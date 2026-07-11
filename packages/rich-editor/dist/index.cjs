"use client";
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  RichTextEditor: () => RichTextEditor,
  RichTextViewer: () => RichTextViewer,
  allSelectionMenuItems: () => allSelectionMenuItems,
  applyLinkTargetToHtml: () => applyLinkTargetToHtml,
  buildMarkdownTransformers: () => buildMarkdownTransformers,
  defaultEditorTheme: () => defaultEditorTheme,
  defaultEnterKeyBindings: () => defaultEnterKeyBindings,
  defaultFeatures: () => defaultFeatures,
  defaultLabels: () => defaultLabels,
  defaultSelectionMenuItems: () => defaultSelectionMenuItems,
  defaultViewerFeatures: () => defaultViewerFeatures,
  defaultViewerLabels: () => defaultViewerLabels,
  describeEnterKeyBindings: () => describeEnterKeyBindings,
  editorCssVariables: () => editorCssVariables,
  editorThemePresets: () => editorThemePresets,
  enterBehaviorToBindings: () => enterBehaviorToBindings,
  exportEditorHtml: () => exportEditorHtml,
  formatEnterKeyBinding: () => formatEnterKeyBinding,
  formatKeyboardShortcuts: () => formatKeyboardShortcuts,
  getActiveFormatShortcuts: () => getActiveFormatShortcuts,
  getEnterBehaviorDescription: () => getEnterBehaviorDescription,
  isEditorThemePreset: () => isEditorThemePreset,
  isHtmlContent: () => isHtmlContent,
  looksLikeMarkdown: () => looksLikeMarkdown,
  markdownShortcuts: () => markdownShortcuts,
  markdownToHtml: () => markdownToHtml,
  matchEnterKeyAction: () => matchEnterKeyAction,
  mentionKeyboardShortcuts: () => mentionKeyboardShortcuts,
  normalizeHtml: () => normalizeHtml,
  plainTextFromHtml: () => plainTextFromHtml,
  prepareViewerContent: () => prepareViewerContent,
  resolveEnterKeyBindings: () => resolveEnterKeyBindings,
  sanitizeHtml: () => sanitizeHtml,
  shortcutById: () => shortcutById,
  shouldPluginHandleEnterAction: () => shouldPluginHandleEnterAction,
  useRichTextEditor: () => useRichTextEditor
});
module.exports = __toCommonJS(index_exports);

// src/components/RichTextEditor.tsx
var import_html5 = require("@lexical/html");
var import_code5 = require("@lexical/code");
var import_link2 = require("@lexical/link");
var import_list3 = require("@lexical/list");
var import_LexicalComposer = require("@lexical/react/LexicalComposer");
var import_LexicalComposerContext12 = require("@lexical/react/LexicalComposerContext");
var import_LexicalContentEditable = require("@lexical/react/LexicalContentEditable");
var import_LexicalErrorBoundary = require("@lexical/react/LexicalErrorBoundary");
var import_LexicalHistoryPlugin = require("@lexical/react/LexicalHistoryPlugin");
var import_LexicalLinkPlugin = require("@lexical/react/LexicalLinkPlugin");
var import_LexicalListPlugin = require("@lexical/react/LexicalListPlugin");
var import_LexicalMarkdownShortcutPlugin = require("@lexical/react/LexicalMarkdownShortcutPlugin");
var import_LexicalRichTextPlugin = require("@lexical/react/LexicalRichTextPlugin");
var import_rich_text6 = require("@lexical/rich-text");
var import_react15 = require("react");

// src/context/EditorContext.tsx
var import_react = require("react");
var import_jsx_runtime = require("react/jsx-runtime");
var RichTextEditorContext = (0, import_react.createContext)(
  null
);
function RichTextEditorProvider({
  value,
  children
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RichTextEditorContext.Provider, { value, children });
}
function useRichTextEditor() {
  const ctx = (0, import_react.useContext)(RichTextEditorContext);
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
var import_lexical = require("lexical");

// src/core/mentions.ts
var MENTION_ID_ATTR = "data-mention-id";
var MENTION_LABEL_ATTR = "data-mention-label";
function mentionDisplayText(label) {
  return `@${label}`;
}

// src/nodes/MentionNode.ts
var MentionNode = class _MentionNode extends import_lexical.TextNode {
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
  return (0, import_lexical.$applyNodeReplacement)(mentionNode);
}

// src/nodes/SpoilerNode.ts
var import_lexical2 = require("lexical");
var SpoilerNode = class _SpoilerNode extends import_lexical2.ElementNode {
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
  return (0, import_lexical2.$applyNodeReplacement)(new SpoilerNode());
}
function $isSpoilerNode(node) {
  return node instanceof SpoilerNode;
}

// src/core/html.ts
var import_isomorphic_dompurify = __toESM(require("isomorphic-dompurify"), 1);
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
  return import_isomorphic_dompurify.default.sanitize(html, {
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
var import_markdown = require("@lexical/markdown");
var import_rich_text = require("@lexical/rich-text");
var import_lexical3 = require("lexical");
var import_marked = require("marked");
import_marked.marked.setOptions({ gfm: true, breaks: true });
import_marked.marked.use({
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
    spoiler.append((0, import_lexical3.$createTextNode)(match[1]));
    textNode.replace(spoiler);
  },
  trigger: "|",
  type: "text-match"
};
var QUOTE_REGEX = /^>\s/;
var QUOTE = {
  dependencies: [import_rich_text.QuoteNode],
  export: (node, exportChildren) => {
    if (!(0, import_rich_text.$isQuoteNode)(node)) return null;
    const lines = exportChildren(node).split("\n");
    return lines.map((line) => `> ${line}`).join("\n");
  },
  regExp: QUOTE_REGEX,
  replace: (parentNode, children, _match, isImport) => {
    if (isImport) {
      const previousNode = parentNode.getPreviousSibling();
      if ((0, import_rich_text.$isQuoteNode)(previousNode)) {
        const paragraph2 = (0, import_lexical3.$createParagraphNode)();
        paragraph2.append(...children);
        previousNode.append(paragraph2);
        parentNode.remove();
        return;
      }
    }
    const quote = (0, import_rich_text.$createQuoteNode)();
    const paragraph = (0, import_lexical3.$createParagraphNode)();
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
  if (features.headings) transformers.push(import_markdown.HEADING);
  if (features.quote) transformers.push(QUOTE);
  if (features.lists) {
    transformers.push(import_markdown.UNORDERED_LIST, import_markdown.ORDERED_LIST);
  }
  if (features.codeBlock) transformers.push(import_markdown.CODE);
  if (features.code) transformers.push(import_markdown.INLINE_CODE);
  if (features.bold) {
    transformers.push(import_markdown.BOLD_STAR, import_markdown.BOLD_UNDERSCORE);
  }
  if (features.italic) {
    transformers.push(import_markdown.ITALIC_STAR, import_markdown.ITALIC_UNDERSCORE);
  }
  if (features.strikethrough) transformers.push(import_markdown.STRIKETHROUGH);
  if (features.links) transformers.push(import_markdown.LINK);
  if (features.spoiler) transformers.push(SPOILER);
  return transformers;
}
function looksLikeMarkdown(text) {
  const t = text.trim();
  if (t.length < 2) return false;
  return /^#{1,6}\s/m.test(t) || /^>\s/m.test(t) || /^[-*+]\s/m.test(t) || /^\d+\.\s/m.test(t) || /```[\s\S]*?```/.test(t) || /\*\*[^*\n]+\*\*/.test(t) || /(?:^|[^*])\*[^*\s][^*\n]*\*(?:[^*]|$)/.test(t) || /`[^`\n]+`/.test(t) || /~~[^~\n]+~~/.test(t) || /\|\|[^|\n]+\|\|/.test(t) || /\[[^\]]+\]\([^)]+\)/.test(t);
}
function markdownToHtml(markdown) {
  const raw = import_marked.marked.parse(markdown, { async: false });
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
var import_react12 = require("react");
var import_html4 = require("@lexical/html");
var import_LexicalComposerContext11 = require("@lexical/react/LexicalComposerContext");
var import_lexical15 = require("lexical");

// src/components/plugins/EnterPlugin.tsx
var import_react2 = require("react");
var import_LexicalComposerContext = require("@lexical/react/LexicalComposerContext");
var import_lexical4 = require("lexical");
function EnterPlugin({
  bindings,
  onSubmit
}) {
  const [editor] = (0, import_LexicalComposerContext.useLexicalComposerContext)();
  (0, import_react2.useEffect)(() => {
    if (!bindings.length) return;
    return editor.registerCommand(
      import_lexical4.KEY_ENTER_COMMAND,
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
            const selection = (0, import_lexical4.$getSelection)();
            if ((0, import_lexical4.$isRangeSelection)(selection)) {
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
      import_lexical4.COMMAND_PRIORITY_LOW
    );
  }, [bindings, editor, onSubmit]);
  return null;
}

// src/components/plugins/MarkdownPastePlugin.tsx
var import_html2 = require("@lexical/html");
var import_LexicalComposerContext2 = require("@lexical/react/LexicalComposerContext");
var import_lexical5 = require("lexical");
var import_react3 = require("react");
function htmlToNodes(editor, html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (0, import_html2.$generateNodesFromDOM)(editor, doc.body);
}
function MarkdownPastePlugin({
  features
}) {
  const [editor] = (0, import_LexicalComposerContext2.useLexicalComposerContext)();
  (0, import_react3.useEffect)(() => {
    if (!features.markdownPaste) return;
    return editor.registerCommand(
      import_lexical5.PASTE_COMMAND,
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
            const selection = (0, import_lexical5.$getSelection)();
            if (!(0, import_lexical5.$isRangeSelection)(selection)) return;
            if (!selection.isCollapsed()) {
              selection.removeText();
            }
            const nodes = htmlToNodes(editor, html);
            if (nodes.length > 0) {
              (0, import_lexical5.$insertNodes)(nodes);
            }
          });
          return true;
        }
        if (htmlRaw && htmlRaw.trim() && !looksLikeMarkdown(text)) {
          event.preventDefault();
          const html = sanitizeHtml(htmlRaw);
          editor.update(() => {
            const selection = (0, import_lexical5.$getSelection)();
            if (!(0, import_lexical5.$isRangeSelection)(selection)) return;
            if (!selection.isCollapsed()) {
              selection.removeText();
            }
            const nodes = htmlToNodes(editor, html);
            if (nodes.length > 0) {
              (0, import_lexical5.$insertNodes)(nodes);
            }
          });
          return true;
        }
        return false;
      },
      import_lexical5.COMMAND_PRIORITY_HIGH
    );
  }, [editor, features.markdownPaste]);
  return null;
}

// src/components/plugins/KeyboardShortcutsPlugin.tsx
var import_react4 = require("react");
var import_LexicalComposerContext3 = require("@lexical/react/LexicalComposerContext");
var import_lexical6 = require("lexical");
function isModKey(event) {
  return event.metaKey || event.ctrlKey;
}
function KeyboardShortcutsPlugin({
  features,
  disabled
}) {
  const [editor] = (0, import_LexicalComposerContext3.useLexicalComposerContext)();
  (0, import_react4.useEffect)(() => {
    if (!features.keyboardShortcuts || disabled) return;
    return editor.registerCommand(
      import_lexical6.KEY_DOWN_COMMAND,
      (event) => {
        if (!(event instanceof KeyboardEvent) || !isModKey(event)) {
          return false;
        }
        const key = event.key.toLowerCase();
        if (key === "b" && features.bold) {
          event.preventDefault();
          editor.dispatchCommand(import_lexical6.FORMAT_TEXT_COMMAND, "bold");
          return true;
        }
        if (key === "i" && features.italic) {
          event.preventDefault();
          editor.dispatchCommand(import_lexical6.FORMAT_TEXT_COMMAND, "italic");
          return true;
        }
        if (key === "e" && features.code && !event.shiftKey) {
          event.preventDefault();
          editor.dispatchCommand(import_lexical6.FORMAT_TEXT_COMMAND, "code");
          return true;
        }
        if (event.shiftKey && key === "x" && features.strikethrough) {
          event.preventDefault();
          editor.dispatchCommand(import_lexical6.FORMAT_TEXT_COMMAND, "strikethrough");
          return true;
        }
        return false;
      },
      import_lexical6.COMMAND_PRIORITY_LOW
    );
  }, [disabled, editor, features]);
  return null;
}

// src/components/plugins/MentionsPlugin.tsx
var import_LexicalTypeaheadMenuPlugin = require("@lexical/react/LexicalTypeaheadMenuPlugin");
var import_LexicalComposerContext4 = require("@lexical/react/LexicalComposerContext");
var import_react5 = require("react");
var import_react_dom = require("react-dom");
var import_lexical7 = require("lexical");
var import_jsx_runtime2 = require("react/jsx-runtime");
var MentionMenuOption = class extends import_LexicalTypeaheadMenuPlugin.MenuOption {
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
  return (0, import_react_dom.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "div",
      {
        id: menuId,
        className: "re-mention-menu",
        role: "listbox",
        "aria-label": menuLabel,
        "aria-activedescendant": activeDescendantId,
        children: options.map((option, index) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
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
  const [editor] = (0, import_LexicalComposerContext4.useLexicalComposerContext)();
  const { labels } = useRichTextEditor();
  const menuId = (0, import_react5.useId)();
  const [query, setQuery] = (0, import_react5.useState)(null);
  const [results, setResults] = (0, import_react5.useState)([]);
  const triggerFn = (0, import_LexicalTypeaheadMenuPlugin.useBasicTypeaheadTriggerMatch)("@", {
    minLength: 0,
    maxLength: 40
  });
  (0, import_react5.useEffect)(() => {
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
  const options = (0, import_react5.useMemo)(
    () => results.map((item) => new MentionMenuOption(item)),
    [results]
  );
  const onSelectOption = (0, import_react5.useCallback)(
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
  const menuRenderFn = (0, import_react5.useCallback)(
    (anchorElementRef, {
      selectedIndex,
      selectOptionAndCleanUp,
      setHighlightedIndex,
      options: menuOptions
    }) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_LexicalTypeaheadMenuPlugin.LexicalTypeaheadMenuPlugin,
    {
      onQueryChange: setQuery,
      onSelectOption,
      triggerFn,
      options,
      menuRenderFn,
      commandPriority: import_lexical7.COMMAND_PRIORITY_HIGH
    }
  );
}

// src/components/plugins/BlockBehaviorPlugin.tsx
var import_react6 = require("react");
var import_LexicalComposerContext5 = require("@lexical/react/LexicalComposerContext");
var import_code2 = require("@lexical/code");
var import_rich_text4 = require("@lexical/rich-text");
var import_lexical10 = require("lexical");

// src/core/blockBehavior.ts
var import_code = require("@lexical/code");
var import_list = require("@lexical/list");
var import_rich_text3 = require("@lexical/rich-text");
var import_utils2 = require("@lexical/utils");
var import_lexical9 = require("lexical");

// src/core/quoteBlocks.ts
var import_rich_text2 = require("@lexical/rich-text");
var import_utils = require("@lexical/utils");
var import_lexical8 = require("lexical");
function $getTopLevelBlock(node) {
  let current = node;
  while (current !== null && !(0, import_lexical8.$isRootOrShadowRoot)(current.getParent())) {
    current = current.getParent();
  }
  return (0, import_lexical8.$isElementNode)(current) ? current : null;
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
  if (children.length > 0 && children.every(import_lexical8.$isParagraphNode)) return;
  const normalized = [];
  let pending = null;
  for (const child of children) {
    if ((0, import_lexical8.$isParagraphNode)(child)) {
      normalized.push(child);
      pending = null;
      continue;
    }
    if (!pending) {
      pending = (0, import_lexical8.$createParagraphNode)();
      normalized.push(pending);
    }
    pending.append(child);
  }
  if (normalized.length === 0) {
    normalized.push((0, import_lexical8.$createParagraphNode)());
  }
  quote.clear();
  quote.append(...normalized);
}
function $getQuoteParagraph(node) {
  const quote = (0, import_utils.$findMatchingParent)(node, import_rich_text2.$isQuoteNode);
  if (!quote) return null;
  let current = node;
  while (current !== null && current !== quote) {
    if ((0, import_lexical8.$isParagraphNode)(current) && current.getParent() === quote) {
      return current;
    }
    current = current.getParent();
  }
  $ensureQuoteParagraphStructure(quote);
  current = node;
  while (current !== null && current !== quote) {
    if ((0, import_lexical8.$isParagraphNode)(current) && current.getParent() === quote) {
      return current;
    }
    current = current.getParent();
  }
  const first = quote.getFirstChild();
  return (0, import_lexical8.$isParagraphNode)(first) ? first : null;
}
function $unwrapQuote(quote) {
  $ensureQuoteParagraphStructure(quote);
  const paragraphs = quote.getChildren().filter(import_lexical8.$isParagraphNode);
  if (paragraphs.length === 0) {
    quote.replace((0, import_lexical8.$createParagraphNode)());
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
  const quote = (0, import_rich_text2.$createQuoteNode)();
  const inner = (0, import_lexical8.$createParagraphNode)();
  inner.append(...paragraph.getChildren());
  quote.append(inner);
  paragraph.replace(quote);
  return quote;
}
function $applyQuoteToSelection(selection) {
  const inQuote = (0, import_utils.$findMatchingParent)(selection.anchor.getNode(), import_rich_text2.$isQuoteNode);
  if (inQuote) {
    $unwrapQuote(inQuote);
    return;
  }
  const blocks = $getSelectedTopLevelBlocks(selection);
  const paragraphs = blocks.filter(import_lexical8.$isParagraphNode);
  if (paragraphs.length === 0) return;
  if (paragraphs.length === 1) {
    $wrapParagraphInQuote(paragraphs[0]);
    return;
  }
  const quote = (0, import_rich_text2.$createQuoteNode)();
  for (const block of paragraphs) {
    const inner = (0, import_lexical8.$createParagraphNode)();
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
  for (const child of (0, import_lexical8.$getRoot)().getChildren()) {
    if ((0, import_rich_text2.$isQuoteNode)(child)) {
      if (child.getTextContent().trim() === "") {
        child.remove();
        continue;
      }
      $ensureQuoteParagraphStructure(child);
    }
  }
}

// src/core/blockBehavior.ts
function $getBlockQuote(node) {
  return (0, import_utils2.$findMatchingParent)(node, import_rich_text3.$isQuoteNode);
}
function $getBlockCode(node) {
  return (0, import_utils2.$findMatchingParent)(node, import_code.$isCodeNode);
}
function $isParagraphEmpty(node) {
  return (0, import_lexical9.$isParagraphNode)(node) && node.getTextContent().trim() === "";
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
  const paragraph = (0, import_utils2.$findMatchingParent)(node, import_lexical9.$isParagraphNode);
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
  if ((0, import_lexical9.$isParagraphNode)(node)) return true;
  if ((0, import_lexical9.$isTextNode)(node)) {
    const parent = node.getParent();
    if ((0, import_lexical9.$isElementNode)(parent)) {
      return parent.getFirstChild() === node;
    }
  }
  return false;
}
function $isAtEndOfBlock(selection) {
  const focus = selection.focus;
  const node = focus.getNode();
  if ((0, import_lexical9.$isTextNode)(node)) {
    return focus.offset === node.getTextContentSize();
  }
  if ((0, import_lexical9.$isParagraphNode)(node)) {
    const lastDescendant = node.getLastDescendant();
    if (!lastDescendant) return true;
    if ((0, import_lexical9.$isTextNode)(lastDescendant)) {
      return focus.offset === lastDescendant.getTextContentSize();
    }
  }
  return false;
}
function $unwrapParagraphFromQuote(paragraph) {
  const quote = paragraph.getParent();
  if (!(0, import_rich_text3.$isQuoteNode)(quote)) return;
  const paragraphs = quote.getChildren().filter(import_lexical9.$isParagraphNode);
  const index = paragraphs.findIndex((p) => p.getKey() === paragraph.getKey());
  if (index === -1) return;
  const total = paragraphs.length;
  const newParagraph = (0, import_lexical9.$createParagraphNode)();
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
  const afterQuote = (0, import_rich_text3.$createQuoteNode)();
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
  for (const child of [...(0, import_lexical9.$getRoot)().getChildren()]) {
    if (!(0, import_rich_text3.$isQuoteNode)(child)) continue;
    if (child.getTextContent().trim() === "") {
      child.remove();
    }
  }
}
function $insertParagraphBeforeBlock(block) {
  const paragraph = (0, import_lexical9.$createParagraphNode)();
  block.insertBefore(paragraph);
  paragraph.selectEnd();
}
function $exitQuoteWithEmptyLines(quote) {
  while (quote.getLastChild() && $isParagraphEmpty(quote.getLastChild())) {
    quote.getLastChild().remove();
  }
  const exitParagraph = (0, import_lexical9.$createParagraphNode)();
  quote.insertAfter(exitParagraph);
  exitParagraph.selectStart();
  if (quote.getChildrenSize() === 0) {
    quote.remove();
  }
}
function $handleQuoteEnter(quote, paragraph, selection) {
  $ensureQuoteParagraphStructure(quote);
  if (!(0, import_lexical9.$isParagraphNode)(paragraph) || paragraph.getParent() !== quote) {
    const resolved = quote.getChildren().find(import_lexical9.$isParagraphNode);
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
  const liveQuote = (0, import_lexical9.$getNodeByKey)(quote.getKey());
  if (!liveQuote || !(0, import_rich_text3.$isQuoteNode)(liveQuote)) return;
  quote = liveQuote;
  const liveParagraph = $getQuoteParagraph(selection.anchor.getNode());
  if (!liveParagraph || liveParagraph.getParent() !== quote) return;
  paragraph = liveParagraph;
  if (!(0, import_lexical9.$isParagraphNode)(paragraph) || paragraph.getParent() !== quote) return;
  if (!$isAtStartOfBlock(selection)) return;
  if ($isParagraphEmpty(paragraph)) {
    if (quote.getChildrenSize() <= 1) {
      const replacement = (0, import_lexical9.$createParagraphNode)();
      quote.replace(replacement);
      replacement.selectStart();
      return;
    }
    const prev = paragraph.getPreviousSibling();
    paragraph.remove();
    if (prev && (0, import_lexical9.$isParagraphNode)(prev)) {
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
  const root = (0, import_lexical9.$getRoot)();
  const children = [...root.getChildren()];
  for (let i = 0; i < children.length - 1; i++) {
    const current = children[i];
    const next = children[i + 1];
    if ((0, import_rich_text3.$isQuoteNode)(current) && (0, import_rich_text3.$isQuoteNode)(next)) {
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
  const root = (0, import_lexical9.$getRoot)();
  const children = [...root.getChildren()];
  for (let i = 0; i < children.length - 1; i++) {
    const current = children[i];
    const next = children[i + 1];
    if ((0, import_code.$isCodeNode)(current) && (0, import_code.$isCodeNode)(next)) {
      const merged = current.getTextContent();
      const nextText = next.getTextContent();
      const join = merged.endsWith("\n") || nextText.startsWith("\n") ? "" : "\n";
      current.clear();
      current.append((0, import_lexical9.$createTextNode)(merged + join + nextText));
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
    codeNode.append((0, import_lexical9.$createTextNode)(text));
  }
  const exitParagraph = (0, import_lexical9.$createParagraphNode)();
  codeNode.insertAfter(exitParagraph);
  exitParagraph.selectStart();
}
function $shouldSkipBlockBehavior() {
  const selection = (0, import_lexical9.$getSelection)();
  if (!(0, import_lexical9.$isRangeSelection)(selection)) return true;
  const node = selection.anchor.getNode();
  if ((0, import_utils2.$findMatchingParent)(node, import_list.$isListItemNode)) return true;
  return false;
}

// src/components/plugins/BlockBehaviorPlugin.tsx
function $needsQuoteNormalization() {
  for (const child of (0, import_lexical10.$getRoot)().getChildren()) {
    if (!(0, import_rich_text4.$isQuoteNode)(child)) continue;
    if (child.getTextContent().trim() === "") return true;
    const children = child.getChildren();
    if (children.length === 0 || children.some((node) => !(0, import_lexical10.$isParagraphNode)(node))) {
      return true;
    }
  }
  return false;
}
function $needsBlockMerge() {
  const children = (0, import_lexical10.$getRoot)().getChildren();
  for (let i = 0; i < children.length - 1; i++) {
    const current = children[i];
    const next = children[i + 1];
    if ((0, import_rich_text4.$isQuoteNode)(current) && (0, import_rich_text4.$isQuoteNode)(next)) return true;
    if ((0, import_code2.$isCodeNode)(current) && (0, import_code2.$isCodeNode)(next)) return true;
  }
  return false;
}
function BlockBehaviorPlugin() {
  const [editor] = (0, import_LexicalComposerContext5.useLexicalComposerContext)();
  (0, import_react6.useEffect)(() => {
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
          $pruneEmptyQuotes();
        },
        { discrete: true }
      );
    });
    const removeEnter = editor.registerCommand(
      import_lexical10.KEY_ENTER_COMMAND,
      (event) => {
        if ($shouldSkipBlockBehavior()) return false;
        const quoteContext = editor.getEditorState().read(() => {
          const selection = (0, import_lexical10.$getSelection)();
          if (!(0, import_lexical10.$isRangeSelection)(selection)) return null;
          const quote = $getBlockQuote(selection.anchor.getNode());
          if (!quote || !(0, import_rich_text4.$isQuoteNode)(quote)) return null;
          const paragraph = $getQuoteParagraph(selection.anchor.getNode());
          if (!paragraph || paragraph.getParent() !== quote) return null;
          return { quote, paragraph };
        });
        if (quoteContext) {
          event?.preventDefault();
          editor.update(() => {
            const selection = (0, import_lexical10.$getSelection)();
            if (!(0, import_lexical10.$isRangeSelection)(selection)) return;
            $handleQuoteEnter(
              quoteContext.quote,
              quoteContext.paragraph,
              selection
            );
          });
          return true;
        }
        const shouldExitCode = editor.getEditorState().read(() => {
          const selection = (0, import_lexical10.$getSelection)();
          if (!(0, import_lexical10.$isRangeSelection)(selection)) return false;
          const code = $getBlockCode(selection.anchor.getNode());
          if (!code || !(0, import_code2.$isCodeNode)(code) || !$isAtEndOfCodeBlock(selection)) {
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
            const selection = (0, import_lexical10.$getSelection)();
            if (!(0, import_lexical10.$isRangeSelection)(selection)) return;
            const code = $getBlockCode(selection.anchor.getNode());
            if (code && (0, import_code2.$isCodeNode)(code)) {
              $exitCodeBlock(code);
            }
          });
          return true;
        }
        return false;
      },
      import_lexical10.COMMAND_PRIORITY_CRITICAL
    );
    const removeBackspace = editor.registerCommand(
      import_lexical10.DELETE_CHARACTER_COMMAND,
      (isBackward) => {
        if (!isBackward) return false;
        if ($shouldSkipBlockBehavior()) return false;
        const selection = (0, import_lexical10.$getSelection)();
        if (!(0, import_lexical10.$isRangeSelection)(selection) || !selection.isCollapsed()) return false;
        if (!$isAtStartOfBlock(selection)) return false;
        const quote = $getBlockQuote(selection.anchor.getNode());
        if (!quote || !(0, import_rich_text4.$isQuoteNode)(quote)) return false;
        const paragraph = $getQuoteParagraph(selection.anchor.getNode());
        if (!paragraph || paragraph.getParent() !== quote) return false;
        $handleQuoteBackspace(quote, paragraph, selection);
        return true;
      },
      import_lexical10.COMMAND_PRIORITY_CRITICAL
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
var import_react7 = require("react");
var import_code3 = require("@lexical/code");
var import_LexicalComposerContext6 = require("@lexical/react/LexicalComposerContext");
function CodeHighlightPlugin({ enabled }) {
  const [editor] = (0, import_LexicalComposerContext6.useLexicalComposerContext)();
  (0, import_react7.useEffect)(() => {
    if (!enabled) return;
    return (0, import_code3.registerCodeHighlighting)(editor);
  }, [editor, enabled]);
  return null;
}

// src/components/plugins/SelectionMenuPlugin.tsx
var import_react9 = require("react");
var import_react_dom2 = require("react-dom");
var import_LexicalComposerContext8 = require("@lexical/react/LexicalComposerContext");
var import_lexical12 = require("lexical");

// src/components/toolbar/ToolbarIcons.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M6 4h8a4 4 0 0 1 0 8H6z" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M6 12h9a4 4 0 0 1 0 8H6z" })
  ] });
}
function IconItalic(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("line", { x1: "19", y1: "4", x2: "10", y2: "4" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("line", { x1: "14", y1: "20", x2: "5", y2: "20" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("line", { x1: "15", y1: "4", x2: "9", y2: "20" })
  ] });
}
function IconStrikethrough(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M16 4H9a3 3 0 0 0-2.83 4" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M14 12a4 4 0 0 1 0 8H6" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("line", { x1: "4", y1: "12", x2: "20", y2: "12" })
  ] });
}
function IconCode(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("polyline", { points: "16 18 22 12 16 6" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("polyline", { points: "8 6 2 12 8 18" })
  ] });
}
function IconQuote(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M3 10h4v7H3z" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M13 10h4v7h-4z" })
  ] });
}
function IconCodeBlock(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("rect", { x: "4", y: "4", width: "16", height: "16", rx: "2" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M8 10l2 2-2 2" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M13 14h3" })
  ] });
}
function IconBulletList(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("line", { x1: "9", y1: "6", x2: "20", y2: "6" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("line", { x1: "9", y1: "12", x2: "20", y2: "12" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("line", { x1: "9", y1: "18", x2: "20", y2: "18" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("circle", { cx: "5", cy: "6", r: "1.5", fill: "currentColor", stroke: "none" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("circle", { cx: "5", cy: "12", r: "1.5", fill: "currentColor", stroke: "none" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("circle", { cx: "5", cy: "18", r: "1.5", fill: "currentColor", stroke: "none" })
  ] });
}
function IconNumberedList(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("line", { x1: "10", y1: "6", x2: "20", y2: "6" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("line", { x1: "10", y1: "12", x2: "20", y2: "12" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("line", { x1: "10", y1: "18", x2: "20", y2: "18" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M4 6h1v4H4" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M4 16h2" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M6 14H4" })
  ] });
}
function IconLink(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M10 13a5 5 0 0 0 7.54.54l2.92-2.92a5 5 0 0 0-7.07-7.07l-1.5 1.5" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M14 11a5 5 0 0 0-7.54-.54L3.54 13.4a5 5 0 0 0 7.07 7.07l1.5-1.5" })
  ] });
}
function IconHeading(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M4 12V4h4v16H4v-8" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M12 4h8" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M16 4v16" })
  ] });
}
function IconMention(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("circle", { cx: "12", cy: "12", r: "4" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" })
  ] });
}
function IconSpoiler(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" }),
    /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("line", { x1: "3", y1: "3", x2: "21", y2: "21" })
  ] });
}

// src/components/toolbar/useFormatState.ts
var import_react8 = require("react");
var import_LexicalComposerContext7 = require("@lexical/react/LexicalComposerContext");
var import_code4 = require("@lexical/code");
var import_link = require("@lexical/link");
var import_list2 = require("@lexical/list");
var import_rich_text5 = require("@lexical/rich-text");
var import_selection = require("@lexical/selection");
var import_utils3 = require("@lexical/utils");
var import_lexical11 = require("lexical");
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
  const [editor] = (0, import_LexicalComposerContext7.useLexicalComposerContext)();
  const [state, setState] = (0, import_react8.useState)(emptyFormat);
  (0, import_react8.useEffect)(() => {
    const update = () => {
      editor.getEditorState().read(() => {
        const selection = (0, import_lexical11.$getSelection)();
        if (!(0, import_lexical11.$isRangeSelection)(selection)) {
          setState(emptyFormat);
          return;
        }
        const anchorNode = selection.anchor.getNode();
        const listNode = (0, import_utils3.$findMatchingParent)(anchorNode, import_list2.$isListNode);
        setState({
          bold: selection.hasFormat("bold"),
          italic: selection.hasFormat("italic"),
          strikethrough: selection.hasFormat("strikethrough"),
          code: selection.hasFormat("code"),
          quote: !!(0, import_utils3.$findMatchingParent)(anchorNode, import_rich_text5.$isQuoteNode),
          codeBlock: !!(0, import_utils3.$findMatchingParent)(anchorNode, import_code4.$isCodeNode),
          bulletList: listNode?.getListType() === "bullet",
          numberedList: listNode?.getListType() === "number",
          link: !!(0, import_utils3.$findMatchingParent)(anchorNode, import_link.$isLinkNode),
          heading: !!(0, import_utils3.$findMatchingParent)(anchorNode, import_rich_text5.$isHeadingNode),
          spoiler: !!(0, import_utils3.$findMatchingParent)(anchorNode, $isSpoilerNode)
        });
      });
    };
    const removeUpdate = editor.registerUpdateListener(() => update());
    const removeSelection = editor.registerCommand(
      import_lexical11.SELECTION_CHANGE_COMMAND,
      () => {
        update();
        return false;
      },
      import_lexical11.COMMAND_PRIORITY_LOW
    );
    return () => {
      removeUpdate();
      removeSelection();
    };
  }, [editor]);
  return state;
}
function useFormatActions() {
  const [editor] = (0, import_LexicalComposerContext7.useLexicalComposerContext)();
  return {
    bold: () => editor.dispatchCommand(import_lexical11.FORMAT_TEXT_COMMAND, "bold"),
    italic: () => editor.dispatchCommand(import_lexical11.FORMAT_TEXT_COMMAND, "italic"),
    strikethrough: () => editor.dispatchCommand(import_lexical11.FORMAT_TEXT_COMMAND, "strikethrough"),
    code: () => editor.dispatchCommand(import_lexical11.FORMAT_TEXT_COMMAND, "code"),
    quote: () => {
      editor.update(() => {
        const selection = (0, import_lexical11.$getSelection)();
        if (!(0, import_lexical11.$isRangeSelection)(selection)) return;
        $applyQuoteToSelection(selection);
      });
    },
    codeBlock: () => {
      editor.update(() => {
        const selection = (0, import_lexical11.$getSelection)();
        if (!(0, import_lexical11.$isRangeSelection)(selection)) return;
        const inCode = !!(0, import_utils3.$findMatchingParent)(
          selection.anchor.getNode(),
          import_code4.$isCodeNode
        );
        if (inCode) {
          (0, import_selection.$setBlocksType)(selection, () => (0, import_lexical11.$createParagraphNode)());
        } else {
          (0, import_selection.$setBlocksType)(selection, () => (0, import_code4.$createCodeNode)());
        }
      });
    },
    bulletList: () => {
      editor.update(() => {
        const selection = (0, import_lexical11.$getSelection)();
        if (!(0, import_lexical11.$isRangeSelection)(selection)) return;
        const listNode = (0, import_utils3.$findMatchingParent)(
          selection.anchor.getNode(),
          import_list2.$isListNode
        );
        if (listNode?.getListType() === "bullet") {
          editor.dispatchCommand(import_list2.REMOVE_LIST_COMMAND, void 0);
        } else {
          editor.dispatchCommand(import_list2.INSERT_UNORDERED_LIST_COMMAND, void 0);
        }
      });
    },
    numberedList: () => {
      editor.update(() => {
        const selection = (0, import_lexical11.$getSelection)();
        if (!(0, import_lexical11.$isRangeSelection)(selection)) return;
        const listNode = (0, import_utils3.$findMatchingParent)(
          selection.anchor.getNode(),
          import_list2.$isListNode
        );
        if (listNode?.getListType() === "number") {
          editor.dispatchCommand(import_list2.REMOVE_LIST_COMMAND, void 0);
        } else {
          editor.dispatchCommand(import_list2.INSERT_ORDERED_LIST_COMMAND, void 0);
        }
      });
    },
    link: () => {
      editor.update(() => {
        const selection = (0, import_lexical11.$getSelection)();
        if (!(0, import_lexical11.$isRangeSelection)(selection)) return;
        const existing = (0, import_utils3.$findMatchingParent)(
          selection.anchor.getNode(),
          import_link.$isLinkNode
        );
        if (existing) {
          editor.dispatchCommand(import_link.TOGGLE_LINK_COMMAND, null);
          return;
        }
        const url = window.prompt("URL", "https://");
        if (url === null) return;
        if (url.trim()) {
          editor.dispatchCommand(import_link.TOGGLE_LINK_COMMAND, url.trim());
        }
      });
    },
    heading: () => {
      editor.update(() => {
        const selection = (0, import_lexical11.$getSelection)();
        if (!(0, import_lexical11.$isRangeSelection)(selection)) return;
        const heading = (0, import_utils3.$findMatchingParent)(
          selection.anchor.getNode(),
          import_rich_text5.$isHeadingNode
        );
        if (heading) {
          (0, import_selection.$setBlocksType)(selection, () => (0, import_lexical11.$createParagraphNode)());
        } else {
          (0, import_selection.$setBlocksType)(selection, () => (0, import_rich_text5.$createHeadingNode)("h2"));
        }
      });
    },
    mentionTrigger: () => {
      editor.update(() => {
        const selection = (0, import_lexical11.$getSelection)();
        if ((0, import_lexical11.$isRangeSelection)(selection)) {
          selection.insertText("@");
        }
      });
      editor.focus();
    },
    spoiler: () => {
      editor.update(() => {
        const selection = (0, import_lexical11.$getSelection)();
        if (!(0, import_lexical11.$isRangeSelection)(selection) || selection.isCollapsed()) return;
        const anchorNode = selection.anchor.getNode();
        const existing = (0, import_utils3.$findMatchingParent)(anchorNode, $isSpoilerNode);
        if (existing) {
          const textNode = (0, import_lexical11.$createTextNode)(existing.getTextContent());
          existing.replace(textNode);
          textNode.select();
          return;
        }
        const text = selection.getTextContent();
        if (!text) return;
        selection.removeText();
        const spoiler = $createSpoilerNode();
        spoiler.append((0, import_lexical11.$createTextNode)(text));
        selection.insertNodes([spoiler]);
      });
    }
  };
}

// src/components/plugins/SelectionMenuPlugin.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
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
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(IconBold, {});
    case "italic":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(IconItalic, {});
    case "strikethrough":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(IconStrikethrough, {});
    case "code":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(IconCode, {});
    case "quote":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(IconQuote, {});
    case "codeBlock":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(IconCodeBlock, {});
    case "bulletList":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(IconBulletList, {});
    case "numberedList":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(IconNumberedList, {});
    case "link":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(IconLink, {});
    case "heading":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(IconHeading, {});
    case "mention":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(IconMention, {});
    case "spoiler":
      return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(IconSpoiler, {});
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
  const [editor] = (0, import_LexicalComposerContext8.useLexicalComposerContext)();
  const active = useFormatState();
  const format = useFormatActions();
  const [position, setPosition] = (0, import_react9.useState)(
    null
  );
  const visibleItems = items.filter((item) => isItemEnabled(item, features));
  (0, import_react9.useEffect)(() => {
    if (!features.selectionMenu || visibleItems.length === 0) {
      setPosition(null);
      return;
    }
    const update = () => {
      editor.getEditorState().read(() => {
        const selection = (0, import_lexical12.$getSelection)();
        if (!(0, import_lexical12.$isRangeSelection)(selection) || selection.isCollapsed()) {
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
      import_lexical12.SELECTION_CHANGE_COMMAND,
      () => {
        update();
        return false;
      },
      import_lexical12.COMMAND_PRIORITY_LOW
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
  const menu = /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "div",
    {
      className: "re-selection-menu",
      style: {
        top: `${Math.max(0, position.top)}px`,
        left: `${position.left}px`
      },
      role: "toolbar",
      "aria-label": labels.selectionMenu,
      children: visibleItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
          children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(MenuIcon, { item })
        },
        item
      ))
    }
  );
  return (0, import_react_dom2.createPortal)(menu, containerRef.current ?? document.body);
}

// src/components/plugins/LineBreakPlugin.tsx
var import_react10 = require("react");
var import_LexicalComposerContext9 = require("@lexical/react/LexicalComposerContext");
var import_lexical13 = require("lexical");
function LineBreakPlugin() {
  const [editor] = (0, import_LexicalComposerContext9.useLexicalComposerContext)();
  (0, import_react10.useEffect)(() => {
    return editor.registerCommand(
      import_lexical13.INSERT_LINE_BREAK_COMMAND,
      () => {
        const selection = (0, import_lexical13.$getSelection)();
        if (!(0, import_lexical13.$isRangeSelection)(selection)) return false;
        if ($getBlockCode(selection.anchor.getNode())) return false;
        selection.insertParagraph();
        return true;
      },
      import_lexical13.COMMAND_PRIORITY_HIGH
    );
  }, [editor]);
  return null;
}

// src/components/plugins/SpoilerPlugin.tsx
var import_react11 = require("react");
var import_LexicalComposerContext10 = require("@lexical/react/LexicalComposerContext");
var import_utils4 = require("@lexical/utils");
var import_lexical14 = require("lexical");
function SpoilerPlugin() {
  const [editor] = (0, import_LexicalComposerContext10.useLexicalComposerContext)();
  const editingRef = (0, import_react11.useRef)(null);
  (0, import_react11.useEffect)(() => {
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
        const selection = (0, import_lexical14.$getSelection)();
        if (!(0, import_lexical14.$isRangeSelection)(selection)) return;
        const spoiler = (0, import_utils4.$findMatchingParent)(
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
  const [editor] = (0, import_LexicalComposerContext11.useLexicalComposerContext)();
  const lastApplied = (0, import_react12.useRef)(void 0);
  (0, import_react12.useEffect)(() => {
    if (html === lastApplied.current) return;
    editor.update(() => {
      const root = (0, import_lexical15.$getRoot)();
      root.clear();
      if (!html?.trim()) {
        lastApplied.current = html;
        return;
      }
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, "text/html");
      const nodes = (0, import_html4.$generateNodesFromDOM)(editor, dom.body);
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
  const [editor] = (0, import_LexicalComposerContext11.useLexicalComposerContext)();
  (0, import_react12.useEffect)(() => {
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
  const [editor] = (0, import_LexicalComposerContext11.useLexicalComposerContext)();
  (0, import_react12.useEffect)(() => {
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
  const [editor] = (0, import_LexicalComposerContext11.useLexicalComposerContext)();
  (0, import_react12.useEffect)(() => {
    setHtmlRef.current = (html) => {
      editor.update(() => {
        const root = (0, import_lexical15.$getRoot)();
        root.clear();
        if (!html.trim()) return;
        const parser = new DOMParser();
        const dom = parser.parseFromString(html, "text/html");
        const nodes = (0, import_html4.$generateNodesFromDOM)(editor, dom.body);
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
  const [editor] = (0, import_LexicalComposerContext11.useLexicalComposerContext)();
  (0, import_react12.useEffect)(() => {
    clearRef.current = () => {
      editor.update(() => {
        (0, import_lexical15.$getRoot)().clear();
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
  const [editor] = (0, import_LexicalComposerContext11.useLexicalComposerContext)();
  (0, import_react12.useEffect)(() => {
    const update = () => {
      editor.getEditorState().read(() => {
        onEmptyChange((0, import_lexical15.$getRoot)().getTextContent().trim() === "");
      });
    };
    update();
    return editor.registerUpdateListener(() => update());
  }, [editor, onEmptyChange]);
  return null;
}

// src/components/toolbar/EditorToolbar.tsx
var import_react13 = require("react");

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
var import_jsx_runtime5 = require("react/jsx-runtime");
function ToolbarButton({
  label,
  active,
  onClick,
  shortcutId,
  children
}) {
  const shortcut = shortcutId ? shortcutById(shortcutId) : void 0;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
  const [menuOpen, setMenuOpen] = (0, import_react13.useState)(false);
  const menuId = (0, import_react13.useId)();
  const hasMenu = !!slots.toolbarMenu;
  (0, import_react13.useEffect)(() => {
    if (!menuOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
    "div",
    {
      className: "re-toolbar",
      role: "toolbar",
      "aria-label": labels.toolbar,
      "aria-controls": editorInputId,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "re-toolbar-group re-toolbar-group-main", children: [
          slots.toolbarStart,
          features.bold && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            ToolbarButton,
            {
              label: labels.bold,
              active: active.bold,
              onClick: format.bold,
              shortcutId: "format.bold",
              children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IconBold, {})
            }
          ),
          features.italic && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            ToolbarButton,
            {
              label: labels.italic,
              active: active.italic,
              onClick: format.italic,
              shortcutId: "format.italic",
              children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IconItalic, {})
            }
          ),
          features.strikethrough && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            ToolbarButton,
            {
              label: labels.strikethrough,
              active: active.strikethrough,
              onClick: format.strikethrough,
              shortcutId: "format.strikethrough",
              children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IconStrikethrough, {})
            }
          ),
          features.code && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            ToolbarButton,
            {
              label: labels.code,
              active: active.code,
              onClick: format.code,
              shortcutId: "format.code",
              children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IconCode, {})
            }
          ),
          features.spoiler && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            ToolbarButton,
            {
              label: labels.spoiler,
              active: active.spoiler,
              onClick: format.spoiler,
              children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IconSpoiler, {})
            }
          ),
          features.quote && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            ToolbarButton,
            {
              label: labels.quote,
              active: active.quote,
              onClick: format.quote,
              children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IconQuote, {})
            }
          ),
          features.codeBlock && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            ToolbarButton,
            {
              label: labels.codeBlock,
              active: active.codeBlock,
              onClick: format.codeBlock,
              children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IconCodeBlock, {})
            }
          ),
          features.lists && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
              ToolbarButton,
              {
                label: labels.bulletList,
                active: active.bulletList,
                onClick: format.bulletList,
                children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IconBulletList, {})
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
              ToolbarButton,
              {
                label: labels.numberedList,
                active: active.numberedList,
                onClick: format.numberedList,
                children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IconNumberedList, {})
              }
            )
          ] }),
          features.links && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            ToolbarButton,
            {
              label: labels.link,
              active: active.link,
              onClick: format.link,
              children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IconLink, {})
            }
          ),
          features.headings && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            ToolbarButton,
            {
              label: labels.heading,
              active: active.heading,
              onClick: format.heading,
              children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IconHeading, {})
            }
          ),
          showMentionButton && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(ToolbarButton, { label: labels.mention, onClick: format.mentionTrigger, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(IconMention, {}) })
        ] }),
        (slots.toolbarEnd || hasMenu) && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "re-toolbar-group", style: { position: "relative" }, children: [
          slots.toolbarEnd,
          hasMenu && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
            menuOpen && /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(import_jsx_runtime5.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                "div",
                {
                  className: "re-toolbar-menu-backdrop",
                  onClick: () => setMenuOpen(false),
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
var import_react14 = require("react");
function createSlot(name) {
  const Slot = ({ children }) => null;
  Slot.slotName = name;
  Slot.displayName = `RichTextEditor.${name}`;
  return Slot;
}
function isSlotComponent(child) {
  return (0, import_react14.isValidElement)(child) && typeof child.type === "function" && "slotName" in child.type && typeof child.type.slotName === "string";
}
function collectSlots(children) {
  const slots = {};
  import_react14.Children.forEach(children, (child) => {
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
var import_jsx_runtime6 = require("react/jsx-runtime");
function onError(error) {
  console.error(error);
}
function exportEditorHtml(editor) {
  let html = "";
  editor.getEditorState().read(() => {
    html = (0, import_html5.$generateHtmlFromNodes)(editor, null);
  });
  return normalizeHtml(html.trim());
}
function EditorRefPlugin({
  getHtmlRef
}) {
  const [editor] = (0, import_LexicalComposerContext12.useLexicalComposerContext)();
  (0, import_react15.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
    "button",
    {
      type: "button",
      onClick: onSubmit,
      disabled,
      className: "re-submit-btn",
      "aria-label": label,
      title: label,
      children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" }) })
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
    return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_jsx_runtime6.Fragment, { children: slots.submitButton });
  }
  if (!showDefault) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
  const ctx = (0, import_react15.useMemo)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(RichTextEditorProvider, { value: ctx, children });
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
  const features = (0, import_react15.useMemo)(() => resolveFeatures(featuresProp), [featuresProp]);
  const labels = (0, import_react15.useMemo)(() => resolveLabels(labelsProp), [labelsProp]);
  const slots = (0, import_react15.useMemo)(() => collectSlots(children), [children]);
  const rootId = (0, import_react15.useId)();
  const editorInputId = `${rootId}-input`;
  const placeholderId = `${rootId}-placeholder`;
  const rootRef = (0, import_react15.useRef)(null);
  const bodyRef = (0, import_react15.useRef)(null);
  const getHtmlRef = (0, import_react15.useRef)(null);
  const setHtmlRef = (0, import_react15.useRef)(null);
  const clearRef = (0, import_react15.useRef)(null);
  const focusRef = (0, import_react15.useRef)(null);
  const [isEmpty, setIsEmpty] = (0, import_react15.useState)(true);
  const [sending, setSending] = (0, import_react15.useState)(false);
  const inputStyle = (0, import_react15.useMemo)(
    () => ({
      minHeight: `${minRows * EDITOR_LINE_HEIGHT_PX}px`,
      maxHeight: `${maxRows * EDITOR_LINE_HEIGHT_PX}px`
    }),
    [minRows, maxRows]
  );
  const enterBindings = (0, import_react15.useMemo)(
    () => resolveEnterKeyBindings({ enterBehavior, enterKeyBindings }),
    [enterBehavior, enterKeyBindings]
  );
  const initialConfig = (0, import_react15.useMemo)(
    () => ({
      namespace: "RichTextEditor",
      theme: editorTheme,
      editable: !disabled,
      onError,
      nodes: [
        import_rich_text6.HeadingNode,
        ...features.quote ? [import_rich_text6.QuoteNode] : [],
        import_list3.ListNode,
        import_list3.ListItemNode,
        import_code5.CodeNode,
        import_code5.CodeHighlightNode,
        import_link2.LinkNode,
        import_link2.AutoLinkNode,
        ...features.mentions ? [MentionNode] : [],
        ...features.spoiler ? [SpoilerNode] : []
      ]
    }),
    [disabled, features.mentions, features.quote, features.spoiler]
  );
  const transformers = (0, import_react15.useMemo)(
    () => features.markdownShortcuts ? buildMarkdownTransformers(features) : [],
    [features]
  );
  const getHtml = (0, import_react15.useCallback)(() => getHtmlRef.current?.() ?? "", []);
  const submit = (0, import_react15.useCallback)(async () => {
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
  (0, import_react15.useImperativeHandle)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_LexicalComposer.LexicalComposer, { initialConfig, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(EditorRefPlugin, { getHtmlRef }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(SetHtmlPlugin, { setHtmlRef }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(ClearPlugin, { clearRef }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(FocusPlugin, { focusRef }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(EmptyStatePlugin, { onEmptyChange: setIsEmpty }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
        children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
          "div",
          {
            ref: rootRef,
            id: rootId,
            ...themeDataAttribute(theme),
            className: cn("re-editor-root", className),
            children: [
              showToolbar && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                EditorToolbar,
                {
                  features,
                  labels,
                  slots,
                  editorInputId,
                  showMentionButton: features.mentions && !!mentionSearch
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                BlurCapturePlugin,
                {
                  rootRef,
                  onBlur,
                  getHtml
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { ref: bodyRef, className: "re-editor-body", children: [
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(BlockBehaviorPlugin, {}),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(LineBreakPlugin, {}),
                features.spoiler && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(SpoilerPlugin, {}),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(InitialHtmlPlugin, { html: value }),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                  import_LexicalRichTextPlugin.RichTextPlugin,
                  {
                    contentEditable: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                      import_LexicalContentEditable.ContentEditable,
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
                    placeholder: placeholder ? /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { id: placeholderId, className: "re-editor-placeholder", "aria-hidden": "true", children: placeholder }) : null,
                    ErrorBoundary: import_LexicalErrorBoundary.LexicalErrorBoundary
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_LexicalHistoryPlugin.HistoryPlugin, {}),
                features.lists && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_LexicalListPlugin.ListPlugin, {}),
                features.links && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_LexicalLinkPlugin.LinkPlugin, {}),
                features.codeBlock && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(CodeHighlightPlugin, { enabled: !disabled }),
                transformers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_LexicalMarkdownShortcutPlugin.MarkdownShortcutPlugin, { transformers }),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(MarkdownPastePlugin, { features }),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(KeyboardShortcutsPlugin, { features, disabled }),
                features.mentions && mentionSearch && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(MentionsPlugin, { searchMentions: mentionSearch }),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                  EnterPlugin,
                  {
                    bindings: enterBindings,
                    onSubmit: onSubmit ? () => void submit() : void 0
                  }
                ),
                features.selectionMenu && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
                  SelectionMenuPlugin,
                  {
                    features,
                    labels,
                    items: selectionMenuItems,
                    containerRef: bodyRef
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
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
              slots.footer && /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "re-footer", children: slots.footer })
            ]
          }
        )
      }
    )
  ] });
}
var RichTextEditorBase = (0, import_react15.forwardRef)(RichTextEditorInner);
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
var import_react16 = require("react");

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
var import_jsx_runtime7 = require("react/jsx-runtime");
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
  const ref = (0, import_react16.useRef)(null);
  const prepared = (0, import_react16.useMemo)(
    () => prepareViewerContent(content, features),
    [content, features]
  );
  (0, import_react16.useLayoutEffect)(() => {
    if (prepared.kind !== "html" || !features.codeHighlight) return;
    void highlightViewerCodeBlocks(ref.current);
  }, [prepared, features.codeHighlight]);
  (0, import_react16.useEffect)(() => {
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
  (0, import_react16.useEffect)(() => {
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
    return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
      "p",
      {
        ...themeDataAttribute(theme),
        className: cn("re-viewer re-viewer-plain", className),
        "aria-label": labels.content,
        children: prepared.text
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=index.cjs.map