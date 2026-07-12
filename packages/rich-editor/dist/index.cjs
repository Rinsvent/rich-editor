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
  trimEditorHtml: () => trimEditorHtml,
  useRichTextEditor: () => useRichTextEditor
});
module.exports = __toCommonJS(index_exports);

// src/components/RichTextEditor.tsx
var import_html5 = require("@lexical/html");
var import_code6 = require("@lexical/code");
var import_link4 = require("@lexical/link");
var import_list3 = require("@lexical/list");
var import_LexicalComposer = require("@lexical/react/LexicalComposer");
var import_LexicalComposerContext17 = require("@lexical/react/LexicalComposerContext");
var import_LexicalContentEditable = require("@lexical/react/LexicalContentEditable");
var import_LexicalErrorBoundary = require("@lexical/react/LexicalErrorBoundary");
var import_LexicalHistoryPlugin = require("@lexical/react/LexicalHistoryPlugin");
var import_LexicalLinkPlugin = require("@lexical/react/LexicalLinkPlugin");
var import_LexicalListPlugin = require("@lexical/react/LexicalListPlugin");
var import_LexicalMarkdownShortcutPlugin = require("@lexical/react/LexicalMarkdownShortcutPlugin");
var import_LexicalRichTextPlugin = require("@lexical/react/LexicalRichTextPlugin");
var import_rich_text6 = require("@lexical/rich-text");
var import_react21 = require("react");

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
  underline: false,
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
  selectionMenu: false,
  attachments: false
};
function resolveFeatures(partial) {
  return { ...defaultFeatures, ...partial };
}
var defaultLabels = {
  bold: "Bold",
  italic: "Italic",
  underline: "Underline",
  strikethrough: "Strikethrough",
  code: "Inline code",
  codeBlock: "Code block",
  quote: "Quote",
  bulletList: "Bullet list",
  numberedList: "Numbered list",
  link: "Link",
  linkText: "Text",
  linkUrl: "URL",
  linkAdd: "Add link",
  linkEdit: "Edit link",
  linkRemove: "Remove link",
  linkSave: "Save",
  linkCancel: "Cancel",
  linkToolbar: "Link actions",
  heading: "Heading",
  mention: "Mention",
  spoiler: "Spoiler",
  submit: "Submit",
  menu: "Menu",
  editor: "Rich text editor",
  toolbar: "Formatting",
  mentionMenu: "Mention suggestions",
  selectionMenu: "Selection formatting",
  codeLanguage: "Code language",
  attachFile: "Attach file",
  attachments: "Attachments",
  removeAttachment: "Remove attachment",
  insertAttachment: "Insert into message",
  uploading: "Uploading",
  uploadFailed: "Upload failed"
};
function resolveLabels(partial) {
  return { ...defaultLabels, ...partial };
}
var defaultViewerLabels = {
  content: "Rich text content",
  mention: "Mention {label}",
  copyCode: "Copy code",
  copiedCode: "Copied",
  attachments: "Attachments"
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
var EDITOR_LINE_HEIGHT_PX = 24;

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
  "underline",
  "strikethrough",
  "code",
  "link",
  "spoiler"
];
var allSelectionMenuItems = [
  "bold",
  "italic",
  "underline",
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

// src/nodes/ImageNode.tsx
var import_lexical6 = require("lexical");

// src/components/attachments/ImageComponent.tsx
var import_LexicalComposerContext = require("@lexical/react/LexicalComposerContext");
var import_useLexicalNodeSelection = require("@lexical/react/useLexicalNodeSelection");
var import_utils = require("@lexical/utils");
var import_lexical5 = require("lexical");
var import_react2 = require("react");

// src/core/attachmentInsert.ts
var import_lexical4 = require("lexical");

// src/core/attachments.ts
var FILE_ID_ATTR = "data-file-id";
var FILE_NAME_ATTR = "data-file-name";
var FILE_MIME_ATTR = "data-file-mime";
var IMAGE_ASPECT_ATTR = "data-aspect-ratio";
function createLocalId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `file-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
function isImageMime(mimeType) {
  return mimeType.startsWith("image/");
}
function isVideoMime(mimeType) {
  return mimeType.startsWith("video/");
}
function getFileKind(mimeType) {
  if (isImageMime(mimeType)) return "image";
  if (isVideoMime(mimeType)) return "video";
  return "file";
}
function getFileExtension(name) {
  const index = name.lastIndexOf(".");
  if (index <= 0) return "";
  return name.slice(index + 1).toUpperCase();
}
function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function toAttachmentPayload(attachment) {
  if (attachment.status !== "ready" || !attachment.id || !attachment.url) {
    return null;
  }
  return {
    id: attachment.id,
    name: attachment.name,
    mimeType: attachment.mimeType,
    size: attachment.size,
    url: attachment.url,
    thumbnailUrl: attachment.thumbnailUrl
  };
}
function getReadyAttachmentPayloads(attachments) {
  return attachments.map(toAttachmentPayload).filter((item) => item !== null);
}
function collectFilesFromDataTransfer(dataTransfer) {
  if (!dataTransfer) return [];
  const files = [];
  if (dataTransfer.files?.length) {
    for (const file of Array.from(dataTransfer.files)) {
      files.push(file);
    }
  }
  return files;
}
function collectFilesFromClipboard(clipboard) {
  if (!clipboard) return [];
  const files = [];
  if (clipboard.files?.length) {
    for (const file of Array.from(clipboard.files)) {
      files.push(file);
    }
  }
  return files;
}

// src/nodes/FileLinkNode.ts
var import_lexical3 = require("lexical");
var FileLinkNode = class _FileLinkNode extends import_lexical3.ElementNode {
  static getType() {
    return "file-link";
  }
  static clone(node) {
    return new _FileLinkNode(
      node.__fileId,
      node.__fileName,
      node.__fileUrl,
      node.__mimeType,
      node.__key
    );
  }
  static importJSON(serializedNode) {
    return $createFileLinkNode({
      fileId: serializedNode.fileId,
      fileName: serializedNode.fileName,
      fileUrl: serializedNode.fileUrl,
      mimeType: serializedNode.mimeType
    });
  }
  static importDOM() {
    return {
      a: (domNode) => {
        const fileId = domNode.getAttribute(FILE_ID_ATTR);
        if (!fileId) return null;
        const fileName = domNode.getAttribute(FILE_NAME_ATTR) ?? domNode.textContent?.trim() ?? "File";
        const fileUrl = domNode.getAttribute("href") ?? "";
        const mimeType = domNode.getAttribute(FILE_MIME_ATTR) ?? "application/octet-stream";
        return {
          conversion: () => ({
            node: $createFileLinkNode({
              fileId,
              fileName,
              fileUrl,
              mimeType
            })
          }),
          priority: 2
        };
      }
    };
  }
  constructor(fileId, fileName, fileUrl, mimeType, key) {
    super(key);
    this.__fileId = fileId;
    this.__fileName = fileName;
    this.__fileUrl = fileUrl;
    this.__mimeType = mimeType;
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      fileId: this.__fileId,
      fileName: this.__fileName,
      fileUrl: this.__fileUrl,
      mimeType: this.__mimeType,
      type: "file-link"
    };
  }
  createDOM(config) {
    const element = document.createElement("a");
    element.className = config.theme.fileLink ?? "re-file-link";
    element.href = this.__fileUrl;
    element.setAttribute(FILE_ID_ATTR, this.__fileId);
    element.setAttribute(FILE_NAME_ATTR, this.__fileName);
    element.setAttribute(FILE_MIME_ATTR, this.__mimeType);
    element.setAttribute("target", "_blank");
    element.setAttribute("rel", "noopener noreferrer");
    element.contentEditable = "false";
    element.textContent = this.__fileName;
    return element;
  }
  updateDOM() {
    return false;
  }
  exportDOM() {
    const element = document.createElement("a");
    element.className = "re-file-link";
    element.href = this.__fileUrl;
    element.setAttribute(FILE_ID_ATTR, this.__fileId);
    element.setAttribute(FILE_NAME_ATTR, this.__fileName);
    element.setAttribute(FILE_MIME_ATTR, this.__mimeType);
    element.setAttribute("target", "_blank");
    element.setAttribute("rel", "noopener noreferrer");
    element.textContent = this.__fileName;
    return { element };
  }
  isInline() {
    return true;
  }
  canBeEmpty() {
    return false;
  }
  canInsertTextBefore() {
    return false;
  }
  canInsertTextAfter() {
    return false;
  }
  getFileId() {
    return this.getLatest().__fileId;
  }
  getFileName() {
    return this.getLatest().__fileName;
  }
  getFileUrl() {
    return this.getLatest().__fileUrl;
  }
  getMimeType() {
    return this.getLatest().__mimeType;
  }
};
function $createFileLinkNode({
  fileId,
  fileName,
  fileUrl,
  mimeType
}) {
  return (0, import_lexical3.$applyNodeReplacement)(
    new FileLinkNode(fileId, fileName, fileUrl, mimeType)
  );
}

// src/core/attachmentInsert.ts
var MIN_IMAGE_WIDTH = 80;
var MAX_IMAGE_WIDTH = 720;
function readImageDimensions(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve({
        width: image.naturalWidth || 320,
        height: image.naturalHeight || 240
      });
    };
    image.onerror = () => reject(new Error("Failed to load image"));
    image.src = src;
  });
}
async function getDefaultImageDimensions(src) {
  try {
    const { width, height } = await readImageDimensions(src);
    const aspectRatio = width / Math.max(height, 1);
    const targetWidth = Math.min(
      MAX_IMAGE_WIDTH,
      Math.max(MIN_IMAGE_WIDTH, width)
    );
    return { width: targetWidth, aspectRatio };
  } catch {
    return { width: 320, aspectRatio: 4 / 3 };
  }
}
function getAttachmentSource(attachment) {
  return attachment.url ?? attachment.previewUrl ?? attachment.thumbnailUrl ?? null;
}
async function insertImageAtSelection(editor, attachment) {
  const src = getAttachmentSource(attachment);
  if (!src) return;
  const fileId = attachment.id ?? attachment.localId;
  const { width, aspectRatio } = await getDefaultImageDimensions(src);
  editor.update(() => {
    const imageNode = $createImageNode({
      src,
      alt: attachment.name,
      fileId,
      width,
      aspectRatio
    });
    const selection = (0, import_lexical4.$getSelection)();
    if ((0, import_lexical4.$isRangeSelection)(selection)) {
      (0, import_lexical4.$insertNodes)([imageNode]);
      return;
    }
    const root = (0, import_lexical4.$getRoot)();
    const lastChild = root.getLastChild();
    if (lastChild && (0, import_lexical4.$isParagraphNode)(lastChild)) {
      lastChild.append(imageNode);
      return;
    }
    const paragraph = (0, import_lexical4.$createParagraphNode)();
    paragraph.append(imageNode);
    root.append(paragraph);
  });
}
function insertFileLinkAtSelection(editor, attachment) {
  if (!attachment.id || !attachment.url) return;
  editor.update(() => {
    const fileLink = $createFileLinkNode({
      fileId: attachment.id,
      fileName: attachment.name,
      fileUrl: attachment.url,
      mimeType: attachment.mimeType
    });
    const selection = (0, import_lexical4.$getSelection)();
    if (!(0, import_lexical4.$isRangeSelection)(selection)) {
      (0, import_lexical4.$insertNodes)([fileLink]);
      return;
    }
    selection.insertNodes([fileLink]);
  });
}
async function insertAttachmentAtSelection(editor, attachment) {
  if (attachment.status !== "ready") return;
  if (getFileKind(attachment.mimeType) === "image" || isImageMime(attachment.mimeType)) {
    await insertImageAtSelection(editor, attachment);
    return;
  }
  insertFileLinkAtSelection(editor, attachment);
}

// src/components/attachments/ImageComponent.tsx
var import_jsx_runtime2 = require("react/jsx-runtime");
function clampWidth(width) {
  return Math.min(MAX_IMAGE_WIDTH, Math.max(MIN_IMAGE_WIDTH, Math.round(width)));
}
function ImageComponent({
  src,
  alt,
  width,
  aspectRatio,
  nodeKey
}) {
  const [editor] = (0, import_LexicalComposerContext.useLexicalComposerContext)();
  const [isSelected, setSelected, clearSelection] = (0, import_useLexicalNodeSelection.useLexicalNodeSelection)(nodeKey);
  const imageRef = (0, import_react2.useRef)(null);
  const [isResizing, setIsResizing] = (0, import_react2.useState)(false);
  const height = Math.max(1, Math.round(width / aspectRatio));
  (0, import_react2.useEffect)(() => {
    return (0, import_utils.mergeRegister)(
      editor.registerCommand(
        import_lexical5.CLICK_COMMAND,
        (event) => {
          const target = event.target;
          if (!imageRef.current?.closest(".re-image-wrap")?.contains(target)) {
            return false;
          }
          if (event.shiftKey) {
            setSelected(!isSelected);
          } else {
            clearSelection();
            setSelected(true);
          }
          return true;
        },
        import_lexical5.COMMAND_PRIORITY_LOW
      )
    );
  }, [clearSelection, editor, isSelected, setSelected]);
  const onResizeStart = (0, import_react2.useCallback)(
    (edge, event) => {
      event.preventDefault();
      event.stopPropagation();
      setIsResizing(true);
      const startX = event.clientX;
      const startY = event.clientY;
      const startWidth = width;
      const onMove = (moveEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;
        let nextWidth = startWidth;
        if (edge === "e") {
          nextWidth = startWidth + deltaX;
        } else if (edge === "s") {
          nextWidth = startWidth + deltaY * aspectRatio;
        } else {
          const fromX = startWidth + deltaX;
          const fromY = startWidth + deltaY * aspectRatio;
          nextWidth = Math.abs(deltaX) >= Math.abs(deltaY * aspectRatio) ? fromX : fromY;
        }
        editor.update(() => {
          const node = (0, import_lexical5.$getNodeByKey)(nodeKey);
          if ($isImageNode(node)) {
            node.setWidth(clampWidth(nextWidth));
          }
        });
      };
      const onUp = () => {
        setIsResizing(false);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [aspectRatio, editor, nodeKey, width]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "span",
    {
      className: `re-image-wrap${isSelected ? " re-image-wrap-selected" : ""}${isResizing ? " re-image-wrap-resizing" : ""}`,
      style: { width: `${width}px` },
      contentEditable: false,
      "data-lexical-decorator": "true",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "img",
          {
            ref: imageRef,
            className: "re-image",
            src,
            alt,
            width,
            height,
            draggable: false
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "span",
          {
            className: "re-image-resize-handle re-image-resize-handle-e",
            onMouseDown: (event) => onResizeStart("e", event),
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "span",
          {
            className: "re-image-resize-handle re-image-resize-handle-s",
            onMouseDown: (event) => onResizeStart("s", event),
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "span",
          {
            className: "re-image-resize-handle re-image-resize-handle-se",
            onMouseDown: (event) => onResizeStart("se", event),
            "aria-hidden": "true"
          }
        )
      ]
    }
  );
}

// src/nodes/ImageNode.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var ImageNode = class _ImageNode extends import_lexical6.DecoratorNode {
  static getType() {
    return "image";
  }
  static clone(node) {
    return new _ImageNode(
      node.__src,
      node.__alt,
      node.__fileId,
      node.__width,
      node.__aspectRatio,
      node.__key
    );
  }
  static importJSON(serializedNode) {
    return $createImageNode({
      src: serializedNode.src,
      alt: serializedNode.alt,
      fileId: serializedNode.fileId,
      width: serializedNode.width,
      aspectRatio: serializedNode.aspectRatio
    });
  }
  static importDOM() {
    return {
      img: (domNode) => {
        if (!(domNode instanceof HTMLImageElement)) return null;
        const fileId = domNode.getAttribute(FILE_ID_ATTR);
        if (!fileId) return null;
        const src = domNode.getAttribute("src") ?? "";
        const alt = domNode.getAttribute("alt") ?? "";
        const width = Number(domNode.getAttribute("width")) || 320;
        const aspectRatio = Number(domNode.getAttribute(IMAGE_ASPECT_ATTR)) || (domNode.width && domNode.height ? domNode.width / domNode.height : 4 / 3);
        return {
          conversion: () => ({
            node: $createImageNode({
              src,
              alt,
              fileId,
              width,
              aspectRatio
            })
          }),
          priority: 2
        };
      }
    };
  }
  constructor(src, alt, fileId, width, aspectRatio, key) {
    super(key);
    this.__src = src;
    this.__alt = alt;
    this.__fileId = fileId;
    this.__width = width;
    this.__aspectRatio = aspectRatio;
  }
  exportJSON() {
    return {
      type: "image",
      version: 1,
      src: this.__src,
      alt: this.__alt,
      fileId: this.__fileId,
      width: this.__width,
      aspectRatio: this.__aspectRatio
    };
  }
  exportDOM() {
    const element = document.createElement("img");
    element.className = "re-image";
    element.src = this.__src;
    element.alt = this.__alt;
    element.setAttribute(FILE_ID_ATTR, this.__fileId);
    element.width = this.__width;
    element.height = Math.max(1, Math.round(this.__width / this.__aspectRatio));
    element.setAttribute(IMAGE_ASPECT_ATTR, String(this.__aspectRatio));
    element.style.width = `${this.__width}px`;
    element.style.maxWidth = "100%";
    element.style.height = "auto";
    return { element };
  }
  createDOM() {
    const span = document.createElement("span");
    span.className = "re-image-host";
    span.style.display = "inline-block";
    span.style.maxWidth = "100%";
    span.style.verticalAlign = "bottom";
    return span;
  }
  updateDOM() {
    return false;
  }
  decorate() {
    return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
      ImageComponent,
      {
        src: this.__src,
        alt: this.__alt,
        width: this.__width,
        aspectRatio: this.__aspectRatio,
        nodeKey: this.getKey()
      }
    );
  }
  isInline() {
    return true;
  }
  getSrc() {
    return this.getLatest().__src;
  }
  getAlt() {
    return this.getLatest().__alt;
  }
  getFileId() {
    return this.getLatest().__fileId;
  }
  getWidth() {
    return this.getLatest().__width;
  }
  getAspectRatio() {
    return this.getLatest().__aspectRatio;
  }
  setWidth(width) {
    const writable = this.getWritable();
    writable.__width = width;
  }
  setSrc(src) {
    const writable = this.getWritable();
    writable.__src = src;
  }
  setFileId(fileId) {
    const writable = this.getWritable();
    writable.__fileId = fileId;
  }
};
function $createImageNode({
  src,
  alt,
  fileId,
  width,
  aspectRatio
}) {
  return (0, import_lexical6.$applyNodeReplacement)(
    new ImageNode(src, alt, fileId, width, aspectRatio)
  );
}
function $isImageNode(node) {
  return node instanceof ImageNode;
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
  "u",
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
  "h6",
  "img"
];
var ALLOWED_URI_REGEXP = /^(?:(?:https?|mailto|tel|blob):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i;
function sanitizeHtml(html) {
  return import_isomorphic_dompurify.default.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: [
      "href",
      "class",
      "target",
      "rel",
      "style",
      "data-mention-id",
      "data-mention-label",
      "data-re-spoiler",
      "src",
      "alt",
      "width",
      "height",
      "data-file-id",
      "data-file-name",
      "data-file-mime",
      "data-aspect-ratio",
      "data-language"
    ],
    ALLOWED_URI_REGEXP
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
  container.querySelectorAll('[style*="underline"]').forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    if (node.style.textDecorationLine?.includes("line-through")) return;
    if (node.style.textDecoration?.includes("line-through")) return;
    const u = document.createElement("u");
    u.innerHTML = node.innerHTML;
    node.replaceWith(u);
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
  flattenTag(container, "u");
  flattenTag(container, "s");
  mergeAdjacentBlockquotes(container);
  return container.innerHTML.trim();
}
var BLOCK_CONTAINER_TAGS = /* @__PURE__ */ new Set(["blockquote", "ul", "ol"]);
var TRIMMABLE_BLOCK_TAGS = /* @__PURE__ */ new Set([
  "p",
  "blockquote",
  "pre",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6"
]);
function isTrimableBreak(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return !node.textContent?.replace(/\u00a0/g, " ").trim();
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    return node.tagName.toLowerCase() === "br";
  }
  return false;
}
function trimEdgeBreaks(el, edge) {
  if (edge === "start") {
    while (el.firstChild && isTrimableBreak(el.firstChild)) {
      el.firstChild.remove();
    }
    return;
  }
  while (el.lastChild && isTrimableBreak(el.lastChild)) {
    el.lastChild.remove();
  }
}
function isExportNodeEmpty(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return !node.textContent?.replace(/\u00a0/g, " ").trim();
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return true;
  const el = node;
  const tag = el.tagName.toLowerCase();
  if (tag === "br") return true;
  const text = el.textContent?.replace(/\u00a0/g, " ").trim() ?? "";
  if (text) return false;
  const children = Array.from(el.childNodes);
  if (children.length === 0) return true;
  return children.every(isExportNodeEmpty);
}
function isEmptyBlockElement(el) {
  const tag = el.tagName.toLowerCase();
  if (!TRIMMABLE_BLOCK_TAGS.has(tag) && !BLOCK_CONTAINER_TAGS.has(tag)) {
    return false;
  }
  return isExportNodeEmpty(el);
}
function trimContainerEdges(el) {
  while (el.firstElementChild && isEmptyBlockElement(el.firstElementChild)) {
    el.firstElementChild.remove();
  }
  while (el.lastElementChild && isEmptyBlockElement(el.lastElementChild)) {
    el.lastElementChild.remove();
  }
  trimEdgeBreaks(el, "start");
  trimEdgeBreaks(el, "end");
  const first = el.firstElementChild;
  const last = el.lastElementChild;
  if (first && BLOCK_CONTAINER_TAGS.has(first.tagName.toLowerCase())) {
    trimContainerEdges(first);
  }
  if (last && last !== first && BLOCK_CONTAINER_TAGS.has(last.tagName.toLowerCase())) {
    trimContainerEdges(last);
  }
}
function trimEditorHtml(html) {
  const trimmed = html.trim();
  if (!trimmed) return "";
  if (typeof document === "undefined") {
    return trimmed.replace(/^(?:<p[^>]*>(?:\s|<br\s*\/?>)*<\/p>\s*)+/gi, "").replace(/(?:\s*<p[^>]*>(?:\s|<br\s*\/?>)*<\/p>)+$/gi, "").replace(/^(<(?:p|blockquote|h[1-6])[^>]*>)<br\s*\/?>/i, "$1").replace(/<br\s*\/?>(<\/(?:p|blockquote|h[1-6])>)$/i, "$1").trim();
  }
  const container = document.createElement("div");
  container.innerHTML = trimmed;
  trimContainerEdges(container);
  while (container.firstElementChild && isEmptyBlockElement(container.firstElementChild)) {
    container.firstElementChild.remove();
  }
  while (container.lastElementChild && isEmptyBlockElement(container.lastElementChild)) {
    container.lastElementChild.remove();
  }
  const first = container.firstElementChild;
  const last = container.lastElementChild;
  if (first) trimContainerEdges(first);
  if (last && last !== first) trimContainerEdges(last);
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
var import_lexical7 = require("lexical");
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
    spoiler.append((0, import_lexical7.$createTextNode)(match[1]));
    textNode.replace(spoiler);
  },
  trigger: "|",
  type: "text-match"
};
var UNDERLINE = {
  format: ["underline"],
  tag: "++",
  type: "text-format"
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
        const paragraph2 = (0, import_lexical7.$createParagraphNode)();
        paragraph2.append(...children);
        previousNode.append(paragraph2);
        parentNode.remove();
        return;
      }
    }
    const quote = (0, import_rich_text.$createQuoteNode)();
    const paragraph = (0, import_lexical7.$createParagraphNode)();
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
  if (features.underline) transformers.push(UNDERLINE);
  if (features.strikethrough) transformers.push(import_markdown.STRIKETHROUGH);
  if (features.links) transformers.push(import_markdown.LINK);
  if (features.spoiler) transformers.push(SPOILER);
  return transformers;
}
function looksLikeMarkdown(text) {
  const t = text.trim();
  if (t.length < 2) return false;
  return /^#{1,6}\s/m.test(t) || /^>\s/m.test(t) || /^[-*+]\s/m.test(t) || /^\d+\.\s/m.test(t) || /```[\s\S]*?```/.test(t) || /\*\*[^*\n]+\*\*/.test(t) || /(?:^|[^*])\*[^*\s][^*\n]*\*(?:[^*]|$)/.test(t) || /`[^`\n]+`/.test(t) || /\+\+[^+\n]+\+\+/.test(t) || /~~[^~\n]+~~/.test(t) || /\|\|[^|\n]+\|\|/.test(t) || /\[[^\]]+\]\([^)]+\)/.test(t);
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
    underline: "re-text-underline",
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
  spoiler: "re-spoiler",
  image: "re-image",
  fileLink: "re-file-link"
};

// src/core/cn.ts
function cn(...parts) {
  return parts.filter(Boolean).join(" ");
}

// src/components/plugins/index.tsx
var import_react17 = require("react");
var import_html4 = require("@lexical/html");
var import_LexicalComposerContext15 = require("@lexical/react/LexicalComposerContext");
var import_lexical24 = require("lexical");

// src/core/selectionFormat.ts
var import_lexical8 = require("lexical");
function $clearStickyTextFormats() {
  const selection = (0, import_lexical8.$getSelection)();
  if ((0, import_lexical8.$isRangeSelection)(selection)) {
    selection.setFormat(0);
  }
}

// src/components/plugins/EnterPlugin.tsx
var import_react3 = require("react");
var import_LexicalComposerContext2 = require("@lexical/react/LexicalComposerContext");
var import_lexical9 = require("lexical");
function EnterPlugin({
  bindings,
  onSubmit
}) {
  const [editor] = (0, import_LexicalComposerContext2.useLexicalComposerContext)();
  (0, import_react3.useEffect)(() => {
    if (!bindings.length) return;
    return editor.registerCommand(
      import_lexical9.KEY_ENTER_COMMAND,
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
            const selection = (0, import_lexical9.$getSelection)();
            if ((0, import_lexical9.$isRangeSelection)(selection)) {
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
      import_lexical9.COMMAND_PRIORITY_LOW
    );
  }, [bindings, editor, onSubmit]);
  return null;
}

// src/components/plugins/MarkdownPastePlugin.tsx
var import_html2 = require("@lexical/html");
var import_LexicalComposerContext3 = require("@lexical/react/LexicalComposerContext");
var import_lexical10 = require("lexical");
var import_react4 = require("react");
function htmlToNodes(editor, html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return (0, import_html2.$generateNodesFromDOM)(editor, doc.body);
}
function MarkdownPastePlugin({
  features
}) {
  const [editor] = (0, import_LexicalComposerContext3.useLexicalComposerContext)();
  (0, import_react4.useEffect)(() => {
    if (!features.markdownPaste) return;
    return editor.registerCommand(
      import_lexical10.PASTE_COMMAND,
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
            const selection = (0, import_lexical10.$getSelection)();
            if (!(0, import_lexical10.$isRangeSelection)(selection)) return;
            if (!selection.isCollapsed()) {
              selection.removeText();
            }
            const nodes = htmlToNodes(editor, html);
            if (nodes.length > 0) {
              (0, import_lexical10.$insertNodes)(nodes);
            }
          });
          return true;
        }
        if (htmlRaw && htmlRaw.trim() && !looksLikeMarkdown(text)) {
          event.preventDefault();
          const html = sanitizeHtml(htmlRaw);
          editor.update(() => {
            const selection = (0, import_lexical10.$getSelection)();
            if (!(0, import_lexical10.$isRangeSelection)(selection)) return;
            if (!selection.isCollapsed()) {
              selection.removeText();
            }
            const nodes = htmlToNodes(editor, html);
            if (nodes.length > 0) {
              (0, import_lexical10.$insertNodes)(nodes);
            }
          });
          return true;
        }
        return false;
      },
      import_lexical10.COMMAND_PRIORITY_HIGH
    );
  }, [editor, features.markdownPaste]);
  return null;
}

// src/components/plugins/KeyboardShortcutsPlugin.tsx
var import_react5 = require("react");
var import_LexicalComposerContext4 = require("@lexical/react/LexicalComposerContext");
var import_lexical11 = require("lexical");
function isModKey(event) {
  return event.metaKey || event.ctrlKey;
}
function KeyboardShortcutsPlugin({
  features,
  disabled
}) {
  const [editor] = (0, import_LexicalComposerContext4.useLexicalComposerContext)();
  (0, import_react5.useEffect)(() => {
    if (!features.keyboardShortcuts || disabled) return;
    return editor.registerCommand(
      import_lexical11.KEY_DOWN_COMMAND,
      (event) => {
        if (!(event instanceof KeyboardEvent) || !isModKey(event)) {
          return false;
        }
        const key = event.key.toLowerCase();
        if (key === "b" && features.bold) {
          event.preventDefault();
          editor.dispatchCommand(import_lexical11.FORMAT_TEXT_COMMAND, "bold");
          return true;
        }
        if (key === "i" && features.italic) {
          event.preventDefault();
          editor.dispatchCommand(import_lexical11.FORMAT_TEXT_COMMAND, "italic");
          return true;
        }
        if (key === "u" && features.underline && !event.shiftKey) {
          event.preventDefault();
          editor.dispatchCommand(import_lexical11.FORMAT_TEXT_COMMAND, "underline");
          return true;
        }
        if (key === "e" && features.code && !event.shiftKey) {
          event.preventDefault();
          editor.dispatchCommand(import_lexical11.FORMAT_TEXT_COMMAND, "code");
          return true;
        }
        if (event.shiftKey && key === "x" && features.strikethrough) {
          event.preventDefault();
          editor.dispatchCommand(import_lexical11.FORMAT_TEXT_COMMAND, "strikethrough");
          return true;
        }
        return false;
      },
      import_lexical11.COMMAND_PRIORITY_LOW
    );
  }, [disabled, editor, features]);
  return null;
}

// src/components/plugins/MentionsPlugin.tsx
var import_LexicalTypeaheadMenuPlugin = require("@lexical/react/LexicalTypeaheadMenuPlugin");
var import_LexicalComposerContext5 = require("@lexical/react/LexicalComposerContext");
var import_react6 = require("react");
var import_react_dom = require("react-dom");
var import_lexical12 = require("lexical");
var import_jsx_runtime4 = require("react/jsx-runtime");
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
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      "div",
      {
        id: menuId,
        className: "re-mention-menu re-scrollbar",
        role: "listbox",
        "aria-label": menuLabel,
        "aria-activedescendant": activeDescendantId,
        children: options.map((option, index) => /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
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
  const [editor] = (0, import_LexicalComposerContext5.useLexicalComposerContext)();
  const { labels } = useRichTextEditor();
  const menuId = (0, import_react6.useId)();
  const [query, setQuery] = (0, import_react6.useState)(null);
  const [results, setResults] = (0, import_react6.useState)([]);
  const triggerFn = (0, import_LexicalTypeaheadMenuPlugin.useBasicTypeaheadTriggerMatch)("@", {
    minLength: 0,
    maxLength: 40
  });
  (0, import_react6.useEffect)(() => {
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
  const options = (0, import_react6.useMemo)(
    () => results.map((item) => new MentionMenuOption(item)),
    [results]
  );
  const onSelectOption = (0, import_react6.useCallback)(
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
  const menuRenderFn = (0, import_react6.useCallback)(
    (anchorElementRef, {
      selectedIndex,
      selectOptionAndCleanUp,
      setHighlightedIndex,
      options: menuOptions
    }) => /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    import_LexicalTypeaheadMenuPlugin.LexicalTypeaheadMenuPlugin,
    {
      onQueryChange: setQuery,
      onSelectOption,
      triggerFn,
      options,
      menuRenderFn,
      commandPriority: import_lexical12.COMMAND_PRIORITY_HIGH
    }
  );
}

// src/components/plugins/BlockBehaviorPlugin.tsx
var import_react7 = require("react");
var import_LexicalComposerContext6 = require("@lexical/react/LexicalComposerContext");
var import_code2 = require("@lexical/code");
var import_rich_text4 = require("@lexical/rich-text");
var import_lexical15 = require("lexical");

// src/core/blockBehavior.ts
var import_code = require("@lexical/code");
var import_list = require("@lexical/list");
var import_rich_text3 = require("@lexical/rich-text");
var import_utils3 = require("@lexical/utils");
var import_lexical14 = require("lexical");

// src/core/quoteBlocks.ts
var import_rich_text2 = require("@lexical/rich-text");
var import_utils2 = require("@lexical/utils");
var import_lexical13 = require("lexical");
function $getTopLevelBlock(node) {
  let current = node;
  while (current !== null && !(0, import_lexical13.$isRootOrShadowRoot)(current.getParent())) {
    current = current.getParent();
  }
  return (0, import_lexical13.$isElementNode)(current) ? current : null;
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
  if (children.length > 0 && children.every(import_lexical13.$isParagraphNode)) return;
  const normalized = [];
  let pending = null;
  for (const child of children) {
    if ((0, import_lexical13.$isParagraphNode)(child)) {
      normalized.push(child);
      pending = null;
      continue;
    }
    if (!pending) {
      pending = (0, import_lexical13.$createParagraphNode)();
      normalized.push(pending);
    }
    pending.append(child);
  }
  if (normalized.length === 0) {
    normalized.push((0, import_lexical13.$createParagraphNode)());
  }
  quote.clear();
  quote.append(...normalized);
}
function $getQuoteParagraph(node) {
  const quote = (0, import_utils2.$findMatchingParent)(node, import_rich_text2.$isQuoteNode);
  if (!quote) return null;
  let current = node;
  while (current !== null && current !== quote) {
    if ((0, import_lexical13.$isParagraphNode)(current) && current.getParent() === quote) {
      return current;
    }
    current = current.getParent();
  }
  $ensureQuoteParagraphStructure(quote);
  current = node;
  while (current !== null && current !== quote) {
    if ((0, import_lexical13.$isParagraphNode)(current) && current.getParent() === quote) {
      return current;
    }
    current = current.getParent();
  }
  const first = quote.getFirstChild();
  return (0, import_lexical13.$isParagraphNode)(first) ? first : null;
}
function $unwrapQuote(quote) {
  $ensureQuoteParagraphStructure(quote);
  const paragraphs = quote.getChildren().filter(import_lexical13.$isParagraphNode);
  if (paragraphs.length === 0) {
    quote.replace((0, import_lexical13.$createParagraphNode)());
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
  const inner = (0, import_lexical13.$createParagraphNode)();
  inner.append(...paragraph.getChildren());
  quote.append(inner);
  paragraph.replace(quote);
  return quote;
}
function $applyQuoteToSelection(selection) {
  const inQuote = (0, import_utils2.$findMatchingParent)(selection.anchor.getNode(), import_rich_text2.$isQuoteNode);
  if (inQuote) {
    $unwrapQuote(inQuote);
    return;
  }
  const blocks = $getSelectedTopLevelBlocks(selection);
  const paragraphs = blocks.filter(import_lexical13.$isParagraphNode);
  if (paragraphs.length === 0) return;
  if (paragraphs.length === 1) {
    $wrapParagraphInQuote(paragraphs[0]);
    return;
  }
  const quote = (0, import_rich_text2.$createQuoteNode)();
  for (const block of paragraphs) {
    const inner = (0, import_lexical13.$createParagraphNode)();
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
  for (const child of (0, import_lexical13.$getRoot)().getChildren()) {
    if ((0, import_rich_text2.$isQuoteNode)(child)) {
      $ensureQuoteParagraphStructure(child);
    }
  }
}

// src/core/blockBehavior.ts
function $getBlockQuote(node) {
  return (0, import_utils3.$findMatchingParent)(node, import_rich_text3.$isQuoteNode);
}
function $getBlockCode(node) {
  return (0, import_utils3.$findMatchingParent)(node, import_code.$isCodeNode);
}
function $isParagraphEmpty(node) {
  return (0, import_lexical14.$isParagraphNode)(node) && node.getTextContent().trim() === "";
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
  const paragraph = (0, import_utils3.$findMatchingParent)(node, import_lexical14.$isParagraphNode);
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
  if ((0, import_lexical14.$isParagraphNode)(node)) return true;
  if ((0, import_lexical14.$isTextNode)(node)) {
    const parent = node.getParent();
    if ((0, import_lexical14.$isElementNode)(parent)) {
      return parent.getFirstChild() === node;
    }
  }
  return false;
}
function $isAtEndOfBlock(selection) {
  const focus = selection.focus;
  const node = focus.getNode();
  if ((0, import_lexical14.$isTextNode)(node)) {
    return focus.offset === node.getTextContentSize();
  }
  if ((0, import_lexical14.$isParagraphNode)(node)) {
    const lastDescendant = node.getLastDescendant();
    if (!lastDescendant) return true;
    if ((0, import_lexical14.$isTextNode)(lastDescendant)) {
      return focus.offset === lastDescendant.getTextContentSize();
    }
  }
  return false;
}
function $unwrapParagraphFromQuote(paragraph) {
  const quote = paragraph.getParent();
  if (!(0, import_rich_text3.$isQuoteNode)(quote)) return;
  const paragraphs = quote.getChildren().filter(import_lexical14.$isParagraphNode);
  const index = paragraphs.findIndex((p) => p.getKey() === paragraph.getKey());
  if (index === -1) return;
  const total = paragraphs.length;
  const newParagraph = (0, import_lexical14.$createParagraphNode)();
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
  for (const child of [...(0, import_lexical14.$getRoot)().getChildren()]) {
    if (!(0, import_rich_text3.$isQuoteNode)(child)) continue;
    if (child.getTextContent().trim() === "") {
      child.remove();
    }
  }
}
function $insertParagraphBeforeBlock(block) {
  const paragraph = (0, import_lexical14.$createParagraphNode)();
  block.insertBefore(paragraph);
  paragraph.selectEnd();
}
function $exitQuoteWithEmptyLines(quote) {
  while (quote.getLastChild() && $isParagraphEmpty(quote.getLastChild())) {
    quote.getLastChild().remove();
  }
  const exitParagraph = (0, import_lexical14.$createParagraphNode)();
  quote.insertAfter(exitParagraph);
  exitParagraph.selectStart();
  if (quote.getChildrenSize() === 0) {
    quote.remove();
  }
}
function $handleQuoteEnter(quote, paragraph, selection) {
  $ensureQuoteParagraphStructure(quote);
  if (!(0, import_lexical14.$isParagraphNode)(paragraph) || paragraph.getParent() !== quote) {
    const resolved = quote.getChildren().find(import_lexical14.$isParagraphNode);
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
  const liveQuote = (0, import_lexical14.$getNodeByKey)(quote.getKey());
  if (!liveQuote || !(0, import_rich_text3.$isQuoteNode)(liveQuote)) return;
  quote = liveQuote;
  const liveParagraph = $getQuoteParagraph(selection.anchor.getNode());
  if (!liveParagraph || liveParagraph.getParent() !== quote) return;
  paragraph = liveParagraph;
  if (!(0, import_lexical14.$isParagraphNode)(paragraph) || paragraph.getParent() !== quote) return;
  if (!$isAtStartOfBlock(selection)) return;
  if ($isParagraphEmpty(paragraph)) {
    if (quote.getChildrenSize() <= 1) {
      const replacement = (0, import_lexical14.$createParagraphNode)();
      quote.replace(replacement);
      replacement.selectStart();
      return;
    }
    const prev = paragraph.getPreviousSibling();
    paragraph.remove();
    if (prev && (0, import_lexical14.$isParagraphNode)(prev)) {
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
  const root = (0, import_lexical14.$getRoot)();
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
  const root = (0, import_lexical14.$getRoot)();
  const children = [...root.getChildren()];
  for (let i = 0; i < children.length - 1; i++) {
    const current = children[i];
    const next = children[i + 1];
    if ((0, import_code.$isCodeNode)(current) && (0, import_code.$isCodeNode)(next)) {
      const merged = current.getTextContent();
      const nextText = next.getTextContent();
      const join = merged.endsWith("\n") || nextText.startsWith("\n") ? "" : "\n";
      current.clear();
      current.append((0, import_lexical14.$createTextNode)(merged + join + nextText));
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
    codeNode.append((0, import_lexical14.$createTextNode)(text));
  }
  const exitParagraph = (0, import_lexical14.$createParagraphNode)();
  codeNode.insertAfter(exitParagraph);
  exitParagraph.selectStart();
}
function $shouldSkipBlockBehavior() {
  const selection = (0, import_lexical14.$getSelection)();
  if (!(0, import_lexical14.$isRangeSelection)(selection)) return true;
  const node = selection.anchor.getNode();
  if ((0, import_utils3.$findMatchingParent)(node, import_list.$isListItemNode)) return true;
  return false;
}

// src/components/plugins/BlockBehaviorPlugin.tsx
function $needsQuoteNormalization() {
  for (const child of (0, import_lexical15.$getRoot)().getChildren()) {
    if (!(0, import_rich_text4.$isQuoteNode)(child)) continue;
    const children = child.getChildren();
    if (children.length === 0 || children.some((node) => !(0, import_lexical15.$isParagraphNode)(node))) {
      return true;
    }
  }
  return false;
}
function $needsBlockMerge() {
  const children = (0, import_lexical15.$getRoot)().getChildren();
  for (let i = 0; i < children.length - 1; i++) {
    const current = children[i];
    const next = children[i + 1];
    if ((0, import_rich_text4.$isQuoteNode)(current) && (0, import_rich_text4.$isQuoteNode)(next)) return true;
    if ((0, import_code2.$isCodeNode)(current) && (0, import_code2.$isCodeNode)(next)) return true;
  }
  return false;
}
function BlockBehaviorPlugin() {
  const [editor] = (0, import_LexicalComposerContext6.useLexicalComposerContext)();
  (0, import_react7.useEffect)(() => {
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
      import_lexical15.KEY_ENTER_COMMAND,
      (event) => {
        if ($shouldSkipBlockBehavior()) return false;
        const quoteContext = editor.getEditorState().read(() => {
          const selection = (0, import_lexical15.$getSelection)();
          if (!(0, import_lexical15.$isRangeSelection)(selection)) return null;
          const quote = $getBlockQuote(selection.anchor.getNode());
          if (!quote || !(0, import_rich_text4.$isQuoteNode)(quote)) return null;
          const paragraph = $getQuoteParagraph(selection.anchor.getNode());
          if (!paragraph || paragraph.getParent() !== quote) return null;
          return { quote, paragraph };
        });
        if (quoteContext) {
          event?.preventDefault();
          editor.update(() => {
            const selection = (0, import_lexical15.$getSelection)();
            if (!(0, import_lexical15.$isRangeSelection)(selection)) return;
            $handleQuoteEnter(
              quoteContext.quote,
              quoteContext.paragraph,
              selection
            );
          });
          return true;
        }
        const shouldExitCode = editor.getEditorState().read(() => {
          const selection = (0, import_lexical15.$getSelection)();
          if (!(0, import_lexical15.$isRangeSelection)(selection)) return false;
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
            const selection = (0, import_lexical15.$getSelection)();
            if (!(0, import_lexical15.$isRangeSelection)(selection)) return;
            const code = $getBlockCode(selection.anchor.getNode());
            if (code && (0, import_code2.$isCodeNode)(code)) {
              $exitCodeBlock(code);
            }
          });
          return true;
        }
        return false;
      },
      import_lexical15.COMMAND_PRIORITY_CRITICAL
    );
    const removeBackspace = editor.registerCommand(
      import_lexical15.DELETE_CHARACTER_COMMAND,
      (isBackward) => {
        if (!isBackward) return false;
        if ($shouldSkipBlockBehavior()) return false;
        const selection = (0, import_lexical15.$getSelection)();
        if (!(0, import_lexical15.$isRangeSelection)(selection) || !selection.isCollapsed()) return false;
        if (!$isAtStartOfBlock(selection)) return false;
        const quote = $getBlockQuote(selection.anchor.getNode());
        if (!quote || !(0, import_rich_text4.$isQuoteNode)(quote)) return false;
        const paragraph = $getQuoteParagraph(selection.anchor.getNode());
        if (!paragraph || paragraph.getParent() !== quote) return false;
        $handleQuoteBackspace(quote, paragraph, selection);
        return true;
      },
      import_lexical15.COMMAND_PRIORITY_CRITICAL
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
var import_react8 = require("react");
var import_code3 = require("@lexical/code");
var import_LexicalComposerContext7 = require("@lexical/react/LexicalComposerContext");
function CodeHighlightPlugin({ enabled }) {
  const [editor] = (0, import_LexicalComposerContext7.useLexicalComposerContext)();
  (0, import_react8.useEffect)(() => {
    if (!enabled) return;
    return (0, import_code3.registerCodeHighlighting)(editor);
  }, [editor, enabled]);
  return null;
}

// src/components/plugins/CodeLanguagePlugin.tsx
var import_react9 = require("react");
var import_react_dom2 = require("react-dom");
var import_LexicalComposerContext8 = require("@lexical/react/LexicalComposerContext");
var import_code4 = require("@lexical/code");
var import_utils4 = require("@lexical/utils");
var import_lexical16 = require("lexical");

// src/core/hljsLanguages.ts
var HLJS_LANGUAGE_LABELS = {
  "1c": "1C",
  "abnf": "Abnf",
  "accesslog": "Accesslog",
  "actionscript": "Actionscript",
  "ada": "Ada",
  "angelscript": "Angelscript",
  "apache": "Apache",
  "applescript": "Applescript",
  "arcade": "Arcade",
  "arduino": "Arduino",
  "armasm": "Armasm",
  "asciidoc": "Asciidoc",
  "aspectj": "Aspectj",
  "autohotkey": "Autohotkey",
  "autoit": "Autoit",
  "avrasm": "Avrasm",
  "awk": "Awk",
  "axapta": "Axapta",
  "bash": "Bash",
  "basic": "Basic",
  "bnf": "Bnf",
  "brainfuck": "Brainfuck",
  "c": "C",
  "cal": "Cal",
  "capnproto": "Capnproto",
  "ceylon": "Ceylon",
  "clean": "Clean",
  "clojure": "Clojure",
  "clojure-repl": "Clojure Repl",
  "cmake": "Cmake",
  "coffeescript": "Coffeescript",
  "coq": "Coq",
  "cos": "Cos",
  "cpp": "C++",
  "crmsh": "Crmsh",
  "crystal": "Crystal",
  "csharp": "C#",
  "csp": "Csp",
  "css": "CSS",
  "d": "D",
  "dart": "Dart",
  "delphi": "Delphi",
  "diff": "Diff",
  "django": "Django",
  "dns": "Dns",
  "dockerfile": "Dockerfile",
  "dos": "Dos",
  "dsconfig": "Dsconfig",
  "dts": "Dts",
  "dust": "Dust",
  "ebnf": "Ebnf",
  "elixir": "Elixir",
  "elm": "Elm",
  "erb": "Erb",
  "erlang": "Erlang",
  "erlang-repl": "Erlang Repl",
  "excel": "Excel",
  "fix": "Fix",
  "flix": "Flix",
  "fortran": "Fortran",
  "fsharp": "Fsharp",
  "gams": "Gams",
  "gauss": "Gauss",
  "gcode": "Gcode",
  "gherkin": "Gherkin",
  "glsl": "Glsl",
  "gml": "Gml",
  "go": "Go",
  "golo": "Golo",
  "gradle": "Gradle",
  "graphql": "Graphql",
  "groovy": "Groovy",
  "haml": "Haml",
  "handlebars": "Handlebars",
  "haskell": "Haskell",
  "haxe": "Haxe",
  "hsp": "Hsp",
  "http": "Http",
  "hy": "Hy",
  "inform7": "Inform7",
  "ini": "Ini",
  "irpf90": "Irpf90",
  "isbl": "Isbl",
  "java": "Java",
  "javascript": "JavaScript",
  "jboss-cli": "Jboss Cli",
  "json": "JSON",
  "julia": "Julia",
  "julia-repl": "Julia Repl",
  "kotlin": "Kotlin",
  "lasso": "Lasso",
  "latex": "Latex",
  "ldif": "Ldif",
  "leaf": "Leaf",
  "less": "Less",
  "lisp": "Lisp",
  "livecodeserver": "Livecodeserver",
  "livescript": "Livescript",
  "llvm": "Llvm",
  "lsl": "Lsl",
  "lua": "Lua",
  "makefile": "Makefile",
  "markdown": "Markdown",
  "mathematica": "Mathematica",
  "matlab": "Matlab",
  "maxima": "Maxima",
  "mel": "Mel",
  "mercury": "Mercury",
  "mipsasm": "Mipsasm",
  "mizar": "Mizar",
  "mojolicious": "Mojolicious",
  "monkey": "Monkey",
  "moonscript": "Moonscript",
  "n1ql": "N1ql",
  "nestedtext": "Nestedtext",
  "nginx": "Nginx",
  "nim": "Nim",
  "nix": "Nix",
  "node-repl": "Node Repl",
  "nsis": "Nsis",
  "objectivec": "Objectivec",
  "ocaml": "Ocaml",
  "openscad": "Openscad",
  "oxygene": "Oxygene",
  "parser3": "Parser3",
  "perl": "Perl",
  "pf": "Pf",
  "pgsql": "Pgsql",
  "php": "PHP",
  "php-template": "Php Template",
  "plaintext": "Plain Text",
  "pony": "Pony",
  "powershell": "Powershell",
  "processing": "Processing",
  "profile": "Profile",
  "prolog": "Prolog",
  "properties": "Properties",
  "protobuf": "Protobuf",
  "puppet": "Puppet",
  "purebasic": "Purebasic",
  "python": "Python",
  "python-repl": "Python Repl",
  "q": "Q",
  "qml": "Qml",
  "r": "R",
  "reasonml": "Reasonml",
  "rib": "Rib",
  "roboconf": "Roboconf",
  "routeros": "Routeros",
  "rsl": "Rsl",
  "ruby": "Ruby",
  "ruleslanguage": "Ruleslanguage",
  "rust": "Rust",
  "sas": "Sas",
  "scala": "Scala",
  "scheme": "Scheme",
  "scilab": "Scilab",
  "scss": "Scss",
  "shell": "Shell",
  "smali": "Smali",
  "smalltalk": "Smalltalk",
  "sml": "Sml",
  "sqf": "Sqf",
  "sql": "SQL",
  "stan": "Stan",
  "stata": "Stata",
  "step21": "Step21",
  "stylus": "Stylus",
  "subunit": "Subunit",
  "swift": "Swift",
  "taggerscript": "Taggerscript",
  "tap": "Tap",
  "tcl": "Tcl",
  "thrift": "Thrift",
  "tp": "Tp",
  "twig": "Twig",
  "typescript": "TypeScript",
  "vala": "Vala",
  "vbnet": "Vbnet",
  "vbscript": "Vbscript",
  "vbscript-html": "Vbscript Html",
  "verilog": "Verilog",
  "vhdl": "Vhdl",
  "vim": "Vim",
  "wasm": "Wasm",
  "wren": "Wren",
  "x86asm": "X86asm",
  "xl": "Xl",
  "xml": "XML",
  "xquery": "Xquery",
  "yaml": "YAML",
  "zephir": "Zephir"
};
var HLJS_LANGUAGE_IDS = Object.keys(HLJS_LANGUAGE_LABELS).sort();
function getHljsLanguageLabel(id) {
  return HLJS_LANGUAGE_LABELS[id] ?? id;
}
function resolveCodeLanguages(ids) {
  if (!ids || ids.length === 0) return HLJS_LANGUAGE_IDS;
  const allowed = new Set(ids.map((id) => id.trim().toLowerCase()).filter(Boolean));
  return HLJS_LANGUAGE_IDS.filter((id) => allowed.has(id));
}

// src/components/plugins/CodeLanguagePlugin.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
var PRISM_TO_HLJS_LANGUAGE = {
  js: "javascript",
  ts: "typescript",
  py: "python",
  plain: "plaintext",
  md: "markdown"
};
function toSelectLanguage(language) {
  if (!language) return "plaintext";
  return PRISM_TO_HLJS_LANGUAGE[language] ?? language;
}
function CodeLanguagePlugin({
  labels,
  containerRef,
  codeLanguages
}) {
  const [editor] = (0, import_LexicalComposerContext8.useLexicalComposerContext)();
  const [toolbar, setToolbar] = (0, import_react9.useState)(null);
  const [menuOpen, setMenuOpen] = (0, import_react9.useState)(false);
  const toolbarRef = (0, import_react9.useRef)(null);
  const languageOptions = (0, import_react9.useMemo)(() => {
    const ids = resolveCodeLanguages(codeLanguages);
    return ids.map((id) => ({
      id,
      label: getHljsLanguageLabel(id)
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, [codeLanguages]);
  const allowedLanguages = (0, import_react9.useMemo)(
    () => new Set(languageOptions.map((option) => option.id)),
    [languageOptions]
  );
  const update = (0, import_react9.useCallback)(() => {
    editor.getEditorState().read(() => {
      const selection = (0, import_lexical16.$getSelection)();
      if (!(0, import_lexical16.$isRangeSelection)(selection)) {
        setToolbar(null);
        setMenuOpen(false);
        return;
      }
      const code = (0, import_utils4.$findMatchingParent)(selection.anchor.getNode(), import_code4.$isCodeNode);
      if (!code || !code.isAttached()) {
        setToolbar(null);
        setMenuOpen(false);
        return;
      }
      const element = editor.getElementByKey(code.getKey());
      const container = containerRef.current;
      if (!element || !container || !container.contains(element)) {
        setToolbar(null);
        setMenuOpen(false);
        return;
      }
      const rect = element.getBoundingClientRect();
      const host = container.getBoundingClientRect();
      const language = toSelectLanguage(code.getLanguage());
      setToolbar((prev) => {
        const next = {
          codeKey: code.getKey(),
          language,
          top: rect.top - host.top + 6,
          right: host.right - rect.right + 6
        };
        if (prev && prev.codeKey === next.codeKey && prev.language === next.language && prev.top === next.top && prev.right === next.right) {
          return prev;
        }
        return next;
      });
    });
  }, [containerRef, editor]);
  (0, import_react9.useEffect)(() => {
    update();
    const removeSelection = editor.registerCommand(
      import_lexical16.SELECTION_CHANGE_COMMAND,
      () => {
        update();
        return false;
      },
      import_lexical16.COMMAND_PRIORITY_LOW
    );
    const removeUpdate = editor.registerUpdateListener(() => {
      update();
    });
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      removeSelection();
      removeUpdate();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [editor, update]);
  (0, import_react9.useEffect)(() => {
    if (!menuOpen) return;
    const onPointerDown = (event) => {
      const target = event.target;
      if (toolbarRef.current?.contains(target)) return;
      setMenuOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [menuOpen]);
  const setLanguage = (language) => {
    if (!toolbar) return;
    const codeKey = toolbar.codeKey;
    editor.update(() => {
      const code = (0, import_lexical16.$getNodeByKey)(codeKey);
      if (!(0, import_code4.$isCodeNode)(code)) return;
      code.setLanguage((0, import_code4.normalizeCodeLanguage)(language));
    });
    setToolbar(
      (current) => current ? { ...current, language } : current
    );
    setMenuOpen(false);
  };
  if (!toolbar || !containerRef.current) return null;
  const currentLabel = languageOptions.find((option) => option.id === toolbar.language)?.label ?? getHljsLanguageLabel(toolbar.language);
  const resolvedLanguage = allowedLanguages.has(toolbar.language) ? toolbar.language : languageOptions[0]?.id ?? toolbar.language;
  return (0, import_react_dom2.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
      "div",
      {
        ref: toolbarRef,
        className: "re-code-language-toolbar",
        style: {
          top: `${toolbar.top}px`,
          right: `${toolbar.right}px`
        },
        children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "re-code-language-picker", children: [
          /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)(
            "button",
            {
              type: "button",
              className: "re-code-language-trigger",
              "aria-label": labels.codeLanguage,
              "aria-haspopup": "listbox",
              "aria-expanded": menuOpen,
              onMouseDown: (event) => event.stopPropagation(),
              onClick: () => setMenuOpen((open) => !open),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("span", { className: "re-code-language-trigger-label", children: currentLabel }),
                /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                  "svg",
                  {
                    className: "re-code-language-chevron",
                    width: "10",
                    height: "10",
                    viewBox: "0 0 10 10",
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                      "path",
                      {
                        d: "M2 3.5 5 6.5 8 3.5",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "1.5",
                        strokeLinecap: "round",
                        strokeLinejoin: "round"
                      }
                    )
                  }
                )
              ]
            }
          ),
          menuOpen && /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
            "ul",
            {
              className: "re-code-language-menu re-scrollbar",
              role: "listbox",
              "aria-label": labels.codeLanguage,
              children: languageOptions.map((option) => /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("li", { role: "none", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
                "button",
                {
                  type: "button",
                  role: "option",
                  "aria-selected": option.id === resolvedLanguage,
                  className: "re-code-language-menu-item",
                  onMouseDown: (event) => event.stopPropagation(),
                  onClick: () => setLanguage(option.id),
                  children: option.label
                }
              ) }, option.id))
            }
          )
        ] })
      }
    ),
    containerRef.current
  );
}

// src/components/plugins/SelectionMenuPlugin.tsx
var import_react12 = require("react");
var import_react_dom3 = require("react-dom");
var import_LexicalComposerContext10 = require("@lexical/react/LexicalComposerContext");
var import_lexical18 = require("lexical");

// src/components/toolbar/ToolbarIcons.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
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
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M6 4h8a4 4 0 0 1 0 8H6z" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M6 12h9a4 4 0 0 1 0 8H6z" })
  ] });
}
function IconItalic(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("line", { x1: "19", y1: "4", x2: "10", y2: "4" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("line", { x1: "14", y1: "20", x2: "5", y2: "20" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("line", { x1: "15", y1: "4", x2: "9", y2: "20" })
  ] });
}
function IconUnderline(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M6 4v6a6 6 0 0 0 12 0V4" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("line", { x1: "4", y1: "20", x2: "20", y2: "20" })
  ] });
}
function IconStrikethrough(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M16 4H9a3 3 0 0 0-2.83 4" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M14 12a4 4 0 0 1 0 8H6" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("line", { x1: "4", y1: "12", x2: "20", y2: "12" })
  ] });
}
function IconCode(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("polyline", { points: "16 18 22 12 16 6" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("polyline", { points: "8 6 2 12 8 18" })
  ] });
}
function IconQuote(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M3 10h4v7H3z" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M13 10h4v7h-4z" })
  ] });
}
function IconCodeBlock(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("rect", { x: "4", y: "4", width: "16", height: "16", rx: "2" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M8 10l2 2-2 2" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M13 14h3" })
  ] });
}
function IconBulletList(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("line", { x1: "9", y1: "6", x2: "20", y2: "6" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("line", { x1: "9", y1: "12", x2: "20", y2: "12" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("line", { x1: "9", y1: "18", x2: "20", y2: "18" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("circle", { cx: "5", cy: "6", r: "1.5", fill: "currentColor", stroke: "none" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("circle", { cx: "5", cy: "12", r: "1.5", fill: "currentColor", stroke: "none" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("circle", { cx: "5", cy: "18", r: "1.5", fill: "currentColor", stroke: "none" })
  ] });
}
function IconNumberedList(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("line", { x1: "10", y1: "6", x2: "20", y2: "6" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("line", { x1: "10", y1: "12", x2: "20", y2: "12" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("line", { x1: "10", y1: "18", x2: "20", y2: "18" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M4 6h1v4H4" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M4 16h2" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M6 14H4" })
  ] });
}
function IconLink(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M10 13a5 5 0 0 0 7.54.54l2.92-2.92a5 5 0 0 0-7.07-7.07l-1.5 1.5" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M14 11a5 5 0 0 0-7.54-.54L3.54 13.4a5 5 0 0 0 7.07 7.07l1.5-1.5" })
  ] });
}
function IconHeading(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M4 12V4h4v16H4v-8" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M12 4h8" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M16 4v16" })
  ] });
}
function IconMention(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("circle", { cx: "12", cy: "12", r: "4" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" })
  ] });
}
function IconSpoiler(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("line", { x1: "3", y1: "3", x2: "21", y2: "21" })
  ] });
}
function IconEdit(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M12 20h9" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" })
  ] });
}
function IconTrash(props) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M3 6h18" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M8 6V4h8v2" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("line", { x1: "10", y1: "11", x2: "10", y2: "17" }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("line", { x1: "14", y1: "11", x2: "14", y2: "17" })
  ] });
}

// src/components/toolbar/useFormatState.ts
var import_react11 = require("react");
var import_LexicalComposerContext9 = require("@lexical/react/LexicalComposerContext");
var import_code5 = require("@lexical/code");
var import_link = require("@lexical/link");
var import_list2 = require("@lexical/list");
var import_rich_text5 = require("@lexical/rich-text");
var import_selection = require("@lexical/selection");
var import_utils5 = require("@lexical/utils");
var import_lexical17 = require("lexical");

// src/context/LinkUiContext.tsx
var import_react10 = require("react");
var import_jsx_runtime7 = require("react/jsx-runtime");
var LinkUiContext = (0, import_react10.createContext)(null);
function LinkUiProvider({
  openLinkDialog,
  children
}) {
  const value = (0, import_react10.useMemo)(() => ({ openLinkDialog }), [openLinkDialog]);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(LinkUiContext.Provider, { value, children });
}
function useLinkUiOptional() {
  return (0, import_react10.useContext)(LinkUiContext);
}

// src/components/toolbar/useFormatState.ts
var emptyFormat = {
  bold: false,
  italic: false,
  underline: false,
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
  const [editor] = (0, import_LexicalComposerContext9.useLexicalComposerContext)();
  const [state, setState] = (0, import_react11.useState)(emptyFormat);
  (0, import_react11.useEffect)(() => {
    const update = () => {
      editor.getEditorState().read(() => {
        const selection = (0, import_lexical17.$getSelection)();
        if (!(0, import_lexical17.$isRangeSelection)(selection)) {
          setState(emptyFormat);
          return;
        }
        const anchorNode = selection.anchor.getNode();
        const listNode = (0, import_utils5.$findMatchingParent)(anchorNode, import_list2.$isListNode);
        setState({
          bold: selection.hasFormat("bold"),
          italic: selection.hasFormat("italic"),
          underline: selection.hasFormat("underline"),
          strikethrough: selection.hasFormat("strikethrough"),
          code: selection.hasFormat("code"),
          quote: !!(0, import_utils5.$findMatchingParent)(anchorNode, import_rich_text5.$isQuoteNode),
          codeBlock: !!(0, import_utils5.$findMatchingParent)(anchorNode, import_code5.$isCodeNode),
          bulletList: listNode?.getListType() === "bullet",
          numberedList: listNode?.getListType() === "number",
          link: !!(0, import_utils5.$findMatchingParent)(anchorNode, import_link.$isLinkNode),
          heading: !!(0, import_utils5.$findMatchingParent)(anchorNode, import_rich_text5.$isHeadingNode),
          spoiler: !!(0, import_utils5.$findMatchingParent)(anchorNode, $isSpoilerNode)
        });
      });
    };
    const removeUpdate = editor.registerUpdateListener(() => update());
    const removeSelection = editor.registerCommand(
      import_lexical17.SELECTION_CHANGE_COMMAND,
      () => {
        update();
        return false;
      },
      import_lexical17.COMMAND_PRIORITY_LOW
    );
    return () => {
      removeUpdate();
      removeSelection();
    };
  }, [editor]);
  return state;
}
function useFormatActions() {
  const [editor] = (0, import_LexicalComposerContext9.useLexicalComposerContext)();
  const linkUi = useLinkUiOptional();
  return {
    bold: () => editor.dispatchCommand(import_lexical17.FORMAT_TEXT_COMMAND, "bold"),
    italic: () => editor.dispatchCommand(import_lexical17.FORMAT_TEXT_COMMAND, "italic"),
    underline: () => editor.dispatchCommand(import_lexical17.FORMAT_TEXT_COMMAND, "underline"),
    strikethrough: () => editor.dispatchCommand(import_lexical17.FORMAT_TEXT_COMMAND, "strikethrough"),
    code: () => editor.dispatchCommand(import_lexical17.FORMAT_TEXT_COMMAND, "code"),
    quote: () => {
      editor.update(() => {
        const selection = (0, import_lexical17.$getSelection)();
        if (!(0, import_lexical17.$isRangeSelection)(selection)) return;
        $applyQuoteToSelection(selection);
      });
    },
    codeBlock: () => {
      editor.update(() => {
        const selection = (0, import_lexical17.$getSelection)();
        if (!(0, import_lexical17.$isRangeSelection)(selection)) return;
        const inCode = !!(0, import_utils5.$findMatchingParent)(
          selection.anchor.getNode(),
          import_code5.$isCodeNode
        );
        if (inCode) {
          (0, import_selection.$setBlocksType)(selection, () => (0, import_lexical17.$createParagraphNode)());
        } else {
          (0, import_selection.$setBlocksType)(selection, () => (0, import_code5.$createCodeNode)());
        }
      });
    },
    bulletList: () => {
      editor.update(() => {
        const selection = (0, import_lexical17.$getSelection)();
        if (!(0, import_lexical17.$isRangeSelection)(selection)) return;
        const listNode = (0, import_utils5.$findMatchingParent)(
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
        const selection = (0, import_lexical17.$getSelection)();
        if (!(0, import_lexical17.$isRangeSelection)(selection)) return;
        const listNode = (0, import_utils5.$findMatchingParent)(
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
      linkUi?.openLinkDialog();
    },
    heading: () => {
      editor.update(() => {
        const selection = (0, import_lexical17.$getSelection)();
        if (!(0, import_lexical17.$isRangeSelection)(selection)) return;
        const heading = (0, import_utils5.$findMatchingParent)(
          selection.anchor.getNode(),
          import_rich_text5.$isHeadingNode
        );
        if (heading) {
          (0, import_selection.$setBlocksType)(selection, () => (0, import_lexical17.$createParagraphNode)());
        } else {
          (0, import_selection.$setBlocksType)(selection, () => (0, import_rich_text5.$createHeadingNode)("h2"));
        }
      });
    },
    mentionTrigger: () => {
      editor.update(() => {
        const selection = (0, import_lexical17.$getSelection)();
        if ((0, import_lexical17.$isRangeSelection)(selection)) {
          selection.insertText("@");
        }
      });
      editor.focus();
    },
    spoiler: () => {
      editor.update(() => {
        const selection = (0, import_lexical17.$getSelection)();
        if (!(0, import_lexical17.$isRangeSelection)(selection) || selection.isCollapsed()) return;
        const anchorNode = selection.anchor.getNode();
        const existing = (0, import_utils5.$findMatchingParent)(anchorNode, $isSpoilerNode);
        if (existing) {
          const textNode = (0, import_lexical17.$createTextNode)(existing.getTextContent());
          existing.replace(textNode);
          textNode.select();
          return;
        }
        const text = selection.getTextContent();
        if (!text) return;
        selection.removeText();
        const spoiler = $createSpoilerNode();
        spoiler.append((0, import_lexical17.$createTextNode)(text));
        selection.insertNodes([spoiler]);
      });
    }
  };
}

// src/components/plugins/SelectionMenuPlugin.tsx
var import_jsx_runtime8 = require("react/jsx-runtime");
function isItemEnabled(item, features) {
  switch (item) {
    case "bold":
      return features.bold;
    case "italic":
      return features.italic;
    case "underline":
      return features.underline;
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
      return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(IconBold, {});
    case "italic":
      return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(IconItalic, {});
    case "underline":
      return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(IconUnderline, {});
    case "strikethrough":
      return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(IconStrikethrough, {});
    case "code":
      return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(IconCode, {});
    case "quote":
      return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(IconQuote, {});
    case "codeBlock":
      return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(IconCodeBlock, {});
    case "bulletList":
      return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(IconBulletList, {});
    case "numberedList":
      return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(IconNumberedList, {});
    case "link":
      return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(IconLink, {});
    case "heading":
      return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(IconHeading, {});
    case "mention":
      return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(IconMention, {});
    case "spoiler":
      return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(IconSpoiler, {});
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
    case "underline":
      return labels.underline;
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
    case "underline":
      format.underline();
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
    case "underline":
      return active.underline;
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
  const [editor] = (0, import_LexicalComposerContext10.useLexicalComposerContext)();
  const active = useFormatState();
  const format = useFormatActions();
  const [position, setPosition] = (0, import_react12.useState)(
    null
  );
  const visibleItems = items.filter((item) => isItemEnabled(item, features));
  (0, import_react12.useEffect)(() => {
    if (!features.selectionMenu || visibleItems.length === 0) {
      setPosition(null);
      return;
    }
    const update = () => {
      editor.getEditorState().read(() => {
        const selection = (0, import_lexical18.$getSelection)();
        if (!(0, import_lexical18.$isRangeSelection)(selection) || selection.isCollapsed()) {
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
      import_lexical18.SELECTION_CHANGE_COMMAND,
      () => {
        update();
        return false;
      },
      import_lexical18.COMMAND_PRIORITY_LOW
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
  const menu = /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    "div",
    {
      className: "re-selection-menu",
      style: {
        top: `${Math.max(0, position.top)}px`,
        left: `${position.left}px`
      },
      role: "toolbar",
      "aria-label": labels.selectionMenu,
      children: visibleItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
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
          children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(MenuIcon, { item })
        },
        item
      ))
    }
  );
  return (0, import_react_dom3.createPortal)(menu, containerRef.current ?? document.body);
}

// src/components/plugins/LineBreakPlugin.tsx
var import_react13 = require("react");
var import_LexicalComposerContext11 = require("@lexical/react/LexicalComposerContext");
var import_lexical19 = require("lexical");
function LineBreakPlugin() {
  const [editor] = (0, import_LexicalComposerContext11.useLexicalComposerContext)();
  (0, import_react13.useEffect)(() => {
    return editor.registerCommand(
      import_lexical19.INSERT_LINE_BREAK_COMMAND,
      () => {
        const selection = (0, import_lexical19.$getSelection)();
        if (!(0, import_lexical19.$isRangeSelection)(selection)) return false;
        if ($getBlockCode(selection.anchor.getNode())) return false;
        selection.insertParagraph();
        return true;
      },
      import_lexical19.COMMAND_PRIORITY_HIGH
    );
  }, [editor]);
  return null;
}

// src/components/plugins/LinkUiPlugin.tsx
var import_react14 = require("react");
var import_react_dom4 = require("react-dom");
var import_LexicalComposerContext12 = require("@lexical/react/LexicalComposerContext");
var import_link3 = require("@lexical/link");
var import_utils6 = require("@lexical/utils");
var import_lexical21 = require("lexical");

// src/core/links.ts
var import_link2 = require("@lexical/link");
var import_lexical20 = require("lexical");
function $applyLinkForm(values, linkKey) {
  const text = values.text.trim();
  const url = values.url.trim();
  if (!text || !url) return;
  if (linkKey) {
    const link2 = (0, import_lexical20.$getNodeByKey)(linkKey);
    if (!(0, import_link2.$isLinkNode)(link2)) return;
    const nextLink = (0, import_link2.$createLinkNode)(url, {
      rel: link2.getRel(),
      target: link2.getTarget(),
      title: link2.getTitle()
    });
    nextLink.append((0, import_lexical20.$createTextNode)(text));
    link2.replace(nextLink);
    nextLink.selectEnd();
    return;
  }
  const selection = (0, import_lexical20.$getSelection)();
  if (!(0, import_lexical20.$isRangeSelection)(selection)) return;
  if (!selection.isCollapsed()) {
    selection.removeText();
  }
  const link = (0, import_link2.$createLinkNode)(url);
  link.append((0, import_lexical20.$createTextNode)(text));
  selection.insertNodes([link]);
}
function $removeLinkByKey(linkKey) {
  const link = (0, import_lexical20.$getNodeByKey)(linkKey);
  if (!(0, import_link2.$isLinkNode)(link)) return;
  const textNode = (0, import_lexical20.$createTextNode)(link.getTextContent());
  link.replace(textNode);
  textNode.select();
}

// src/components/plugins/LinkUiPlugin.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
function LinkModal({
  state,
  labels,
  onClose,
  onSave
}) {
  const titleId = (0, import_react14.useId)();
  const textId = (0, import_react14.useId)();
  const urlId = (0, import_react14.useId)();
  const [text, setText] = (0, import_react14.useState)(state.text);
  const [url, setUrl] = (0, import_react14.useState)(state.url);
  const textRef = (0, import_react14.useRef)(null);
  (0, import_react14.useEffect)(() => {
    setText(state.text);
    setUrl(state.url || "https://");
    const timer = window.setTimeout(() => textRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [state]);
  (0, import_react14.useEffect)(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);
  const title = state.mode === "edit" ? labels.linkEdit : labels.linkAdd;
  return (0, import_react_dom4.createPortal)(
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "re-link-modal-backdrop", onMouseDown: onClose, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
      "div",
      {
        className: "re-link-modal",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": titleId,
        onMouseDown: (event) => event.stopPropagation(),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h3", { id: titleId, className: "re-link-modal-title", children: title }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("label", { className: "re-link-field", htmlFor: textId, children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "re-link-field-label", children: labels.linkText }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              "input",
              {
                ref: textRef,
                id: textId,
                type: "text",
                className: "re-link-field-input",
                value: text,
                onChange: (event) => setText(event.target.value),
                placeholder: labels.linkText
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("label", { className: "re-link-field", htmlFor: urlId, children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "re-link-field-label", children: labels.linkUrl }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              "input",
              {
                id: urlId,
                type: "url",
                className: "re-link-field-input",
                value: url,
                onChange: (event) => setUrl(event.target.value),
                placeholder: "https://"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "re-link-modal-actions", children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              "button",
              {
                type: "button",
                className: "re-link-modal-btn re-link-modal-btn-secondary",
                onClick: onClose,
                children: labels.linkCancel
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              "button",
              {
                type: "button",
                className: "re-link-modal-btn re-link-modal-btn-primary",
                onClick: () => onSave(text, url, state.linkKey),
                disabled: !text.trim() || !url.trim(),
                children: labels.linkSave
              }
            )
          ] })
        ]
      }
    ) }),
    document.body
  );
}
function LinkFloatingToolbar({
  position,
  labels,
  onEdit,
  onRemove
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
    "div",
    {
      className: "re-link-floating-toolbar",
      style: {
        top: `${position.top}px`,
        left: `${position.left}px`
      },
      role: "toolbar",
      "aria-label": labels.linkToolbar,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "button",
          {
            type: "button",
            className: "re-link-floating-btn",
            "aria-label": labels.linkEdit,
            title: labels.linkEdit,
            onMouseDown: (event) => {
              event.preventDefault();
              onEdit();
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(IconEdit, {})
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "button",
          {
            type: "button",
            className: "re-link-floating-btn re-link-floating-btn-danger",
            "aria-label": labels.linkRemove,
            title: labels.linkRemove,
            onMouseDown: (event) => {
              event.preventDefault();
              onRemove();
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(IconTrash, {})
          }
        )
      ]
    }
  );
}
function LinkUiPlugin({
  labels,
  containerRef,
  enabled = true,
  children
}) {
  if (!enabled) {
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_jsx_runtime9.Fragment, { children });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(LinkUiPluginInner, { labels, containerRef, children });
}
function LinkUiPluginInner({
  labels,
  containerRef,
  children
}) {
  const [editor] = (0, import_LexicalComposerContext12.useLexicalComposerContext)();
  const [modal, setModal] = (0, import_react14.useState)(null);
  const [toolbar, setToolbar] = (0, import_react14.useState)(null);
  const closeModal = (0, import_react14.useCallback)(() => setModal(null), []);
  const hideToolbar = (0, import_react14.useCallback)(() => setToolbar(null), []);
  const openLinkDialog = (0, import_react14.useCallback)(() => {
    editor.getEditorState().read(() => {
      const selection = (0, import_lexical21.$getSelection)();
      if (!(0, import_lexical21.$isRangeSelection)(selection)) return;
      const existing = (0, import_utils6.$findMatchingParent)(selection.anchor.getNode(), import_link3.$isLinkNode);
      if (existing) {
        setModal({
          mode: "edit",
          text: existing.getTextContent(),
          url: existing.getURL(),
          linkKey: existing.getKey()
        });
        hideToolbar();
        return;
      }
      setModal({
        mode: "create",
        text: selection.getTextContent(),
        url: "https://"
      });
      hideToolbar();
    });
  }, [editor, hideToolbar]);
  const openEditForLinkKey = (0, import_react14.useCallback)(
    (linkKey) => {
      editor.getEditorState().read(() => {
        const link = (0, import_lexical21.$getNodeByKey)(linkKey);
        if (!(0, import_link3.$isLinkNode)(link)) return;
        setModal({
          mode: "edit",
          text: link.getTextContent(),
          url: link.getURL(),
          linkKey: link.getKey()
        });
        hideToolbar();
      });
    },
    [editor, hideToolbar]
  );
  const handleSaveModal = (0, import_react14.useCallback)(
    (text, url, linkKey) => {
      editor.update(() => {
        $applyLinkForm({ text, url }, linkKey);
      });
      closeModal();
      editor.focus();
    },
    [closeModal, editor]
  );
  const removeLink = (0, import_react14.useCallback)(
    (linkKey) => {
      editor.update(() => {
        $removeLinkByKey(linkKey);
      });
      hideToolbar();
    },
    [editor, hideToolbar]
  );
  (0, import_react14.useEffect)(() => {
    const removeClick = editor.registerCommand(
      import_lexical21.CLICK_COMMAND,
      (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return false;
        const anchor = target.closest("a.re-link");
        if (!anchor || !containerRef.current?.contains(anchor)) return false;
        event.preventDefault();
        const node = (0, import_lexical21.$getNearestNodeFromDOMNode)(anchor);
        const link = node ? (0, import_utils6.$findMatchingParent)(node, import_link3.$isLinkNode) : null;
        if (!link) return true;
        const rect = anchor.getBoundingClientRect();
        const host = containerRef.current.getBoundingClientRect();
        const toolbarHeight = 36;
        const gap = 6;
        const spaceAbove = rect.top - host.top;
        const showBelow = spaceAbove < toolbarHeight + gap;
        setToolbar({
          linkKey: link.getKey(),
          top: showBelow ? rect.bottom - host.top + gap : rect.top - host.top - toolbarHeight - gap,
          left: rect.left - host.left + rect.width / 2
        });
        setModal(null);
        return true;
      },
      import_lexical21.COMMAND_PRIORITY_HIGH
    );
    const onDocumentMouseDown = (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.closest(".re-link-floating-toolbar")) return;
      if (target.closest(".re-link-modal")) return;
      if (target.closest("a.re-link")) return;
      hideToolbar();
    };
    document.addEventListener("mousedown", onDocumentMouseDown);
    return () => {
      removeClick();
      document.removeEventListener("mousedown", onDocumentMouseDown);
    };
  }, [containerRef, editor, hideToolbar]);
  (0, import_react14.useEffect)(() => {
    if (!toolbar) return;
    const update = () => {
      editor.getEditorState().read(() => {
        const link = (0, import_lexical21.$getNodeByKey)(toolbar.linkKey);
        if (!(0, import_link3.$isLinkNode)(link)) {
          hideToolbar();
          return;
        }
        const element = editor.getElementByKey(link.getKey());
        const container = containerRef.current;
        if (!element || !container) {
          hideToolbar();
          return;
        }
        const rect = element.getBoundingClientRect();
        const host = container.getBoundingClientRect();
        const toolbarHeight = 36;
        const gap = 6;
        setToolbar(
          (current) => current ? {
            ...current,
            top: rect.top - host.top - toolbarHeight - gap,
            left: rect.left - host.left + rect.width / 2
          } : null
        );
      });
    };
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [containerRef, editor, hideToolbar, toolbar]);
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(LinkUiProvider, { openLinkDialog, children: [
    children,
    toolbar && containerRef.current && (0, import_react_dom4.createPortal)(
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
        LinkFloatingToolbar,
        {
          position: toolbar,
          labels,
          onEdit: () => openEditForLinkKey(toolbar.linkKey),
          onRemove: () => removeLink(toolbar.linkKey)
        }
      ),
      containerRef.current
    ),
    modal && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
      LinkModal,
      {
        state: modal,
        labels,
        onClose: closeModal,
        onSave: handleSaveModal
      }
    )
  ] });
}

// src/components/plugins/SpoilerPlugin.tsx
var import_react15 = require("react");
var import_LexicalComposerContext13 = require("@lexical/react/LexicalComposerContext");
var import_utils7 = require("@lexical/utils");
var import_lexical22 = require("lexical");
function SpoilerPlugin() {
  const [editor] = (0, import_LexicalComposerContext13.useLexicalComposerContext)();
  const editingRef = (0, import_react15.useRef)(null);
  (0, import_react15.useEffect)(() => {
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
        const selection = (0, import_lexical22.$getSelection)();
        if (!(0, import_lexical22.$isRangeSelection)(selection)) return;
        const spoiler = (0, import_utils7.$findMatchingParent)(
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

// src/components/plugins/AttachmentsPlugin.tsx
var import_LexicalComposerContext14 = require("@lexical/react/LexicalComposerContext");
var import_lexical23 = require("lexical");
var import_react16 = require("react");
function syncUploadedImages(editor, attachments) {
  editor.update(() => {
    const imageNodes = (0, import_lexical23.$nodesOfType)(ImageNode);
    for (const attachment of attachments) {
      if (attachment.status !== "ready" || !attachment.id || !attachment.url) {
        continue;
      }
      for (const node of imageNodes) {
        if (node.getFileId() !== attachment.localId) continue;
        node.setSrc(attachment.url);
        node.setFileId(attachment.id);
      }
    }
  });
}
function AttachmentsPlugin({
  disabled,
  attachments,
  addFiles,
  containerRef,
  insertInlineOnDrop = true
}) {
  const [editor] = (0, import_LexicalComposerContext14.useLexicalComposerContext)();
  const dragDepthRef = (0, import_react16.useRef)(0);
  (0, import_react16.useEffect)(() => {
    if (disabled) return;
    syncUploadedImages(editor, attachments);
  }, [attachments, disabled, editor]);
  (0, import_react16.useEffect)(() => {
    if (disabled) return;
    return editor.registerCommand(
      import_lexical23.PASTE_COMMAND,
      (event) => {
        if (!(event instanceof ClipboardEvent)) return false;
        const files = collectFilesFromClipboard(event.clipboardData);
        if (files.length === 0) return false;
        event.preventDefault();
        const added = addFiles(files);
        const imageAttachment = added.find((item) => isImageMime(item.mimeType));
        if (imageAttachment) {
          void insertImageAtSelection(editor, imageAttachment);
        }
        return true;
      },
      import_lexical23.COMMAND_PRIORITY_HIGH
    );
  }, [addFiles, disabled, editor]);
  (0, import_react16.useEffect)(() => {
    const container = containerRef.current;
    if (!container || disabled) return;
    const setDragOver = (active) => {
      container.classList.toggle("re-editor-drag-over", active);
    };
    const onDragEnter = (event) => {
      if (!event.dataTransfer?.types.includes("Files")) return;
      event.preventDefault();
      dragDepthRef.current += 1;
      setDragOver(true);
    };
    const onDragLeave = (event) => {
      if (!event.dataTransfer?.types.includes("Files")) return;
      dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
      if (dragDepthRef.current === 0) setDragOver(false);
    };
    const onDragOver = (event) => {
      if (!event.dataTransfer?.types.includes("Files")) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    };
    const onDrop = (event) => {
      const files = collectFilesFromDataTransfer(event.dataTransfer);
      if (files.length === 0) return;
      event.preventDefault();
      dragDepthRef.current = 0;
      setDragOver(false);
      const added = addFiles(files);
      if (!insertInlineOnDrop) return;
      const imageAttachment = added.find(
        (item) => getFileKind(item.mimeType) === "image"
      );
      if (imageAttachment) {
        void insertImageAtSelection(editor, imageAttachment);
      }
    };
    container.addEventListener("dragenter", onDragEnter);
    container.addEventListener("dragleave", onDragLeave);
    container.addEventListener("dragover", onDragOver);
    container.addEventListener("drop", onDrop);
    return () => {
      container.removeEventListener("dragenter", onDragEnter);
      container.removeEventListener("dragleave", onDragLeave);
      container.removeEventListener("dragover", onDragOver);
      container.removeEventListener("drop", onDrop);
      setDragOver(false);
    };
  }, [addFiles, containerRef, disabled, editor, insertInlineOnDrop]);
  return null;
}
async function handleInsertAttachment(editor, attachments, localId) {
  const attachment = attachments.find((item) => item.localId === localId);
  if (!attachment) return;
  await insertAttachmentAtSelection(editor, attachment);
}

// src/components/plugins/index.tsx
function InitialHtmlPlugin({ html }) {
  const [editor] = (0, import_LexicalComposerContext15.useLexicalComposerContext)();
  const lastApplied = (0, import_react17.useRef)(void 0);
  (0, import_react17.useEffect)(() => {
    if (html === lastApplied.current) return;
    editor.update(() => {
      const root = (0, import_lexical24.$getRoot)();
      root.clear();
      if (!html?.trim()) {
        const paragraph = (0, import_lexical24.$createParagraphNode)();
        root.append(paragraph);
        paragraph.select();
        $clearStickyTextFormats();
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
  const [editor] = (0, import_LexicalComposerContext15.useLexicalComposerContext)();
  (0, import_react17.useEffect)(() => {
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
  const [editor] = (0, import_LexicalComposerContext15.useLexicalComposerContext)();
  (0, import_react17.useEffect)(() => {
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
  const [editor] = (0, import_LexicalComposerContext15.useLexicalComposerContext)();
  (0, import_react17.useEffect)(() => {
    setHtmlRef.current = (html) => {
      editor.update(() => {
        const root = (0, import_lexical24.$getRoot)();
        root.clear();
        if (!html.trim()) {
          const paragraph = (0, import_lexical24.$createParagraphNode)();
          root.append(paragraph);
          paragraph.select();
          $clearStickyTextFormats();
          return;
        }
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
  clearRef,
  resetFormatsRef
}) {
  const [editor] = (0, import_LexicalComposerContext15.useLexicalComposerContext)();
  (0, import_react17.useEffect)(() => {
    const resetFormats = () => {
      editor.update(() => {
        $clearStickyTextFormats();
      });
    };
    clearRef.current = () => {
      editor.update(() => {
        const root = (0, import_lexical24.$getRoot)();
        root.clear();
        const paragraph = (0, import_lexical24.$createParagraphNode)();
        root.append(paragraph);
        paragraph.select();
        $clearStickyTextFormats();
      });
      editor.focus();
    };
    if (resetFormatsRef) {
      resetFormatsRef.current = resetFormats;
    }
    return () => {
      clearRef.current = null;
      if (resetFormatsRef) {
        resetFormatsRef.current = null;
      }
    };
  }, [editor, clearRef, resetFormatsRef]);
  return null;
}
function EmptyStatePlugin({
  onEmptyChange
}) {
  const [editor] = (0, import_LexicalComposerContext15.useLexicalComposerContext)();
  (0, import_react17.useEffect)(() => {
    const update = () => {
      editor.getEditorState().read(() => {
        onEmptyChange((0, import_lexical24.$getRoot)().getTextContent().trim() === "");
      });
    };
    update();
    return editor.registerUpdateListener(() => update());
  }, [editor, onEmptyChange]);
  return null;
}

// src/components/attachments/AttachmentsBridge.tsx
var import_LexicalComposerContext16 = require("@lexical/react/LexicalComposerContext");

// src/components/attachments/AttachmentStrip.tsx
var import_react18 = require("react");

// src/components/attachments/AttachmentThumb.tsx
var import_jsx_runtime10 = require("react/jsx-runtime");
function getPayloadPreviewUrl(file) {
  return file.thumbnailUrl ?? file.url;
}
function getEditorAttachmentPreviewUrl(attachment) {
  return attachment.thumbnailUrl ?? attachment.previewUrl ?? attachment.url ?? "";
}
function AttachmentThumb({
  name,
  mimeType,
  previewUrl
}) {
  const kind = getFileKind(mimeType);
  if (kind === "image" && previewUrl) {
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
      "img",
      {
        className: "re-attachment-thumb",
        src: previewUrl,
        alt: "",
        draggable: false,
        loading: "lazy"
      }
    );
  }
  if (kind === "video" && previewUrl) {
    return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
      "video",
      {
        className: "re-attachment-thumb re-attachment-thumb-video",
        src: previewUrl,
        muted: true,
        playsInline: true,
        preload: "metadata"
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("span", { className: "re-attachment-file-icon", "aria-hidden": "true", children: getFileExtension(name) || "FILE" });
}

// src/components/attachments/AttachmentStrip.tsx
var import_jsx_runtime11 = require("react/jsx-runtime");
function useAttachmentUploads({
  onUploadFile,
  disabled
}) {
  const [attachments, setAttachments] = (0, import_react18.useState)([]);
  const abortControllers = (0, import_react18.useRef)(/* @__PURE__ */ new Map());
  const uploadSingle = (0, import_react18.useCallback)(
    async (file, localId) => {
      const controller = new AbortController();
      abortControllers.current.set(localId, controller);
      try {
        const uploaded = await onUploadFile(file, {
          signal: controller.signal,
          onProgress: (progress) => {
            setAttachments(
              (current) => current.map(
                (item) => item.localId === localId ? { ...item, progress } : item
              )
            );
          }
        });
        setAttachments(
          (current) => current.map(
            (item) => item.localId === localId ? {
              ...item,
              id: uploaded.id,
              name: uploaded.name,
              mimeType: uploaded.mimeType,
              size: uploaded.size,
              url: uploaded.url,
              thumbnailUrl: uploaded.thumbnailUrl,
              status: "ready",
              progress: 100,
              error: void 0
            } : item
          )
        );
      } catch (error) {
        if (controller.signal.aborted) return;
        setAttachments(
          (current) => current.map(
            (item) => item.localId === localId ? {
              ...item,
              status: "error",
              error: error instanceof Error ? error.message : "Upload failed"
            } : item
          )
        );
      } finally {
        abortControllers.current.delete(localId);
      }
    },
    [onUploadFile]
  );
  const addFiles = (0, import_react18.useCallback)(
    (files) => {
      if (disabled || files.length === 0) return [];
      const nextItems = files.map((file) => {
        const localId = createLocalId();
        const previewUrl = URL.createObjectURL(file);
        return {
          localId,
          name: file.name,
          mimeType: file.type || "application/octet-stream",
          size: file.size,
          previewUrl,
          status: "uploading",
          progress: 0
        };
      });
      setAttachments((current) => [...current, ...nextItems]);
      nextItems.forEach((item, index) => {
        void uploadSingle(files[index], item.localId);
      });
      return nextItems;
    },
    [disabled, uploadSingle]
  );
  const removeAttachment = (0, import_react18.useCallback)((localId) => {
    const controller = abortControllers.current.get(localId);
    controller?.abort();
    abortControllers.current.delete(localId);
    setAttachments((current) => {
      const target = current.find((item) => item.localId === localId);
      if (target?.previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return current.filter((item) => item.localId !== localId);
    });
  }, []);
  const clearAttachments = (0, import_react18.useCallback)(() => {
    abortControllers.current.forEach((controller) => controller.abort());
    abortControllers.current.clear();
    setAttachments((current) => {
      for (const item of current) {
        if (item.previewUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(item.previewUrl);
        }
      }
      return [];
    });
  }, []);
  const hasReadyAttachments = attachments.some(
    (item) => item.status === "ready" && !!item.id
  );
  const hasUploadingAttachments = attachments.some(
    (item) => item.status === "uploading"
  );
  return {
    attachments,
    addFiles,
    removeAttachment,
    clearAttachments,
    hasReadyAttachments,
    hasUploadingAttachments
  };
}
function AttachmentPreview({
  attachment
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    AttachmentThumb,
    {
      name: attachment.name,
      mimeType: attachment.mimeType,
      previewUrl: getEditorAttachmentPreviewUrl(attachment)
    }
  );
}
function AttachmentStrip({
  attachments,
  labels,
  disabled,
  onRemove,
  onInsert
}) {
  if (attachments.length === 0) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "re-attachments", "aria-label": labels.attachments, children: attachments.map((attachment) => {
    const canInsert = attachment.status === "ready";
    return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
      "div",
      {
        className: `re-attachment-item re-attachment-item-${attachment.status}`,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(
            "button",
            {
              type: "button",
              className: "re-attachment-main",
              disabled: disabled || !canInsert,
              title: canInsert ? labels.insertAttachment : attachment.error,
              onClick: () => onInsert(attachment.localId),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(AttachmentPreview, { attachment }),
                /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("span", { className: "re-attachment-meta", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "re-attachment-name", children: attachment.name }),
                  /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "re-attachment-sub", children: attachment.status === "uploading" ? `${labels.uploading} ${attachment.progress ?? 0}%` : attachment.status === "error" ? attachment.error ?? labels.uploadFailed : formatFileSize(attachment.size) })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
            "button",
            {
              type: "button",
              className: "re-attachment-remove",
              "aria-label": labels.removeAttachment,
              title: labels.removeAttachment,
              disabled,
              onClick: () => onRemove(attachment.localId),
              children: "\xD7"
            }
          )
        ]
      },
      attachment.localId
    );
  }) });
}
function AttachmentUploadButton({
  labels,
  disabled,
  multiple = true,
  accept,
  onFilesSelected
}) {
  const inputRef = (0, import_react18.useRef)(null);
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)(import_jsx_runtime11.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
      "button",
      {
        type: "button",
        className: "re-toolbar-btn",
        "aria-label": labels.attachFile,
        title: labels.attachFile,
        disabled,
        onClick: () => inputRef.current?.click(),
        children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          "path",
          {
            d: "M21.44 11.05l-8.49 8.49a5.5 5.5 0 0 1-7.78-7.78l9.19-9.19a3.5 3.5 0 0 1 4.95 4.95l-9.2 9.19a1.5 1.5 0 1 1-2.12-2.12l8.49-8.48",
            stroke: "currentColor",
            strokeWidth: "1.8",
            strokeLinecap: "round",
            strokeLinejoin: "round"
          }
        ) })
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
      "input",
      {
        ref: inputRef,
        type: "file",
        className: "sr-only",
        multiple,
        accept,
        onChange: (event) => {
          const files = Array.from(event.target.files ?? []);
          if (files.length > 0) onFilesSelected(files);
          event.target.value = "";
        }
      }
    )
  ] });
}

// src/components/attachments/AttachmentsBridge.tsx
var import_jsx_runtime12 = require("react/jsx-runtime");
function AttachmentsBridge({
  attachments,
  labels,
  disabled,
  onRemove
}) {
  const [editor] = (0, import_LexicalComposerContext16.useLexicalComposerContext)();
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
    AttachmentStrip,
    {
      attachments,
      labels,
      disabled,
      onRemove,
      onInsert: (localId) => {
        void handleInsertAttachment(editor, attachments, localId);
      }
    }
  );
}

// src/components/toolbar/EditorToolbar.tsx
var import_react19 = require("react");

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
    id: "format.underline",
    keys: "Ctrl+U",
    ariaKeyshortcuts: "Control+u",
    action: "Underline"
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
  { pattern: "++text++", action: "Underline" },
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
      case "format.underline":
        return features.underline;
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
var import_jsx_runtime13 = require("react/jsx-runtime");
function ToolbarButton({
  label,
  active,
  onClick,
  shortcutId,
  children
}) {
  const shortcut = shortcutId ? shortcutById(shortcutId) : void 0;
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
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
  showMentionButton,
  showAttachButton,
  onAttachFiles,
  acceptFiles
}) {
  const active = useFormatState();
  const format = useFormatActions();
  const [menuOpen, setMenuOpen] = (0, import_react19.useState)(false);
  const menuId = (0, import_react19.useId)();
  const hasMenu = !!slots.toolbarMenu;
  (0, import_react19.useEffect)(() => {
    if (!menuOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
    "div",
    {
      className: "re-toolbar",
      role: "toolbar",
      "aria-label": labels.toolbar,
      "aria-controls": editorInputId,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "re-toolbar-group re-toolbar-group-main", children: [
          slots.toolbarStart,
          features.bold && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            ToolbarButton,
            {
              label: labels.bold,
              active: active.bold,
              onClick: format.bold,
              shortcutId: "format.bold",
              children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(IconBold, {})
            }
          ),
          features.italic && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            ToolbarButton,
            {
              label: labels.italic,
              active: active.italic,
              onClick: format.italic,
              shortcutId: "format.italic",
              children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(IconItalic, {})
            }
          ),
          features.underline && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            ToolbarButton,
            {
              label: labels.underline,
              active: active.underline,
              onClick: format.underline,
              shortcutId: "format.underline",
              children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(IconUnderline, {})
            }
          ),
          features.strikethrough && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            ToolbarButton,
            {
              label: labels.strikethrough,
              active: active.strikethrough,
              onClick: format.strikethrough,
              shortcutId: "format.strikethrough",
              children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(IconStrikethrough, {})
            }
          ),
          features.code && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            ToolbarButton,
            {
              label: labels.code,
              active: active.code,
              onClick: format.code,
              shortcutId: "format.code",
              children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(IconCode, {})
            }
          ),
          features.spoiler && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            ToolbarButton,
            {
              label: labels.spoiler,
              active: active.spoiler,
              onClick: format.spoiler,
              children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(IconSpoiler, {})
            }
          ),
          features.quote && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            ToolbarButton,
            {
              label: labels.quote,
              active: active.quote,
              onClick: format.quote,
              children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(IconQuote, {})
            }
          ),
          features.codeBlock && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            ToolbarButton,
            {
              label: labels.codeBlock,
              active: active.codeBlock,
              onClick: format.codeBlock,
              children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(IconCodeBlock, {})
            }
          ),
          features.lists && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(import_jsx_runtime13.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
              ToolbarButton,
              {
                label: labels.bulletList,
                active: active.bulletList,
                onClick: format.bulletList,
                children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(IconBulletList, {})
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
              ToolbarButton,
              {
                label: labels.numberedList,
                active: active.numberedList,
                onClick: format.numberedList,
                children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(IconNumberedList, {})
              }
            )
          ] }),
          features.links && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            ToolbarButton,
            {
              label: labels.link,
              active: active.link,
              onClick: format.link,
              children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(IconLink, {})
            }
          ),
          features.headings && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            ToolbarButton,
            {
              label: labels.heading,
              active: active.heading,
              onClick: format.heading,
              children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(IconHeading, {})
            }
          ),
          showMentionButton && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(ToolbarButton, { label: labels.mention, onClick: format.mentionTrigger, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(IconMention, {}) }),
          showAttachButton && onAttachFiles && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            AttachmentUploadButton,
            {
              labels,
              accept: acceptFiles,
              onFilesSelected: onAttachFiles
            }
          )
        ] }),
        (slots.toolbarEnd || hasMenu) && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "re-toolbar-group", style: { position: "relative" }, children: [
          slots.toolbarEnd,
          hasMenu && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(import_jsx_runtime13.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
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
            menuOpen && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(import_jsx_runtime13.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                "div",
                {
                  className: "re-toolbar-menu-backdrop",
                  onClick: () => setMenuOpen(false),
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
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
var import_react20 = require("react");
function createSlot(name) {
  const Slot = ({ children }) => null;
  Slot.slotName = name;
  Slot.displayName = `RichTextEditor.${name}`;
  return Slot;
}
function isSlotComponent(child) {
  return (0, import_react20.isValidElement)(child) && typeof child.type === "function" && "slotName" in child.type && typeof child.type.slotName === "string";
}
function collectSlots(children) {
  const slots = {};
  import_react20.Children.forEach(children, (child) => {
    if (!isSlotComponent(child)) return;
    const name = child.type.slotName;
    slots[name] = child.props.children;
  });
  return slots;
}
function hasToolbar(features, slots) {
  return features.bold || features.italic || features.underline || features.strikethrough || features.code || features.quote || features.codeBlock || features.lists || features.links || features.headings || features.spoiler || features.mentions || features.attachments || !!slots.toolbarStart || !!slots.toolbarEnd || !!slots.toolbarMenu;
}

// src/components/RichTextEditor.tsx
var import_jsx_runtime14 = require("react/jsx-runtime");
function onError(error) {
  console.error(error);
}
function exportEditorHtml(editor, options) {
  let html = "";
  editor.getEditorState().read(() => {
    html = (0, import_html5.$generateHtmlFromNodes)(editor, null);
  });
  html = normalizeHtml(html.trim());
  if (options?.useTrim) {
    html = trimEditorHtml(html);
  }
  return html;
}
function EditorRefPlugin({
  getHtmlRef,
  useTrim
}) {
  const [editor] = (0, import_LexicalComposerContext17.useLexicalComposerContext)();
  (0, import_react21.useEffect)(() => {
    getHtmlRef.current = () => exportEditorHtml(editor, { useTrim });
    return () => {
      getHtmlRef.current = null;
    };
  }, [editor, getHtmlRef, useTrim]);
  return null;
}
function DefaultSubmitButton({
  disabled,
  onSubmit,
  label,
  show
}) {
  if (!show) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    "button",
    {
      type: "button",
      onClick: onSubmit,
      disabled,
      className: "re-submit-btn",
      "aria-label": label,
      title: label,
      children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("path", { d: "M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" }) })
    }
  );
}
function SubmitArea({
  slots,
  disabled,
  sending,
  onSubmit,
  label,
  showDefault,
  showSubmit
}) {
  if (slots.submitButton !== void 0) {
    return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(import_jsx_runtime14.Fragment, { children: slots.submitButton });
  }
  if (!showDefault) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    DefaultSubmitButton,
    {
      disabled: disabled || sending,
      onSubmit,
      label,
      show: showSubmit
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
  attachments,
  hasReadyAttachments,
  children
}) {
  const formatState = useFormatState();
  const format = useFormatActions();
  const ctx = (0, import_react21.useMemo)(
    () => ({
      getHtml: () => getHtmlRef.current?.() ?? "",
      setHtml: (html) => setHtmlRef.current?.(html),
      clear: () => clearRef.current?.(),
      focus: () => focusRef.current?.(),
      submit: onSubmit,
      isEmpty,
      attachments,
      hasReadyAttachments,
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
      hasReadyAttachments,
      isEmpty,
      labels,
      attachments,
      setHtmlRef,
      onSubmit
    ]
  );
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(RichTextEditorProvider, { value: ctx, children });
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
  codeLanguages,
  useTrim = false,
  className,
  theme = defaultEditorTheme,
  minRows = 1,
  maxRows = 8,
  mentionSearch,
  onUploadFile,
  acceptFiles,
  children
}, ref) {
  const features = (0, import_react21.useMemo)(() => resolveFeatures(featuresProp), [featuresProp]);
  const labels = (0, import_react21.useMemo)(() => resolveLabels(labelsProp), [labelsProp]);
  const slots = (0, import_react21.useMemo)(() => collectSlots(children), [children]);
  const rootId = (0, import_react21.useId)();
  const editorInputId = `${rootId}-input`;
  const placeholderId = `${rootId}-placeholder`;
  const rootRef = (0, import_react21.useRef)(null);
  const bodyRef = (0, import_react21.useRef)(null);
  const getHtmlRef = (0, import_react21.useRef)(null);
  const setHtmlRef = (0, import_react21.useRef)(null);
  const clearRef = (0, import_react21.useRef)(null);
  const resetFormatsRef = (0, import_react21.useRef)(null);
  const focusRef = (0, import_react21.useRef)(null);
  const [isEmpty, setIsEmpty] = (0, import_react21.useState)(true);
  const [sending, setSending] = (0, import_react21.useState)(false);
  const attachmentsEnabled = features.attachments && !!onUploadFile;
  const uploads = useAttachmentUploads({
    onUploadFile: onUploadFile ?? (async () => {
      throw new Error("onUploadFile is required when attachments feature is enabled");
    }),
    disabled: disabled || !attachmentsEnabled
  });
  const inputStyle = (0, import_react21.useMemo)(
    () => ({
      minHeight: `${minRows * EDITOR_LINE_HEIGHT_PX}px`,
      maxHeight: `${maxRows * EDITOR_LINE_HEIGHT_PX}px`
    }),
    [minRows, maxRows]
  );
  const enterBindings = (0, import_react21.useMemo)(
    () => resolveEnterKeyBindings({ enterBehavior, enterKeyBindings }),
    [enterBehavior, enterKeyBindings]
  );
  const initialConfig = (0, import_react21.useMemo)(
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
        import_code6.CodeNode,
        import_code6.CodeHighlightNode,
        import_link4.LinkNode,
        import_link4.AutoLinkNode,
        ...features.mentions ? [MentionNode] : [],
        ...features.spoiler ? [SpoilerNode] : [],
        ...attachmentsEnabled ? [ImageNode, FileLinkNode] : []
      ]
    }),
    [attachmentsEnabled, disabled, features.mentions, features.quote, features.spoiler]
  );
  const transformers = (0, import_react21.useMemo)(
    () => features.markdownShortcuts ? buildMarkdownTransformers(features) : [],
    [features]
  );
  const getHtml = (0, import_react21.useCallback)(() => getHtmlRef.current?.() ?? "", []);
  const submit = (0, import_react21.useCallback)(async () => {
    if (disabled || sending || !onSubmit) return;
    const html = getHtml();
    const attachmentPayloads = getReadyAttachmentPayloads(uploads.attachments);
    if (!html && attachmentPayloads.length === 0) return;
    if (uploads.hasUploadingAttachments) return;
    setSending(true);
    try {
      await onSubmit({ html, attachments: attachmentPayloads });
      if (clearOnSubmit) {
        clearRef.current?.();
        uploads.clearAttachments();
      } else {
        resetFormatsRef.current?.();
      }
    } finally {
      setSending(false);
    }
  }, [
    clearOnSubmit,
    disabled,
    getHtml,
    onSubmit,
    sending,
    uploads
  ]);
  const canSubmit = !isEmpty || uploads.hasReadyAttachments;
  (0, import_react21.useImperativeHandle)(
    ref,
    () => ({
      getHtml,
      setHtml: (html) => setHtmlRef.current?.(html),
      clear: () => {
        clearRef.current?.();
        uploads.clearAttachments();
      },
      focus: () => focusRef.current?.(),
      isEmpty: () => isEmpty,
      getAttachments: () => uploads.attachments
    }),
    [getHtml, isEmpty, uploads]
  );
  const showToolbar = hasToolbar(features, slots);
  const showDefaultSubmit = !!onSubmit && slots.submitButton === void 0;
  const bodyHasSubmitPadding = slots.submitButton !== void 0 || showDefaultSubmit && canSubmit;
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(import_LexicalComposer.LexicalComposer, { initialConfig, children: [
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(EditorRefPlugin, { getHtmlRef, useTrim }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(SetHtmlPlugin, { setHtmlRef }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(ClearPlugin, { clearRef, resetFormatsRef }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(FocusPlugin, { focusRef }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(EmptyStatePlugin, { onEmptyChange: setIsEmpty }),
    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(LinkUiPlugin, { labels, containerRef: bodyRef, enabled: features.links, children: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
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
        attachments: uploads.attachments,
        hasReadyAttachments: uploads.hasReadyAttachments,
        onSubmit: () => void submit(),
        children: /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
          "div",
          {
            ref: rootRef,
            id: rootId,
            ...themeDataAttribute(theme),
            className: cn("re-editor-root", className),
            children: [
              showToolbar && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                EditorToolbar,
                {
                  features,
                  labels,
                  slots,
                  editorInputId,
                  showMentionButton: features.mentions && !!mentionSearch,
                  showAttachButton: attachmentsEnabled,
                  onAttachFiles: uploads.addFiles,
                  acceptFiles
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                BlurCapturePlugin,
                {
                  rootRef,
                  onBlur,
                  getHtml
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(
                "div",
                {
                  ref: bodyRef,
                  className: cn(
                    "re-editor-body",
                    bodyHasSubmitPadding && "re-editor-body-has-submit"
                  ),
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(BlockBehaviorPlugin, {}),
                    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(LineBreakPlugin, {}),
                    features.spoiler && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(SpoilerPlugin, {}),
                    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(InitialHtmlPlugin, { html: value }),
                    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                      import_LexicalRichTextPlugin.RichTextPlugin,
                      {
                        contentEditable: /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
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
                        placeholder: placeholder ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { id: placeholderId, className: "re-editor-placeholder", "aria-hidden": "true", children: placeholder }) : null,
                        ErrorBoundary: import_LexicalErrorBoundary.LexicalErrorBoundary
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(import_LexicalHistoryPlugin.HistoryPlugin, {}),
                    features.lists && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(import_LexicalListPlugin.ListPlugin, {}),
                    features.links && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(import_LexicalLinkPlugin.LinkPlugin, {}),
                    features.codeBlock && /* @__PURE__ */ (0, import_jsx_runtime14.jsxs)(import_jsx_runtime14.Fragment, { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(CodeHighlightPlugin, { enabled: !disabled }),
                      /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                        CodeLanguagePlugin,
                        {
                          labels,
                          containerRef: bodyRef,
                          codeLanguages
                        }
                      )
                    ] }),
                    transformers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(import_LexicalMarkdownShortcutPlugin.MarkdownShortcutPlugin, { transformers }),
                    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(MarkdownPastePlugin, { features }),
                    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(KeyboardShortcutsPlugin, { features, disabled }),
                    features.mentions && mentionSearch && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(MentionsPlugin, { searchMentions: mentionSearch }),
                    attachmentsEnabled && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                      AttachmentsPlugin,
                      {
                        disabled,
                        attachments: uploads.attachments,
                        addFiles: uploads.addFiles,
                        containerRef: bodyRef
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                      EnterPlugin,
                      {
                        bindings: enterBindings,
                        onSubmit: onSubmit ? () => void submit() : void 0
                      }
                    ),
                    features.selectionMenu && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                      SelectionMenuPlugin,
                      {
                        features,
                        labels,
                        items: selectionMenuItems,
                        containerRef: bodyRef
                      }
                    ),
                    attachmentsEnabled && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                      AttachmentsBridge,
                      {
                        attachments: uploads.attachments,
                        labels,
                        disabled,
                        onRemove: uploads.removeAttachment
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
                      SubmitArea,
                      {
                        slots,
                        disabled,
                        sending,
                        onSubmit: () => void submit(),
                        label: labels.submit,
                        showDefault: showDefaultSubmit,
                        showSubmit: canSubmit
                      }
                    )
                  ]
                }
              ),
              slots.footer && /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "re-footer", children: slots.footer })
            ]
          }
        )
      }
    ) })
  ] });
}
var RichTextEditorBase = (0, import_react21.forwardRef)(RichTextEditorInner);
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
var import_react22 = require("react");

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

// src/core/hljsLanguageLoaders.ts
var HLJS_LANGUAGE_LOADERS = {
  "1c": () => import("highlight.js/lib/languages/1c"),
  "abnf": () => import("highlight.js/lib/languages/abnf"),
  "accesslog": () => import("highlight.js/lib/languages/accesslog"),
  "actionscript": () => import("highlight.js/lib/languages/actionscript"),
  "ada": () => import("highlight.js/lib/languages/ada"),
  "angelscript": () => import("highlight.js/lib/languages/angelscript"),
  "apache": () => import("highlight.js/lib/languages/apache"),
  "applescript": () => import("highlight.js/lib/languages/applescript"),
  "arcade": () => import("highlight.js/lib/languages/arcade"),
  "arduino": () => import("highlight.js/lib/languages/arduino"),
  "armasm": () => import("highlight.js/lib/languages/armasm"),
  "asciidoc": () => import("highlight.js/lib/languages/asciidoc"),
  "aspectj": () => import("highlight.js/lib/languages/aspectj"),
  "autohotkey": () => import("highlight.js/lib/languages/autohotkey"),
  "autoit": () => import("highlight.js/lib/languages/autoit"),
  "avrasm": () => import("highlight.js/lib/languages/avrasm"),
  "awk": () => import("highlight.js/lib/languages/awk"),
  "axapta": () => import("highlight.js/lib/languages/axapta"),
  "bash": () => import("highlight.js/lib/languages/bash"),
  "basic": () => import("highlight.js/lib/languages/basic"),
  "bnf": () => import("highlight.js/lib/languages/bnf"),
  "brainfuck": () => import("highlight.js/lib/languages/brainfuck"),
  "c": () => import("highlight.js/lib/languages/c"),
  "cal": () => import("highlight.js/lib/languages/cal"),
  "capnproto": () => import("highlight.js/lib/languages/capnproto"),
  "ceylon": () => import("highlight.js/lib/languages/ceylon"),
  "clean": () => import("highlight.js/lib/languages/clean"),
  "clojure": () => import("highlight.js/lib/languages/clojure"),
  "clojure-repl": () => import("highlight.js/lib/languages/clojure-repl"),
  "cmake": () => import("highlight.js/lib/languages/cmake"),
  "coffeescript": () => import("highlight.js/lib/languages/coffeescript"),
  "coq": () => import("highlight.js/lib/languages/coq"),
  "cos": () => import("highlight.js/lib/languages/cos"),
  "cpp": () => import("highlight.js/lib/languages/cpp"),
  "crmsh": () => import("highlight.js/lib/languages/crmsh"),
  "crystal": () => import("highlight.js/lib/languages/crystal"),
  "csharp": () => import("highlight.js/lib/languages/csharp"),
  "csp": () => import("highlight.js/lib/languages/csp"),
  "css": () => import("highlight.js/lib/languages/css"),
  "d": () => import("highlight.js/lib/languages/d"),
  "dart": () => import("highlight.js/lib/languages/dart"),
  "delphi": () => import("highlight.js/lib/languages/delphi"),
  "diff": () => import("highlight.js/lib/languages/diff"),
  "django": () => import("highlight.js/lib/languages/django"),
  "dns": () => import("highlight.js/lib/languages/dns"),
  "dockerfile": () => import("highlight.js/lib/languages/dockerfile"),
  "dos": () => import("highlight.js/lib/languages/dos"),
  "dsconfig": () => import("highlight.js/lib/languages/dsconfig"),
  "dts": () => import("highlight.js/lib/languages/dts"),
  "dust": () => import("highlight.js/lib/languages/dust"),
  "ebnf": () => import("highlight.js/lib/languages/ebnf"),
  "elixir": () => import("highlight.js/lib/languages/elixir"),
  "elm": () => import("highlight.js/lib/languages/elm"),
  "erb": () => import("highlight.js/lib/languages/erb"),
  "erlang": () => import("highlight.js/lib/languages/erlang"),
  "erlang-repl": () => import("highlight.js/lib/languages/erlang-repl"),
  "excel": () => import("highlight.js/lib/languages/excel"),
  "fix": () => import("highlight.js/lib/languages/fix"),
  "flix": () => import("highlight.js/lib/languages/flix"),
  "fortran": () => import("highlight.js/lib/languages/fortran"),
  "fsharp": () => import("highlight.js/lib/languages/fsharp"),
  "gams": () => import("highlight.js/lib/languages/gams"),
  "gauss": () => import("highlight.js/lib/languages/gauss"),
  "gcode": () => import("highlight.js/lib/languages/gcode"),
  "gherkin": () => import("highlight.js/lib/languages/gherkin"),
  "glsl": () => import("highlight.js/lib/languages/glsl"),
  "gml": () => import("highlight.js/lib/languages/gml"),
  "go": () => import("highlight.js/lib/languages/go"),
  "golo": () => import("highlight.js/lib/languages/golo"),
  "gradle": () => import("highlight.js/lib/languages/gradle"),
  "graphql": () => import("highlight.js/lib/languages/graphql"),
  "groovy": () => import("highlight.js/lib/languages/groovy"),
  "haml": () => import("highlight.js/lib/languages/haml"),
  "handlebars": () => import("highlight.js/lib/languages/handlebars"),
  "haskell": () => import("highlight.js/lib/languages/haskell"),
  "haxe": () => import("highlight.js/lib/languages/haxe"),
  "hsp": () => import("highlight.js/lib/languages/hsp"),
  "http": () => import("highlight.js/lib/languages/http"),
  "hy": () => import("highlight.js/lib/languages/hy"),
  "inform7": () => import("highlight.js/lib/languages/inform7"),
  "ini": () => import("highlight.js/lib/languages/ini"),
  "irpf90": () => import("highlight.js/lib/languages/irpf90"),
  "isbl": () => import("highlight.js/lib/languages/isbl"),
  "java": () => import("highlight.js/lib/languages/java"),
  "javascript": () => import("highlight.js/lib/languages/javascript"),
  "jboss-cli": () => import("highlight.js/lib/languages/jboss-cli"),
  "json": () => import("highlight.js/lib/languages/json"),
  "julia": () => import("highlight.js/lib/languages/julia"),
  "julia-repl": () => import("highlight.js/lib/languages/julia-repl"),
  "kotlin": () => import("highlight.js/lib/languages/kotlin"),
  "lasso": () => import("highlight.js/lib/languages/lasso"),
  "latex": () => import("highlight.js/lib/languages/latex"),
  "ldif": () => import("highlight.js/lib/languages/ldif"),
  "leaf": () => import("highlight.js/lib/languages/leaf"),
  "less": () => import("highlight.js/lib/languages/less"),
  "lisp": () => import("highlight.js/lib/languages/lisp"),
  "livecodeserver": () => import("highlight.js/lib/languages/livecodeserver"),
  "livescript": () => import("highlight.js/lib/languages/livescript"),
  "llvm": () => import("highlight.js/lib/languages/llvm"),
  "lsl": () => import("highlight.js/lib/languages/lsl"),
  "lua": () => import("highlight.js/lib/languages/lua"),
  "makefile": () => import("highlight.js/lib/languages/makefile"),
  "markdown": () => import("highlight.js/lib/languages/markdown"),
  "mathematica": () => import("highlight.js/lib/languages/mathematica"),
  "matlab": () => import("highlight.js/lib/languages/matlab"),
  "maxima": () => import("highlight.js/lib/languages/maxima"),
  "mel": () => import("highlight.js/lib/languages/mel"),
  "mercury": () => import("highlight.js/lib/languages/mercury"),
  "mipsasm": () => import("highlight.js/lib/languages/mipsasm"),
  "mizar": () => import("highlight.js/lib/languages/mizar"),
  "mojolicious": () => import("highlight.js/lib/languages/mojolicious"),
  "monkey": () => import("highlight.js/lib/languages/monkey"),
  "moonscript": () => import("highlight.js/lib/languages/moonscript"),
  "n1ql": () => import("highlight.js/lib/languages/n1ql"),
  "nestedtext": () => import("highlight.js/lib/languages/nestedtext"),
  "nginx": () => import("highlight.js/lib/languages/nginx"),
  "nim": () => import("highlight.js/lib/languages/nim"),
  "nix": () => import("highlight.js/lib/languages/nix"),
  "node-repl": () => import("highlight.js/lib/languages/node-repl"),
  "nsis": () => import("highlight.js/lib/languages/nsis"),
  "objectivec": () => import("highlight.js/lib/languages/objectivec"),
  "ocaml": () => import("highlight.js/lib/languages/ocaml"),
  "openscad": () => import("highlight.js/lib/languages/openscad"),
  "oxygene": () => import("highlight.js/lib/languages/oxygene"),
  "parser3": () => import("highlight.js/lib/languages/parser3"),
  "perl": () => import("highlight.js/lib/languages/perl"),
  "pf": () => import("highlight.js/lib/languages/pf"),
  "pgsql": () => import("highlight.js/lib/languages/pgsql"),
  "php": () => import("highlight.js/lib/languages/php"),
  "php-template": () => import("highlight.js/lib/languages/php-template"),
  "plaintext": () => import("highlight.js/lib/languages/plaintext"),
  "pony": () => import("highlight.js/lib/languages/pony"),
  "powershell": () => import("highlight.js/lib/languages/powershell"),
  "processing": () => import("highlight.js/lib/languages/processing"),
  "profile": () => import("highlight.js/lib/languages/profile"),
  "prolog": () => import("highlight.js/lib/languages/prolog"),
  "properties": () => import("highlight.js/lib/languages/properties"),
  "protobuf": () => import("highlight.js/lib/languages/protobuf"),
  "puppet": () => import("highlight.js/lib/languages/puppet"),
  "purebasic": () => import("highlight.js/lib/languages/purebasic"),
  "python": () => import("highlight.js/lib/languages/python"),
  "python-repl": () => import("highlight.js/lib/languages/python-repl"),
  "q": () => import("highlight.js/lib/languages/q"),
  "qml": () => import("highlight.js/lib/languages/qml"),
  "r": () => import("highlight.js/lib/languages/r"),
  "reasonml": () => import("highlight.js/lib/languages/reasonml"),
  "rib": () => import("highlight.js/lib/languages/rib"),
  "roboconf": () => import("highlight.js/lib/languages/roboconf"),
  "routeros": () => import("highlight.js/lib/languages/routeros"),
  "rsl": () => import("highlight.js/lib/languages/rsl"),
  "ruby": () => import("highlight.js/lib/languages/ruby"),
  "ruleslanguage": () => import("highlight.js/lib/languages/ruleslanguage"),
  "rust": () => import("highlight.js/lib/languages/rust"),
  "sas": () => import("highlight.js/lib/languages/sas"),
  "scala": () => import("highlight.js/lib/languages/scala"),
  "scheme": () => import("highlight.js/lib/languages/scheme"),
  "scilab": () => import("highlight.js/lib/languages/scilab"),
  "scss": () => import("highlight.js/lib/languages/scss"),
  "shell": () => import("highlight.js/lib/languages/shell"),
  "smali": () => import("highlight.js/lib/languages/smali"),
  "smalltalk": () => import("highlight.js/lib/languages/smalltalk"),
  "sml": () => import("highlight.js/lib/languages/sml"),
  "sqf": () => import("highlight.js/lib/languages/sqf"),
  "sql": () => import("highlight.js/lib/languages/sql"),
  "stan": () => import("highlight.js/lib/languages/stan"),
  "stata": () => import("highlight.js/lib/languages/stata"),
  "step21": () => import("highlight.js/lib/languages/step21"),
  "stylus": () => import("highlight.js/lib/languages/stylus"),
  "subunit": () => import("highlight.js/lib/languages/subunit"),
  "swift": () => import("highlight.js/lib/languages/swift"),
  "taggerscript": () => import("highlight.js/lib/languages/taggerscript"),
  "tap": () => import("highlight.js/lib/languages/tap"),
  "tcl": () => import("highlight.js/lib/languages/tcl"),
  "thrift": () => import("highlight.js/lib/languages/thrift"),
  "tp": () => import("highlight.js/lib/languages/tp"),
  "twig": () => import("highlight.js/lib/languages/twig"),
  "typescript": () => import("highlight.js/lib/languages/typescript"),
  "vala": () => import("highlight.js/lib/languages/vala"),
  "vbnet": () => import("highlight.js/lib/languages/vbnet"),
  "vbscript": () => import("highlight.js/lib/languages/vbscript"),
  "vbscript-html": () => import("highlight.js/lib/languages/vbscript-html"),
  "verilog": () => import("highlight.js/lib/languages/verilog"),
  "vhdl": () => import("highlight.js/lib/languages/vhdl"),
  "vim": () => import("highlight.js/lib/languages/vim"),
  "wasm": () => import("highlight.js/lib/languages/wasm"),
  "wren": () => import("highlight.js/lib/languages/wren"),
  "x86asm": () => import("highlight.js/lib/languages/x86asm"),
  "xl": () => import("highlight.js/lib/languages/xl"),
  "xml": () => import("highlight.js/lib/languages/xml"),
  "xquery": () => import("highlight.js/lib/languages/xquery"),
  "yaml": () => import("highlight.js/lib/languages/yaml"),
  "zephir": () => import("highlight.js/lib/languages/zephir")
};

// src/core/hljsRuntime.ts
var HLJS_LANGUAGE_ALIASES = {
  js: "javascript",
  ts: "typescript",
  py: "python",
  md: "markdown",
  sh: "bash",
  shell: "bash",
  text: "plaintext",
  plain: "plaintext"
};
var hljsInstance = null;
var hljsInit = null;
var loadingLanguages = /* @__PURE__ */ new Map();
function normalizeHljsLanguage(language) {
  if (!language) return "plaintext";
  const normalized = language.trim().toLowerCase();
  return HLJS_LANGUAGE_ALIASES[normalized] ?? normalized;
}
async function getHljs() {
  if (hljsInstance) return hljsInstance;
  if (!hljsInit) {
    hljsInit = import("highlight.js/lib/core").then(async (mod) => {
      hljsInstance = mod.default;
      await loadHljsLanguage("plaintext");
      return hljsInstance;
    });
  }
  return hljsInit;
}
async function loadHljsLanguage(language) {
  const hljs = await getHljs();
  const id = normalizeHljsLanguage(language);
  if (hljs.getLanguage(id)) return id;
  const pending = loadingLanguages.get(id);
  if (pending) return pending;
  const loadPromise = (async () => {
    try {
      const loader = HLJS_LANGUAGE_LOADERS[id];
      if (!loader) return "plaintext";
      const mod = await loader();
      hljs.registerLanguage(id, mod.default);
      return id;
    } catch {
      if (!hljs.getLanguage("plaintext")) {
        const plain = await HLJS_LANGUAGE_LOADERS.plaintext();
        hljs.registerLanguage("plaintext", plain.default);
      }
      return "plaintext";
    } finally {
      loadingLanguages.delete(id);
    }
  })();
  loadingLanguages.set(id, loadPromise);
  return loadPromise;
}
async function ensureHljsLanguages(languages) {
  await Promise.all([...new Set(languages)].map((lang) => loadHljsLanguage(lang)));
}
function resolveHljsLanguage(hljs, language) {
  const id = normalizeHljsLanguage(language);
  return hljs.getLanguage(id) ? id : "plaintext";
}

// src/components/highlightViewerCode.ts
function isAlreadyHighlighted(element) {
  if (element.classList.contains("hljs")) return true;
  return element.querySelector(
    ".token, .hljs, [class*='hljs-']"
  ) !== null;
}
function detectLanguage(element) {
  const dataLanguage = element.getAttribute("data-language");
  if (dataLanguage) return dataLanguage;
  const languageClass = [...element.classList].find(
    (name) => name.startsWith("language-")
  );
  if (languageClass) return languageClass.slice("language-".length);
  return "plaintext";
}
async function highlightViewerCodeBlocks(root) {
  if (!root) return;
  const blocks = root.querySelectorAll(
    "pre code, code.re-block-code, .re-block-code"
  );
  const needsHighlight = [...blocks].filter((el) => !isAlreadyHighlighted(el));
  if (needsHighlight.length === 0) return;
  const languages = needsHighlight.map((el) => detectLanguage(el));
  await ensureHljsLanguages(languages);
  const hljs = await getHljs();
  for (const el of needsHighlight) {
    const text = el.textContent ?? "";
    if (!text.trim()) continue;
    el.dataset.code = text;
    const language = resolveHljsLanguage(hljs, detectLanguage(el));
    const result = hljs.highlight(text, { language });
    el.innerHTML = result.value;
    el.classList.add("hljs");
    el.setAttribute("data-language", language);
  }
}
function storeViewerCodeText(root) {
  if (!root) return;
  root.querySelectorAll(
    "pre code, code.re-block-code, .re-block-code"
  ).forEach((el) => {
    if (!el.dataset.code) {
      el.dataset.code = el.textContent ?? "";
    }
  });
}

// src/core/clipboard.ts
async function copyTextToClipboard(text) {
  if (!text) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      textarea.remove();
      return copied;
    } catch {
      return false;
    }
  }
}

// src/components/enhanceViewerCode.ts
function collectCodeBlocks(root) {
  const blocks = [];
  root.querySelectorAll("pre").forEach((pre) => blocks.push(pre));
  root.querySelectorAll("code.re-block-code, .re-block-code").forEach((code) => {
    if (!code.closest("pre")) blocks.push(code);
  });
  return blocks;
}
function collectInlineCodeElements(root) {
  const elements = [];
  root.querySelectorAll("p code, .re-paragraph code").forEach((code) => {
    if (!(code instanceof HTMLElement)) return;
    if (code.classList.contains("re-block-code")) return;
    if (code.closest("pre")) return;
    if (code.closest(".re-code-block-wrap")) return;
    elements.push(code);
  });
  return elements;
}
function getCodeElement(block) {
  if (block instanceof HTMLPreElement) {
    return block.querySelector("code") ?? block;
  }
  return block;
}
function getCodeText(element) {
  return element.dataset.code ?? element.textContent ?? "";
}
function ensureWrapped(block) {
  const existing = block.closest(".re-code-block-wrap");
  if (existing instanceof HTMLElement) return existing;
  const wrap = document.createElement("div");
  wrap.className = "re-code-block-wrap";
  block.parentNode?.insertBefore(wrap, block);
  wrap.appendChild(block);
  return wrap;
}
function createCopyButton(labels) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "re-code-copy-btn";
  button.setAttribute("aria-label", labels.copyCode);
  button.title = labels.copyCode;
  button.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
  return button;
}
function flashCopied(button, labels) {
  const previous = button.title;
  button.classList.add("re-code-copy-btn-copied");
  button.title = labels.copiedCode;
  window.setTimeout(() => {
    button.classList.remove("re-code-copy-btn-copied");
    button.title = previous;
  }, 1500);
}
function flashCopiedInline(element, labels) {
  const previous = element.title;
  element.classList.add("re-inline-code-copied");
  element.title = labels.copiedCode;
  window.setTimeout(() => {
    element.classList.remove("re-inline-code-copied");
    element.title = previous;
  }, 1500);
}
function enhanceViewerCodeBlocks(root, labels) {
  if (!root) return () => {
  };
  const cleanups = [];
  collectCodeBlocks(root).forEach((block) => {
    const codeElement = getCodeElement(block);
    const wrap = ensureWrapped(block);
    let button = wrap.querySelector(".re-code-copy-btn");
    if (!button) {
      button = createCopyButton(labels);
      wrap.appendChild(button);
    }
    const copy = async () => {
      const copied = await copyTextToClipboard(getCodeText(codeElement));
      if (copied) flashCopied(button, labels);
    };
    const onButtonClick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      void copy();
    };
    button.addEventListener("click", onButtonClick);
    cleanups.push(() => {
      button?.removeEventListener("click", onButtonClick);
    });
  });
  collectInlineCodeElements(root).forEach((element) => {
    const copy = async () => {
      const copied = await copyTextToClipboard(getCodeText(element));
      if (copied) flashCopiedInline(element, labels);
    };
    const onClick = (event) => {
      event.preventDefault();
      void copy();
    };
    element.addEventListener("click", onClick);
    element.classList.add("re-code-copyable", "re-inline-code-copyable");
    element.setAttribute("role", "button");
    element.setAttribute("tabindex", "0");
    element.setAttribute("aria-label", labels.copyCode);
    const onKeyDown = (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      void copy();
    };
    element.addEventListener("keydown", onKeyDown);
    cleanups.push(() => {
      element.removeEventListener("click", onClick);
      element.removeEventListener("keydown", onKeyDown);
      element.classList.remove(
        "re-code-copyable",
        "re-inline-code-copyable",
        "re-inline-code-copied"
      );
      element.removeAttribute("role");
      element.removeAttribute("tabindex");
      element.removeAttribute("aria-label");
    });
  });
  return () => {
    for (const cleanup of cleanups) cleanup();
  };
}

// src/components/attachments/ViewerAttachments.tsx
var import_jsx_runtime15 = require("react/jsx-runtime");
function ViewerAttachments({
  attachments,
  labels
}) {
  if (attachments.length === 0) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { className: "re-attachments re-viewer-attachments", "aria-label": labels.attachments, children: attachments.map((file) => /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
    "a",
    {
      className: "re-attachment-item re-viewer-attachment-item",
      href: file.url,
      target: "_blank",
      rel: "noopener noreferrer",
      title: file.name,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
          AttachmentThumb,
          {
            name: file.name,
            mimeType: file.mimeType,
            previewUrl: getPayloadPreviewUrl(file)
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("span", { className: "re-attachment-meta", children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: "re-attachment-name", children: file.name }),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: "re-attachment-sub", children: formatFileSize(file.size) })
        ] })
      ]
    },
    file.id
  )) });
}

// src/components/RichTextViewer.tsx
var import_jsx_runtime16 = require("react/jsx-runtime");
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
  onMentionClick,
  attachments = [],
  showAttachments = false
}) {
  const features = (0, import_react22.useMemo)(
    () => resolveViewerFeatures(featuresProp),
    [featuresProp]
  );
  const labels = (0, import_react22.useMemo)(
    () => resolveViewerLabels(labelsProp),
    [labelsProp]
  );
  const ref = (0, import_react22.useRef)(null);
  const [displayHtml, setDisplayHtml] = (0, import_react22.useState)(null);
  const prepared = (0, import_react22.useMemo)(
    () => prepareViewerContent(content, features),
    [content, features.linkTarget]
  );
  const preparedHtml = prepared.kind === "html" ? prepared.html : "";
  (0, import_react22.useEffect)(() => {
    setDisplayHtml(null);
  }, [content, features.codeHighlight]);
  const attachmentStrip = showAttachments && attachments.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(ViewerAttachments, { attachments, labels }) : null;
  (0, import_react22.useLayoutEffect)(() => {
    if (prepared.kind !== "html") return;
    let cancelled = false;
    const run = async () => {
      if (features.codeHighlight) {
        await highlightViewerCodeBlocks(ref.current);
        const highlighted = ref.current?.innerHTML;
        if (!cancelled && highlighted && highlighted !== preparedHtml) {
          setDisplayHtml(highlighted);
        }
      } else {
        storeViewerCodeText(ref.current);
        if (!cancelled) setDisplayHtml(null);
      }
      return enhanceViewerCodeBlocks(ref.current, labels);
    };
    let cleanup;
    void run().then((dispose) => {
      if (!cancelled) cleanup = dispose;
    });
    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [
    features.codeHighlight,
    labels.copyCode,
    labels.copiedCode,
    preparedHtml
  ]);
  (0, import_react22.useEffect)(() => {
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
  }, [preparedHtml]);
  (0, import_react22.useEffect)(() => {
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
  }, [labels.mention, onMentionClick, preparedHtml]);
  if (prepared.kind === "plain") {
    return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(
      "div",
      {
        ...themeDataAttribute(theme),
        className: cn("re-viewer-shell", className),
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("p", { className: "re-viewer re-viewer-plain", "aria-label": labels.content, children: prepared.text }),
          attachmentStrip
        ]
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)(
    "div",
    {
      ...themeDataAttribute(theme),
      className: cn("re-viewer-shell", className),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
          "div",
          {
            ref,
            className: "re-viewer",
            role: "article",
            "aria-label": labels.content,
            dangerouslySetInnerHTML: { __html: displayHtml ?? preparedHtml }
          }
        ),
        attachmentStrip
      ]
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
  trimEditorHtml,
  useRichTextEditor
});
//# sourceMappingURL=index.cjs.map