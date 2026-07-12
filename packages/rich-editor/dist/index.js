"use client";

// src/components/RichTextEditor.tsx
import { $generateHtmlFromNodes } from "@lexical/html";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext as useLexicalComposerContext17 } from "@lexical/react/LexicalComposerContext";
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
  useCallback as useCallback7,
  useEffect as useEffect17,
  useId as useId4,
  useImperativeHandle,
  useMemo as useMemo4,
  useRef as useRef8,
  useState as useState9
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

// src/nodes/ImageNode.tsx
import {
  $applyNodeReplacement as $applyNodeReplacement4,
  DecoratorNode
} from "lexical";

// src/components/attachments/ImageComponent.tsx
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import {
  $getNodeByKey,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";

// src/core/attachmentInsert.ts
import { $createParagraphNode, $getRoot, $getSelection, $insertNodes, $isParagraphNode, $isRangeSelection } from "lexical";

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
import {
  $applyNodeReplacement as $applyNodeReplacement3,
  ElementNode as ElementNode2
} from "lexical";
var FileLinkNode = class _FileLinkNode extends ElementNode2 {
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
  return $applyNodeReplacement3(
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
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      $insertNodes([imageNode]);
      return;
    }
    const root = $getRoot();
    const lastChild = root.getLastChild();
    if (lastChild && $isParagraphNode(lastChild)) {
      lastChild.append(imageNode);
      return;
    }
    const paragraph = $createParagraphNode();
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
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      $insertNodes([fileLink]);
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
import { jsx as jsx2, jsxs } from "react/jsx-runtime";
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
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const imageRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const height = Math.max(1, Math.round(width / aspectRatio));
  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
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
        COMMAND_PRIORITY_LOW
      )
    );
  }, [clearSelection, editor, isSelected, setSelected]);
  const onResizeStart = useCallback(
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
          const node = $getNodeByKey(nodeKey);
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
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: `re-image-wrap${isSelected ? " re-image-wrap-selected" : ""}${isResizing ? " re-image-wrap-resizing" : ""}`,
      style: { width: `${width}px` },
      contentEditable: false,
      "data-lexical-decorator": "true",
      children: [
        /* @__PURE__ */ jsx2(
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
        /* @__PURE__ */ jsx2(
          "span",
          {
            className: "re-image-resize-handle re-image-resize-handle-e",
            onMouseDown: (event) => onResizeStart("e", event),
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsx2(
          "span",
          {
            className: "re-image-resize-handle re-image-resize-handle-s",
            onMouseDown: (event) => onResizeStart("s", event),
            "aria-hidden": "true"
          }
        ),
        /* @__PURE__ */ jsx2(
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
import { jsx as jsx3 } from "react/jsx-runtime";
var ImageNode = class _ImageNode extends DecoratorNode {
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
    return /* @__PURE__ */ jsx3(
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
  return $applyNodeReplacement4(
    new ImageNode(src, alt, fileId, width, aspectRatio)
  );
}
function $isImageNode(node) {
  return node instanceof ImageNode;
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
  return DOMPurify.sanitize(html, {
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
import { $createParagraphNode as $createParagraphNode2, $createTextNode } from "lexical";
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
var UNDERLINE = {
  format: ["underline"],
  tag: "++",
  type: "text-format"
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
        const paragraph2 = $createParagraphNode2();
        paragraph2.append(...children);
        previousNode.append(paragraph2);
        parentNode.remove();
        return;
      }
    }
    const quote = $createQuoteNode();
    const paragraph = $createParagraphNode2();
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
  if (features.underline) transformers.push(UNDERLINE);
  if (features.strikethrough) transformers.push(STRIKETHROUGH);
  if (features.links) transformers.push(LINK);
  if (features.spoiler) transformers.push(SPOILER);
  return transformers;
}
function looksLikeMarkdown(text) {
  const t = text.trim();
  if (t.length < 2) return false;
  return /^#{1,6}\s/m.test(t) || /^>\s/m.test(t) || /^[-*+]\s/m.test(t) || /^\d+\.\s/m.test(t) || /```[\s\S]*?```/.test(t) || /\*\*[^*\n]+\*\*/.test(t) || /(?:^|[^*])\*[^*\s][^*\n]*\*(?:[^*]|$)/.test(t) || /`[^`\n]+`/.test(t) || /\+\+[^+\n]+\+\+/.test(t) || /~~[^~\n]+~~/.test(t) || /\|\|[^|\n]+\|\|/.test(t) || /\[[^\]]+\]\([^)]+\)/.test(t);
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
import { useEffect as useEffect15, useRef as useRef6 } from "react";
import { $generateNodesFromDOM as $generateNodesFromDOM2 } from "@lexical/html";
import { useLexicalComposerContext as useLexicalComposerContext15 } from "@lexical/react/LexicalComposerContext";
import { $createParagraphNode as $createParagraphNode6, $getRoot as $getRoot5 } from "lexical";

// src/core/selectionFormat.ts
import { $getSelection as $getSelection2, $isRangeSelection as $isRangeSelection2 } from "lexical";
function $clearStickyTextFormats() {
  const selection = $getSelection2();
  if ($isRangeSelection2(selection)) {
    selection.setFormat(0);
  }
}

// src/components/plugins/EnterPlugin.tsx
import { useEffect as useEffect2 } from "react";
import { useLexicalComposerContext as useLexicalComposerContext2 } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection as $getSelection3,
  $isRangeSelection as $isRangeSelection3,
  COMMAND_PRIORITY_LOW as COMMAND_PRIORITY_LOW2,
  KEY_ENTER_COMMAND
} from "lexical";
function EnterPlugin({
  bindings,
  onSubmit
}) {
  const [editor] = useLexicalComposerContext2();
  useEffect2(() => {
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
            const selection = $getSelection3();
            if ($isRangeSelection3(selection)) {
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
      COMMAND_PRIORITY_LOW2
    );
  }, [bindings, editor, onSubmit]);
  return null;
}

// src/components/plugins/MarkdownPastePlugin.tsx
import { $generateNodesFromDOM } from "@lexical/html";
import { useLexicalComposerContext as useLexicalComposerContext3 } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection as $getSelection4,
  $insertNodes as $insertNodes2,
  $isRangeSelection as $isRangeSelection4,
  COMMAND_PRIORITY_HIGH,
  PASTE_COMMAND
} from "lexical";
import { useEffect as useEffect3 } from "react";
function htmlToNodes(editor, html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return $generateNodesFromDOM(editor, doc.body);
}
function MarkdownPastePlugin({
  features
}) {
  const [editor] = useLexicalComposerContext3();
  useEffect3(() => {
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
            const selection = $getSelection4();
            if (!$isRangeSelection4(selection)) return;
            if (!selection.isCollapsed()) {
              selection.removeText();
            }
            const nodes = htmlToNodes(editor, html);
            if (nodes.length > 0) {
              $insertNodes2(nodes);
            }
          });
          return true;
        }
        if (htmlRaw && htmlRaw.trim() && !looksLikeMarkdown(text)) {
          event.preventDefault();
          const html = sanitizeHtml(htmlRaw);
          editor.update(() => {
            const selection = $getSelection4();
            if (!$isRangeSelection4(selection)) return;
            if (!selection.isCollapsed()) {
              selection.removeText();
            }
            const nodes = htmlToNodes(editor, html);
            if (nodes.length > 0) {
              $insertNodes2(nodes);
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
import { useEffect as useEffect4 } from "react";
import { useLexicalComposerContext as useLexicalComposerContext4 } from "@lexical/react/LexicalComposerContext";
import {
  COMMAND_PRIORITY_LOW as COMMAND_PRIORITY_LOW3,
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
  const [editor] = useLexicalComposerContext4();
  useEffect4(() => {
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
        if (key === "u" && features.underline && !event.shiftKey) {
          event.preventDefault();
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
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
      COMMAND_PRIORITY_LOW3
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
import { useLexicalComposerContext as useLexicalComposerContext5 } from "@lexical/react/LexicalComposerContext";
import {
  useCallback as useCallback2,
  useEffect as useEffect5,
  useId,
  useMemo,
  useState as useState2
} from "react";
import { createPortal } from "react-dom";
import { COMMAND_PRIORITY_HIGH as COMMAND_PRIORITY_HIGH2 } from "lexical";
import { jsx as jsx4, jsxs as jsxs2 } from "react/jsx-runtime";
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
    /* @__PURE__ */ jsx4(
      "div",
      {
        id: menuId,
        className: "re-mention-menu re-scrollbar",
        role: "listbox",
        "aria-label": menuLabel,
        "aria-activedescendant": activeDescendantId,
        children: options.map((option, index) => /* @__PURE__ */ jsxs2(
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
  const [editor] = useLexicalComposerContext5();
  const { labels } = useRichTextEditor();
  const menuId = useId();
  const [query, setQuery] = useState2(null);
  const [results, setResults] = useState2([]);
  const triggerFn = useBasicTypeaheadTriggerMatch("@", {
    minLength: 0,
    maxLength: 40
  });
  useEffect5(() => {
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
  const onSelectOption = useCallback2(
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
  const menuRenderFn = useCallback2(
    (anchorElementRef, {
      selectedIndex,
      selectOptionAndCleanUp,
      setHighlightedIndex,
      options: menuOptions
    }) => /* @__PURE__ */ jsx4(
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
  return /* @__PURE__ */ jsx4(
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
import { useEffect as useEffect6 } from "react";
import { useLexicalComposerContext as useLexicalComposerContext6 } from "@lexical/react/LexicalComposerContext";
import { $isCodeNode as $isCodeNode2 } from "@lexical/code";
import { $isQuoteNode as $isQuoteNode4 } from "@lexical/rich-text";
import {
  $getRoot as $getRoot4,
  $getSelection as $getSelection6,
  $isParagraphNode as $isParagraphNode4,
  $isRangeSelection as $isRangeSelection6,
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
  $createParagraphNode as $createParagraphNode4,
  $createTextNode as $createTextNode2,
  $getRoot as $getRoot3,
  $getSelection as $getSelection5,
  $getNodeByKey as $getNodeByKey2,
  $isElementNode as $isElementNode2,
  $isParagraphNode as $isParagraphNode3,
  $isRangeSelection as $isRangeSelection5,
  $isTextNode
} from "lexical";

// src/core/quoteBlocks.ts
import { $isQuoteNode as $isQuoteNode2, $createQuoteNode as $createQuoteNode2 } from "@lexical/rich-text";
import { $findMatchingParent } from "@lexical/utils";
import {
  $createParagraphNode as $createParagraphNode3,
  $getRoot as $getRoot2,
  $isElementNode,
  $isParagraphNode as $isParagraphNode2,
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
  if (children.length > 0 && children.every($isParagraphNode2)) return;
  const normalized = [];
  let pending = null;
  for (const child of children) {
    if ($isParagraphNode2(child)) {
      normalized.push(child);
      pending = null;
      continue;
    }
    if (!pending) {
      pending = $createParagraphNode3();
      normalized.push(pending);
    }
    pending.append(child);
  }
  if (normalized.length === 0) {
    normalized.push($createParagraphNode3());
  }
  quote.clear();
  quote.append(...normalized);
}
function $getQuoteParagraph(node) {
  const quote = $findMatchingParent(node, $isQuoteNode2);
  if (!quote) return null;
  let current = node;
  while (current !== null && current !== quote) {
    if ($isParagraphNode2(current) && current.getParent() === quote) {
      return current;
    }
    current = current.getParent();
  }
  $ensureQuoteParagraphStructure(quote);
  current = node;
  while (current !== null && current !== quote) {
    if ($isParagraphNode2(current) && current.getParent() === quote) {
      return current;
    }
    current = current.getParent();
  }
  const first = quote.getFirstChild();
  return $isParagraphNode2(first) ? first : null;
}
function $unwrapQuote(quote) {
  $ensureQuoteParagraphStructure(quote);
  const paragraphs = quote.getChildren().filter($isParagraphNode2);
  if (paragraphs.length === 0) {
    quote.replace($createParagraphNode3());
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
  const inner = $createParagraphNode3();
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
  const paragraphs = blocks.filter($isParagraphNode2);
  if (paragraphs.length === 0) return;
  if (paragraphs.length === 1) {
    $wrapParagraphInQuote(paragraphs[0]);
    return;
  }
  const quote = $createQuoteNode2();
  for (const block of paragraphs) {
    const inner = $createParagraphNode3();
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
  for (const child of $getRoot2().getChildren()) {
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
  return $isParagraphNode3(node) && node.getTextContent().trim() === "";
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
  const paragraph = $findMatchingParent2(node, $isParagraphNode3);
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
  if ($isParagraphNode3(node)) return true;
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
  if ($isParagraphNode3(node)) {
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
  const paragraphs = quote.getChildren().filter($isParagraphNode3);
  const index = paragraphs.findIndex((p) => p.getKey() === paragraph.getKey());
  if (index === -1) return;
  const total = paragraphs.length;
  const newParagraph = $createParagraphNode4();
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
  for (const child of [...$getRoot3().getChildren()]) {
    if (!$isQuoteNode3(child)) continue;
    if (child.getTextContent().trim() === "") {
      child.remove();
    }
  }
}
function $insertParagraphBeforeBlock(block) {
  const paragraph = $createParagraphNode4();
  block.insertBefore(paragraph);
  paragraph.selectEnd();
}
function $exitQuoteWithEmptyLines(quote) {
  while (quote.getLastChild() && $isParagraphEmpty(quote.getLastChild())) {
    quote.getLastChild().remove();
  }
  const exitParagraph = $createParagraphNode4();
  quote.insertAfter(exitParagraph);
  exitParagraph.selectStart();
  if (quote.getChildrenSize() === 0) {
    quote.remove();
  }
}
function $handleQuoteEnter(quote, paragraph, selection) {
  $ensureQuoteParagraphStructure(quote);
  if (!$isParagraphNode3(paragraph) || paragraph.getParent() !== quote) {
    const resolved = quote.getChildren().find($isParagraphNode3);
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
  const liveQuote = $getNodeByKey2(quote.getKey());
  if (!liveQuote || !$isQuoteNode3(liveQuote)) return;
  quote = liveQuote;
  const liveParagraph = $getQuoteParagraph(selection.anchor.getNode());
  if (!liveParagraph || liveParagraph.getParent() !== quote) return;
  paragraph = liveParagraph;
  if (!$isParagraphNode3(paragraph) || paragraph.getParent() !== quote) return;
  if (!$isAtStartOfBlock(selection)) return;
  if ($isParagraphEmpty(paragraph)) {
    if (quote.getChildrenSize() <= 1) {
      const replacement = $createParagraphNode4();
      quote.replace(replacement);
      replacement.selectStart();
      return;
    }
    const prev = paragraph.getPreviousSibling();
    paragraph.remove();
    if (prev && $isParagraphNode3(prev)) {
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
  const root = $getRoot3();
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
  const root = $getRoot3();
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
  const exitParagraph = $createParagraphNode4();
  codeNode.insertAfter(exitParagraph);
  exitParagraph.selectStart();
}
function $shouldSkipBlockBehavior() {
  const selection = $getSelection5();
  if (!$isRangeSelection5(selection)) return true;
  const node = selection.anchor.getNode();
  if ($findMatchingParent2(node, $isListItemNode)) return true;
  return false;
}

// src/components/plugins/BlockBehaviorPlugin.tsx
function $needsQuoteNormalization() {
  for (const child of $getRoot4().getChildren()) {
    if (!$isQuoteNode4(child)) continue;
    const children = child.getChildren();
    if (children.length === 0 || children.some((node) => !$isParagraphNode4(node))) {
      return true;
    }
  }
  return false;
}
function $needsBlockMerge() {
  const children = $getRoot4().getChildren();
  for (let i = 0; i < children.length - 1; i++) {
    const current = children[i];
    const next = children[i + 1];
    if ($isQuoteNode4(current) && $isQuoteNode4(next)) return true;
    if ($isCodeNode2(current) && $isCodeNode2(next)) return true;
  }
  return false;
}
function BlockBehaviorPlugin() {
  const [editor] = useLexicalComposerContext6();
  useEffect6(() => {
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
          const selection = $getSelection6();
          if (!$isRangeSelection6(selection)) return null;
          const quote = $getBlockQuote(selection.anchor.getNode());
          if (!quote || !$isQuoteNode4(quote)) return null;
          const paragraph = $getQuoteParagraph(selection.anchor.getNode());
          if (!paragraph || paragraph.getParent() !== quote) return null;
          return { quote, paragraph };
        });
        if (quoteContext) {
          event?.preventDefault();
          editor.update(() => {
            const selection = $getSelection6();
            if (!$isRangeSelection6(selection)) return;
            $handleQuoteEnter(
              quoteContext.quote,
              quoteContext.paragraph,
              selection
            );
          });
          return true;
        }
        const shouldExitCode = editor.getEditorState().read(() => {
          const selection = $getSelection6();
          if (!$isRangeSelection6(selection)) return false;
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
            const selection = $getSelection6();
            if (!$isRangeSelection6(selection)) return;
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
        const selection = $getSelection6();
        if (!$isRangeSelection6(selection) || !selection.isCollapsed()) return false;
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
import { useEffect as useEffect7 } from "react";
import { registerCodeHighlighting } from "@lexical/code";
import { useLexicalComposerContext as useLexicalComposerContext7 } from "@lexical/react/LexicalComposerContext";
function CodeHighlightPlugin({ enabled }) {
  const [editor] = useLexicalComposerContext7();
  useEffect7(() => {
    if (!enabled) return;
    return registerCodeHighlighting(editor);
  }, [editor, enabled]);
  return null;
}

// src/components/plugins/CodeLanguagePlugin.tsx
import { useCallback as useCallback3, useEffect as useEffect8, useMemo as useMemo2, useRef as useRef2, useState as useState3 } from "react";
import { createPortal as createPortal2 } from "react-dom";
import { useLexicalComposerContext as useLexicalComposerContext8 } from "@lexical/react/LexicalComposerContext";
import { $isCodeNode as $isCodeNode3, normalizeCodeLanguage } from "@lexical/code";
import { $findMatchingParent as $findMatchingParent3 } from "@lexical/utils";
import {
  $getNodeByKey as $getNodeByKey3,
  $getSelection as $getSelection7,
  $isRangeSelection as $isRangeSelection7,
  COMMAND_PRIORITY_LOW as COMMAND_PRIORITY_LOW4,
  SELECTION_CHANGE_COMMAND
} from "lexical";

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
import { jsx as jsx5, jsxs as jsxs3 } from "react/jsx-runtime";
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
  const [editor] = useLexicalComposerContext8();
  const [toolbar, setToolbar] = useState3(null);
  const [menuOpen, setMenuOpen] = useState3(false);
  const toolbarRef = useRef2(null);
  const languageOptions = useMemo2(() => {
    const ids = resolveCodeLanguages(codeLanguages);
    return ids.map((id) => ({
      id,
      label: getHljsLanguageLabel(id)
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, [codeLanguages]);
  const allowedLanguages = useMemo2(
    () => new Set(languageOptions.map((option) => option.id)),
    [languageOptions]
  );
  const update = useCallback3(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection7();
      if (!$isRangeSelection7(selection)) {
        setToolbar(null);
        setMenuOpen(false);
        return;
      }
      const code = $findMatchingParent3(selection.anchor.getNode(), $isCodeNode3);
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
  useEffect8(() => {
    update();
    const removeSelection = editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        update();
        return false;
      },
      COMMAND_PRIORITY_LOW4
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
  useEffect8(() => {
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
      const code = $getNodeByKey3(codeKey);
      if (!$isCodeNode3(code)) return;
      code.setLanguage(normalizeCodeLanguage(language));
    });
    setToolbar(
      (current) => current ? { ...current, language } : current
    );
    setMenuOpen(false);
  };
  if (!toolbar || !containerRef.current) return null;
  const currentLabel = languageOptions.find((option) => option.id === toolbar.language)?.label ?? getHljsLanguageLabel(toolbar.language);
  const resolvedLanguage = allowedLanguages.has(toolbar.language) ? toolbar.language : languageOptions[0]?.id ?? toolbar.language;
  return createPortal2(
    /* @__PURE__ */ jsx5(
      "div",
      {
        ref: toolbarRef,
        className: "re-code-language-toolbar",
        style: {
          top: `${toolbar.top}px`,
          right: `${toolbar.right}px`
        },
        children: /* @__PURE__ */ jsxs3("div", { className: "re-code-language-picker", children: [
          /* @__PURE__ */ jsxs3(
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
                /* @__PURE__ */ jsx5("span", { className: "re-code-language-trigger-label", children: currentLabel }),
                /* @__PURE__ */ jsx5(
                  "svg",
                  {
                    className: "re-code-language-chevron",
                    width: "10",
                    height: "10",
                    viewBox: "0 0 10 10",
                    "aria-hidden": "true",
                    children: /* @__PURE__ */ jsx5(
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
          menuOpen && /* @__PURE__ */ jsx5(
            "ul",
            {
              className: "re-code-language-menu re-scrollbar",
              role: "listbox",
              "aria-label": labels.codeLanguage,
              children: languageOptions.map((option) => /* @__PURE__ */ jsx5("li", { role: "none", children: /* @__PURE__ */ jsx5(
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
import { useEffect as useEffect10, useState as useState5 } from "react";
import { createPortal as createPortal3 } from "react-dom";
import { useLexicalComposerContext as useLexicalComposerContext10 } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection as $getSelection9,
  $isRangeSelection as $isRangeSelection9,
  COMMAND_PRIORITY_LOW as COMMAND_PRIORITY_LOW6,
  SELECTION_CHANGE_COMMAND as SELECTION_CHANGE_COMMAND3
} from "lexical";

// src/components/toolbar/ToolbarIcons.tsx
import { jsx as jsx6, jsxs as jsxs4 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsxs4("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ jsx6("path", { d: "M6 4h8a4 4 0 0 1 0 8H6z" }),
    /* @__PURE__ */ jsx6("path", { d: "M6 12h9a4 4 0 0 1 0 8H6z" })
  ] });
}
function IconItalic(props) {
  return /* @__PURE__ */ jsxs4("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ jsx6("line", { x1: "19", y1: "4", x2: "10", y2: "4" }),
    /* @__PURE__ */ jsx6("line", { x1: "14", y1: "20", x2: "5", y2: "20" }),
    /* @__PURE__ */ jsx6("line", { x1: "15", y1: "4", x2: "9", y2: "20" })
  ] });
}
function IconUnderline(props) {
  return /* @__PURE__ */ jsxs4("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ jsx6("path", { d: "M6 4v6a6 6 0 0 0 12 0V4" }),
    /* @__PURE__ */ jsx6("line", { x1: "4", y1: "20", x2: "20", y2: "20" })
  ] });
}
function IconStrikethrough(props) {
  return /* @__PURE__ */ jsxs4("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ jsx6("path", { d: "M16 4H9a3 3 0 0 0-2.83 4" }),
    /* @__PURE__ */ jsx6("path", { d: "M14 12a4 4 0 0 1 0 8H6" }),
    /* @__PURE__ */ jsx6("line", { x1: "4", y1: "12", x2: "20", y2: "12" })
  ] });
}
function IconCode(props) {
  return /* @__PURE__ */ jsxs4("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ jsx6("polyline", { points: "16 18 22 12 16 6" }),
    /* @__PURE__ */ jsx6("polyline", { points: "8 6 2 12 8 18" })
  ] });
}
function IconQuote(props) {
  return /* @__PURE__ */ jsxs4("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ jsx6("path", { d: "M3 10h4v7H3z" }),
    /* @__PURE__ */ jsx6("path", { d: "M13 10h4v7h-4z" })
  ] });
}
function IconCodeBlock(props) {
  return /* @__PURE__ */ jsxs4("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ jsx6("rect", { x: "4", y: "4", width: "16", height: "16", rx: "2" }),
    /* @__PURE__ */ jsx6("path", { d: "M8 10l2 2-2 2" }),
    /* @__PURE__ */ jsx6("path", { d: "M13 14h3" })
  ] });
}
function IconBulletList(props) {
  return /* @__PURE__ */ jsxs4("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ jsx6("line", { x1: "9", y1: "6", x2: "20", y2: "6" }),
    /* @__PURE__ */ jsx6("line", { x1: "9", y1: "12", x2: "20", y2: "12" }),
    /* @__PURE__ */ jsx6("line", { x1: "9", y1: "18", x2: "20", y2: "18" }),
    /* @__PURE__ */ jsx6("circle", { cx: "5", cy: "6", r: "1.5", fill: "currentColor", stroke: "none" }),
    /* @__PURE__ */ jsx6("circle", { cx: "5", cy: "12", r: "1.5", fill: "currentColor", stroke: "none" }),
    /* @__PURE__ */ jsx6("circle", { cx: "5", cy: "18", r: "1.5", fill: "currentColor", stroke: "none" })
  ] });
}
function IconNumberedList(props) {
  return /* @__PURE__ */ jsxs4("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ jsx6("line", { x1: "10", y1: "6", x2: "20", y2: "6" }),
    /* @__PURE__ */ jsx6("line", { x1: "10", y1: "12", x2: "20", y2: "12" }),
    /* @__PURE__ */ jsx6("line", { x1: "10", y1: "18", x2: "20", y2: "18" }),
    /* @__PURE__ */ jsx6("path", { d: "M4 6h1v4H4" }),
    /* @__PURE__ */ jsx6("path", { d: "M4 16h2" }),
    /* @__PURE__ */ jsx6("path", { d: "M6 14H4" })
  ] });
}
function IconLink(props) {
  return /* @__PURE__ */ jsxs4("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ jsx6("path", { d: "M10 13a5 5 0 0 0 7.54.54l2.92-2.92a5 5 0 0 0-7.07-7.07l-1.5 1.5" }),
    /* @__PURE__ */ jsx6("path", { d: "M14 11a5 5 0 0 0-7.54-.54L3.54 13.4a5 5 0 0 0 7.07 7.07l1.5-1.5" })
  ] });
}
function IconHeading(props) {
  return /* @__PURE__ */ jsxs4("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ jsx6("path", { d: "M4 12V4h4v16H4v-8" }),
    /* @__PURE__ */ jsx6("path", { d: "M12 4h8" }),
    /* @__PURE__ */ jsx6("path", { d: "M16 4v16" })
  ] });
}
function IconMention(props) {
  return /* @__PURE__ */ jsxs4("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ jsx6("circle", { cx: "12", cy: "12", r: "4" }),
    /* @__PURE__ */ jsx6("path", { d: "M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" })
  ] });
}
function IconSpoiler(props) {
  return /* @__PURE__ */ jsxs4("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ jsx6("path", { d: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" }),
    /* @__PURE__ */ jsx6("line", { x1: "3", y1: "3", x2: "21", y2: "21" })
  ] });
}
function IconEdit(props) {
  return /* @__PURE__ */ jsxs4("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ jsx6("path", { d: "M12 20h9" }),
    /* @__PURE__ */ jsx6("path", { d: "M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" })
  ] });
}
function IconTrash(props) {
  return /* @__PURE__ */ jsxs4("svg", { ...defaults, ...props, children: [
    /* @__PURE__ */ jsx6("path", { d: "M3 6h18" }),
    /* @__PURE__ */ jsx6("path", { d: "M8 6V4h8v2" }),
    /* @__PURE__ */ jsx6("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }),
    /* @__PURE__ */ jsx6("line", { x1: "10", y1: "11", x2: "10", y2: "17" }),
    /* @__PURE__ */ jsx6("line", { x1: "14", y1: "11", x2: "14", y2: "17" })
  ] });
}

// src/components/toolbar/useFormatState.ts
import { useEffect as useEffect9, useState as useState4 } from "react";
import { useLexicalComposerContext as useLexicalComposerContext9 } from "@lexical/react/LexicalComposerContext";
import { $createCodeNode, $isCodeNode as $isCodeNode4 } from "@lexical/code";
import { $isLinkNode } from "@lexical/link";
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
import { $findMatchingParent as $findMatchingParent4 } from "@lexical/utils";
import {
  $createParagraphNode as $createParagraphNode5,
  $createTextNode as $createTextNode3,
  $getSelection as $getSelection8,
  $isRangeSelection as $isRangeSelection8,
  COMMAND_PRIORITY_LOW as COMMAND_PRIORITY_LOW5,
  FORMAT_TEXT_COMMAND as FORMAT_TEXT_COMMAND2,
  SELECTION_CHANGE_COMMAND as SELECTION_CHANGE_COMMAND2
} from "lexical";

// src/context/LinkUiContext.tsx
import {
  createContext as createContext2,
  useContext as useContext2,
  useMemo as useMemo3
} from "react";
import { jsx as jsx7 } from "react/jsx-runtime";
var LinkUiContext = createContext2(null);
function LinkUiProvider({
  openLinkDialog,
  children
}) {
  const value = useMemo3(() => ({ openLinkDialog }), [openLinkDialog]);
  return /* @__PURE__ */ jsx7(LinkUiContext.Provider, { value, children });
}
function useLinkUiOptional() {
  return useContext2(LinkUiContext);
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
  const [editor] = useLexicalComposerContext9();
  const [state, setState] = useState4(emptyFormat);
  useEffect9(() => {
    const update = () => {
      editor.getEditorState().read(() => {
        const selection = $getSelection8();
        if (!$isRangeSelection8(selection)) {
          setState(emptyFormat);
          return;
        }
        const anchorNode = selection.anchor.getNode();
        const listNode = $findMatchingParent4(anchorNode, $isListNode);
        setState({
          bold: selection.hasFormat("bold"),
          italic: selection.hasFormat("italic"),
          underline: selection.hasFormat("underline"),
          strikethrough: selection.hasFormat("strikethrough"),
          code: selection.hasFormat("code"),
          quote: !!$findMatchingParent4(anchorNode, $isQuoteNode5),
          codeBlock: !!$findMatchingParent4(anchorNode, $isCodeNode4),
          bulletList: listNode?.getListType() === "bullet",
          numberedList: listNode?.getListType() === "number",
          link: !!$findMatchingParent4(anchorNode, $isLinkNode),
          heading: !!$findMatchingParent4(anchorNode, $isHeadingNode),
          spoiler: !!$findMatchingParent4(anchorNode, $isSpoilerNode)
        });
      });
    };
    const removeUpdate = editor.registerUpdateListener(() => update());
    const removeSelection = editor.registerCommand(
      SELECTION_CHANGE_COMMAND2,
      () => {
        update();
        return false;
      },
      COMMAND_PRIORITY_LOW5
    );
    return () => {
      removeUpdate();
      removeSelection();
    };
  }, [editor]);
  return state;
}
function useFormatActions() {
  const [editor] = useLexicalComposerContext9();
  const linkUi = useLinkUiOptional();
  return {
    bold: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND2, "bold"),
    italic: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND2, "italic"),
    underline: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND2, "underline"),
    strikethrough: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND2, "strikethrough"),
    code: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND2, "code"),
    quote: () => {
      editor.update(() => {
        const selection = $getSelection8();
        if (!$isRangeSelection8(selection)) return;
        $applyQuoteToSelection(selection);
      });
    },
    codeBlock: () => {
      editor.update(() => {
        const selection = $getSelection8();
        if (!$isRangeSelection8(selection)) return;
        const inCode = !!$findMatchingParent4(
          selection.anchor.getNode(),
          $isCodeNode4
        );
        if (inCode) {
          $setBlocksType(selection, () => $createParagraphNode5());
        } else {
          $setBlocksType(selection, () => $createCodeNode());
        }
      });
    },
    bulletList: () => {
      editor.update(() => {
        const selection = $getSelection8();
        if (!$isRangeSelection8(selection)) return;
        const listNode = $findMatchingParent4(
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
        const selection = $getSelection8();
        if (!$isRangeSelection8(selection)) return;
        const listNode = $findMatchingParent4(
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
      linkUi?.openLinkDialog();
    },
    heading: () => {
      editor.update(() => {
        const selection = $getSelection8();
        if (!$isRangeSelection8(selection)) return;
        const heading = $findMatchingParent4(
          selection.anchor.getNode(),
          $isHeadingNode
        );
        if (heading) {
          $setBlocksType(selection, () => $createParagraphNode5());
        } else {
          $setBlocksType(selection, () => $createHeadingNode("h2"));
        }
      });
    },
    mentionTrigger: () => {
      editor.update(() => {
        const selection = $getSelection8();
        if ($isRangeSelection8(selection)) {
          selection.insertText("@");
        }
      });
      editor.focus();
    },
    spoiler: () => {
      editor.update(() => {
        const selection = $getSelection8();
        if (!$isRangeSelection8(selection) || selection.isCollapsed()) return;
        const anchorNode = selection.anchor.getNode();
        const existing = $findMatchingParent4(anchorNode, $isSpoilerNode);
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
import { jsx as jsx8 } from "react/jsx-runtime";
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
      return /* @__PURE__ */ jsx8(IconBold, {});
    case "italic":
      return /* @__PURE__ */ jsx8(IconItalic, {});
    case "underline":
      return /* @__PURE__ */ jsx8(IconUnderline, {});
    case "strikethrough":
      return /* @__PURE__ */ jsx8(IconStrikethrough, {});
    case "code":
      return /* @__PURE__ */ jsx8(IconCode, {});
    case "quote":
      return /* @__PURE__ */ jsx8(IconQuote, {});
    case "codeBlock":
      return /* @__PURE__ */ jsx8(IconCodeBlock, {});
    case "bulletList":
      return /* @__PURE__ */ jsx8(IconBulletList, {});
    case "numberedList":
      return /* @__PURE__ */ jsx8(IconNumberedList, {});
    case "link":
      return /* @__PURE__ */ jsx8(IconLink, {});
    case "heading":
      return /* @__PURE__ */ jsx8(IconHeading, {});
    case "mention":
      return /* @__PURE__ */ jsx8(IconMention, {});
    case "spoiler":
      return /* @__PURE__ */ jsx8(IconSpoiler, {});
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
  const [editor] = useLexicalComposerContext10();
  const active = useFormatState();
  const format = useFormatActions();
  const [position, setPosition] = useState5(
    null
  );
  const visibleItems = items.filter((item) => isItemEnabled(item, features));
  useEffect10(() => {
    if (!features.selectionMenu || visibleItems.length === 0) {
      setPosition(null);
      return;
    }
    const update = () => {
      editor.getEditorState().read(() => {
        const selection = $getSelection9();
        if (!$isRangeSelection9(selection) || selection.isCollapsed()) {
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
      SELECTION_CHANGE_COMMAND3,
      () => {
        update();
        return false;
      },
      COMMAND_PRIORITY_LOW6
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
  const menu = /* @__PURE__ */ jsx8(
    "div",
    {
      className: "re-selection-menu",
      style: {
        top: `${Math.max(0, position.top)}px`,
        left: `${position.left}px`
      },
      role: "toolbar",
      "aria-label": labels.selectionMenu,
      children: visibleItems.map((item) => /* @__PURE__ */ jsx8(
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
          children: /* @__PURE__ */ jsx8(MenuIcon, { item })
        },
        item
      ))
    }
  );
  return createPortal3(menu, containerRef.current ?? document.body);
}

// src/components/plugins/LineBreakPlugin.tsx
import { useEffect as useEffect11 } from "react";
import { useLexicalComposerContext as useLexicalComposerContext11 } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection as $getSelection10,
  $isRangeSelection as $isRangeSelection10,
  COMMAND_PRIORITY_HIGH as COMMAND_PRIORITY_HIGH3,
  INSERT_LINE_BREAK_COMMAND
} from "lexical";
function LineBreakPlugin() {
  const [editor] = useLexicalComposerContext11();
  useEffect11(() => {
    return editor.registerCommand(
      INSERT_LINE_BREAK_COMMAND,
      () => {
        const selection = $getSelection10();
        if (!$isRangeSelection10(selection)) return false;
        if ($getBlockCode(selection.anchor.getNode())) return false;
        selection.insertParagraph();
        return true;
      },
      COMMAND_PRIORITY_HIGH3
    );
  }, [editor]);
  return null;
}

// src/components/plugins/LinkUiPlugin.tsx
import { useCallback as useCallback5, useEffect as useEffect12, useId as useId2, useRef as useRef3, useState as useState6 } from "react";
import { createPortal as createPortal4 } from "react-dom";
import { useLexicalComposerContext as useLexicalComposerContext12 } from "@lexical/react/LexicalComposerContext";
import { $isLinkNode as $isLinkNode3 } from "@lexical/link";
import { $findMatchingParent as $findMatchingParent5 } from "@lexical/utils";
import {
  $getNearestNodeFromDOMNode,
  $getNodeByKey as $getNodeByKey5,
  $getSelection as $getSelection12,
  $isRangeSelection as $isRangeSelection12,
  CLICK_COMMAND as CLICK_COMMAND2,
  COMMAND_PRIORITY_HIGH as COMMAND_PRIORITY_HIGH4
} from "lexical";

// src/core/links.ts
import { $createLinkNode, $isLinkNode as $isLinkNode2 } from "@lexical/link";
import {
  $createTextNode as $createTextNode4,
  $getNodeByKey as $getNodeByKey4,
  $getSelection as $getSelection11,
  $isRangeSelection as $isRangeSelection11
} from "lexical";
function $applyLinkForm(values, linkKey) {
  const text = values.text.trim();
  const url = values.url.trim();
  if (!text || !url) return;
  if (linkKey) {
    const link2 = $getNodeByKey4(linkKey);
    if (!$isLinkNode2(link2)) return;
    const nextLink = $createLinkNode(url, {
      rel: link2.getRel(),
      target: link2.getTarget(),
      title: link2.getTitle()
    });
    nextLink.append($createTextNode4(text));
    link2.replace(nextLink);
    nextLink.selectEnd();
    return;
  }
  const selection = $getSelection11();
  if (!$isRangeSelection11(selection)) return;
  if (!selection.isCollapsed()) {
    selection.removeText();
  }
  const link = $createLinkNode(url);
  link.append($createTextNode4(text));
  selection.insertNodes([link]);
}
function $removeLinkByKey(linkKey) {
  const link = $getNodeByKey4(linkKey);
  if (!$isLinkNode2(link)) return;
  const textNode = $createTextNode4(link.getTextContent());
  link.replace(textNode);
  textNode.select();
}

// src/components/plugins/LinkUiPlugin.tsx
import { Fragment, jsx as jsx9, jsxs as jsxs5 } from "react/jsx-runtime";
function LinkModal({
  state,
  labels,
  onClose,
  onSave
}) {
  const titleId = useId2();
  const textId = useId2();
  const urlId = useId2();
  const [text, setText] = useState6(state.text);
  const [url, setUrl] = useState6(state.url);
  const textRef = useRef3(null);
  useEffect12(() => {
    setText(state.text);
    setUrl(state.url || "https://");
    const timer = window.setTimeout(() => textRef.current?.focus(), 0);
    return () => window.clearTimeout(timer);
  }, [state]);
  useEffect12(() => {
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
  return createPortal4(
    /* @__PURE__ */ jsx9("div", { className: "re-link-modal-backdrop", onMouseDown: onClose, children: /* @__PURE__ */ jsxs5(
      "div",
      {
        className: "re-link-modal",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": titleId,
        onMouseDown: (event) => event.stopPropagation(),
        children: [
          /* @__PURE__ */ jsx9("h3", { id: titleId, className: "re-link-modal-title", children: title }),
          /* @__PURE__ */ jsxs5("label", { className: "re-link-field", htmlFor: textId, children: [
            /* @__PURE__ */ jsx9("span", { className: "re-link-field-label", children: labels.linkText }),
            /* @__PURE__ */ jsx9(
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
          /* @__PURE__ */ jsxs5("label", { className: "re-link-field", htmlFor: urlId, children: [
            /* @__PURE__ */ jsx9("span", { className: "re-link-field-label", children: labels.linkUrl }),
            /* @__PURE__ */ jsx9(
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
          /* @__PURE__ */ jsxs5("div", { className: "re-link-modal-actions", children: [
            /* @__PURE__ */ jsx9(
              "button",
              {
                type: "button",
                className: "re-link-modal-btn re-link-modal-btn-secondary",
                onClick: onClose,
                children: labels.linkCancel
              }
            ),
            /* @__PURE__ */ jsx9(
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
  return /* @__PURE__ */ jsxs5(
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
        /* @__PURE__ */ jsx9(
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
            children: /* @__PURE__ */ jsx9(IconEdit, {})
          }
        ),
        /* @__PURE__ */ jsx9(
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
            children: /* @__PURE__ */ jsx9(IconTrash, {})
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
    return /* @__PURE__ */ jsx9(Fragment, { children });
  }
  return /* @__PURE__ */ jsx9(LinkUiPluginInner, { labels, containerRef, children });
}
function LinkUiPluginInner({
  labels,
  containerRef,
  children
}) {
  const [editor] = useLexicalComposerContext12();
  const [modal, setModal] = useState6(null);
  const [toolbar, setToolbar] = useState6(null);
  const closeModal = useCallback5(() => setModal(null), []);
  const hideToolbar = useCallback5(() => setToolbar(null), []);
  const openLinkDialog = useCallback5(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection12();
      if (!$isRangeSelection12(selection)) return;
      const existing = $findMatchingParent5(selection.anchor.getNode(), $isLinkNode3);
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
  const openEditForLinkKey = useCallback5(
    (linkKey) => {
      editor.getEditorState().read(() => {
        const link = $getNodeByKey5(linkKey);
        if (!$isLinkNode3(link)) return;
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
  const handleSaveModal = useCallback5(
    (text, url, linkKey) => {
      editor.update(() => {
        $applyLinkForm({ text, url }, linkKey);
      });
      closeModal();
      editor.focus();
    },
    [closeModal, editor]
  );
  const removeLink = useCallback5(
    (linkKey) => {
      editor.update(() => {
        $removeLinkByKey(linkKey);
      });
      hideToolbar();
    },
    [editor, hideToolbar]
  );
  useEffect12(() => {
    const removeClick = editor.registerCommand(
      CLICK_COMMAND2,
      (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return false;
        const anchor = target.closest("a.re-link");
        if (!anchor || !containerRef.current?.contains(anchor)) return false;
        event.preventDefault();
        const node = $getNearestNodeFromDOMNode(anchor);
        const link = node ? $findMatchingParent5(node, $isLinkNode3) : null;
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
      COMMAND_PRIORITY_HIGH4
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
  useEffect12(() => {
    if (!toolbar) return;
    const update = () => {
      editor.getEditorState().read(() => {
        const link = $getNodeByKey5(toolbar.linkKey);
        if (!$isLinkNode3(link)) {
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
  return /* @__PURE__ */ jsxs5(LinkUiProvider, { openLinkDialog, children: [
    children,
    toolbar && containerRef.current && createPortal4(
      /* @__PURE__ */ jsx9(
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
    modal && /* @__PURE__ */ jsx9(
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
import { useEffect as useEffect13, useRef as useRef4 } from "react";
import { useLexicalComposerContext as useLexicalComposerContext13 } from "@lexical/react/LexicalComposerContext";
import { $findMatchingParent as $findMatchingParent6 } from "@lexical/utils";
import { $getSelection as $getSelection13, $isRangeSelection as $isRangeSelection13 } from "lexical";
function SpoilerPlugin() {
  const [editor] = useLexicalComposerContext13();
  const editingRef = useRef4(null);
  useEffect13(() => {
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
        const selection = $getSelection13();
        if (!$isRangeSelection13(selection)) return;
        const spoiler = $findMatchingParent6(
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
import { useLexicalComposerContext as useLexicalComposerContext14 } from "@lexical/react/LexicalComposerContext";
import {
  $nodesOfType,
  COMMAND_PRIORITY_HIGH as COMMAND_PRIORITY_HIGH5,
  PASTE_COMMAND as PASTE_COMMAND2
} from "lexical";
import { useEffect as useEffect14, useRef as useRef5 } from "react";
function syncUploadedImages(editor, attachments) {
  editor.update(() => {
    const imageNodes = $nodesOfType(ImageNode);
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
  const [editor] = useLexicalComposerContext14();
  const dragDepthRef = useRef5(0);
  useEffect14(() => {
    if (disabled) return;
    syncUploadedImages(editor, attachments);
  }, [attachments, disabled, editor]);
  useEffect14(() => {
    if (disabled) return;
    return editor.registerCommand(
      PASTE_COMMAND2,
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
      COMMAND_PRIORITY_HIGH5
    );
  }, [addFiles, disabled, editor]);
  useEffect14(() => {
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
  const [editor] = useLexicalComposerContext15();
  const lastApplied = useRef6(void 0);
  useEffect15(() => {
    if (html === lastApplied.current) return;
    editor.update(() => {
      const root = $getRoot5();
      root.clear();
      if (!html?.trim()) {
        const paragraph = $createParagraphNode6();
        root.append(paragraph);
        paragraph.select();
        $clearStickyTextFormats();
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
  const [editor] = useLexicalComposerContext15();
  useEffect15(() => {
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
  const [editor] = useLexicalComposerContext15();
  useEffect15(() => {
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
  const [editor] = useLexicalComposerContext15();
  useEffect15(() => {
    setHtmlRef.current = (html) => {
      editor.update(() => {
        const root = $getRoot5();
        root.clear();
        if (!html.trim()) {
          const paragraph = $createParagraphNode6();
          root.append(paragraph);
          paragraph.select();
          $clearStickyTextFormats();
          return;
        }
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
  clearRef,
  resetFormatsRef
}) {
  const [editor] = useLexicalComposerContext15();
  useEffect15(() => {
    const resetFormats = () => {
      editor.update(() => {
        $clearStickyTextFormats();
      });
    };
    clearRef.current = () => {
      editor.update(() => {
        const root = $getRoot5();
        root.clear();
        const paragraph = $createParagraphNode6();
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
  const [editor] = useLexicalComposerContext15();
  useEffect15(() => {
    const update = () => {
      editor.getEditorState().read(() => {
        onEmptyChange($getRoot5().getTextContent().trim() === "");
      });
    };
    update();
    return editor.registerUpdateListener(() => update());
  }, [editor, onEmptyChange]);
  return null;
}

// src/components/attachments/AttachmentsBridge.tsx
import { useLexicalComposerContext as useLexicalComposerContext16 } from "@lexical/react/LexicalComposerContext";

// src/components/attachments/AttachmentStrip.tsx
import { useCallback as useCallback6, useRef as useRef7, useState as useState7 } from "react";

// src/components/attachments/AttachmentThumb.tsx
import { jsx as jsx10 } from "react/jsx-runtime";
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
    return /* @__PURE__ */ jsx10(
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
    return /* @__PURE__ */ jsx10(
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
  return /* @__PURE__ */ jsx10("span", { className: "re-attachment-file-icon", "aria-hidden": "true", children: getFileExtension(name) || "FILE" });
}

// src/components/attachments/AttachmentStrip.tsx
import { Fragment as Fragment2, jsx as jsx11, jsxs as jsxs6 } from "react/jsx-runtime";
function useAttachmentUploads({
  onUploadFile,
  disabled
}) {
  const [attachments, setAttachments] = useState7([]);
  const abortControllers = useRef7(/* @__PURE__ */ new Map());
  const uploadSingle = useCallback6(
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
  const addFiles = useCallback6(
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
  const removeAttachment = useCallback6((localId) => {
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
  const clearAttachments = useCallback6(() => {
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
  return /* @__PURE__ */ jsx11(
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
  return /* @__PURE__ */ jsx11("div", { className: "re-attachments", "aria-label": labels.attachments, children: attachments.map((attachment) => {
    const canInsert = attachment.status === "ready";
    return /* @__PURE__ */ jsxs6(
      "div",
      {
        className: `re-attachment-item re-attachment-item-${attachment.status}`,
        children: [
          /* @__PURE__ */ jsxs6(
            "button",
            {
              type: "button",
              className: "re-attachment-main",
              disabled: disabled || !canInsert,
              title: canInsert ? labels.insertAttachment : attachment.error,
              onClick: () => onInsert(attachment.localId),
              children: [
                /* @__PURE__ */ jsx11(AttachmentPreview, { attachment }),
                /* @__PURE__ */ jsxs6("span", { className: "re-attachment-meta", children: [
                  /* @__PURE__ */ jsx11("span", { className: "re-attachment-name", children: attachment.name }),
                  /* @__PURE__ */ jsx11("span", { className: "re-attachment-sub", children: attachment.status === "uploading" ? `${labels.uploading} ${attachment.progress ?? 0}%` : attachment.status === "error" ? attachment.error ?? labels.uploadFailed : formatFileSize(attachment.size) })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx11(
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
  const inputRef = useRef7(null);
  return /* @__PURE__ */ jsxs6(Fragment2, { children: [
    /* @__PURE__ */ jsx11(
      "button",
      {
        type: "button",
        className: "re-toolbar-btn",
        "aria-label": labels.attachFile,
        title: labels.attachFile,
        disabled,
        onClick: () => inputRef.current?.click(),
        children: /* @__PURE__ */ jsx11("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ jsx11(
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
    /* @__PURE__ */ jsx11(
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
import { jsx as jsx12 } from "react/jsx-runtime";
function AttachmentsBridge({
  attachments,
  labels,
  disabled,
  onRemove
}) {
  const [editor] = useLexicalComposerContext16();
  return /* @__PURE__ */ jsx12(
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
import { useState as useState8, useId as useId3, useEffect as useEffect16 } from "react";

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
import { Fragment as Fragment3, jsx as jsx13, jsxs as jsxs7 } from "react/jsx-runtime";
function ToolbarButton({
  label,
  active,
  onClick,
  shortcutId,
  children
}) {
  const shortcut = shortcutId ? shortcutById(shortcutId) : void 0;
  return /* @__PURE__ */ jsx13(
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
  const [menuOpen, setMenuOpen] = useState8(false);
  const menuId = useId3();
  const hasMenu = !!slots.toolbarMenu;
  useEffect16(() => {
    if (!menuOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);
  return /* @__PURE__ */ jsxs7(
    "div",
    {
      className: "re-toolbar",
      role: "toolbar",
      "aria-label": labels.toolbar,
      "aria-controls": editorInputId,
      children: [
        /* @__PURE__ */ jsxs7("div", { className: "re-toolbar-group re-toolbar-group-main", children: [
          slots.toolbarStart,
          features.bold && /* @__PURE__ */ jsx13(
            ToolbarButton,
            {
              label: labels.bold,
              active: active.bold,
              onClick: format.bold,
              shortcutId: "format.bold",
              children: /* @__PURE__ */ jsx13(IconBold, {})
            }
          ),
          features.italic && /* @__PURE__ */ jsx13(
            ToolbarButton,
            {
              label: labels.italic,
              active: active.italic,
              onClick: format.italic,
              shortcutId: "format.italic",
              children: /* @__PURE__ */ jsx13(IconItalic, {})
            }
          ),
          features.underline && /* @__PURE__ */ jsx13(
            ToolbarButton,
            {
              label: labels.underline,
              active: active.underline,
              onClick: format.underline,
              shortcutId: "format.underline",
              children: /* @__PURE__ */ jsx13(IconUnderline, {})
            }
          ),
          features.strikethrough && /* @__PURE__ */ jsx13(
            ToolbarButton,
            {
              label: labels.strikethrough,
              active: active.strikethrough,
              onClick: format.strikethrough,
              shortcutId: "format.strikethrough",
              children: /* @__PURE__ */ jsx13(IconStrikethrough, {})
            }
          ),
          features.code && /* @__PURE__ */ jsx13(
            ToolbarButton,
            {
              label: labels.code,
              active: active.code,
              onClick: format.code,
              shortcutId: "format.code",
              children: /* @__PURE__ */ jsx13(IconCode, {})
            }
          ),
          features.spoiler && /* @__PURE__ */ jsx13(
            ToolbarButton,
            {
              label: labels.spoiler,
              active: active.spoiler,
              onClick: format.spoiler,
              children: /* @__PURE__ */ jsx13(IconSpoiler, {})
            }
          ),
          features.quote && /* @__PURE__ */ jsx13(
            ToolbarButton,
            {
              label: labels.quote,
              active: active.quote,
              onClick: format.quote,
              children: /* @__PURE__ */ jsx13(IconQuote, {})
            }
          ),
          features.codeBlock && /* @__PURE__ */ jsx13(
            ToolbarButton,
            {
              label: labels.codeBlock,
              active: active.codeBlock,
              onClick: format.codeBlock,
              children: /* @__PURE__ */ jsx13(IconCodeBlock, {})
            }
          ),
          features.lists && /* @__PURE__ */ jsxs7(Fragment3, { children: [
            /* @__PURE__ */ jsx13(
              ToolbarButton,
              {
                label: labels.bulletList,
                active: active.bulletList,
                onClick: format.bulletList,
                children: /* @__PURE__ */ jsx13(IconBulletList, {})
              }
            ),
            /* @__PURE__ */ jsx13(
              ToolbarButton,
              {
                label: labels.numberedList,
                active: active.numberedList,
                onClick: format.numberedList,
                children: /* @__PURE__ */ jsx13(IconNumberedList, {})
              }
            )
          ] }),
          features.links && /* @__PURE__ */ jsx13(
            ToolbarButton,
            {
              label: labels.link,
              active: active.link,
              onClick: format.link,
              children: /* @__PURE__ */ jsx13(IconLink, {})
            }
          ),
          features.headings && /* @__PURE__ */ jsx13(
            ToolbarButton,
            {
              label: labels.heading,
              active: active.heading,
              onClick: format.heading,
              children: /* @__PURE__ */ jsx13(IconHeading, {})
            }
          ),
          showMentionButton && /* @__PURE__ */ jsx13(ToolbarButton, { label: labels.mention, onClick: format.mentionTrigger, children: /* @__PURE__ */ jsx13(IconMention, {}) }),
          showAttachButton && onAttachFiles && /* @__PURE__ */ jsx13(
            AttachmentUploadButton,
            {
              labels,
              accept: acceptFiles,
              onFilesSelected: onAttachFiles
            }
          )
        ] }),
        (slots.toolbarEnd || hasMenu) && /* @__PURE__ */ jsxs7("div", { className: "re-toolbar-group", style: { position: "relative" }, children: [
          slots.toolbarEnd,
          hasMenu && /* @__PURE__ */ jsxs7(Fragment3, { children: [
            /* @__PURE__ */ jsx13(
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
            menuOpen && /* @__PURE__ */ jsxs7(Fragment3, { children: [
              /* @__PURE__ */ jsx13(
                "div",
                {
                  className: "re-toolbar-menu-backdrop",
                  onClick: () => setMenuOpen(false),
                  "aria-hidden": "true"
                }
              ),
              /* @__PURE__ */ jsx13(
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
  return features.bold || features.italic || features.underline || features.strikethrough || features.code || features.quote || features.codeBlock || features.lists || features.links || features.headings || features.spoiler || features.mentions || features.attachments || !!slots.toolbarStart || !!slots.toolbarEnd || !!slots.toolbarMenu;
}

// src/components/RichTextEditor.tsx
import { Fragment as Fragment4, jsx as jsx14, jsxs as jsxs8 } from "react/jsx-runtime";
function onError(error) {
  console.error(error);
}
function exportEditorHtml(editor, options) {
  let html = "";
  editor.getEditorState().read(() => {
    html = $generateHtmlFromNodes(editor, null);
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
  const [editor] = useLexicalComposerContext17();
  useEffect17(() => {
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
  return /* @__PURE__ */ jsx14(
    "button",
    {
      type: "button",
      onClick: onSubmit,
      disabled,
      className: "re-submit-btn",
      "aria-label": label,
      title: label,
      children: /* @__PURE__ */ jsx14("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx14("path", { d: "M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" }) })
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
    return /* @__PURE__ */ jsx14(Fragment4, { children: slots.submitButton });
  }
  if (!showDefault) return null;
  return /* @__PURE__ */ jsx14(
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
  const ctx = useMemo4(
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
  return /* @__PURE__ */ jsx14(RichTextEditorProvider, { value: ctx, children });
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
  const features = useMemo4(() => resolveFeatures(featuresProp), [featuresProp]);
  const labels = useMemo4(() => resolveLabels(labelsProp), [labelsProp]);
  const slots = useMemo4(() => collectSlots(children), [children]);
  const rootId = useId4();
  const editorInputId = `${rootId}-input`;
  const placeholderId = `${rootId}-placeholder`;
  const rootRef = useRef8(null);
  const bodyRef = useRef8(null);
  const getHtmlRef = useRef8(null);
  const setHtmlRef = useRef8(null);
  const clearRef = useRef8(null);
  const resetFormatsRef = useRef8(null);
  const focusRef = useRef8(null);
  const [isEmpty, setIsEmpty] = useState9(true);
  const [sending, setSending] = useState9(false);
  const attachmentsEnabled = features.attachments && !!onUploadFile;
  const uploads = useAttachmentUploads({
    onUploadFile: onUploadFile ?? (async () => {
      throw new Error("onUploadFile is required when attachments feature is enabled");
    }),
    disabled: disabled || !attachmentsEnabled
  });
  const inputStyle = useMemo4(
    () => ({
      minHeight: `${minRows * EDITOR_LINE_HEIGHT_PX}px`,
      maxHeight: `${maxRows * EDITOR_LINE_HEIGHT_PX}px`
    }),
    [minRows, maxRows]
  );
  const enterBindings = useMemo4(
    () => resolveEnterKeyBindings({ enterBehavior, enterKeyBindings }),
    [enterBehavior, enterKeyBindings]
  );
  const initialConfig = useMemo4(
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
        ...features.spoiler ? [SpoilerNode] : [],
        ...attachmentsEnabled ? [ImageNode, FileLinkNode] : []
      ]
    }),
    [attachmentsEnabled, disabled, features.mentions, features.quote, features.spoiler]
  );
  const transformers = useMemo4(
    () => features.markdownShortcuts ? buildMarkdownTransformers(features) : [],
    [features]
  );
  const getHtml = useCallback7(() => getHtmlRef.current?.() ?? "", []);
  const submit = useCallback7(async () => {
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
  useImperativeHandle(
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
  return /* @__PURE__ */ jsxs8(LexicalComposer, { initialConfig, children: [
    /* @__PURE__ */ jsx14(EditorRefPlugin, { getHtmlRef, useTrim }),
    /* @__PURE__ */ jsx14(SetHtmlPlugin, { setHtmlRef }),
    /* @__PURE__ */ jsx14(ClearPlugin, { clearRef, resetFormatsRef }),
    /* @__PURE__ */ jsx14(FocusPlugin, { focusRef }),
    /* @__PURE__ */ jsx14(EmptyStatePlugin, { onEmptyChange: setIsEmpty }),
    /* @__PURE__ */ jsx14(LinkUiPlugin, { labels, containerRef: bodyRef, enabled: features.links, children: /* @__PURE__ */ jsx14(
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
        children: /* @__PURE__ */ jsxs8(
          "div",
          {
            ref: rootRef,
            id: rootId,
            ...themeDataAttribute(theme),
            className: cn("re-editor-root", className),
            children: [
              showToolbar && /* @__PURE__ */ jsx14(
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
              /* @__PURE__ */ jsx14(
                BlurCapturePlugin,
                {
                  rootRef,
                  onBlur,
                  getHtml
                }
              ),
              /* @__PURE__ */ jsxs8(
                "div",
                {
                  ref: bodyRef,
                  className: cn(
                    "re-editor-body",
                    bodyHasSubmitPadding && "re-editor-body-has-submit"
                  ),
                  children: [
                    /* @__PURE__ */ jsx14(BlockBehaviorPlugin, {}),
                    /* @__PURE__ */ jsx14(LineBreakPlugin, {}),
                    features.spoiler && /* @__PURE__ */ jsx14(SpoilerPlugin, {}),
                    /* @__PURE__ */ jsx14(InitialHtmlPlugin, { html: value }),
                    /* @__PURE__ */ jsx14(
                      RichTextPlugin,
                      {
                        contentEditable: /* @__PURE__ */ jsx14(
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
                        placeholder: placeholder ? /* @__PURE__ */ jsx14("div", { id: placeholderId, className: "re-editor-placeholder", "aria-hidden": "true", children: placeholder }) : null,
                        ErrorBoundary: LexicalErrorBoundary
                      }
                    ),
                    /* @__PURE__ */ jsx14(HistoryPlugin, {}),
                    features.lists && /* @__PURE__ */ jsx14(ListPlugin, {}),
                    features.links && /* @__PURE__ */ jsx14(LinkPlugin, {}),
                    features.codeBlock && /* @__PURE__ */ jsxs8(Fragment4, { children: [
                      /* @__PURE__ */ jsx14(CodeHighlightPlugin, { enabled: !disabled }),
                      /* @__PURE__ */ jsx14(
                        CodeLanguagePlugin,
                        {
                          labels,
                          containerRef: bodyRef,
                          codeLanguages
                        }
                      )
                    ] }),
                    transformers.length > 0 && /* @__PURE__ */ jsx14(MarkdownShortcutPlugin, { transformers }),
                    /* @__PURE__ */ jsx14(MarkdownPastePlugin, { features }),
                    /* @__PURE__ */ jsx14(KeyboardShortcutsPlugin, { features, disabled }),
                    features.mentions && mentionSearch && /* @__PURE__ */ jsx14(MentionsPlugin, { searchMentions: mentionSearch }),
                    attachmentsEnabled && /* @__PURE__ */ jsx14(
                      AttachmentsPlugin,
                      {
                        disabled,
                        attachments: uploads.attachments,
                        addFiles: uploads.addFiles,
                        containerRef: bodyRef
                      }
                    ),
                    /* @__PURE__ */ jsx14(
                      EnterPlugin,
                      {
                        bindings: enterBindings,
                        onSubmit: onSubmit ? () => void submit() : void 0
                      }
                    ),
                    features.selectionMenu && /* @__PURE__ */ jsx14(
                      SelectionMenuPlugin,
                      {
                        features,
                        labels,
                        items: selectionMenuItems,
                        containerRef: bodyRef
                      }
                    ),
                    attachmentsEnabled && /* @__PURE__ */ jsx14(
                      AttachmentsBridge,
                      {
                        attachments: uploads.attachments,
                        labels,
                        disabled,
                        onRemove: uploads.removeAttachment
                      }
                    ),
                    /* @__PURE__ */ jsx14(
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
              slots.footer && /* @__PURE__ */ jsx14("div", { className: "re-footer", children: slots.footer })
            ]
          }
        )
      }
    ) })
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
import { useEffect as useEffect18, useLayoutEffect, useMemo as useMemo5, useRef as useRef9, useState as useState10 } from "react";

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
import { jsx as jsx15, jsxs as jsxs9 } from "react/jsx-runtime";
function ViewerAttachments({
  attachments,
  labels
}) {
  if (attachments.length === 0) return null;
  return /* @__PURE__ */ jsx15("div", { className: "re-attachments re-viewer-attachments", "aria-label": labels.attachments, children: attachments.map((file) => /* @__PURE__ */ jsxs9(
    "a",
    {
      className: "re-attachment-item re-viewer-attachment-item",
      href: file.url,
      target: "_blank",
      rel: "noopener noreferrer",
      title: file.name,
      children: [
        /* @__PURE__ */ jsx15(
          AttachmentThumb,
          {
            name: file.name,
            mimeType: file.mimeType,
            previewUrl: getPayloadPreviewUrl(file)
          }
        ),
        /* @__PURE__ */ jsxs9("span", { className: "re-attachment-meta", children: [
          /* @__PURE__ */ jsx15("span", { className: "re-attachment-name", children: file.name }),
          /* @__PURE__ */ jsx15("span", { className: "re-attachment-sub", children: formatFileSize(file.size) })
        ] })
      ]
    },
    file.id
  )) });
}

// src/components/RichTextViewer.tsx
import { jsx as jsx16, jsxs as jsxs10 } from "react/jsx-runtime";
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
  const features = useMemo5(
    () => resolveViewerFeatures(featuresProp),
    [featuresProp]
  );
  const labels = useMemo5(
    () => resolveViewerLabels(labelsProp),
    [labelsProp]
  );
  const ref = useRef9(null);
  const [displayHtml, setDisplayHtml] = useState10(null);
  const prepared = useMemo5(
    () => prepareViewerContent(content, features),
    [content, features.linkTarget]
  );
  const preparedHtml = prepared.kind === "html" ? prepared.html : "";
  useEffect18(() => {
    setDisplayHtml(null);
  }, [content, features.codeHighlight]);
  const attachmentStrip = showAttachments && attachments.length > 0 ? /* @__PURE__ */ jsx16(ViewerAttachments, { attachments, labels }) : null;
  useLayoutEffect(() => {
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
  useEffect18(() => {
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
  useEffect18(() => {
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
    return /* @__PURE__ */ jsxs10(
      "div",
      {
        ...themeDataAttribute(theme),
        className: cn("re-viewer-shell", className),
        children: [
          /* @__PURE__ */ jsx16("p", { className: "re-viewer re-viewer-plain", "aria-label": labels.content, children: prepared.text }),
          attachmentStrip
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs10(
    "div",
    {
      ...themeDataAttribute(theme),
      className: cn("re-viewer-shell", className),
      children: [
        /* @__PURE__ */ jsx16(
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
  trimEditorHtml,
  useRichTextEditor
};
//# sourceMappingURL=index.js.map