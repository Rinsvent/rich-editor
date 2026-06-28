"use client";

// src/components/RichTextEditor.tsx
import { $generateHtmlFromNodes } from "@lexical/html";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext as useLexicalComposerContext6 } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode as QuoteNode2 } from "@lexical/rich-text";
import {
  forwardRef,
  useCallback,
  useEffect as useEffect6,
  useId,
  useImperativeHandle,
  useMemo,
  useRef as useRef2,
  useState as useState3
} from "react";

// src/context/EditorContext.tsx
import {
  createContext,
  useContext
} from "react";
import { jsx } from "react/jsx-runtime";
var RichTextEditorContext = createContext(
  null
);
function RichTextEditorProvider({
  value,
  children
}) {
  return /* @__PURE__ */ jsx(RichTextEditorContext.Provider, { value, children });
}
function useRichTextEditor() {
  const ctx = useContext(RichTextEditorContext);
  if (!ctx) {
    throw new Error("useRichTextEditor must be used within RichTextEditor");
  }
  return ctx;
}

// src/core/features.ts
var defaultFeatures = {
  bold: true,
  italic: true,
  strikethrough: false,
  code: true,
  quote: true,
  lists: true,
  links: true,
  codeBlock: true,
  headings: false,
  markdownShortcuts: true,
  markdownPaste: true,
  keyboardShortcuts: true
};
function resolveFeatures(partial) {
  return { ...defaultFeatures, ...partial };
}
var defaultLabels = {
  bold: "Bold",
  italic: "Italic",
  strikethrough: "Strikethrough",
  code: "Code",
  quote: "Quote",
  submit: "Submit",
  menu: "Menu"
};
function resolveLabels(partial) {
  return { ...defaultLabels, ...partial };
}
var defaultViewerFeatures = {
  codeHighlight: true,
  linkTarget: "_blank"
};
function resolveViewerFeatures(partial) {
  return { ...defaultViewerFeatures, ...partial };
}
var EDITOR_LINE_HEIGHT_PX = 28;

// src/core/html.ts
import DOMPurify from "dompurify";
var ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "s",
  "del",
  "strike",
  "code",
  "pre",
  "blockquote",
  "a",
  "ul",
  "ol",
  "li",
  "span",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6"
];
function sanitizeHtml(html) {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ["href", "class", "target", "rel"]
  });
}
function isHtmlContent(content) {
  return /<[a-z][\s\S]*>/i.test(content.trim());
}
function plainTextFromHtml(html) {
  if (typeof document === "undefined") {
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
  const el = document.createElement("div");
  el.innerHTML = sanitizeHtml(html);
  return el.textContent?.replace(/\s+/g, " ").trim() ?? "";
}
function normalizeHtml(html) {
  if (typeof document === "undefined") {
    return html.replace(
      /<\/?strong\b[^>]*>/gi,
      (tag) => tag.startsWith("</") ? "</b>" : "<b>"
    ).replace(
      /<\/?em\b[^>]*>/gi,
      (tag) => tag.startsWith("</") ? "</i>" : "<i>"
    ).replace(
      /<\/?del\b[^>]*>/gi,
      (tag) => tag.startsWith("</") ? "</s>" : "<s>"
    ).replace(
      /<\/?strike\b[^>]*>/gi,
      (tag) => tag.startsWith("</") ? "</s>" : "<s>"
    );
  }
  const container = document.createElement("div");
  container.innerHTML = html;
  container.querySelectorAll("strong").forEach((node) => {
    const b = document.createElement("b");
    b.innerHTML = node.innerHTML;
    node.replaceWith(b);
  });
  container.querySelectorAll("em").forEach((node) => {
    const i = document.createElement("i");
    i.innerHTML = node.innerHTML;
    node.replaceWith(i);
  });
  for (const tag of ["del", "strike"]) {
    container.querySelectorAll(tag).forEach((node) => {
      const s = document.createElement("s");
      s.innerHTML = node.innerHTML;
      node.replaceWith(s);
    });
  }
  container.querySelectorAll('[style*="line-through"]').forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    const s = document.createElement("s");
    s.innerHTML = node.innerHTML;
    node.replaceWith(s);
  });
  container.querySelectorAll("code span").forEach((span) => {
    const code = span.parentElement;
    if (!code) return;
    while (span.firstChild) {
      code.insertBefore(span.firstChild, span);
    }
    span.remove();
  });
  flattenTag(container, "b");
  flattenTag(container, "i");
  flattenTag(container, "s");
  return container.innerHTML.trim();
}
function flattenTag(container, tagName) {
  const lower = tagName.toLowerCase();
  let changed = true;
  while (changed) {
    changed = false;
    for (const el of Array.from(container.getElementsByTagName(tagName))) {
      const parent = el.parentElement;
      if (parent && parent.tagName.toLowerCase() === lower) {
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el);
        }
        el.remove();
        changed = true;
      }
    }
  }
}

// src/core/markdown.ts
import {
  BOLD_STAR,
  BOLD_UNDERSCORE,
  CODE,
  HEADING,
  INLINE_CODE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  LINK,
  ORDERED_LIST,
  QUOTE,
  STRIKETHROUGH,
  UNORDERED_LIST
} from "@lexical/markdown";
import { marked } from "marked";
marked.setOptions({ gfm: true, breaks: true });
marked.use({
  renderer: {
    strong({ tokens }) {
      const text = this.parser.parseInline(tokens);
      return `<b>${text}</b>`;
    },
    em({ tokens }) {
      const text = this.parser.parseInline(tokens);
      return `<i>${text}</i>`;
    },
    del({ tokens }) {
      const text = this.parser.parseInline(tokens);
      return `<s>${text}</s>`;
    }
  }
});
function buildMarkdownTransformers(features) {
  const transformers = [];
  if (features.headings) transformers.push(HEADING);
  if (features.quote) transformers.push(QUOTE);
  if (features.lists) {
    transformers.push(UNORDERED_LIST, ORDERED_LIST);
  }
  if (features.codeBlock) transformers.push(CODE);
  if (features.code) transformers.push(INLINE_CODE);
  if (features.bold) {
    transformers.push(BOLD_STAR, BOLD_UNDERSCORE);
  }
  if (features.italic) {
    transformers.push(ITALIC_STAR, ITALIC_UNDERSCORE);
  }
  if (features.strikethrough) transformers.push(STRIKETHROUGH);
  if (features.links) transformers.push(LINK);
  return transformers;
}
function looksLikeMarkdown(text) {
  const t = text.trim();
  if (t.length < 2) return false;
  return /^#{1,6}\s/m.test(t) || /^>\s/m.test(t) || /^[-*+]\s/m.test(t) || /^\d+\.\s/m.test(t) || /```[\s\S]*?```/.test(t) || /\*\*[^*\n]+\*\*/.test(t) || /(?:^|[^*])\*[^*\s][^*\n]*\*(?:[^*]|$)/.test(t) || /`[^`\n]+`/.test(t) || /~~[^~\n]+~~/.test(t) || /\[[^\]]+\]\([^)]+\)/.test(t);
}
function markdownToHtml(markdown) {
  const raw = marked.parse(markdown, { async: false });
  return sanitizeHtml(raw);
}

// src/core/theme.ts
var editorTheme = {
  paragraph: "re-paragraph",
  quote: "re-quote",
  heading: {
    h1: "re-heading-h1",
    h2: "re-heading-h2",
    h3: "re-heading-h3",
    h4: "re-heading-h4",
    h5: "re-heading-h5",
    h6: "re-heading-h6"
  },
  text: {
    bold: "re-text-bold",
    italic: "re-text-italic",
    strikethrough: "re-text-strike",
    code: "re-text-code"
  },
  code: "re-block-code",
  list: {
    ul: "re-list-ul",
    ol: "re-list-ol",
    listitem: "re-list-item"
  },
  link: "re-link"
};

// src/core/cn.ts
function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

// src/components/plugins/index.tsx
import { useEffect as useEffect4, useRef } from "react";
import { $generateNodesFromDOM as $generateNodesFromDOM2 } from "@lexical/html";
import { useLexicalComposerContext as useLexicalComposerContext4 } from "@lexical/react/LexicalComposerContext";
import { $getRoot } from "lexical";

// src/components/plugins/EnterPlugin.tsx
import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  KEY_ENTER_COMMAND
} from "lexical";
function EnterPlugin({
  behavior,
  onSubmit
}) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        if (behavior === "newline") return false;
        if (behavior === "shift-newline") {
          if (event?.shiftKey) {
            event.preventDefault();
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                selection.insertParagraph();
              }
            });
            return true;
          }
          if (onSubmit) {
            event?.preventDefault();
            onSubmit();
            return true;
          }
          return false;
        }
        if (behavior === "submit") {
          if (event?.shiftKey) {
            event.preventDefault();
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                selection.insertParagraph();
              }
            });
            return true;
          }
          if (onSubmit) {
            event?.preventDefault();
            onSubmit();
            return true;
          }
        }
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [behavior, editor, onSubmit]);
  return null;
}

// src/components/plugins/MarkdownPastePlugin.tsx
import { $generateNodesFromDOM } from "@lexical/html";
import { useLexicalComposerContext as useLexicalComposerContext2 } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection as $getSelection2,
  $insertNodes,
  $isRangeSelection as $isRangeSelection2,
  COMMAND_PRIORITY_HIGH,
  PASTE_COMMAND
} from "lexical";
import { useEffect as useEffect2 } from "react";
function htmlToNodes(editor, html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return $generateNodesFromDOM(editor, doc.body);
}
function MarkdownPastePlugin({
  features
}) {
  const [editor] = useLexicalComposerContext2();
  useEffect2(() => {
    if (!features.markdownPaste) return;
    return editor.registerCommand(
      PASTE_COMMAND,
      (event) => {
        if (!(event instanceof ClipboardEvent)) return false;
        const clipboard = event.clipboardData;
        if (!clipboard) return false;
        const text = clipboard.getData("text/plain");
        const htmlRaw = clipboard.getData("text/html");
        if (text && looksLikeMarkdown(text)) {
          event.preventDefault();
          const html = markdownToHtml(text);
          editor.update(() => {
            const selection = $getSelection2();
            if (!$isRangeSelection2(selection)) return;
            if (!selection.isCollapsed()) {
              selection.removeText();
            }
            const nodes = htmlToNodes(editor, html);
            if (nodes.length > 0) {
              $insertNodes(nodes);
            }
          });
          return true;
        }
        if (htmlRaw && htmlRaw.trim() && !looksLikeMarkdown(text)) {
          event.preventDefault();
          const html = sanitizeHtml(htmlRaw);
          editor.update(() => {
            const selection = $getSelection2();
            if (!$isRangeSelection2(selection)) return;
            if (!selection.isCollapsed()) {
              selection.removeText();
            }
            const nodes = htmlToNodes(editor, html);
            if (nodes.length > 0) {
              $insertNodes(nodes);
            }
          });
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_HIGH
    );
  }, [editor, features.markdownPaste]);
  return null;
}

// src/components/plugins/KeyboardShortcutsPlugin.tsx
import { useEffect as useEffect3 } from "react";
import { useLexicalComposerContext as useLexicalComposerContext3 } from "@lexical/react/LexicalComposerContext";
import {
  COMMAND_PRIORITY_LOW as COMMAND_PRIORITY_LOW2,
  FORMAT_TEXT_COMMAND,
  KEY_DOWN_COMMAND
} from "lexical";
function isModKey(event) {
  return event.metaKey || event.ctrlKey;
}
function KeyboardShortcutsPlugin({
  features,
  disabled
}) {
  const [editor] = useLexicalComposerContext3();
  useEffect3(() => {
    if (!features.keyboardShortcuts || disabled) return;
    return editor.registerCommand(
      KEY_DOWN_COMMAND,
      (event) => {
        if (!(event instanceof KeyboardEvent) || !isModKey(event)) {
          return false;
        }
        const key = event.key.toLowerCase();
        if (key === "b" && features.bold) {
          event.preventDefault();
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
          return true;
        }
        if (key === "i" && features.italic) {
          event.preventDefault();
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
          return true;
        }
        if (key === "e" && features.code && !event.shiftKey) {
          event.preventDefault();
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
          return true;
        }
        if (event.shiftKey && key === "x" && features.strikethrough) {
          event.preventDefault();
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_LOW2
    );
  }, [disabled, editor, features]);
  return null;
}

// src/components/plugins/index.tsx
function InitialHtmlPlugin({ html }) {
  const [editor] = useLexicalComposerContext4();
  const lastApplied = useRef(void 0);
  useEffect4(() => {
    if (html === lastApplied.current) return;
    editor.update(() => {
      const root = $getRoot();
      root.clear();
      if (!html?.trim()) {
        lastApplied.current = html;
        return;
      }
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, "text/html");
      const nodes = $generateNodesFromDOM2(editor, dom.body);
      root.append(...nodes);
      lastApplied.current = html;
    });
  }, [editor, html]);
  return null;
}
function BlurCapturePlugin({
  rootRef,
  onBlur,
  getHtml
}) {
  const [editor] = useLexicalComposerContext4();
  useEffect4(() => {
    if (!onBlur) return;
    const root = rootRef.current;
    if (!root) return;
    const handler = (e) => {
      const next = e.relatedTarget;
      if (next && root.contains(next)) return;
      onBlur(getHtml());
    };
    root.addEventListener("focusout", handler);
    return () => root.removeEventListener("focusout", handler);
  }, [editor, getHtml, onBlur, rootRef]);
  return null;
}
function FocusPlugin({
  focusRef
}) {
  const [editor] = useLexicalComposerContext4();
  useEffect4(() => {
    focusRef.current = () => editor.focus();
    return () => {
      focusRef.current = null;
    };
  }, [editor, focusRef]);
  return null;
}
function SetHtmlPlugin({
  setHtmlRef
}) {
  const [editor] = useLexicalComposerContext4();
  useEffect4(() => {
    setHtmlRef.current = (html) => {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        if (!html.trim()) return;
        const parser = new DOMParser();
        const dom = parser.parseFromString(html, "text/html");
        const nodes = $generateNodesFromDOM2(editor, dom.body);
        root.append(...nodes);
      });
    };
    return () => {
      setHtmlRef.current = null;
    };
  }, [editor, setHtmlRef]);
  return null;
}
function ClearPlugin({
  clearRef
}) {
  const [editor] = useLexicalComposerContext4();
  useEffect4(() => {
    clearRef.current = () => {
      editor.update(() => {
        $getRoot().clear();
      });
    };
    return () => {
      clearRef.current = null;
    };
  }, [editor, clearRef]);
  return null;
}
function EmptyStatePlugin({
  onEmptyChange
}) {
  const [editor] = useLexicalComposerContext4();
  useEffect4(() => {
    const update = () => {
      editor.getEditorState().read(() => {
        onEmptyChange($getRoot().getTextContent().trim() === "");
      });
    };
    update();
    return editor.registerUpdateListener(() => update());
  }, [editor, onEmptyChange]);
  return null;
}

// src/components/toolbar/EditorToolbar.tsx
import { useState as useState2 } from "react";

// src/components/toolbar/useFormatState.ts
import { useEffect as useEffect5, useState } from "react";
import { useLexicalComposerContext as useLexicalComposerContext5 } from "@lexical/react/LexicalComposerContext";
import { $isQuoteNode, QuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $findMatchingParent } from "@lexical/utils";
import {
  $createParagraphNode,
  $getSelection as $getSelection3,
  $isRangeSelection as $isRangeSelection3,
  COMMAND_PRIORITY_LOW as COMMAND_PRIORITY_LOW3,
  FORMAT_TEXT_COMMAND as FORMAT_TEXT_COMMAND2,
  SELECTION_CHANGE_COMMAND
} from "lexical";
var emptyFormat = {
  bold: false,
  italic: false,
  strikethrough: false,
  code: false,
  quote: false
};
function useFormatState() {
  const [editor] = useLexicalComposerContext5();
  const [state, setState] = useState(emptyFormat);
  useEffect5(() => {
    const update = () => {
      editor.getEditorState().read(() => {
        const selection = $getSelection3();
        if (!$isRangeSelection3(selection)) {
          setState(emptyFormat);
          return;
        }
        setState({
          bold: selection.hasFormat("bold"),
          italic: selection.hasFormat("italic"),
          strikethrough: selection.hasFormat("strikethrough"),
          code: selection.hasFormat("code"),
          quote: !!$findMatchingParent(
            selection.anchor.getNode(),
            $isQuoteNode
          )
        });
      });
    };
    const removeUpdate = editor.registerUpdateListener(() => update());
    const removeSelection = editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        update();
        return false;
      },
      COMMAND_PRIORITY_LOW3
    );
    return () => {
      removeUpdate();
      removeSelection();
    };
  }, [editor]);
  return state;
}
function useFormatActions() {
  const [editor] = useLexicalComposerContext5();
  return {
    bold: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND2, "bold"),
    italic: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND2, "italic"),
    strikethrough: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND2, "strikethrough"),
    code: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND2, "code"),
    quote: () => {
      editor.update(() => {
        const selection = $getSelection3();
        if (!$isRangeSelection3(selection)) return;
        const inQuote = !!$findMatchingParent(
          selection.anchor.getNode(),
          $isQuoteNode
        );
        if (inQuote) {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () => new QuoteNode());
        }
      });
    }
  };
}

// src/components/toolbar/EditorToolbar.tsx
import { Fragment, jsx as jsx2, jsxs } from "react/jsx-runtime";
function ToolbarButton({
  label,
  active,
  onClick,
  children
}) {
  return /* @__PURE__ */ jsx2(
    "button",
    {
      type: "button",
      "aria-label": label,
      "aria-pressed": active,
      title: label,
      onClick,
      className: "re-toolbar-btn",
      children
    }
  );
}
function EditorToolbar({
  features,
  labels,
  slots
}) {
  const active = useFormatState();
  const format = useFormatActions();
  const [menuOpen, setMenuOpen] = useState2(false);
  const hasMenu = !!slots.toolbarMenu;
  return /* @__PURE__ */ jsxs("div", { className: "re-toolbar", children: [
    /* @__PURE__ */ jsxs("div", { className: "re-toolbar-group", children: [
      slots.toolbarStart,
      features.bold && /* @__PURE__ */ jsx2(
        ToolbarButton,
        {
          label: labels.bold,
          active: active.bold,
          onClick: format.bold,
          children: "B"
        }
      ),
      features.italic && /* @__PURE__ */ jsx2(
        ToolbarButton,
        {
          label: labels.italic,
          active: active.italic,
          onClick: format.italic,
          children: "I"
        }
      ),
      features.strikethrough && /* @__PURE__ */ jsx2(
        ToolbarButton,
        {
          label: labels.strikethrough,
          active: active.strikethrough,
          onClick: format.strikethrough,
          children: "S"
        }
      ),
      features.code && /* @__PURE__ */ jsx2(
        ToolbarButton,
        {
          label: labels.code,
          active: active.code,
          onClick: format.code,
          children: "</>"
        }
      ),
      features.quote && /* @__PURE__ */ jsx2(
        ToolbarButton,
        {
          label: labels.quote,
          active: active.quote,
          onClick: format.quote,
          children: '"'
        }
      )
    ] }),
    (slots.toolbarEnd || hasMenu) && /* @__PURE__ */ jsxs("div", { className: "re-toolbar-group", style: { position: "relative" }, children: [
      slots.toolbarEnd,
      hasMenu && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx2(
          "button",
          {
            type: "button",
            "aria-label": labels.menu,
            title: labels.menu,
            onClick: () => setMenuOpen((v) => !v),
            className: "re-toolbar-menu-btn",
            children: "\u22EE"
          }
        ),
        menuOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx2(
            "div",
            {
              className: "re-toolbar-menu-backdrop",
              onClick: () => setMenuOpen(false)
            }
          ),
          /* @__PURE__ */ jsx2(
            "div",
            {
              className: "re-toolbar-menu",
              onClick: () => setMenuOpen(false),
              children: slots.toolbarMenu
            }
          )
        ] })
      ] })
    ] })
  ] });
}

// src/components/slots/createSlot.tsx
import {
  Children,
  isValidElement
} from "react";
function createSlot(name) {
  const Slot = ({ children }) => null;
  Slot.slotName = name;
  Slot.displayName = `RichTextEditor.${name}`;
  return Slot;
}
function isSlotComponent(child) {
  return isValidElement(child) && typeof child.type === "function" && "slotName" in child.type && typeof child.type.slotName === "string";
}
function collectSlots(children) {
  const slots = {};
  Children.forEach(children, (child) => {
    if (!isSlotComponent(child)) return;
    const name = child.type.slotName;
    slots[name] = child.props.children;
  });
  return slots;
}
function hasToolbar(features, slots) {
  return features.bold || features.italic || features.strikethrough || features.code || features.quote || !!slots.toolbarStart || !!slots.toolbarEnd || !!slots.toolbarMenu;
}

// src/components/RichTextEditor.tsx
import { Fragment as Fragment2, jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function onError(error) {
  console.error(error);
}
function exportEditorHtml(editor) {
  let html = "";
  editor.getEditorState().read(() => {
    html = $generateHtmlFromNodes(editor, null);
  });
  return normalizeHtml(html.trim());
}
function EditorRefPlugin({
  getHtmlRef
}) {
  const [editor] = useLexicalComposerContext6();
  useEffect6(() => {
    getHtmlRef.current = () => exportEditorHtml(editor);
    return () => {
      getHtmlRef.current = null;
    };
  }, [editor, getHtmlRef]);
  return null;
}
function DefaultSubmitButton({
  disabled,
  onSubmit,
  label
}) {
  const { isEmpty } = useRichTextEditor();
  if (isEmpty) return null;
  return /* @__PURE__ */ jsx3(
    "button",
    {
      type: "button",
      onClick: onSubmit,
      disabled,
      className: "re-submit-btn",
      "aria-label": label,
      title: label,
      children: /* @__PURE__ */ jsx3("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx3("path", { d: "M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" }) })
    }
  );
}
function SubmitArea({
  slots,
  disabled,
  sending,
  onSubmit,
  label,
  showDefault
}) {
  if (slots.submitButton !== void 0) {
    return /* @__PURE__ */ jsx3(Fragment2, { children: slots.submitButton });
  }
  if (!showDefault) return null;
  return /* @__PURE__ */ jsx3(
    DefaultSubmitButton,
    {
      disabled: disabled || sending,
      onSubmit,
      label
    }
  );
}
function ContextBridge({
  disabled,
  features,
  labels,
  isEmpty,
  getHtmlRef,
  focusRef,
  setHtmlRef,
  clearRef,
  onSubmit,
  children
}) {
  const formatState = useFormatState();
  const format = useFormatActions();
  const ctx = useMemo(
    () => ({
      getHtml: () => getHtmlRef.current?.() ?? "",
      setHtml: (html) => setHtmlRef.current?.(html),
      clear: () => clearRef.current?.(),
      focus: () => focusRef.current?.(),
      submit: onSubmit,
      isEmpty,
      formatState,
      format,
      disabled,
      features,
      labels
    }),
    [
      clearRef,
      disabled,
      features,
      focusRef,
      format,
      formatState,
      getHtmlRef,
      isEmpty,
      labels,
      setHtmlRef,
      onSubmit
    ]
  );
  return /* @__PURE__ */ jsx3(RichTextEditorProvider, { value: ctx, children });
}
function RichTextEditorInner({
  value,
  onSubmit,
  onBlur,
  placeholder = "",
  disabled = false,
  features: featuresProp,
  labels: labelsProp,
  enterBehavior = "shift-newline",
  clearOnSubmit = false,
  className,
  theme = "dark",
  minRows = 1,
  maxRows = 8,
  children
}, ref) {
  const features = useMemo(() => resolveFeatures(featuresProp), [featuresProp]);
  const labels = useMemo(() => resolveLabels(labelsProp), [labelsProp]);
  const slots = useMemo(() => collectSlots(children), [children]);
  const rootId = useId();
  const rootRef = useRef2(null);
  const getHtmlRef = useRef2(null);
  const setHtmlRef = useRef2(null);
  const clearRef = useRef2(null);
  const focusRef = useRef2(null);
  const [isEmpty, setIsEmpty] = useState3(true);
  const [sending, setSending] = useState3(false);
  const inputStyle = useMemo(
    () => ({
      minHeight: `${minRows * EDITOR_LINE_HEIGHT_PX}px`,
      maxHeight: `${maxRows * EDITOR_LINE_HEIGHT_PX}px`
    }),
    [minRows, maxRows]
  );
  const initialConfig = useMemo(
    () => ({
      namespace: "RichTextEditor",
      theme: editorTheme,
      editable: !disabled,
      onError,
      nodes: [
        HeadingNode,
        QuoteNode2,
        ListNode,
        ListItemNode,
        CodeNode,
        CodeHighlightNode,
        LinkNode,
        AutoLinkNode
      ]
    }),
    [disabled]
  );
  const transformers = useMemo(
    () => features.markdownShortcuts ? buildMarkdownTransformers(features) : [],
    [features]
  );
  const getHtml = useCallback(() => getHtmlRef.current?.() ?? "", []);
  const submit = useCallback(async () => {
    if (disabled || sending || isEmpty || !onSubmit) return;
    const html = getHtml();
    if (!html) return;
    setSending(true);
    try {
      await onSubmit(html);
      if (clearOnSubmit) {
        clearRef.current?.();
      }
    } finally {
      setSending(false);
    }
  }, [clearOnSubmit, disabled, getHtml, isEmpty, onSubmit, sending]);
  useImperativeHandle(
    ref,
    () => ({
      getHtml,
      setHtml: (html) => setHtmlRef.current?.(html),
      clear: () => clearRef.current?.(),
      focus: () => focusRef.current?.(),
      isEmpty: () => isEmpty
    }),
    [getHtml, isEmpty]
  );
  const showToolbar = hasToolbar(features, slots);
  const showDefaultSubmit = !!onSubmit && slots.submitButton === void 0;
  return /* @__PURE__ */ jsxs2(LexicalComposer, { initialConfig, children: [
    /* @__PURE__ */ jsx3(EditorRefPlugin, { getHtmlRef }),
    /* @__PURE__ */ jsx3(SetHtmlPlugin, { setHtmlRef }),
    /* @__PURE__ */ jsx3(ClearPlugin, { clearRef }),
    /* @__PURE__ */ jsx3(FocusPlugin, { focusRef }),
    /* @__PURE__ */ jsx3(EmptyStatePlugin, { onEmptyChange: setIsEmpty }),
    /* @__PURE__ */ jsx3(
      ContextBridge,
      {
        disabled,
        features,
        labels,
        isEmpty,
        getHtmlRef,
        focusRef,
        setHtmlRef,
        clearRef,
        onSubmit: () => void submit(),
        children: /* @__PURE__ */ jsxs2(
          "div",
          {
            ref: rootRef,
            id: rootId,
            "data-re-theme": theme,
            className: cn("re-editor-root", className),
            children: [
              showToolbar && /* @__PURE__ */ jsx3(EditorToolbar, { features, labels, slots }),
              /* @__PURE__ */ jsx3(
                BlurCapturePlugin,
                {
                  rootRef,
                  onBlur,
                  getHtml
                }
              ),
              /* @__PURE__ */ jsxs2("div", { className: "re-editor-body", children: [
                /* @__PURE__ */ jsx3(InitialHtmlPlugin, { html: value }),
                /* @__PURE__ */ jsx3(
                  RichTextPlugin,
                  {
                    contentEditable: /* @__PURE__ */ jsx3(
                      ContentEditable,
                      {
                        className: "re-editor-input",
                        style: inputStyle
                      }
                    ),
                    placeholder: placeholder ? /* @__PURE__ */ jsx3("div", { className: "re-editor-placeholder", children: placeholder }) : null,
                    ErrorBoundary: LexicalErrorBoundary
                  }
                ),
                /* @__PURE__ */ jsx3(HistoryPlugin, {}),
                features.lists && /* @__PURE__ */ jsx3(ListPlugin, {}),
                features.links && /* @__PURE__ */ jsx3(LinkPlugin, {}),
                transformers.length > 0 && /* @__PURE__ */ jsx3(MarkdownShortcutPlugin, { transformers }),
                /* @__PURE__ */ jsx3(MarkdownPastePlugin, { features }),
                /* @__PURE__ */ jsx3(KeyboardShortcutsPlugin, { features, disabled }),
                onSubmit && /* @__PURE__ */ jsx3(
                  EnterPlugin,
                  {
                    behavior: enterBehavior,
                    onSubmit: () => void submit()
                  }
                ),
                /* @__PURE__ */ jsx3(
                  SubmitArea,
                  {
                    slots,
                    disabled,
                    sending,
                    onSubmit: () => void submit(),
                    label: labels.submit,
                    showDefault: showDefaultSubmit
                  }
                )
              ] }),
              slots.footer && /* @__PURE__ */ jsx3("div", { className: "re-footer", children: slots.footer })
            ]
          }
        )
      }
    )
  ] });
}
var RichTextEditorBase = forwardRef(RichTextEditorInner);
var ToolbarStart = createSlot("toolbarStart");
var ToolbarEnd = createSlot("toolbarEnd");
var ToolbarMenu = createSlot("toolbarMenu");
var SubmitButton = createSlot("submitButton");
var Footer = createSlot("footer");
var RichTextEditor = Object.assign(RichTextEditorBase, {
  ToolbarStart,
  ToolbarEnd,
  ToolbarMenu,
  SubmitButton,
  Footer
});

// src/components/RichTextViewer.tsx
import { useEffect as useEffect7, useRef as useRef3 } from "react";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import plaintext from "highlight.js/lib/languages/plaintext";
import typescript from "highlight.js/lib/languages/typescript";
import { jsx as jsx4 } from "react/jsx-runtime";
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("js", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("ts", typescript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("plaintext", plaintext);
function RichTextViewer({
  content,
  features: featuresProp,
  className,
  theme = "dark"
}) {
  const features = resolveViewerFeatures(featuresProp);
  const ref = useRef3(null);
  const isHtml = isHtmlContent(content);
  const html = isHtml ? sanitizeHtml(content) : "";
  useEffect7(() => {
    if (!isHtml || !features.codeHighlight) return;
    const root = ref.current;
    if (!root) return;
    root.querySelectorAll("pre code").forEach((el) => {
      hljs.highlightElement(el);
    });
  }, [content, features.codeHighlight, isHtml]);
  useEffect7(() => {
    if (!isHtml || !features.linkTarget) return;
    const root = ref.current;
    if (!root) return;
    root.querySelectorAll("a[href]").forEach((a) => {
      a.setAttribute("target", features.linkTarget);
      a.setAttribute("rel", "noopener noreferrer");
    });
  }, [content, features.linkTarget, isHtml]);
  if (!isHtml) {
    return /* @__PURE__ */ jsx4(
      "p",
      {
        "data-re-theme": theme,
        className: cn("re-viewer re-viewer-plain", className),
        children: content
      }
    );
  }
  return /* @__PURE__ */ jsx4(
    "div",
    {
      ref,
      "data-re-theme": theme,
      className: cn("re-viewer", className),
      dangerouslySetInnerHTML: { __html: html }
    }
  );
}
export {
  RichTextEditor,
  RichTextViewer,
  buildMarkdownTransformers,
  defaultFeatures,
  defaultLabels,
  defaultViewerFeatures,
  exportEditorHtml,
  isHtmlContent,
  looksLikeMarkdown,
  markdownToHtml,
  normalizeHtml,
  plainTextFromHtml,
  sanitizeHtml,
  useRichTextEditor
};
//# sourceMappingURL=index.js.map