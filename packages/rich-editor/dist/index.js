"use client";

// src/components/RichTextEditor.tsx
import { $generateHtmlFromNodes } from "@lexical/html";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext as useLexicalComposerContext12 } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode as QuoteNode3 } from "@lexical/rich-text";
import {
  forwardRef,
  useCallback as useCallback2,
  useEffect as useEffect13,
  useId as useId3,
  useImperativeHandle,
  useMemo as useMemo2,
  useRef as useRef3,
  useState as useState5
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
  mentions: false,
  spoiler: false,
  selectionMenu: false
};
function resolveFeatures(partial) {
  return { ...defaultFeatures, ...partial };
}
var defaultLabels = {
  bold: "Bold",
  italic: "Italic",
  strikethrough: "Strikethrough",
  code: "Inline code",
  codeBlock: "Code block",
  quote: "Quote",
  bulletList: "Bullet list",
  numberedList: "Numbered list",
  link: "Link",
  heading: "Heading",
  mention: "Mention",
  spoiler: "Spoiler",
  submit: "Submit",
  menu: "Menu",
  editor: "Rich text editor",
  toolbar: "Formatting",
  mentionMenu: "Mention suggestions",
  selectionMenu: "Selection formatting"
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

// src/core/enterBindings.ts
var defaultEnterKeyBindings = [
  { key: "Enter", mod: true, action: "submit" }
];
function enterBehaviorToBindings(behavior) {
  switch (behavior) {
    case "submit":
      return [
        { key: "Enter", shift: true, action: "newline" },
        { key: "Enter", action: "submit" }
      ];
    case "newline":
      return [{ key: "Enter", action: "newline" }];
    case "shift-newline":
      return [
        { key: "Enter", shift: true, action: "newline" },
        { key: "Enter", action: "submit" }
      ];
    default:
      return defaultEnterKeyBindings;
  }
}
function resolveEnterKeyBindings(options) {
  if (options.enterKeyBindings?.length) {
    return options.enterKeyBindings;
  }
  if (options.enterBehavior) {
    return enterBehaviorToBindings(options.enterBehavior);
  }
  return defaultEnterKeyBindings;
}
function matchesEnterKeyBinding(event, binding) {
  if (event.key !== binding.key) return false;
  const mod = event.metaKey || event.ctrlKey;
  if (!!binding.mod !== mod) return false;
  if (!!binding.shift !== event.shiftKey) return false;
  if (!!binding.alt !== event.altKey) return false;
  return true;
}
function matchEnterKeyAction(event, bindings) {
  for (const binding of bindings) {
    if (matchesEnterKeyBinding(event, binding)) {
      return binding.action;
    }
  }
  return null;
}
function shouldPluginHandleEnterAction(event, action, bindings) {
  if (action === "submit") return true;
  const isPlainEnter = !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
  if (action === "newline" && isPlainEnter) {
    const submitOnPlainEnter = bindings.some(
      (b) => b.action === "submit" && !b.mod && !b.shift && !b.alt
    );
    return submitOnPlainEnter;
  }
  return true;
}
function formatEnterKeyBinding(binding) {
  const parts = [];
  if (binding.mod) parts.push("Ctrl");
  if (binding.shift) parts.push("Shift");
  if (binding.alt) parts.push("Alt");
  parts.push(binding.key);
  return parts.join("+");
}
function describeEnterKeyBindings(bindings) {
  const submit = bindings.find((b) => b.action === "submit");
  const newline = bindings.find((b) => b.action === "newline");
  const enterLabel = (() => {
    if (submit && !submit.mod && !submit.shift) return "Submit";
    if (newline && !newline.mod && !newline.shift) return "New line";
    return "New line";
  })();
  const modSubmit = bindings.find((b) => b.action === "submit" && b.mod);
  const shiftNewline = bindings.find((b) => b.action === "newline" && b.shift);
  return {
    enter: enterLabel,
    modEnter: modSubmit ? formatEnterKeyBinding(modSubmit) + " \u2192 Submit" : void 0,
    shiftEnter: shiftNewline ? formatEnterKeyBinding(shiftNewline) + " \u2192 New line" : void 0
  };
}

// src/core/selectionMenu.ts
var defaultSelectionMenuItems = [
  "bold",
  "italic",
  "strikethrough",
  "code",
  "link",
  "spoiler"
];
var allSelectionMenuItems = [
  "bold",
  "italic",
  "strikethrough",
  "code",
  "quote",
  "codeBlock",
  "bulletList",
  "numberedList",
  "link",
  "heading",
  "mention",
  "spoiler"
];

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

// src/nodes/SpoilerNode.ts
import {
  $applyNodeReplacement as $applyNodeReplacement2,
  ElementNode
} from "lexical";
var SpoilerNode = class _SpoilerNode extends ElementNode {
  static getType() {
    return "spoiler";
  }
  static clone(node) {
    return new _SpoilerNode(node.__key);
  }
  static importJSON(_serialized) {
    return $createSpoilerNode();
  }
  static importDOM() {
    return {
      span: (domNode) => {
        if (!domNode.classList.contains("re-spoiler")) return null;
        return {
          conversion: () => ({ node: $createSpoilerNode() }),
          priority: 2
        };
      }
    };
  }
  constructor(key) {
    super(key);
  }
  isInline() {
    return true;
  }
  canBeEmpty() {
    return false;
  }
  canInsertTextBefore() {
    return true;
  }
  canInsertTextAfter() {
    return true;
  }
  createDOM(_config) {
    const dom = document.createElement("span");
    dom.className = "re-spoiler";
    dom.setAttribute("data-re-spoiler", "");
    dom.style.display = "inline";
    return dom;
  }
  extractWithChild() {
    return true;
  }
  updateDOM() {
    return false;
  }
  exportDOM() {
    const element = document.createElement("span");
    element.className = "re-spoiler";
    element.setAttribute("data-re-spoiler", "");
    return { element };
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      type: "spoiler"
    };
  }
};
function $createSpoilerNode() {
  return $applyNodeReplacement2(new SpoilerNode());
}
function $isSpoilerNode(node) {
  return node instanceof SpoilerNode;
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
      "data-mention-label",
      "data-re-spoiler"
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
    if (code.classList.contains("re-block-code")) return;
    while (span.firstChild) {
      code.insertBefore(span.firstChild, span);
    }
    span.remove();
  });
  flattenTag(container, "b");
  flattenTag(container, "i");
  flattenTag(container, "s");
  mergeAdjacentBlockquotes(container);
  return container.innerHTML.trim();
}
function mergeAdjacentBlockquotes(container) {
  const parents = /* @__PURE__ */ new Set();
  container.querySelectorAll("blockquote").forEach((quote) => {
    if (quote.parentElement) parents.add(quote.parentElement);
  });
  for (const parent of parents) {
    const children = Array.from(parent.children);
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.tagName.toLowerCase() !== "blockquote") continue;
      let next = child.nextElementSibling;
      while (next && next.tagName.toLowerCase() === "blockquote") {
        while (next.firstChild) {
          child.appendChild(next.firstChild);
        }
        const toRemove = next;
        next = next.nextElementSibling;
        toRemove.remove();
      }
    }
  }
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
  STRIKETHROUGH,
  UNORDERED_LIST
} from "@lexical/markdown";
import {
  $createQuoteNode,
  $isQuoteNode,
  QuoteNode
} from "@lexical/rich-text";
import { $createParagraphNode, $createTextNode } from "lexical";
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
var SPOILER = {
  dependencies: [SpoilerNode],
  export: (node) => {
    if (!$isSpoilerNode(node)) return null;
    return `||${node.getTextContent()}||`;
  },
  importRegExp: /(?:^|\s)\|\|([^|]+?)\|\|/,
  regExp: /\|\|([^|]+?)\|\|$/,
  replace: (textNode, match) => {
    const spoiler = $createSpoilerNode();
    spoiler.append($createTextNode(match[1]));
    textNode.replace(spoiler);
  },
  trigger: "|",
  type: "text-match"
};
var QUOTE_REGEX = /^>\s/;
var QUOTE = {
  dependencies: [QuoteNode],
  export: (node, exportChildren) => {
    if (!$isQuoteNode(node)) return null;
    const lines = exportChildren(node).split("\n");
    return lines.map((line) => `> ${line}`).join("\n");
  },
  regExp: QUOTE_REGEX,
  replace: (parentNode, children, _match, isImport) => {
    if (isImport) {
      const previousNode = parentNode.getPreviousSibling();
      if ($isQuoteNode(previousNode)) {
        const paragraph2 = $createParagraphNode();
        paragraph2.append(...children);
        previousNode.append(paragraph2);
        parentNode.remove();
        return;
      }
    }
    const quote = $createQuoteNode();
    const paragraph = $createParagraphNode();
    paragraph.append(...children);
    quote.append(paragraph);
    parentNode.replace(quote);
    if (!isImport) {
      paragraph.select(0, 0);
    }
  },
  type: "element"
};
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
  if (features.spoiler) transformers.push(SPOILER);
  return transformers;
}
function looksLikeMarkdown(text) {
  const t = text.trim();
  if (t.length < 2) return false;
  return /^#{1,6}\s/m.test(t) || /^>\s/m.test(t) || /^[-*+]\s/m.test(t) || /^\d+\.\s/m.test(t) || /```[\s\S]*?```/.test(t) || /\*\*[^*\n]+\*\*/.test(t) || /(?:^|[^*])\*[^*\s][^*\n]*\*(?:[^*]|$)/.test(t) || /`[^`\n]+`/.test(t) || /~~[^~\n]+~~/.test(t) || /\|\|[^|\n]+\|\|/.test(t) || /\[[^\]]+\]\([^)]+\)/.test(t);
}
function markdownToHtml(markdown) {
  const raw = marked.parse(markdown, { async: false });
  return sanitizeHtml(raw);
}

// src/core/theme.ts
var PRISM_TOKEN_TYPES = [
  "atrule",
  "attr",
  "attr-name",
  "attr-value",
  "boolean",
  "builtin",
  "cdata",
  "char",
  "class-name",
  "comment",
  "constant",
  "deleted",
  "doctype",
  "entity",
  "function",
  "important",
  "inserted",
  "keyword",
  "namespace",
  "number",
  "operator",
  "prolog",
  "property",
  "punctuation",
  "regex",
  "selector",
  "string",
  "symbol",
  "tag",
  "url",
  "variable"
];
var codeHighlightTheme = Object.fromEntries(
  PRISM_TOKEN_TYPES.map((type) => [type, `token ${type}`])
);
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
  codeHighlight: codeHighlightTheme,
  list: {
    ul: "re-list-ul",
    ol: "re-list-ol",
    listitem: "re-list-item"
  },
  link: "re-link",
  mention: "re-mention",
  spoiler: "re-spoiler"
};

// src/core/cn.ts
function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

// src/components/plugins/index.tsx
import { useEffect as useEffect11, useRef as useRef2 } from "react";
import { $generateNodesFromDOM as $generateNodesFromDOM2 } from "@lexical/html";
import { useLexicalComposerContext as useLexicalComposerContext11 } from "@lexical/react/LexicalComposerContext";
import { $getRoot as $getRoot4 } from "lexical";

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
  bindings,
  onSubmit
}) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!bindings.length) return;
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        if (!(event instanceof KeyboardEvent)) return false;
        const action = matchEnterKeyAction(event, bindings);
        if (!action) return false;
        if (!shouldPluginHandleEnterAction(event, action, bindings)) {
          return false;
        }
        if (action === "newline") {
          event.preventDefault();
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.insertParagraph();
            }
          });
          return true;
        }
        if (action === "submit" && onSubmit) {
          event.preventDefault();
          onSubmit();
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [bindings, editor, onSubmit]);
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

// src/components/plugins/BlockBehaviorPlugin.tsx
import { useEffect as useEffect5 } from "react";
import { useLexicalComposerContext as useLexicalComposerContext5 } from "@lexical/react/LexicalComposerContext";
import { $isCodeNode as $isCodeNode2 } from "@lexical/code";
import { $isQuoteNode as $isQuoteNode4 } from "@lexical/rich-text";
import {
  $getRoot as $getRoot3,
  $getSelection as $getSelection4,
  $isParagraphNode as $isParagraphNode3,
  $isRangeSelection as $isRangeSelection4,
  COMMAND_PRIORITY_CRITICAL,
  DELETE_CHARACTER_COMMAND,
  KEY_ENTER_COMMAND as KEY_ENTER_COMMAND2
} from "lexical";

// src/core/blockBehavior.ts
import { $isCodeNode } from "@lexical/code";
import { $isListItemNode } from "@lexical/list";
import { $createQuoteNode as $createQuoteNode3, $isQuoteNode as $isQuoteNode3 } from "@lexical/rich-text";
import { $findMatchingParent as $findMatchingParent2 } from "@lexical/utils";
import {
  $createParagraphNode as $createParagraphNode3,
  $createTextNode as $createTextNode2,
  $getRoot as $getRoot2,
  $getSelection as $getSelection3,
  $getNodeByKey,
  $isElementNode as $isElementNode2,
  $isParagraphNode as $isParagraphNode2,
  $isRangeSelection as $isRangeSelection3,
  $isTextNode
} from "lexical";

// src/core/quoteBlocks.ts
import { $isQuoteNode as $isQuoteNode2, $createQuoteNode as $createQuoteNode2 } from "@lexical/rich-text";
import { $findMatchingParent } from "@lexical/utils";
import {
  $createParagraphNode as $createParagraphNode2,
  $getRoot,
  $isElementNode,
  $isParagraphNode,
  $isRootOrShadowRoot
} from "lexical";
function $getTopLevelBlock(node) {
  let current = node;
  while (current !== null && !$isRootOrShadowRoot(current.getParent())) {
    current = current.getParent();
  }
  return $isElementNode(current) ? current : null;
}
function $getSelectedTopLevelBlocks(selection) {
  const blocks = /* @__PURE__ */ new Map();
  for (const node of selection.getNodes()) {
    const block = $getTopLevelBlock(node);
    if (block) blocks.set(block.getKey(), block);
  }
  const anchorBlock = $getTopLevelBlock(selection.anchor.getNode());
  const focusBlock = $getTopLevelBlock(selection.focus.getNode());
  if (anchorBlock) blocks.set(anchorBlock.getKey(), anchorBlock);
  if (focusBlock) blocks.set(focusBlock.getKey(), focusBlock);
  return [...blocks.values()];
}
function $ensureQuoteParagraphStructure(quote) {
  const children = [...quote.getChildren()];
  if (children.length > 0 && children.every($isParagraphNode)) return;
  const normalized = [];
  let pending = null;
  for (const child of children) {
    if ($isParagraphNode(child)) {
      normalized.push(child);
      pending = null;
      continue;
    }
    if (!pending) {
      pending = $createParagraphNode2();
      normalized.push(pending);
    }
    pending.append(child);
  }
  if (normalized.length === 0) {
    normalized.push($createParagraphNode2());
  }
  quote.clear();
  quote.append(...normalized);
}
function $getQuoteParagraph(node) {
  const quote = $findMatchingParent(node, $isQuoteNode2);
  if (!quote) return null;
  let current = node;
  while (current !== null && current !== quote) {
    if ($isParagraphNode(current) && current.getParent() === quote) {
      return current;
    }
    current = current.getParent();
  }
  $ensureQuoteParagraphStructure(quote);
  current = node;
  while (current !== null && current !== quote) {
    if ($isParagraphNode(current) && current.getParent() === quote) {
      return current;
    }
    current = current.getParent();
  }
  const first = quote.getFirstChild();
  return $isParagraphNode(first) ? first : null;
}
function $unwrapQuote(quote) {
  $ensureQuoteParagraphStructure(quote);
  const paragraphs = quote.getChildren().filter($isParagraphNode);
  if (paragraphs.length === 0) {
    quote.replace($createParagraphNode2());
    return;
  }
  const [first, ...rest] = paragraphs;
  quote.insertBefore(first);
  let previous = first;
  for (const paragraph of rest) {
    previous.insertAfter(paragraph);
    previous = paragraph;
  }
  quote.remove();
}
function $wrapParagraphInQuote(paragraph) {
  const quote = $createQuoteNode2();
  const inner = $createParagraphNode2();
  inner.append(...paragraph.getChildren());
  quote.append(inner);
  paragraph.replace(quote);
  return quote;
}
function $applyQuoteToSelection(selection) {
  const inQuote = $findMatchingParent(selection.anchor.getNode(), $isQuoteNode2);
  if (inQuote) {
    $unwrapQuote(inQuote);
    return;
  }
  const blocks = $getSelectedTopLevelBlocks(selection);
  const paragraphs = blocks.filter($isParagraphNode);
  if (paragraphs.length === 0) return;
  if (paragraphs.length === 1) {
    $wrapParagraphInQuote(paragraphs[0]);
    return;
  }
  const quote = $createQuoteNode2();
  for (const block of paragraphs) {
    const inner = $createParagraphNode2();
    inner.append(...block.getChildren());
    quote.append(inner);
  }
  paragraphs[0].replace(quote);
  for (let i = 1; i < paragraphs.length; i++) {
    paragraphs[i].remove();
  }
  quote.selectEnd();
}
function $normalizeAllQuotes() {
  for (const child of $getRoot().getChildren()) {
    if ($isQuoteNode2(child)) {
      $ensureQuoteParagraphStructure(child);
    }
  }
}

// src/core/blockBehavior.ts
function $getBlockQuote(node) {
  return $findMatchingParent2(node, $isQuoteNode3);
}
function $getBlockCode(node) {
  return $findMatchingParent2(node, $isCodeNode);
}
function $isParagraphEmpty(node) {
  return $isParagraphNode2(node) && node.getTextContent().trim() === "";
}
function $countTrailingEmptyParagraphs(quote) {
  const children = quote.getChildren();
  let count = 0;
  for (let i = children.length - 1; i >= 0; i--) {
    if ($isParagraphEmpty(children[i])) count += 1;
    else break;
  }
  return count;
}
function $isAtStartOfBlock(selection) {
  const anchor = selection.anchor;
  if (anchor.offset !== 0) return false;
  const node = anchor.getNode();
  const paragraph = $findMatchingParent2(node, $isParagraphNode2);
  if (paragraph) {
    let current = node;
    while (current !== null && current !== paragraph) {
      const parent = current.getParent();
      if (parent === null) return false;
      if (parent.getFirstChild() !== current) return false;
      current = parent;
    }
    return true;
  }
  if ($isParagraphNode2(node)) return true;
  if ($isTextNode(node)) {
    const parent = node.getParent();
    if ($isElementNode2(parent)) {
      return parent.getFirstChild() === node;
    }
  }
  return false;
}
function $isAtEndOfBlock(selection) {
  const focus = selection.focus;
  const node = focus.getNode();
  if ($isTextNode(node)) {
    return focus.offset === node.getTextContentSize();
  }
  if ($isParagraphNode2(node)) {
    const lastDescendant = node.getLastDescendant();
    if (!lastDescendant) return true;
    if ($isTextNode(lastDescendant)) {
      return focus.offset === lastDescendant.getTextContentSize();
    }
  }
  return false;
}
function $unwrapParagraphFromQuote(paragraph) {
  const quote = paragraph.getParent();
  if (!$isQuoteNode3(quote)) return;
  const paragraphs = quote.getChildren().filter($isParagraphNode2);
  const index = paragraphs.findIndex((p) => p.getKey() === paragraph.getKey());
  if (index === -1) return;
  const total = paragraphs.length;
  const newParagraph = $createParagraphNode3();
  newParagraph.append(...paragraph.getChildren());
  paragraph.remove();
  if (total === 1) {
    quote.replace(newParagraph);
    newParagraph.selectStart();
    return;
  }
  if (index === 0) {
    quote.insertBefore(newParagraph);
    newParagraph.selectStart();
    return;
  }
  if (index === total - 1) {
    quote.insertAfter(newParagraph);
    newParagraph.selectStart();
    return;
  }
  const afterQuote = $createQuoteNode3();
  for (let i = index + 1; i < paragraphs.length; i += 1) {
    afterQuote.append(paragraphs[i]);
  }
  quote.insertAfter(newParagraph);
  if (afterQuote.getChildrenSize() > 0) {
    newParagraph.insertAfter(afterQuote);
  }
  newParagraph.selectStart();
}
function $pruneEmptyQuotes() {
  for (const child of [...$getRoot2().getChildren()]) {
    if (!$isQuoteNode3(child)) continue;
    if (child.getTextContent().trim() === "") {
      child.remove();
    }
  }
}
function $insertParagraphBeforeBlock(block) {
  const paragraph = $createParagraphNode3();
  block.insertBefore(paragraph);
  paragraph.selectEnd();
}
function $exitQuoteWithEmptyLines(quote) {
  while (quote.getLastChild() && $isParagraphEmpty(quote.getLastChild())) {
    quote.getLastChild().remove();
  }
  const exitParagraph = $createParagraphNode3();
  quote.insertAfter(exitParagraph);
  exitParagraph.selectStart();
  if (quote.getChildrenSize() === 0) {
    quote.remove();
  }
}
function $handleQuoteEnter(quote, paragraph, selection) {
  $ensureQuoteParagraphStructure(quote);
  if (!$isParagraphNode2(paragraph) || paragraph.getParent() !== quote) {
    const resolved = quote.getChildren().find($isParagraphNode2);
    if (!resolved) {
      selection.insertParagraph();
      return;
    }
    paragraph = resolved;
  }
  if ($isAtStartOfBlock(selection) && paragraph === quote.getFirstChild()) {
    $insertParagraphBeforeBlock(quote);
    return;
  }
  if ($isAtEndOfBlock(selection) && $isParagraphEmpty(paragraph)) {
    const trailingEmpty = $countTrailingEmptyParagraphs(quote);
    if (trailingEmpty >= 2) {
      $exitQuoteWithEmptyLines(quote);
      return;
    }
  }
  selection.insertParagraph();
}
function $handleQuoteBackspace(quote, paragraph, selection) {
  const liveQuote = $getNodeByKey(quote.getKey());
  if (!liveQuote || !$isQuoteNode3(liveQuote)) return;
  quote = liveQuote;
  const liveParagraph = $getQuoteParagraph(selection.anchor.getNode());
  if (!liveParagraph || liveParagraph.getParent() !== quote) return;
  paragraph = liveParagraph;
  if (!$isParagraphNode2(paragraph) || paragraph.getParent() !== quote) return;
  if (!$isAtStartOfBlock(selection)) return;
  if ($isParagraphEmpty(paragraph)) {
    if (quote.getChildrenSize() <= 1) {
      const replacement = $createParagraphNode3();
      quote.replace(replacement);
      replacement.selectStart();
      return;
    }
    const prev = paragraph.getPreviousSibling();
    paragraph.remove();
    if (prev && $isParagraphNode2(prev)) {
      prev.selectEnd();
    } else {
      quote.getFirstChild()?.selectStart();
    }
    return;
  }
  $unwrapParagraphFromQuote(paragraph);
  $pruneEmptyQuotes();
}
function $mergeAdjacentQuoteBlocks() {
  const root = $getRoot2();
  const children = [...root.getChildren()];
  for (let i = 0; i < children.length - 1; i++) {
    const current = children[i];
    const next = children[i + 1];
    if ($isQuoteNode3(current) && $isQuoteNode3(next)) {
      $ensureQuoteParagraphStructure(current);
      $ensureQuoteParagraphStructure(next);
      for (const child of [...next.getChildren()]) {
        current.append(child);
      }
      next.remove();
      children.splice(i + 1, 1);
      i -= 1;
    }
  }
}
function $mergeAdjacentCodeBlocks() {
  const root = $getRoot2();
  const children = [...root.getChildren()];
  for (let i = 0; i < children.length - 1; i++) {
    const current = children[i];
    const next = children[i + 1];
    if ($isCodeNode(current) && $isCodeNode(next)) {
      const merged = current.getTextContent();
      const nextText = next.getTextContent();
      const join = merged.endsWith("\n") || nextText.startsWith("\n") ? "" : "\n";
      current.clear();
      current.append($createTextNode2(merged + join + nextText));
      next.remove();
      children.splice(i + 1, 1);
      i -= 1;
    }
  }
}
function $getCodeTrailingEmptyLines(codeNode) {
  const text = codeNode.getTextContent();
  const lines = text.split("\n");
  let count = 0;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim() === "") count += 1;
    else break;
  }
  return count;
}
function $isAtEndOfCodeBlock(selection) {
  const code = $getBlockCode(selection.focus.getNode());
  if (!code) return false;
  return selection.focus.offset === code.getTextContent().length;
}
function $exitCodeBlock(codeNode) {
  const text = codeNode.getTextContent().replace(/\n{1,2}$/, "");
  codeNode.clear();
  if (text) {
    codeNode.append($createTextNode2(text));
  }
  const exitParagraph = $createParagraphNode3();
  codeNode.insertAfter(exitParagraph);
  exitParagraph.selectStart();
}
function $shouldSkipBlockBehavior() {
  const selection = $getSelection3();
  if (!$isRangeSelection3(selection)) return true;
  const node = selection.anchor.getNode();
  if ($findMatchingParent2(node, $isListItemNode)) return true;
  return false;
}

// src/components/plugins/BlockBehaviorPlugin.tsx
function $needsQuoteNormalization() {
  for (const child of $getRoot3().getChildren()) {
    if (!$isQuoteNode4(child)) continue;
    const children = child.getChildren();
    if (children.length === 0 || children.some((node) => !$isParagraphNode3(node))) {
      return true;
    }
  }
  return false;
}
function $needsBlockMerge() {
  const children = $getRoot3().getChildren();
  for (let i = 0; i < children.length - 1; i++) {
    const current = children[i];
    const next = children[i + 1];
    if ($isQuoteNode4(current) && $isQuoteNode4(next)) return true;
    if ($isCodeNode2(current) && $isCodeNode2(next)) return true;
  }
  return false;
}
function BlockBehaviorPlugin() {
  const [editor] = useLexicalComposerContext5();
  useEffect5(() => {
    const removeMerge = editor.registerUpdateListener(({ editorState }) => {
      const needsWork = editorState.read(
        () => $needsBlockMerge() || $needsQuoteNormalization()
      );
      if (!needsWork) return;
      editor.update(
        () => {
          $normalizeAllQuotes();
          $mergeAdjacentQuoteBlocks();
          $mergeAdjacentCodeBlocks();
        },
        { discrete: true }
      );
    });
    const removeEnter = editor.registerCommand(
      KEY_ENTER_COMMAND2,
      (event) => {
        if ($shouldSkipBlockBehavior()) return false;
        const quoteContext = editor.getEditorState().read(() => {
          const selection = $getSelection4();
          if (!$isRangeSelection4(selection)) return null;
          const quote = $getBlockQuote(selection.anchor.getNode());
          if (!quote || !$isQuoteNode4(quote)) return null;
          const paragraph = $getQuoteParagraph(selection.anchor.getNode());
          if (!paragraph || paragraph.getParent() !== quote) return null;
          return { quote, paragraph };
        });
        if (quoteContext) {
          event?.preventDefault();
          editor.update(() => {
            const selection = $getSelection4();
            if (!$isRangeSelection4(selection)) return;
            $handleQuoteEnter(
              quoteContext.quote,
              quoteContext.paragraph,
              selection
            );
          });
          return true;
        }
        const shouldExitCode = editor.getEditorState().read(() => {
          const selection = $getSelection4();
          if (!$isRangeSelection4(selection)) return false;
          const code = $getBlockCode(selection.anchor.getNode());
          if (!code || !$isCodeNode2(code) || !$isAtEndOfCodeBlock(selection)) {
            return false;
          }
          const trailingEmpty = $getCodeTrailingEmptyLines(code);
          const text = code.getTextContent();
          const atEmptyLine = selection.focus.offset === text.length && text.endsWith("\n");
          return atEmptyLine && trailingEmpty >= 2;
        });
        if (shouldExitCode) {
          event?.preventDefault();
          editor.update(() => {
            const selection = $getSelection4();
            if (!$isRangeSelection4(selection)) return;
            const code = $getBlockCode(selection.anchor.getNode());
            if (code && $isCodeNode2(code)) {
              $exitCodeBlock(code);
            }
          });
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
    const removeBackspace = editor.registerCommand(
      DELETE_CHARACTER_COMMAND,
      (isBackward) => {
        if (!isBackward) return false;
        if ($shouldSkipBlockBehavior()) return false;
        const selection = $getSelection4();
        if (!$isRangeSelection4(selection) || !selection.isCollapsed()) return false;
        if (!$isAtStartOfBlock(selection)) return false;
        const quote = $getBlockQuote(selection.anchor.getNode());
        if (!quote || !$isQuoteNode4(quote)) return false;
        const paragraph = $getQuoteParagraph(selection.anchor.getNode());
        if (!paragraph || paragraph.getParent() !== quote) return false;
        $handleQuoteBackspace(quote, paragraph, selection);
        return true;
      },
      COMMAND_PRIORITY_CRITICAL
    );
    return () => {
      removeMerge();
      removeEnter();
      removeBackspace();
    };
  }, [editor]);
  return null;
}

// src/components/plugins/CodeHighlightPlugin.tsx
import { useEffect as useEffect6 } from "react";
import { registerCodeHighlighting } from "@lexical/code";
import { useLexicalComposerContext as useLexicalComposerContext6 } from "@lexical/react/LexicalComposerContext";
function CodeHighlightPlugin({ enabled }) {
  const [editor] = useLexicalComposerContext6();
  useEffect6(() => {
    if (!enabled) return;
    return registerCodeHighlighting(editor);
  }, [editor, enabled]);
  return null;
}

// src/components/plugins/SelectionMenuPlugin.tsx
import { useEffect as useEffect8, useState as useState3 } from "react";
import { createPortal as createPortal2 } from "react-dom";
import { useLexicalComposerContext as useLexicalComposerContext8 } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection as $getSelection6,
  $isRangeSelection as $isRangeSelection6,
  COMMAND_PRIORITY_LOW as COMMAND_PRIORITY_LOW4,
  SELECTION_CHANGE_COMMAND as SELECTION_CHANGE_COMMAND2
} from "lexical";

// src/components/toolbar/ToolbarIcons.tsx
import { jsx as jsx3, jsxs as jsxs2 } from "react/jsx-runtime";
var defaults = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true
};
function IconBold(props) {
  return /* @__PURE__ */ jsxs2("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ jsx3("path", { d: "M6 4h8a4 4 0 0 1 0 8H6z" }),
    /* @__PURE__ */ jsx3("path", { d: "M6 12h9a4 4 0 0 1 0 8H6z" })
  ] });
}
function IconItalic(props) {
  return /* @__PURE__ */ jsxs2("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ jsx3("line", { x1: "19", y1: "4", x2: "10", y2: "4" }),
    /* @__PURE__ */ jsx3("line", { x1: "14", y1: "20", x2: "5", y2: "20" }),
    /* @__PURE__ */ jsx3("line", { x1: "15", y1: "4", x2: "9", y2: "20" })
  ] });
}
function IconStrikethrough(props) {
  return /* @__PURE__ */ jsxs2("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ jsx3("path", { d: "M16 4H9a3 3 0 0 0-2.83 4" }),
    /* @__PURE__ */ jsx3("path", { d: "M14 12a4 4 0 0 1 0 8H6" }),
    /* @__PURE__ */ jsx3("line", { x1: "4", y1: "12", x2: "20", y2: "12" })
  ] });
}
function IconCode(props) {
  return /* @__PURE__ */ jsxs2("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ jsx3("polyline", { points: "16 18 22 12 16 6" }),
    /* @__PURE__ */ jsx3("polyline", { points: "8 6 2 12 8 18" })
  ] });
}
function IconQuote(props) {
  return /* @__PURE__ */ jsxs2("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ jsx3("path", { d: "M3 10h4v7H3z" }),
    /* @__PURE__ */ jsx3("path", { d: "M13 10h4v7h-4z" })
  ] });
}
function IconCodeBlock(props) {
  return /* @__PURE__ */ jsxs2("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ jsx3("rect", { x: "4", y: "4", width: "16", height: "16", rx: "2" }),
    /* @__PURE__ */ jsx3("path", { d: "M8 10l2 2-2 2" }),
    /* @__PURE__ */ jsx3("path", { d: "M13 14h3" })
  ] });
}
function IconBulletList(props) {
  return /* @__PURE__ */ jsxs2("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ jsx3("line", { x1: "9", y1: "6", x2: "20", y2: "6" }),
    /* @__PURE__ */ jsx3("line", { x1: "9", y1: "12", x2: "20", y2: "12" }),
    /* @__PURE__ */ jsx3("line", { x1: "9", y1: "18", x2: "20", y2: "18" }),
    /* @__PURE__ */ jsx3("circle", { cx: "5", cy: "6", r: "1.5", fill: "currentColor", stroke: "none" }),
    /* @__PURE__ */ jsx3("circle", { cx: "5", cy: "12", r: "1.5", fill: "currentColor", stroke: "none" }),
    /* @__PURE__ */ jsx3("circle", { cx: "5", cy: "18", r: "1.5", fill: "currentColor", stroke: "none" })
  ] });
}
function IconNumberedList(props) {
  return /* @__PURE__ */ jsxs2("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ jsx3("line", { x1: "10", y1: "6", x2: "20", y2: "6" }),
    /* @__PURE__ */ jsx3("line", { x1: "10", y1: "12", x2: "20", y2: "12" }),
    /* @__PURE__ */ jsx3("line", { x1: "10", y1: "18", x2: "20", y2: "18" }),
    /* @__PURE__ */ jsx3("path", { d: "M4 6h1v4H4" }),
    /* @__PURE__ */ jsx3("path", { d: "M4 16h2" }),
    /* @__PURE__ */ jsx3("path", { d: "M6 14H4" })
  ] });
}
function IconLink(props) {
  return /* @__PURE__ */ jsxs2("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ jsx3("path", { d: "M10 13a5 5 0 0 0 7.54.54l2.92-2.92a5 5 0 0 0-7.07-7.07l-1.5 1.5" }),
    /* @__PURE__ */ jsx3("path", { d: "M14 11a5 5 0 0 0-7.54-.54L3.54 13.4a5 5 0 0 0 7.07 7.07l1.5-1.5" })
  ] });
}
function IconHeading(props) {
  return /* @__PURE__ */ jsxs2("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ jsx3("path", { d: "M4 12V4h4v16H4v-8" }),
    /* @__PURE__ */ jsx3("path", { d: "M12 4h8" }),
    /* @__PURE__ */ jsx3("path", { d: "M16 4v16" })
  ] });
}
function IconMention(props) {
  return /* @__PURE__ */ jsxs2("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ jsx3("circle", { cx: "12", cy: "12", r: "4" }),
    /* @__PURE__ */ jsx3("path", { d: "M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" })
  ] });
}
function IconSpoiler(props) {
  return /* @__PURE__ */ jsxs2("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ jsx3("path", { d: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" }),
    /* @__PURE__ */ jsx3("line", { x1: "3", y1: "3", x2: "21", y2: "21" })
  ] });
}

// src/components/toolbar/useFormatState.ts
import { useEffect as useEffect7, useState as useState2 } from "react";
import { useLexicalComposerContext as useLexicalComposerContext7 } from "@lexical/react/LexicalComposerContext";
import { $createCodeNode, $isCodeNode as $isCodeNode3 } from "@lexical/code";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND
} from "@lexical/list";
import {
  $createHeadingNode,
  $isHeadingNode,
  $isQuoteNode as $isQuoteNode5
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $findMatchingParent as $findMatchingParent3 } from "@lexical/utils";
import {
  $createParagraphNode as $createParagraphNode4,
  $createTextNode as $createTextNode3,
  $getSelection as $getSelection5,
  $isRangeSelection as $isRangeSelection5,
  COMMAND_PRIORITY_LOW as COMMAND_PRIORITY_LOW3,
  FORMAT_TEXT_COMMAND as FORMAT_TEXT_COMMAND2,
  SELECTION_CHANGE_COMMAND
} from "lexical";
var emptyFormat = {
  bold: false,
  italic: false,
  strikethrough: false,
  code: false,
  quote: false,
  codeBlock: false,
  bulletList: false,
  numberedList: false,
  link: false,
  heading: false,
  spoiler: false
};
function useFormatState() {
  const [editor] = useLexicalComposerContext7();
  const [state, setState] = useState2(emptyFormat);
  useEffect7(() => {
    const update = () => {
      editor.getEditorState().read(() => {
        const selection = $getSelection5();
        if (!$isRangeSelection5(selection)) {
          setState(emptyFormat);
          return;
        }
        const anchorNode = selection.anchor.getNode();
        const listNode = $findMatchingParent3(anchorNode, $isListNode);
        setState({
          bold: selection.hasFormat("bold"),
          italic: selection.hasFormat("italic"),
          strikethrough: selection.hasFormat("strikethrough"),
          code: selection.hasFormat("code"),
          quote: !!$findMatchingParent3(anchorNode, $isQuoteNode5),
          codeBlock: !!$findMatchingParent3(anchorNode, $isCodeNode3),
          bulletList: listNode?.getListType() === "bullet",
          numberedList: listNode?.getListType() === "number",
          link: !!$findMatchingParent3(anchorNode, $isLinkNode),
          heading: !!$findMatchingParent3(anchorNode, $isHeadingNode),
          spoiler: !!$findMatchingParent3(anchorNode, $isSpoilerNode)
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
  const [editor] = useLexicalComposerContext7();
  return {
    bold: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND2, "bold"),
    italic: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND2, "italic"),
    strikethrough: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND2, "strikethrough"),
    code: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND2, "code"),
    quote: () => {
      editor.update(() => {
        const selection = $getSelection5();
        if (!$isRangeSelection5(selection)) return;
        $applyQuoteToSelection(selection);
      });
    },
    codeBlock: () => {
      editor.update(() => {
        const selection = $getSelection5();
        if (!$isRangeSelection5(selection)) return;
        const inCode = !!$findMatchingParent3(
          selection.anchor.getNode(),
          $isCodeNode3
        );
        if (inCode) {
          $setBlocksType(selection, () => $createParagraphNode4());
        } else {
          $setBlocksType(selection, () => $createCodeNode());
        }
      });
    },
    bulletList: () => {
      editor.update(() => {
        const selection = $getSelection5();
        if (!$isRangeSelection5(selection)) return;
        const listNode = $findMatchingParent3(
          selection.anchor.getNode(),
          $isListNode
        );
        if (listNode?.getListType() === "bullet") {
          editor.dispatchCommand(REMOVE_LIST_COMMAND, void 0);
        } else {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, void 0);
        }
      });
    },
    numberedList: () => {
      editor.update(() => {
        const selection = $getSelection5();
        if (!$isRangeSelection5(selection)) return;
        const listNode = $findMatchingParent3(
          selection.anchor.getNode(),
          $isListNode
        );
        if (listNode?.getListType() === "number") {
          editor.dispatchCommand(REMOVE_LIST_COMMAND, void 0);
        } else {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, void 0);
        }
      });
    },
    link: () => {
      editor.update(() => {
        const selection = $getSelection5();
        if (!$isRangeSelection5(selection)) return;
        const existing = $findMatchingParent3(
          selection.anchor.getNode(),
          $isLinkNode
        );
        if (existing) {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
          return;
        }
        const url = window.prompt("URL", "https://");
        if (url === null) return;
        if (url.trim()) {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, url.trim());
        }
      });
    },
    heading: () => {
      editor.update(() => {
        const selection = $getSelection5();
        if (!$isRangeSelection5(selection)) return;
        const heading = $findMatchingParent3(
          selection.anchor.getNode(),
          $isHeadingNode
        );
        if (heading) {
          $setBlocksType(selection, () => $createParagraphNode4());
        } else {
          $setBlocksType(selection, () => $createHeadingNode("h2"));
        }
      });
    },
    mentionTrigger: () => {
      editor.update(() => {
        const selection = $getSelection5();
        if ($isRangeSelection5(selection)) {
          selection.insertText("@");
        }
      });
      editor.focus();
    },
    spoiler: () => {
      editor.update(() => {
        const selection = $getSelection5();
        if (!$isRangeSelection5(selection) || selection.isCollapsed()) return;
        const anchorNode = selection.anchor.getNode();
        const existing = $findMatchingParent3(anchorNode, $isSpoilerNode);
        if (existing) {
          const textNode = $createTextNode3(existing.getTextContent());
          existing.replace(textNode);
          textNode.select();
          return;
        }
        const text = selection.getTextContent();
        if (!text) return;
        selection.removeText();
        const spoiler = $createSpoilerNode();
        spoiler.append($createTextNode3(text));
        selection.insertNodes([spoiler]);
      });
    }
  };
}

// src/components/plugins/SelectionMenuPlugin.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
function isItemEnabled(item, features) {
  switch (item) {
    case "bold":
      return features.bold;
    case "italic":
      return features.italic;
    case "strikethrough":
      return features.strikethrough;
    case "code":
      return features.code;
    case "quote":
      return features.quote;
    case "codeBlock":
      return features.codeBlock;
    case "bulletList":
    case "numberedList":
      return features.lists;
    case "link":
      return features.links;
    case "heading":
      return features.headings;
    case "mention":
      return features.mentions;
    case "spoiler":
      return features.spoiler;
    default:
      return false;
  }
}
function MenuIcon({ item }) {
  switch (item) {
    case "bold":
      return /* @__PURE__ */ jsx4(IconBold, {});
    case "italic":
      return /* @__PURE__ */ jsx4(IconItalic, {});
    case "strikethrough":
      return /* @__PURE__ */ jsx4(IconStrikethrough, {});
    case "code":
      return /* @__PURE__ */ jsx4(IconCode, {});
    case "quote":
      return /* @__PURE__ */ jsx4(IconQuote, {});
    case "codeBlock":
      return /* @__PURE__ */ jsx4(IconCodeBlock, {});
    case "bulletList":
      return /* @__PURE__ */ jsx4(IconBulletList, {});
    case "numberedList":
      return /* @__PURE__ */ jsx4(IconNumberedList, {});
    case "link":
      return /* @__PURE__ */ jsx4(IconLink, {});
    case "heading":
      return /* @__PURE__ */ jsx4(IconHeading, {});
    case "mention":
      return /* @__PURE__ */ jsx4(IconMention, {});
    case "spoiler":
      return /* @__PURE__ */ jsx4(IconSpoiler, {});
    default:
      return null;
  }
}
function itemLabel(item, labels) {
  switch (item) {
    case "bold":
      return labels.bold;
    case "italic":
      return labels.italic;
    case "strikethrough":
      return labels.strikethrough;
    case "code":
      return labels.code;
    case "quote":
      return labels.quote;
    case "codeBlock":
      return labels.codeBlock;
    case "bulletList":
      return labels.bulletList;
    case "numberedList":
      return labels.numberedList;
    case "link":
      return labels.link;
    case "heading":
      return labels.heading;
    case "mention":
      return labels.mention;
    case "spoiler":
      return labels.spoiler;
    default:
      return item;
  }
}
function runItemAction(item, format) {
  switch (item) {
    case "bold":
      format.bold();
      break;
    case "italic":
      format.italic();
      break;
    case "strikethrough":
      format.strikethrough();
      break;
    case "code":
      format.code();
      break;
    case "quote":
      format.quote();
      break;
    case "codeBlock":
      format.codeBlock();
      break;
    case "bulletList":
      format.bulletList();
      break;
    case "numberedList":
      format.numberedList();
      break;
    case "link":
      format.link();
      break;
    case "heading":
      format.heading();
      break;
    case "mention":
      format.mentionTrigger();
      break;
    case "spoiler":
      format.spoiler();
      break;
  }
}
function isItemActive(item, active) {
  switch (item) {
    case "bold":
      return active.bold;
    case "italic":
      return active.italic;
    case "strikethrough":
      return active.strikethrough;
    case "code":
      return active.code;
    case "quote":
      return active.quote;
    case "codeBlock":
      return active.codeBlock;
    case "bulletList":
      return active.bulletList;
    case "numberedList":
      return active.numberedList;
    case "link":
      return active.link;
    case "heading":
      return active.heading;
    case "spoiler":
      return active.spoiler;
    default:
      return false;
  }
}
function SelectionMenuPlugin({
  features,
  labels,
  items = defaultSelectionMenuItems,
  containerRef
}) {
  const [editor] = useLexicalComposerContext8();
  const active = useFormatState();
  const format = useFormatActions();
  const [position, setPosition] = useState3(
    null
  );
  const visibleItems = items.filter((item) => isItemEnabled(item, features));
  useEffect8(() => {
    if (!features.selectionMenu || visibleItems.length === 0) {
      setPosition(null);
      return;
    }
    const update = () => {
      editor.getEditorState().read(() => {
        const selection = $getSelection6();
        if (!$isRangeSelection6(selection) || selection.isCollapsed()) {
          setPosition(null);
          return;
        }
        const native = window.getSelection();
        const container = containerRef.current;
        if (!native || native.rangeCount === 0 || !container) {
          setPosition(null);
          return;
        }
        const range = native.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const host = container.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) {
          setPosition(null);
          return;
        }
        const menuHeight = 44;
        const gap = 8;
        const spaceAbove = rect.top - host.top;
        const showBelow = spaceAbove < menuHeight + gap;
        setPosition({
          top: showBelow ? rect.bottom - host.top + gap : rect.top - host.top - menuHeight - gap,
          left: rect.left - host.left + rect.width / 2
        });
      });
    };
    update();
    const removeSelection = editor.registerCommand(
      SELECTION_CHANGE_COMMAND2,
      () => {
        update();
        return false;
      },
      COMMAND_PRIORITY_LOW4
    );
    const removeUpdate = editor.registerUpdateListener(update);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      removeSelection();
      removeUpdate();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [containerRef, editor, features.selectionMenu, visibleItems.length]);
  if (!features.selectionMenu || !position || visibleItems.length === 0) {
    return null;
  }
  const menu = /* @__PURE__ */ jsx4(
    "div",
    {
      className: "re-selection-menu",
      style: {
        top: `${Math.max(0, position.top)}px`,
        left: `${position.left}px`
      },
      role: "toolbar",
      "aria-label": labels.selectionMenu,
      children: visibleItems.map((item) => /* @__PURE__ */ jsx4(
        "button",
        {
          type: "button",
          className: cn(
            "re-selection-menu-btn",
            isItemActive(item, active) && "re-selection-menu-btn-active"
          ),
          "aria-label": itemLabel(item, labels),
          "aria-pressed": isItemActive(item, active),
          onMouseDown: (event) => {
            event.preventDefault();
            runItemAction(item, format);
          },
          children: /* @__PURE__ */ jsx4(MenuIcon, { item })
        },
        item
      ))
    }
  );
  return createPortal2(menu, containerRef.current ?? document.body);
}

// src/components/plugins/LineBreakPlugin.tsx
import { useEffect as useEffect9 } from "react";
import { useLexicalComposerContext as useLexicalComposerContext9 } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection as $getSelection7,
  $isRangeSelection as $isRangeSelection7,
  COMMAND_PRIORITY_HIGH as COMMAND_PRIORITY_HIGH3,
  INSERT_LINE_BREAK_COMMAND
} from "lexical";
function LineBreakPlugin() {
  const [editor] = useLexicalComposerContext9();
  useEffect9(() => {
    return editor.registerCommand(
      INSERT_LINE_BREAK_COMMAND,
      () => {
        const selection = $getSelection7();
        if (!$isRangeSelection7(selection)) return false;
        if ($getBlockCode(selection.anchor.getNode())) return false;
        selection.insertParagraph();
        return true;
      },
      COMMAND_PRIORITY_HIGH3
    );
  }, [editor]);
  return null;
}

// src/components/plugins/SpoilerPlugin.tsx
import { useEffect as useEffect10, useRef } from "react";
import { useLexicalComposerContext as useLexicalComposerContext10 } from "@lexical/react/LexicalComposerContext";
import { $findMatchingParent as $findMatchingParent4 } from "@lexical/utils";
import { $getSelection as $getSelection8, $isRangeSelection as $isRangeSelection8 } from "lexical";
function SpoilerPlugin() {
  const [editor] = useLexicalComposerContext10();
  const editingRef = useRef(null);
  useEffect10(() => {
    const root = editor.getRootElement();
    if (!root) return;
    const clearEditing = () => {
      if (editingRef.current) {
        editingRef.current.classList.remove("re-spoiler-editing");
        editingRef.current = null;
      }
    };
    const markEditing = (element) => {
      clearEditing();
      if (!element) return;
      element.classList.add("re-spoiler-editing");
      editingRef.current = element;
    };
    const onClick = (event) => {
      const target = event.target.closest(".re-spoiler");
      if (!target || !root.contains(target)) {
        clearEditing();
        return;
      }
      markEditing(target);
    };
    const removeUpdate = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection8();
        if (!$isRangeSelection8(selection)) return;
        const spoiler = $findMatchingParent4(
          selection.anchor.getNode(),
          $isSpoilerNode
        );
        if (!spoiler) return;
        markEditing(editor.getElementByKey(spoiler.getKey()));
      });
    });
    root.addEventListener("click", onClick);
    return () => {
      root.removeEventListener("click", onClick);
      removeUpdate();
      clearEditing();
    };
  }, [editor]);
  return null;
}

// src/components/plugins/index.tsx
function InitialHtmlPlugin({ html }) {
  const [editor] = useLexicalComposerContext11();
  const lastApplied = useRef2(void 0);
  useEffect11(() => {
    if (html === lastApplied.current) return;
    editor.update(() => {
      const root = $getRoot4();
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
  const [editor] = useLexicalComposerContext11();
  useEffect11(() => {
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
  const [editor] = useLexicalComposerContext11();
  useEffect11(() => {
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
  const [editor] = useLexicalComposerContext11();
  useEffect11(() => {
    setHtmlRef.current = (html) => {
      editor.update(() => {
        const root = $getRoot4();
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
  const [editor] = useLexicalComposerContext11();
  useEffect11(() => {
    clearRef.current = () => {
      editor.update(() => {
        $getRoot4().clear();
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
  const [editor] = useLexicalComposerContext11();
  useEffect11(() => {
    const update = () => {
      editor.getEditorState().read(() => {
        onEmptyChange($getRoot4().getTextContent().trim() === "");
      });
    };
    update();
    return editor.registerUpdateListener(() => update());
  }, [editor, onEmptyChange]);
  return null;
}

// src/components/toolbar/EditorToolbar.tsx
import { useState as useState4, useId as useId2, useEffect as useEffect12 } from "react";

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
  { pattern: "# Heading", action: "Heading (when enabled)" },
  { pattern: "||spoiler||", action: "Spoiler (when enabled)" }
];
var defaultEnterShortcuts = {
  enter: "New line",
  modEnter: "Submit"
};
var legacyEnterBehaviorShortcuts = {
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
  if (!behavior) {
    return {
      enter: defaultEnterShortcuts.enter,
      shiftEnter: defaultEnterShortcuts.enter,
      modEnter: defaultEnterShortcuts.modEnter
    };
  }
  return legacyEnterBehaviorShortcuts[behavior];
}
function shortcutById(id) {
  return [...formatKeyboardShortcuts, ...mentionKeyboardShortcuts].find(
    (item) => item.id === id
  );
}

// src/components/toolbar/EditorToolbar.tsx
import { Fragment, jsx as jsx5, jsxs as jsxs3 } from "react/jsx-runtime";
function ToolbarButton({
  label,
  active,
  onClick,
  shortcutId,
  children
}) {
  const shortcut = shortcutId ? shortcutById(shortcutId) : void 0;
  return /* @__PURE__ */ jsx5(
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
  editorInputId,
  showMentionButton
}) {
  const active = useFormatState();
  const format = useFormatActions();
  const [menuOpen, setMenuOpen] = useState4(false);
  const menuId = useId2();
  const hasMenu = !!slots.toolbarMenu;
  useEffect12(() => {
    if (!menuOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);
  return /* @__PURE__ */ jsxs3(
    "div",
    {
      className: "re-toolbar",
      role: "toolbar",
      "aria-label": labels.toolbar,
      "aria-controls": editorInputId,
      children: [
        /* @__PURE__ */ jsxs3("div", { className: "re-toolbar-group re-toolbar-group-main", children: [
          slots.toolbarStart,
          features.bold && /* @__PURE__ */ jsx5(
            ToolbarButton,
            {
              label: labels.bold,
              active: active.bold,
              onClick: format.bold,
              shortcutId: "format.bold",
              children: /* @__PURE__ */ jsx5(IconBold, {})
            }
          ),
          features.italic && /* @__PURE__ */ jsx5(
            ToolbarButton,
            {
              label: labels.italic,
              active: active.italic,
              onClick: format.italic,
              shortcutId: "format.italic",
              children: /* @__PURE__ */ jsx5(IconItalic, {})
            }
          ),
          features.strikethrough && /* @__PURE__ */ jsx5(
            ToolbarButton,
            {
              label: labels.strikethrough,
              active: active.strikethrough,
              onClick: format.strikethrough,
              shortcutId: "format.strikethrough",
              children: /* @__PURE__ */ jsx5(IconStrikethrough, {})
            }
          ),
          features.code && /* @__PURE__ */ jsx5(
            ToolbarButton,
            {
              label: labels.code,
              active: active.code,
              onClick: format.code,
              shortcutId: "format.code",
              children: /* @__PURE__ */ jsx5(IconCode, {})
            }
          ),
          features.spoiler && /* @__PURE__ */ jsx5(
            ToolbarButton,
            {
              label: labels.spoiler,
              active: active.spoiler,
              onClick: format.spoiler,
              children: /* @__PURE__ */ jsx5(IconSpoiler, {})
            }
          ),
          features.quote && /* @__PURE__ */ jsx5(
            ToolbarButton,
            {
              label: labels.quote,
              active: active.quote,
              onClick: format.quote,
              children: /* @__PURE__ */ jsx5(IconQuote, {})
            }
          ),
          features.codeBlock && /* @__PURE__ */ jsx5(
            ToolbarButton,
            {
              label: labels.codeBlock,
              active: active.codeBlock,
              onClick: format.codeBlock,
              children: /* @__PURE__ */ jsx5(IconCodeBlock, {})
            }
          ),
          features.lists && /* @__PURE__ */ jsxs3(Fragment, { children: [
            /* @__PURE__ */ jsx5(
              ToolbarButton,
              {
                label: labels.bulletList,
                active: active.bulletList,
                onClick: format.bulletList,
                children: /* @__PURE__ */ jsx5(IconBulletList, {})
              }
            ),
            /* @__PURE__ */ jsx5(
              ToolbarButton,
              {
                label: labels.numberedList,
                active: active.numberedList,
                onClick: format.numberedList,
                children: /* @__PURE__ */ jsx5(IconNumberedList, {})
              }
            )
          ] }),
          features.links && /* @__PURE__ */ jsx5(
            ToolbarButton,
            {
              label: labels.link,
              active: active.link,
              onClick: format.link,
              children: /* @__PURE__ */ jsx5(IconLink, {})
            }
          ),
          features.headings && /* @__PURE__ */ jsx5(
            ToolbarButton,
            {
              label: labels.heading,
              active: active.heading,
              onClick: format.heading,
              children: /* @__PURE__ */ jsx5(IconHeading, {})
            }
          ),
          showMentionButton && /* @__PURE__ */ jsx5(ToolbarButton, { label: labels.mention, onClick: format.mentionTrigger, children: /* @__PURE__ */ jsx5(IconMention, {}) })
        ] }),
        (slots.toolbarEnd || hasMenu) && /* @__PURE__ */ jsxs3("div", { className: "re-toolbar-group", style: { position: "relative" }, children: [
          slots.toolbarEnd,
          hasMenu && /* @__PURE__ */ jsxs3(Fragment, { children: [
            /* @__PURE__ */ jsx5(
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
            menuOpen && /* @__PURE__ */ jsxs3(Fragment, { children: [
              /* @__PURE__ */ jsx5(
                "div",
                {
                  className: "re-toolbar-menu-backdrop",
                  onClick: () => setMenuOpen(false),
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ jsx5(
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
  return features.bold || features.italic || features.strikethrough || features.code || features.quote || features.codeBlock || features.lists || features.links || features.headings || features.spoiler || features.mentions || !!slots.toolbarStart || !!slots.toolbarEnd || !!slots.toolbarMenu;
}

// src/components/RichTextEditor.tsx
import { Fragment as Fragment2, jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
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
  const [editor] = useLexicalComposerContext12();
  useEffect13(() => {
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
  return /* @__PURE__ */ jsx6(
    "button",
    {
      type: "button",
      onClick: onSubmit,
      disabled,
      className: "re-submit-btn",
      "aria-label": label,
      title: label,
      children: /* @__PURE__ */ jsx6("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx6("path", { d: "M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" }) })
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
    return /* @__PURE__ */ jsx6(Fragment2, { children: slots.submitButton });
  }
  if (!showDefault) return null;
  return /* @__PURE__ */ jsx6(
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
  return /* @__PURE__ */ jsx6(RichTextEditorProvider, { value: ctx, children });
}
function RichTextEditorInner({
  value,
  onSubmit,
  onBlur,
  placeholder = "",
  disabled = false,
  features: featuresProp,
  labels: labelsProp,
  enterBehavior,
  enterKeyBindings,
  selectionMenuItems = defaultSelectionMenuItems,
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
  const rootRef = useRef3(null);
  const bodyRef = useRef3(null);
  const getHtmlRef = useRef3(null);
  const setHtmlRef = useRef3(null);
  const clearRef = useRef3(null);
  const focusRef = useRef3(null);
  const [isEmpty, setIsEmpty] = useState5(true);
  const [sending, setSending] = useState5(false);
  const inputStyle = useMemo2(
    () => ({
      minHeight: `${minRows * EDITOR_LINE_HEIGHT_PX}px`,
      maxHeight: `${maxRows * EDITOR_LINE_HEIGHT_PX}px`
    }),
    [minRows, maxRows]
  );
  const enterBindings = useMemo2(
    () => resolveEnterKeyBindings({ enterBehavior, enterKeyBindings }),
    [enterBehavior, enterKeyBindings]
  );
  const initialConfig = useMemo2(
    () => ({
      namespace: "RichTextEditor",
      theme: editorTheme,
      editable: !disabled,
      onError,
      nodes: [
        HeadingNode,
        ...features.quote ? [QuoteNode3] : [],
        ListNode,
        ListItemNode,
        CodeNode,
        CodeHighlightNode,
        LinkNode,
        AutoLinkNode,
        ...features.mentions ? [MentionNode] : [],
        ...features.spoiler ? [SpoilerNode] : []
      ]
    }),
    [disabled, features.mentions, features.quote, features.spoiler]
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
  return /* @__PURE__ */ jsxs4(LexicalComposer, { initialConfig, children: [
    /* @__PURE__ */ jsx6(EditorRefPlugin, { getHtmlRef }),
    /* @__PURE__ */ jsx6(SetHtmlPlugin, { setHtmlRef }),
    /* @__PURE__ */ jsx6(ClearPlugin, { clearRef }),
    /* @__PURE__ */ jsx6(FocusPlugin, { focusRef }),
    /* @__PURE__ */ jsx6(EmptyStatePlugin, { onEmptyChange: setIsEmpty }),
    /* @__PURE__ */ jsx6(
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
        children: /* @__PURE__ */ jsxs4(
          "div",
          {
            ref: rootRef,
            id: rootId,
            ...themeDataAttribute(theme),
            className: cn("re-editor-root", className),
            children: [
              showToolbar && /* @__PURE__ */ jsx6(
                EditorToolbar,
                {
                  features,
                  labels,
                  slots,
                  editorInputId,
                  showMentionButton: features.mentions && !!mentionSearch
                }
              ),
              /* @__PURE__ */ jsx6(
                BlurCapturePlugin,
                {
                  rootRef,
                  onBlur,
                  getHtml
                }
              ),
              /* @__PURE__ */ jsxs4("div", { ref: bodyRef, className: "re-editor-body", children: [
                /* @__PURE__ */ jsx6(BlockBehaviorPlugin, {}),
                /* @__PURE__ */ jsx6(LineBreakPlugin, {}),
                features.spoiler && /* @__PURE__ */ jsx6(SpoilerPlugin, {}),
                /* @__PURE__ */ jsx6(InitialHtmlPlugin, { html: value }),
                /* @__PURE__ */ jsx6(
                  RichTextPlugin,
                  {
                    contentEditable: /* @__PURE__ */ jsx6(
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
                    placeholder: placeholder ? /* @__PURE__ */ jsx6("div", { id: placeholderId, className: "re-editor-placeholder", "aria-hidden": "true", children: placeholder }) : null,
                    ErrorBoundary: LexicalErrorBoundary
                  }
                ),
                /* @__PURE__ */ jsx6(HistoryPlugin, {}),
                features.lists && /* @__PURE__ */ jsx6(ListPlugin, {}),
                features.links && /* @__PURE__ */ jsx6(LinkPlugin, {}),
                features.codeBlock && /* @__PURE__ */ jsx6(CodeHighlightPlugin, { enabled: !disabled }),
                transformers.length > 0 && /* @__PURE__ */ jsx6(MarkdownShortcutPlugin, { transformers }),
                /* @__PURE__ */ jsx6(MarkdownPastePlugin, { features }),
                /* @__PURE__ */ jsx6(KeyboardShortcutsPlugin, { features, disabled }),
                features.mentions && mentionSearch && /* @__PURE__ */ jsx6(MentionsPlugin, { searchMentions: mentionSearch }),
                /* @__PURE__ */ jsx6(
                  EnterPlugin,
                  {
                    bindings: enterBindings,
                    onSubmit: onSubmit ? () => void submit() : void 0
                  }
                ),
                features.selectionMenu && /* @__PURE__ */ jsx6(
                  SelectionMenuPlugin,
                  {
                    features,
                    labels,
                    items: selectionMenuItems,
                    containerRef: bodyRef
                  }
                ),
                /* @__PURE__ */ jsx6(
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
              slots.footer && /* @__PURE__ */ jsx6("div", { className: "re-footer", children: slots.footer })
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
import { useEffect as useEffect14, useLayoutEffect, useMemo as useMemo3, useRef as useRef4 } from "react";

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
  const blocks = root.querySelectorAll(
    "pre code, code.re-block-code, .re-block-code"
  );
  const needsHighlight = [...blocks].filter(
    (el) => el.querySelector(".token, .hljs") === null
  );
  if (needsHighlight.length === 0) return;
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
  for (const el of needsHighlight) {
    const text = el.textContent ?? "";
    if (!text.trim()) continue;
    const languageClass = [...el.classList].find(
      (name) => name.startsWith("language-")
    );
    const language = languageClass?.slice("language-".length) ?? "plaintext";
    const result = hljs.highlight(text, {
      language: hljs.getLanguage(language) ? language : "plaintext"
    });
    el.innerHTML = result.value;
    el.classList.add("hljs");
  }
}

// src/components/RichTextViewer.tsx
import { jsx as jsx7 } from "react/jsx-runtime";
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
  const ref = useRef4(null);
  const prepared = useMemo3(
    () => prepareViewerContent(content, features),
    [content, features]
  );
  useLayoutEffect(() => {
    if (prepared.kind !== "html" || !features.codeHighlight) return;
    void highlightViewerCodeBlocks(ref.current);
  }, [prepared, features.codeHighlight]);
  useEffect14(() => {
    if (prepared.kind !== "html") return;
    const root = ref.current;
    if (!root) return;
    const onSpoilerClick = (event) => {
      const target = event.target.closest(".re-spoiler");
      if (!target || !root.contains(target)) return;
      target.classList.add("re-spoiler-revealed");
    };
    root.addEventListener("click", onSpoilerClick);
    return () => root.removeEventListener("click", onSpoilerClick);
  }, [prepared]);
  useEffect14(() => {
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
    return /* @__PURE__ */ jsx7(
      "p",
      {
        ...themeDataAttribute(theme),
        className: cn("re-viewer re-viewer-plain", className),
        "aria-label": labels.content,
        children: prepared.text
      }
    );
  }
  return /* @__PURE__ */ jsx7(
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
  allSelectionMenuItems,
  applyLinkTargetToHtml,
  buildMarkdownTransformers,
  defaultEditorTheme,
  defaultEnterKeyBindings,
  defaultFeatures,
  defaultLabels,
  defaultSelectionMenuItems,
  defaultViewerFeatures,
  defaultViewerLabels,
  describeEnterKeyBindings,
  editorCssVariables,
  editorThemePresets,
  enterBehaviorToBindings,
  exportEditorHtml,
  formatEnterKeyBinding,
  formatKeyboardShortcuts,
  getActiveFormatShortcuts,
  getEnterBehaviorDescription,
  isEditorThemePreset,
  isHtmlContent,
  looksLikeMarkdown,
  markdownShortcuts,
  markdownToHtml,
  matchEnterKeyAction,
  mentionKeyboardShortcuts,
  normalizeHtml,
  plainTextFromHtml,
  prepareViewerContent,
  resolveEnterKeyBindings,
  sanitizeHtml,
  shortcutById,
  shouldPluginHandleEnterAction,
  useRichTextEditor
};
//# sourceMappingURL=index.js.map