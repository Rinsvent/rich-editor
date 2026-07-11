"use client";

// src/components/RichTextEditor.tsx
import { $generateHtmlFromNodes } from "@lexical/html";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext as useLexicalComposerContext7 } from "@lexical/react/LexicalComposerContext";
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
  useCallback as useCallback2,
  useEffect as useEffect8,
  useId as useId3,
  useImperativeHandle,
  useMemo as useMemo2,
  useRef as useRef2,
  useState as useState4
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
  keyboardShortcuts: true,
  mentions: false
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
  menu: "Menu",
  editor: "Rich text editor",
  toolbar: "Formatting",
  mentionMenu: "Mention suggestions"
};
function resolveLabels(partial) {
  return { ...defaultLabels, ...partial };
}
var defaultViewerLabels = {
  content: "Rich text content",
  mention: "Mention {label}"
};
function resolveViewerLabels(partial) {
  return { ...defaultViewerLabels, ...partial };
}
var defaultViewerFeatures = {
  codeHighlight: true,
  linkTarget: "_blank"
};
function resolveViewerFeatures(partial) {
  return { ...defaultViewerFeatures, ...partial };
}
var EDITOR_LINE_HEIGHT_PX = 28;

// src/core/presets.ts
var editorThemePresets = [
  "dark",
  "light",
  "telegram",
  "slack",
  "clickup"
];
var defaultEditorTheme = "dark";
function isEditorThemePreset(value) {
  return editorThemePresets.includes(value);
}
var editorCssVariables = [
  "--re-bg",
  "--re-border",
  "--re-text",
  "--re-muted",
  "--re-accent",
  "--re-accent-hover",
  "--re-hover",
  "--re-code-bg",
  "--re-pre-bg",
  "--re-font-size",
  "--re-line-height"
];

// src/core/themePresets.ts
function themeDataAttribute(theme) {
  if (theme === "none") return void 0;
  return { "data-re-theme": theme };
}

// src/nodes/MentionNode.ts
import {
  $applyNodeReplacement,
  TextNode
} from "lexical";

// src/core/mentions.ts
var MENTION_ID_ATTR = "data-mention-id";
var MENTION_LABEL_ATTR = "data-mention-label";
function mentionDisplayText(label) {
  return `@${label}`;
}

// src/nodes/MentionNode.ts
var MentionNode = class _MentionNode extends TextNode {
  static getType() {
    return "mention";
  }
  static clone(node) {
    return new _MentionNode(
      node.__mentionId,
      node.__mentionLabel,
      node.__text,
      node.__key
    );
  }
  static importJSON(serializedNode) {
    return $createMentionNode(
      serializedNode.mentionId,
      serializedNode.mentionLabel,
      serializedNode.text
    ).updateFromJSON(serializedNode);
  }
  static importDOM() {
    return {
      span: (domNode) => {
        const id = domNode.getAttribute(MENTION_ID_ATTR);
        if (!id) return null;
        const label = domNode.getAttribute(MENTION_LABEL_ATTR) ?? domNode.textContent?.replace(/^@/, "") ?? id;
        return {
          conversion: () => ({
            node: $createMentionNode(id, label, domNode.textContent ?? void 0)
          }),
          priority: 2
        };
      }
    };
  }
  constructor(mentionId, mentionLabel, text, key) {
    super(text ?? mentionDisplayText(mentionLabel), key);
    this.__mentionId = mentionId;
    this.__mentionLabel = mentionLabel;
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      mentionId: this.__mentionId,
      mentionLabel: this.__mentionLabel,
      type: "mention"
    };
  }
  createDOM(config) {
    const dom = super.createDOM(config);
    dom.className = config.theme.mention ?? "re-mention";
    dom.setAttribute(MENTION_ID_ATTR, this.__mentionId);
    dom.setAttribute(MENTION_LABEL_ATTR, this.__mentionLabel);
    dom.spellcheck = false;
    return dom;
  }
  exportDOM() {
    const element = document.createElement("span");
    element.className = "re-mention";
    element.setAttribute(MENTION_ID_ATTR, this.__mentionId);
    element.setAttribute(MENTION_LABEL_ATTR, this.__mentionLabel);
    element.textContent = this.getTextContent();
    return { element };
  }
  isTextEntity() {
    return true;
  }
  canInsertTextBefore() {
    return false;
  }
  canInsertTextAfter() {
    return false;
  }
  getMentionId() {
    return this.getLatest().__mentionId;
  }
  getMentionLabel() {
    return this.getLatest().__mentionLabel;
  }
};
function $createMentionNode(mentionId, mentionLabel, textContent) {
  const mentionNode = new MentionNode(
    mentionId,
    mentionLabel,
    textContent ?? mentionDisplayText(mentionLabel)
  );
  mentionNode.setMode("segmented").toggleDirectionless();
  return $applyNodeReplacement(mentionNode);
}

// src/core/html.ts
import DOMPurify from "isomorphic-dompurify";
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
    ALLOWED_ATTR: [
      "href",
      "class",
      "target",
      "rel",
      "data-mention-id",
      "data-mention-label"
    ]
  });
}
function isHtmlContent(content) {
  return /<[a-z][\s\S]*>/i.test(content.trim());
}
function applyLinkTargetToHtml(html, target) {
  return html.replace(/<a\b([^>]*)>/gi, (match, attrs) => {
    if (/\btarget\s*=/.test(attrs)) return match;
    let next = attrs;
    if (!/\brel\s*=/.test(next)) {
      next = `${next} rel="noopener noreferrer"`;
    }
    return `<a${next} target="${target}">`;
  });
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
  link: "re-link",
  mention: "re-mention"
};

// src/core/cn.ts
function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

// src/components/plugins/index.tsx
import { useEffect as useEffect5, useRef } from "react";
import { $generateNodesFromDOM as $generateNodesFromDOM2 } from "@lexical/html";
import { useLexicalComposerContext as useLexicalComposerContext5 } from "@lexical/react/LexicalComposerContext";
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

// src/components/plugins/MentionsPlugin.tsx
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { useLexicalComposerContext as useLexicalComposerContext4 } from "@lexical/react/LexicalComposerContext";
import {
  useCallback,
  useEffect as useEffect4,
  useId,
  useMemo,
  useState
} from "react";
import { createPortal } from "react-dom";
import { COMMAND_PRIORITY_HIGH as COMMAND_PRIORITY_HIGH2 } from "lexical";
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
var MentionMenuOption = class extends MenuOption {
  constructor(option) {
    super(option.id);
    this.id = option.id;
    this.label = option.label;
  }
};
function MentionMenu({
  anchorElementRef,
  menuId,
  menuLabel,
  options,
  selectedIndex,
  selectOptionAndCleanUp,
  setHighlightedIndex
}) {
  if (options.length === 0) return null;
  const activeDescendantId = selectedIndex !== null ? `${menuId}-option-${selectedIndex}` : void 0;
  return createPortal(
    /* @__PURE__ */ jsx2(
      "div",
      {
        id: menuId,
        className: "re-mention-menu",
        role: "listbox",
        "aria-label": menuLabel,
        "aria-activedescendant": activeDescendantId,
        children: options.map((option, index) => /* @__PURE__ */ jsxs(
          "button",
          {
            id: `${menuId}-option-${index}`,
            type: "button",
            role: "option",
            "aria-selected": selectedIndex === index,
            className: "re-mention-menu-item",
            ref: (el) => option.setRefElement(el),
            onMouseEnter: () => setHighlightedIndex(index),
            onMouseDown: (e) => {
              e.preventDefault();
              selectOptionAndCleanUp(option);
            },
            children: [
              "@",
              option.label
            ]
          },
          option.key
        ))
      }
    ),
    anchorElementRef.current ?? document.body
  );
}
function MentionsPlugin({
  searchMentions
}) {
  const [editor] = useLexicalComposerContext4();
  const { labels } = useRichTextEditor();
  const menuId = useId();
  const [query, setQuery] = useState(null);
  const [results, setResults] = useState([]);
  const triggerFn = useBasicTypeaheadTriggerMatch("@", {
    minLength: 0,
    maxLength: 40
  });
  useEffect4(() => {
    if (query === null) {
      setResults([]);
      return;
    }
    let cancelled = false;
    void Promise.resolve(searchMentions(query)).then((items) => {
      if (!cancelled) setResults(items);
    });
    return () => {
      cancelled = true;
    };
  }, [query, searchMentions]);
  const options = useMemo(
    () => results.map((item) => new MentionMenuOption(item)),
    [results]
  );
  const onSelectOption = useCallback(
    (selectedOption, nodeToReplace, closeMenu) => {
      editor.update(() => {
        const mentionNode = $createMentionNode(
          selectedOption.id,
          selectedOption.label
        );
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        }
        mentionNode.selectNext();
        closeMenu();
      });
    },
    [editor]
  );
  const menuRenderFn = useCallback(
    (anchorElementRef, {
      selectedIndex,
      selectOptionAndCleanUp,
      setHighlightedIndex,
      options: menuOptions
    }) => /* @__PURE__ */ jsx2(
      MentionMenu,
      {
        anchorElementRef,
        menuId,
        menuLabel: labels.mentionMenu,
        options: menuOptions,
        selectedIndex,
        selectOptionAndCleanUp,
        setHighlightedIndex
      }
    ),
    [labels.mentionMenu, menuId]
  );
  return /* @__PURE__ */ jsx2(
    LexicalTypeaheadMenuPlugin,
    {
      onQueryChange: setQuery,
      onSelectOption,
      triggerFn,
      options,
      menuRenderFn,
      commandPriority: COMMAND_PRIORITY_HIGH2
    }
  );
}

// src/components/plugins/index.tsx
function InitialHtmlPlugin({ html }) {
  const [editor] = useLexicalComposerContext5();
  const lastApplied = useRef(void 0);
  useEffect5(() => {
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
  const [editor] = useLexicalComposerContext5();
  useEffect5(() => {
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
  const [editor] = useLexicalComposerContext5();
  useEffect5(() => {
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
  const [editor] = useLexicalComposerContext5();
  useEffect5(() => {
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
  const [editor] = useLexicalComposerContext5();
  useEffect5(() => {
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
  const [editor] = useLexicalComposerContext5();
  useEffect5(() => {
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
import { useState as useState3, useId as useId2, useEffect as useEffect7 } from "react";

// src/core/shortcuts.ts
var formatKeyboardShortcuts = [
  {
    id: "format.bold",
    keys: "Ctrl+B",
    ariaKeyshortcuts: "Control+b",
    action: "Bold"
  },
  {
    id: "format.italic",
    keys: "Ctrl+I",
    ariaKeyshortcuts: "Control+i",
    action: "Italic"
  },
  {
    id: "format.code",
    keys: "Ctrl+E",
    ariaKeyshortcuts: "Control+e",
    action: "Inline code"
  },
  {
    id: "format.strikethrough",
    keys: "Ctrl+Shift+X",
    ariaKeyshortcuts: "Control+Shift+x",
    action: "Strikethrough"
  }
];
var mentionKeyboardShortcuts = [
  {
    id: "mention.open",
    keys: "@",
    ariaKeyshortcuts: "@",
    action: "Open mention menu"
  },
  {
    id: "mention.navigate",
    keys: "\u2191 / \u2193",
    ariaKeyshortcuts: "ArrowUp ArrowDown",
    action: "Navigate mention options"
  },
  {
    id: "mention.select",
    keys: "Enter",
    ariaKeyshortcuts: "Enter",
    action: "Select mention"
  },
  {
    id: "mention.dismiss",
    keys: "Esc",
    ariaKeyshortcuts: "Escape",
    action: "Close mention menu"
  }
];
var markdownShortcuts = [
  { pattern: "**text** or __text__", action: "Bold" },
  { pattern: "*text* or _text_", action: "Italic" },
  { pattern: "~~text~~", action: "Strikethrough" },
  { pattern: "`code`", action: "Inline code" },
  { pattern: "> quote", action: "Block quote" },
  { pattern: "- item", action: "Unordered list" },
  { pattern: "1. item", action: "Ordered list" },
  { pattern: "```lang", action: "Code block" },
  { pattern: "[text](url)", action: "Link" },
  { pattern: "# Heading", action: "Heading (when enabled)" }
];
var enterBehaviorShortcuts = {
  submit: {
    enter: "Submit",
    shiftEnter: "New line"
  },
  newline: {
    enter: "New line",
    shiftEnter: "New line"
  },
  "shift-newline": {
    enter: "New line",
    shiftEnter: "New line"
  }
};
function getActiveFormatShortcuts(features) {
  if (!features.keyboardShortcuts) return [];
  return formatKeyboardShortcuts.filter((shortcut) => {
    switch (shortcut.id) {
      case "format.bold":
        return features.bold;
      case "format.italic":
        return features.italic;
      case "format.code":
        return features.code;
      case "format.strikethrough":
        return features.strikethrough;
      default:
        return true;
    }
  });
}
function getEnterBehaviorDescription(behavior) {
  return enterBehaviorShortcuts[behavior];
}
function shortcutById(id) {
  return [...formatKeyboardShortcuts, ...mentionKeyboardShortcuts].find(
    (item) => item.id === id
  );
}

// src/components/toolbar/useFormatState.ts
import { useEffect as useEffect6, useState as useState2 } from "react";
import { useLexicalComposerContext as useLexicalComposerContext6 } from "@lexical/react/LexicalComposerContext";
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
  const [editor] = useLexicalComposerContext6();
  const [state, setState] = useState2(emptyFormat);
  useEffect6(() => {
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
  const [editor] = useLexicalComposerContext6();
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
import { Fragment, jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
function ToolbarButton({
  label,
  active,
  onClick,
  shortcutId,
  children
}) {
  const shortcut = shortcutId ? shortcutById(shortcutId) : void 0;
  return /* @__PURE__ */ jsx3(
    "button",
    {
      type: "button",
      "aria-label": label,
      "aria-pressed": active,
      "aria-keyshortcuts": shortcut?.ariaKeyshortcuts,
      title: shortcut ? `${label} (${shortcut.keys})` : label,
      onClick,
      className: "re-toolbar-btn",
      children
    }
  );
}
function EditorToolbar({
  features,
  labels,
  slots,
  editorInputId
}) {
  const active = useFormatState();
  const format = useFormatActions();
  const [menuOpen, setMenuOpen] = useState3(false);
  const menuId = useId2();
  const hasMenu = !!slots.toolbarMenu;
  useEffect7(() => {
    if (!menuOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);
  return /* @__PURE__ */ jsxs2(
    "div",
    {
      className: "re-toolbar",
      role: "toolbar",
      "aria-label": labels.toolbar,
      "aria-controls": editorInputId,
      children: [
        /* @__PURE__ */ jsxs2("div", { className: "re-toolbar-group", children: [
          slots.toolbarStart,
          features.bold && /* @__PURE__ */ jsx3(
            ToolbarButton,
            {
              label: labels.bold,
              active: active.bold,
              onClick: format.bold,
              shortcutId: "format.bold",
              children: "B"
            }
          ),
          features.italic && /* @__PURE__ */ jsx3(
            ToolbarButton,
            {
              label: labels.italic,
              active: active.italic,
              onClick: format.italic,
              shortcutId: "format.italic",
              children: "I"
            }
          ),
          features.strikethrough && /* @__PURE__ */ jsx3(
            ToolbarButton,
            {
              label: labels.strikethrough,
              active: active.strikethrough,
              onClick: format.strikethrough,
              shortcutId: "format.strikethrough",
              children: "S"
            }
          ),
          features.code && /* @__PURE__ */ jsx3(
            ToolbarButton,
            {
              label: labels.code,
              active: active.code,
              onClick: format.code,
              shortcutId: "format.code",
              children: "</>"
            }
          ),
          features.quote && /* @__PURE__ */ jsx3(ToolbarButton, { label: labels.quote, active: active.quote, onClick: format.quote, children: '"' })
        ] }),
        (slots.toolbarEnd || hasMenu) && /* @__PURE__ */ jsxs2("div", { className: "re-toolbar-group", style: { position: "relative" }, children: [
          slots.toolbarEnd,
          hasMenu && /* @__PURE__ */ jsxs2(Fragment, { children: [
            /* @__PURE__ */ jsx3(
              "button",
              {
                type: "button",
                "aria-label": labels.menu,
                "aria-haspopup": "menu",
                "aria-expanded": menuOpen,
                "aria-controls": menuId,
                title: labels.menu,
                onClick: () => setMenuOpen((v) => !v),
                className: "re-toolbar-menu-btn",
                children: "\u22EE"
              }
            ),
            menuOpen && /* @__PURE__ */ jsxs2(Fragment, { children: [
              /* @__PURE__ */ jsx3(
                "div",
                {
                  className: "re-toolbar-menu-backdrop",
                  onClick: () => setMenuOpen(false),
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ jsx3(
                "div",
                {
                  id: menuId,
                  role: "menu",
                  className: "re-toolbar-menu",
                  onClick: () => setMenuOpen(false),
                  children: slots.toolbarMenu
                }
              )
            ] })
          ] })
        ] })
      ]
    }
  );
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
import { Fragment as Fragment2, jsx as jsx4, jsxs as jsxs3 } from "react/jsx-runtime";
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
  const [editor] = useLexicalComposerContext7();
  useEffect8(() => {
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
  return /* @__PURE__ */ jsx4(
    "button",
    {
      type: "button",
      onClick: onSubmit,
      disabled,
      className: "re-submit-btn",
      "aria-label": label,
      title: label,
      children: /* @__PURE__ */ jsx4("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx4("path", { d: "M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" }) })
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
    return /* @__PURE__ */ jsx4(Fragment2, { children: slots.submitButton });
  }
  if (!showDefault) return null;
  return /* @__PURE__ */ jsx4(
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
  const ctx = useMemo2(
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
  return /* @__PURE__ */ jsx4(RichTextEditorProvider, { value: ctx, children });
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
  theme = defaultEditorTheme,
  minRows = 1,
  maxRows = 8,
  mentionSearch,
  children
}, ref) {
  const features = useMemo2(() => resolveFeatures(featuresProp), [featuresProp]);
  const labels = useMemo2(() => resolveLabels(labelsProp), [labelsProp]);
  const slots = useMemo2(() => collectSlots(children), [children]);
  const rootId = useId3();
  const editorInputId = `${rootId}-input`;
  const placeholderId = `${rootId}-placeholder`;
  const rootRef = useRef2(null);
  const getHtmlRef = useRef2(null);
  const setHtmlRef = useRef2(null);
  const clearRef = useRef2(null);
  const focusRef = useRef2(null);
  const [isEmpty, setIsEmpty] = useState4(true);
  const [sending, setSending] = useState4(false);
  const inputStyle = useMemo2(
    () => ({
      minHeight: `${minRows * EDITOR_LINE_HEIGHT_PX}px`,
      maxHeight: `${maxRows * EDITOR_LINE_HEIGHT_PX}px`
    }),
    [minRows, maxRows]
  );
  const initialConfig = useMemo2(
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
        AutoLinkNode,
        ...features.mentions ? [MentionNode] : []
      ]
    }),
    [disabled, features.mentions]
  );
  const transformers = useMemo2(
    () => features.markdownShortcuts ? buildMarkdownTransformers(features) : [],
    [features]
  );
  const getHtml = useCallback2(() => getHtmlRef.current?.() ?? "", []);
  const submit = useCallback2(async () => {
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
  return /* @__PURE__ */ jsxs3(LexicalComposer, { initialConfig, children: [
    /* @__PURE__ */ jsx4(EditorRefPlugin, { getHtmlRef }),
    /* @__PURE__ */ jsx4(SetHtmlPlugin, { setHtmlRef }),
    /* @__PURE__ */ jsx4(ClearPlugin, { clearRef }),
    /* @__PURE__ */ jsx4(FocusPlugin, { focusRef }),
    /* @__PURE__ */ jsx4(EmptyStatePlugin, { onEmptyChange: setIsEmpty }),
    /* @__PURE__ */ jsx4(
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
        children: /* @__PURE__ */ jsxs3(
          "div",
          {
            ref: rootRef,
            id: rootId,
            ...themeDataAttribute(theme),
            className: cn("re-editor-root", className),
            children: [
              showToolbar && /* @__PURE__ */ jsx4(
                EditorToolbar,
                {
                  features,
                  labels,
                  slots,
                  editorInputId
                }
              ),
              /* @__PURE__ */ jsx4(
                BlurCapturePlugin,
                {
                  rootRef,
                  onBlur,
                  getHtml
                }
              ),
              /* @__PURE__ */ jsxs3("div", { className: "re-editor-body", children: [
                /* @__PURE__ */ jsx4(InitialHtmlPlugin, { html: value }),
                /* @__PURE__ */ jsx4(
                  RichTextPlugin,
                  {
                    contentEditable: /* @__PURE__ */ jsx4(
                      ContentEditable,
                      {
                        id: editorInputId,
                        className: "re-editor-input",
                        style: inputStyle,
                        role: "textbox",
                        "aria-label": labels.editor,
                        "aria-multiline": true,
                        "aria-disabled": disabled,
                        "aria-describedby": placeholder ? placeholderId : void 0
                      }
                    ),
                    placeholder: placeholder ? /* @__PURE__ */ jsx4("div", { id: placeholderId, className: "re-editor-placeholder", "aria-hidden": "true", children: placeholder }) : null,
                    ErrorBoundary: LexicalErrorBoundary
                  }
                ),
                /* @__PURE__ */ jsx4(HistoryPlugin, {}),
                features.lists && /* @__PURE__ */ jsx4(ListPlugin, {}),
                features.links && /* @__PURE__ */ jsx4(LinkPlugin, {}),
                transformers.length > 0 && /* @__PURE__ */ jsx4(MarkdownShortcutPlugin, { transformers }),
                /* @__PURE__ */ jsx4(MarkdownPastePlugin, { features }),
                /* @__PURE__ */ jsx4(KeyboardShortcutsPlugin, { features, disabled }),
                features.mentions && mentionSearch && /* @__PURE__ */ jsx4(MentionsPlugin, { searchMentions: mentionSearch }),
                onSubmit && /* @__PURE__ */ jsx4(
                  EnterPlugin,
                  {
                    behavior: enterBehavior,
                    onSubmit: () => void submit()
                  }
                ),
                /* @__PURE__ */ jsx4(
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
              slots.footer && /* @__PURE__ */ jsx4("div", { className: "re-footer", children: slots.footer })
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
import { useEffect as useEffect9, useMemo as useMemo3, useRef as useRef3 } from "react";

// src/core/viewerHtml.ts
function prepareViewerContent(content, features) {
  if (!isHtmlContent(content)) {
    return { kind: "plain", text: content };
  }
  let html = sanitizeHtml(content);
  if (features.linkTarget) {
    html = applyLinkTargetToHtml(html, features.linkTarget);
  }
  return { kind: "html", html };
}

// src/components/highlightViewerCode.ts
async function highlightViewerCodeBlocks(root) {
  if (!root) return;
  const [hljsModule, javascript, typescript, json, plaintext] = await Promise.all([
    import("highlight.js/lib/core"),
    import("highlight.js/lib/languages/javascript"),
    import("highlight.js/lib/languages/typescript"),
    import("highlight.js/lib/languages/json"),
    import("highlight.js/lib/languages/plaintext")
  ]);
  const hljs = hljsModule.default;
  hljs.registerLanguage("javascript", javascript.default);
  hljs.registerLanguage("js", javascript.default);
  hljs.registerLanguage("typescript", typescript.default);
  hljs.registerLanguage("ts", typescript.default);
  hljs.registerLanguage("json", json.default);
  hljs.registerLanguage("plaintext", plaintext.default);
  root.querySelectorAll("pre code").forEach((el) => {
    hljs.highlightElement(el);
  });
}

// src/components/RichTextViewer.tsx
import { jsx as jsx5 } from "react/jsx-runtime";
function mentionAriaLabel(template, label) {
  return template.replace("{label}", label);
}
function readMentionFromElement(element) {
  const id = element.getAttribute(MENTION_ID_ATTR);
  if (!id) return null;
  const label = element.getAttribute(MENTION_LABEL_ATTR) ?? element.textContent?.replace(/^@/, "") ?? id;
  return { id, label };
}
function RichTextViewer({
  content,
  features: featuresProp,
  labels: labelsProp,
  className,
  theme = defaultEditorTheme,
  onMentionClick
}) {
  const features = resolveViewerFeatures(featuresProp);
  const labels = resolveViewerLabels(labelsProp);
  const ref = useRef3(null);
  const prepared = useMemo3(
    () => prepareViewerContent(content, features),
    [content, features]
  );
  useEffect9(() => {
    if (prepared.kind !== "html" || !features.codeHighlight) return;
    void highlightViewerCodeBlocks(ref.current);
  }, [prepared, features.codeHighlight]);
  useEffect9(() => {
    if (prepared.kind !== "html" || !onMentionClick) return;
    const root = ref.current;
    if (!root) return;
    const mentions = root.querySelectorAll(`[${MENTION_ID_ATTR}]`);
    mentions.forEach((element) => {
      const mention = readMentionFromElement(element);
      if (!mention) return;
      element.setAttribute("role", "button");
      element.setAttribute("tabindex", "0");
      element.setAttribute(
        "aria-label",
        mentionAriaLabel(labels.mention, mention.label)
      );
    });
    const activateMention = (target) => {
      const mention = readMentionFromElement(target);
      if (mention) onMentionClick(mention);
    };
    const onClick = (event) => {
      const target = event.target.closest(
        `[${MENTION_ID_ATTR}]`
      );
      if (!target || !root.contains(target)) return;
      activateMention(target);
    };
    const onKeyDown = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const target = event.target.closest(
        `[${MENTION_ID_ATTR}]`
      );
      if (!target || !root.contains(target)) return;
      event.preventDefault();
      activateMention(target);
    };
    root.addEventListener("click", onClick);
    root.addEventListener("keydown", onKeyDown);
    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKeyDown);
    };
  }, [labels.mention, onMentionClick, prepared]);
  if (prepared.kind === "plain") {
    return /* @__PURE__ */ jsx5(
      "p",
      {
        ...themeDataAttribute(theme),
        className: cn("re-viewer re-viewer-plain", className),
        "aria-label": labels.content,
        children: prepared.text
      }
    );
  }
  return /* @__PURE__ */ jsx5(
    "div",
    {
      ref,
      ...themeDataAttribute(theme),
      className: cn("re-viewer", className),
      role: "article",
      "aria-label": labels.content,
      dangerouslySetInnerHTML: { __html: prepared.html }
    }
  );
}
export {
  RichTextEditor,
  RichTextViewer,
  applyLinkTargetToHtml,
  buildMarkdownTransformers,
  defaultEditorTheme,
  defaultFeatures,
  defaultLabels,
  defaultViewerFeatures,
  defaultViewerLabels,
  editorCssVariables,
  editorThemePresets,
  exportEditorHtml,
  formatKeyboardShortcuts,
  getActiveFormatShortcuts,
  getEnterBehaviorDescription,
  isEditorThemePreset,
  isHtmlContent,
  looksLikeMarkdown,
  markdownShortcuts,
  markdownToHtml,
  mentionKeyboardShortcuts,
  normalizeHtml,
  plainTextFromHtml,
  prepareViewerContent,
  sanitizeHtml,
  shortcutById,
  useRichTextEditor
};
//# sourceMappingURL=index.js.map