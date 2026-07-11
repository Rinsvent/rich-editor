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
  buildMarkdownTransformers: () => buildMarkdownTransformers,
  defaultEditorTheme: () => defaultEditorTheme,
  defaultFeatures: () => defaultFeatures,
  defaultLabels: () => defaultLabels,
  defaultViewerFeatures: () => defaultViewerFeatures,
  editorCssVariables: () => editorCssVariables,
  editorThemePresets: () => editorThemePresets,
  exportEditorHtml: () => exportEditorHtml,
  isEditorThemePreset: () => isEditorThemePreset,
  isHtmlContent: () => isHtmlContent,
  looksLikeMarkdown: () => looksLikeMarkdown,
  markdownToHtml: () => markdownToHtml,
  normalizeHtml: () => normalizeHtml,
  plainTextFromHtml: () => plainTextFromHtml,
  sanitizeHtml: () => sanitizeHtml,
  useRichTextEditor: () => useRichTextEditor
});
module.exports = __toCommonJS(index_exports);

// src/components/RichTextEditor.tsx
var import_html5 = require("@lexical/html");
var import_code = require("@lexical/code");
var import_link = require("@lexical/link");
var import_list = require("@lexical/list");
var import_LexicalComposer = require("@lexical/react/LexicalComposer");
var import_LexicalComposerContext7 = require("@lexical/react/LexicalComposerContext");
var import_LexicalContentEditable = require("@lexical/react/LexicalContentEditable");
var import_LexicalErrorBoundary = require("@lexical/react/LexicalErrorBoundary");
var import_LexicalHistoryPlugin = require("@lexical/react/LexicalHistoryPlugin");
var import_LexicalLinkPlugin = require("@lexical/react/LexicalLinkPlugin");
var import_LexicalListPlugin = require("@lexical/react/LexicalListPlugin");
var import_LexicalMarkdownShortcutPlugin = require("@lexical/react/LexicalMarkdownShortcutPlugin");
var import_LexicalRichTextPlugin = require("@lexical/react/LexicalRichTextPlugin");
var import_rich_text2 = require("@lexical/rich-text");
var import_react10 = require("react");

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

// src/core/html.ts
var import_dompurify = __toESM(require("dompurify"), 1);
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
  return import_dompurify.default.sanitize(html, {
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
var import_markdown = require("@lexical/markdown");
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
function buildMarkdownTransformers(features) {
  const transformers = [];
  if (features.headings) transformers.push(import_markdown.HEADING);
  if (features.quote) transformers.push(import_markdown.QUOTE);
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
  return transformers;
}
function looksLikeMarkdown(text) {
  const t = text.trim();
  if (t.length < 2) return false;
  return /^#{1,6}\s/m.test(t) || /^>\s/m.test(t) || /^[-*+]\s/m.test(t) || /^\d+\.\s/m.test(t) || /```[\s\S]*?```/.test(t) || /\*\*[^*\n]+\*\*/.test(t) || /(?:^|[^*])\*[^*\s][^*\n]*\*(?:[^*]|$)/.test(t) || /`[^`\n]+`/.test(t) || /~~[^~\n]+~~/.test(t) || /\[[^\]]+\]\([^)]+\)/.test(t);
}
function markdownToHtml(markdown) {
  const raw = import_marked.marked.parse(markdown, { async: false });
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
var import_react6 = require("react");
var import_html4 = require("@lexical/html");
var import_LexicalComposerContext5 = require("@lexical/react/LexicalComposerContext");
var import_lexical6 = require("lexical");

// src/components/plugins/EnterPlugin.tsx
var import_react2 = require("react");
var import_LexicalComposerContext = require("@lexical/react/LexicalComposerContext");
var import_lexical2 = require("lexical");
function EnterPlugin({
  behavior,
  onSubmit
}) {
  const [editor] = (0, import_LexicalComposerContext.useLexicalComposerContext)();
  (0, import_react2.useEffect)(() => {
    return editor.registerCommand(
      import_lexical2.KEY_ENTER_COMMAND,
      (event) => {
        if (behavior === "newline") return false;
        if (behavior === "shift-newline") {
          if (event?.shiftKey) {
            event.preventDefault();
            editor.update(() => {
              const selection = (0, import_lexical2.$getSelection)();
              if ((0, import_lexical2.$isRangeSelection)(selection)) {
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
              const selection = (0, import_lexical2.$getSelection)();
              if ((0, import_lexical2.$isRangeSelection)(selection)) {
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
      import_lexical2.COMMAND_PRIORITY_LOW
    );
  }, [behavior, editor, onSubmit]);
  return null;
}

// src/components/plugins/MarkdownPastePlugin.tsx
var import_html2 = require("@lexical/html");
var import_LexicalComposerContext2 = require("@lexical/react/LexicalComposerContext");
var import_lexical3 = require("lexical");
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
      import_lexical3.PASTE_COMMAND,
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
            const selection = (0, import_lexical3.$getSelection)();
            if (!(0, import_lexical3.$isRangeSelection)(selection)) return;
            if (!selection.isCollapsed()) {
              selection.removeText();
            }
            const nodes = htmlToNodes(editor, html);
            if (nodes.length > 0) {
              (0, import_lexical3.$insertNodes)(nodes);
            }
          });
          return true;
        }
        if (htmlRaw && htmlRaw.trim() && !looksLikeMarkdown(text)) {
          event.preventDefault();
          const html = sanitizeHtml(htmlRaw);
          editor.update(() => {
            const selection = (0, import_lexical3.$getSelection)();
            if (!(0, import_lexical3.$isRangeSelection)(selection)) return;
            if (!selection.isCollapsed()) {
              selection.removeText();
            }
            const nodes = htmlToNodes(editor, html);
            if (nodes.length > 0) {
              (0, import_lexical3.$insertNodes)(nodes);
            }
          });
          return true;
        }
        return false;
      },
      import_lexical3.COMMAND_PRIORITY_HIGH
    );
  }, [editor, features.markdownPaste]);
  return null;
}

// src/components/plugins/KeyboardShortcutsPlugin.tsx
var import_react4 = require("react");
var import_LexicalComposerContext3 = require("@lexical/react/LexicalComposerContext");
var import_lexical4 = require("lexical");
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
      import_lexical4.KEY_DOWN_COMMAND,
      (event) => {
        if (!(event instanceof KeyboardEvent) || !isModKey(event)) {
          return false;
        }
        const key = event.key.toLowerCase();
        if (key === "b" && features.bold) {
          event.preventDefault();
          editor.dispatchCommand(import_lexical4.FORMAT_TEXT_COMMAND, "bold");
          return true;
        }
        if (key === "i" && features.italic) {
          event.preventDefault();
          editor.dispatchCommand(import_lexical4.FORMAT_TEXT_COMMAND, "italic");
          return true;
        }
        if (key === "e" && features.code && !event.shiftKey) {
          event.preventDefault();
          editor.dispatchCommand(import_lexical4.FORMAT_TEXT_COMMAND, "code");
          return true;
        }
        if (event.shiftKey && key === "x" && features.strikethrough) {
          event.preventDefault();
          editor.dispatchCommand(import_lexical4.FORMAT_TEXT_COMMAND, "strikethrough");
          return true;
        }
        return false;
      },
      import_lexical4.COMMAND_PRIORITY_LOW
    );
  }, [disabled, editor, features]);
  return null;
}

// src/components/plugins/MentionsPlugin.tsx
var import_LexicalTypeaheadMenuPlugin = require("@lexical/react/LexicalTypeaheadMenuPlugin");
var import_LexicalComposerContext4 = require("@lexical/react/LexicalComposerContext");
var import_react5 = require("react");
var import_react_dom = require("react-dom");
var import_lexical5 = require("lexical");
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
  options,
  selectedIndex,
  selectOptionAndCleanUp,
  setHighlightedIndex
}) {
  if (options.length === 0) return null;
  return (0, import_react_dom.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "re-mention-menu", role: "listbox", children: options.map((option, index) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
      "button",
      {
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
    )) }),
    anchorElementRef.current ?? document.body
  );
}
function MentionsPlugin({
  searchMentions
}) {
  const [editor] = (0, import_LexicalComposerContext4.useLexicalComposerContext)();
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
        options: menuOptions,
        selectedIndex,
        selectOptionAndCleanUp,
        setHighlightedIndex
      }
    ),
    []
  );
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
    import_LexicalTypeaheadMenuPlugin.LexicalTypeaheadMenuPlugin,
    {
      onQueryChange: setQuery,
      onSelectOption,
      triggerFn,
      options,
      menuRenderFn,
      commandPriority: import_lexical5.COMMAND_PRIORITY_HIGH
    }
  );
}

// src/components/plugins/index.tsx
function InitialHtmlPlugin({ html }) {
  const [editor] = (0, import_LexicalComposerContext5.useLexicalComposerContext)();
  const lastApplied = (0, import_react6.useRef)(void 0);
  (0, import_react6.useEffect)(() => {
    if (html === lastApplied.current) return;
    editor.update(() => {
      const root = (0, import_lexical6.$getRoot)();
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
  const [editor] = (0, import_LexicalComposerContext5.useLexicalComposerContext)();
  (0, import_react6.useEffect)(() => {
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
  const [editor] = (0, import_LexicalComposerContext5.useLexicalComposerContext)();
  (0, import_react6.useEffect)(() => {
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
  const [editor] = (0, import_LexicalComposerContext5.useLexicalComposerContext)();
  (0, import_react6.useEffect)(() => {
    setHtmlRef.current = (html) => {
      editor.update(() => {
        const root = (0, import_lexical6.$getRoot)();
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
  const [editor] = (0, import_LexicalComposerContext5.useLexicalComposerContext)();
  (0, import_react6.useEffect)(() => {
    clearRef.current = () => {
      editor.update(() => {
        (0, import_lexical6.$getRoot)().clear();
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
  const [editor] = (0, import_LexicalComposerContext5.useLexicalComposerContext)();
  (0, import_react6.useEffect)(() => {
    const update = () => {
      editor.getEditorState().read(() => {
        onEmptyChange((0, import_lexical6.$getRoot)().getTextContent().trim() === "");
      });
    };
    update();
    return editor.registerUpdateListener(() => update());
  }, [editor, onEmptyChange]);
  return null;
}

// src/components/toolbar/EditorToolbar.tsx
var import_react8 = require("react");

// src/components/toolbar/useFormatState.ts
var import_react7 = require("react");
var import_LexicalComposerContext6 = require("@lexical/react/LexicalComposerContext");
var import_rich_text = require("@lexical/rich-text");
var import_selection = require("@lexical/selection");
var import_utils = require("@lexical/utils");
var import_lexical7 = require("lexical");
var emptyFormat = {
  bold: false,
  italic: false,
  strikethrough: false,
  code: false,
  quote: false
};
function useFormatState() {
  const [editor] = (0, import_LexicalComposerContext6.useLexicalComposerContext)();
  const [state, setState] = (0, import_react7.useState)(emptyFormat);
  (0, import_react7.useEffect)(() => {
    const update = () => {
      editor.getEditorState().read(() => {
        const selection = (0, import_lexical7.$getSelection)();
        if (!(0, import_lexical7.$isRangeSelection)(selection)) {
          setState(emptyFormat);
          return;
        }
        setState({
          bold: selection.hasFormat("bold"),
          italic: selection.hasFormat("italic"),
          strikethrough: selection.hasFormat("strikethrough"),
          code: selection.hasFormat("code"),
          quote: !!(0, import_utils.$findMatchingParent)(
            selection.anchor.getNode(),
            import_rich_text.$isQuoteNode
          )
        });
      });
    };
    const removeUpdate = editor.registerUpdateListener(() => update());
    const removeSelection = editor.registerCommand(
      import_lexical7.SELECTION_CHANGE_COMMAND,
      () => {
        update();
        return false;
      },
      import_lexical7.COMMAND_PRIORITY_LOW
    );
    return () => {
      removeUpdate();
      removeSelection();
    };
  }, [editor]);
  return state;
}
function useFormatActions() {
  const [editor] = (0, import_LexicalComposerContext6.useLexicalComposerContext)();
  return {
    bold: () => editor.dispatchCommand(import_lexical7.FORMAT_TEXT_COMMAND, "bold"),
    italic: () => editor.dispatchCommand(import_lexical7.FORMAT_TEXT_COMMAND, "italic"),
    strikethrough: () => editor.dispatchCommand(import_lexical7.FORMAT_TEXT_COMMAND, "strikethrough"),
    code: () => editor.dispatchCommand(import_lexical7.FORMAT_TEXT_COMMAND, "code"),
    quote: () => {
      editor.update(() => {
        const selection = (0, import_lexical7.$getSelection)();
        if (!(0, import_lexical7.$isRangeSelection)(selection)) return;
        const inQuote = !!(0, import_utils.$findMatchingParent)(
          selection.anchor.getNode(),
          import_rich_text.$isQuoteNode
        );
        if (inQuote) {
          (0, import_selection.$setBlocksType)(selection, () => (0, import_lexical7.$createParagraphNode)());
        } else {
          (0, import_selection.$setBlocksType)(selection, () => new import_rich_text.QuoteNode());
        }
      });
    }
  };
}

// src/components/toolbar/EditorToolbar.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
function ToolbarButton({
  label,
  active,
  onClick,
  children
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
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
  const [menuOpen, setMenuOpen] = (0, import_react8.useState)(false);
  const hasMenu = !!slots.toolbarMenu;
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "re-toolbar", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "re-toolbar-group", children: [
      slots.toolbarStart,
      features.bold && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        ToolbarButton,
        {
          label: labels.bold,
          active: active.bold,
          onClick: format.bold,
          children: "B"
        }
      ),
      features.italic && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        ToolbarButton,
        {
          label: labels.italic,
          active: active.italic,
          onClick: format.italic,
          children: "I"
        }
      ),
      features.strikethrough && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        ToolbarButton,
        {
          label: labels.strikethrough,
          active: active.strikethrough,
          onClick: format.strikethrough,
          children: "S"
        }
      ),
      features.code && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        ToolbarButton,
        {
          label: labels.code,
          active: active.code,
          onClick: format.code,
          children: "</>"
        }
      ),
      features.quote && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        ToolbarButton,
        {
          label: labels.quote,
          active: active.quote,
          onClick: format.quote,
          children: '"'
        }
      )
    ] }),
    (slots.toolbarEnd || hasMenu) && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "re-toolbar-group", style: { position: "relative" }, children: [
      slots.toolbarEnd,
      hasMenu && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
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
        menuOpen && /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(import_jsx_runtime3.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
            "div",
            {
              className: "re-toolbar-menu-backdrop",
              onClick: () => setMenuOpen(false)
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
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
var import_react9 = require("react");
function createSlot(name) {
  const Slot = ({ children }) => null;
  Slot.slotName = name;
  Slot.displayName = `RichTextEditor.${name}`;
  return Slot;
}
function isSlotComponent(child) {
  return (0, import_react9.isValidElement)(child) && typeof child.type === "function" && "slotName" in child.type && typeof child.type.slotName === "string";
}
function collectSlots(children) {
  const slots = {};
  import_react9.Children.forEach(children, (child) => {
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
var import_jsx_runtime4 = require("react/jsx-runtime");
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
  const [editor] = (0, import_LexicalComposerContext7.useLexicalComposerContext)();
  (0, import_react10.useEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "button",
    {
      type: "button",
      onClick: onSubmit,
      disabled,
      className: "re-submit-btn",
      "aria-label": label,
      title: label,
      children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("path", { d: "M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" }) })
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
    return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_jsx_runtime4.Fragment, { children: slots.submitButton });
  }
  if (!showDefault) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
  const ctx = (0, import_react10.useMemo)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(RichTextEditorProvider, { value: ctx, children });
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
  const features = (0, import_react10.useMemo)(() => resolveFeatures(featuresProp), [featuresProp]);
  const labels = (0, import_react10.useMemo)(() => resolveLabels(labelsProp), [labelsProp]);
  const slots = (0, import_react10.useMemo)(() => collectSlots(children), [children]);
  const rootId = (0, import_react10.useId)();
  const rootRef = (0, import_react10.useRef)(null);
  const getHtmlRef = (0, import_react10.useRef)(null);
  const setHtmlRef = (0, import_react10.useRef)(null);
  const clearRef = (0, import_react10.useRef)(null);
  const focusRef = (0, import_react10.useRef)(null);
  const [isEmpty, setIsEmpty] = (0, import_react10.useState)(true);
  const [sending, setSending] = (0, import_react10.useState)(false);
  const inputStyle = (0, import_react10.useMemo)(
    () => ({
      minHeight: `${minRows * EDITOR_LINE_HEIGHT_PX}px`,
      maxHeight: `${maxRows * EDITOR_LINE_HEIGHT_PX}px`
    }),
    [minRows, maxRows]
  );
  const initialConfig = (0, import_react10.useMemo)(
    () => ({
      namespace: "RichTextEditor",
      theme: editorTheme,
      editable: !disabled,
      onError,
      nodes: [
        import_rich_text2.HeadingNode,
        import_rich_text2.QuoteNode,
        import_list.ListNode,
        import_list.ListItemNode,
        import_code.CodeNode,
        import_code.CodeHighlightNode,
        import_link.LinkNode,
        import_link.AutoLinkNode,
        ...features.mentions ? [MentionNode] : []
      ]
    }),
    [disabled, features.mentions]
  );
  const transformers = (0, import_react10.useMemo)(
    () => features.markdownShortcuts ? buildMarkdownTransformers(features) : [],
    [features]
  );
  const getHtml = (0, import_react10.useCallback)(() => getHtmlRef.current?.() ?? "", []);
  const submit = (0, import_react10.useCallback)(async () => {
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
  (0, import_react10.useImperativeHandle)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(import_LexicalComposer.LexicalComposer, { initialConfig, children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(EditorRefPlugin, { getHtmlRef }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(SetHtmlPlugin, { setHtmlRef }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(ClearPlugin, { clearRef }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(FocusPlugin, { focusRef }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(EmptyStatePlugin, { onEmptyChange: setIsEmpty }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
        children: /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
          "div",
          {
            ref: rootRef,
            id: rootId,
            ...themeDataAttribute(theme),
            className: cn("re-editor-root", className),
            children: [
              showToolbar && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(EditorToolbar, { features, labels, slots }),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                BlurCapturePlugin,
                {
                  rootRef,
                  onBlur,
                  getHtml
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "re-editor-body", children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(InitialHtmlPlugin, { html: value }),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                  import_LexicalRichTextPlugin.RichTextPlugin,
                  {
                    contentEditable: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                      import_LexicalContentEditable.ContentEditable,
                      {
                        className: "re-editor-input",
                        style: inputStyle
                      }
                    ),
                    placeholder: placeholder ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "re-editor-placeholder", children: placeholder }) : null,
                    ErrorBoundary: import_LexicalErrorBoundary.LexicalErrorBoundary
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_LexicalHistoryPlugin.HistoryPlugin, {}),
                features.lists && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_LexicalListPlugin.ListPlugin, {}),
                features.links && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_LexicalLinkPlugin.LinkPlugin, {}),
                transformers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_LexicalMarkdownShortcutPlugin.MarkdownShortcutPlugin, { transformers }),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(MarkdownPastePlugin, { features }),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(KeyboardShortcutsPlugin, { features, disabled }),
                features.mentions && mentionSearch && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(MentionsPlugin, { searchMentions: mentionSearch }),
                onSubmit && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
                  EnterPlugin,
                  {
                    behavior: enterBehavior,
                    onSubmit: () => void submit()
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
              slots.footer && /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "re-footer", children: slots.footer })
            ]
          }
        )
      }
    )
  ] });
}
var RichTextEditorBase = (0, import_react10.forwardRef)(RichTextEditorInner);
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
var import_react11 = require("react");
var import_core = __toESM(require("highlight.js/lib/core"), 1);
var import_javascript = __toESM(require("highlight.js/lib/languages/javascript"), 1);
var import_json = __toESM(require("highlight.js/lib/languages/json"), 1);
var import_plaintext = __toESM(require("highlight.js/lib/languages/plaintext"), 1);
var import_typescript = __toESM(require("highlight.js/lib/languages/typescript"), 1);
var import_jsx_runtime5 = require("react/jsx-runtime");
import_core.default.registerLanguage("javascript", import_javascript.default);
import_core.default.registerLanguage("js", import_javascript.default);
import_core.default.registerLanguage("typescript", import_typescript.default);
import_core.default.registerLanguage("ts", import_typescript.default);
import_core.default.registerLanguage("json", import_json.default);
import_core.default.registerLanguage("plaintext", import_plaintext.default);
function RichTextViewer({
  content,
  features: featuresProp,
  className,
  theme = defaultEditorTheme,
  onMentionClick
}) {
  const features = resolveViewerFeatures(featuresProp);
  const ref = (0, import_react11.useRef)(null);
  const isHtml = isHtmlContent(content);
  const html = isHtml ? sanitizeHtml(content) : "";
  (0, import_react11.useEffect)(() => {
    if (!isHtml || !features.codeHighlight) return;
    const root = ref.current;
    if (!root) return;
    root.querySelectorAll("pre code").forEach((el) => {
      import_core.default.highlightElement(el);
    });
  }, [content, features.codeHighlight, isHtml]);
  (0, import_react11.useEffect)(() => {
    if (!isHtml || !features.linkTarget) return;
    const root = ref.current;
    if (!root) return;
    root.querySelectorAll("a[href]").forEach((a) => {
      a.setAttribute("target", features.linkTarget);
      a.setAttribute("rel", "noopener noreferrer");
    });
  }, [content, features.linkTarget, isHtml]);
  (0, import_react11.useEffect)(() => {
    if (!isHtml || !onMentionClick) return;
    const root = ref.current;
    if (!root) return;
    const handler = (event) => {
      const target = event.target.closest(
        `[${MENTION_ID_ATTR}]`
      );
      if (!target || !root.contains(target)) return;
      const id = target.getAttribute(MENTION_ID_ATTR);
      if (!id) return;
      const label = target.getAttribute(MENTION_LABEL_ATTR) ?? target.textContent?.replace(/^@/, "") ?? id;
      onMentionClick({ id, label });
    };
    root.addEventListener("click", handler);
    return () => root.removeEventListener("click", handler);
  }, [content, isHtml, onMentionClick]);
  if (!isHtml) {
    return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      "p",
      {
        ...themeDataAttribute(theme),
        className: cn("re-viewer re-viewer-plain", className),
        children: content
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    "div",
    {
      ref,
      ...themeDataAttribute(theme),
      className: cn("re-viewer", className),
      dangerouslySetInnerHTML: { __html: html }
    }
  );
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RichTextEditor,
  RichTextViewer,
  buildMarkdownTransformers,
  defaultEditorTheme,
  defaultFeatures,
  defaultLabels,
  defaultViewerFeatures,
  editorCssVariables,
  editorThemePresets,
  exportEditorHtml,
  isEditorThemePreset,
  isHtmlContent,
  looksLikeMarkdown,
  markdownToHtml,
  normalizeHtml,
  plainTextFromHtml,
  sanitizeHtml,
  useRichTextEditor
});
//# sourceMappingURL=index.cjs.map