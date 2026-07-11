"use client";

// src/core/attachmentInsert.ts
import { $createParagraphNode, $getSelection, $insertNodes, $isRangeSelection } from "lexical";

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
function getAttachmentPreviewUrl(attachment) {
  return attachment.thumbnailUrl ?? attachment.previewUrl ?? attachment.url ?? "";
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
  $applyNodeReplacement,
  ElementNode
} from "lexical";
var FileLinkNode = class _FileLinkNode extends ElementNode {
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
  return $applyNodeReplacement(
    new FileLinkNode(fileId, fileName, fileUrl, mimeType)
  );
}

// src/nodes/ImageNode.tsx
import {
  $applyNodeReplacement as $applyNodeReplacement2,
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
import { jsx, jsxs } from "react/jsx-runtime";
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
          if (!imageRef.current?.contains(target)) return false;
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
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      setIsResizing(true);
      const startX = event.clientX;
      const startWidth = width;
      const onMove = (moveEvent) => {
        const delta = moveEvent.clientX - startX;
        const nextWidth = Math.min(
          MAX_IMAGE_WIDTH,
          Math.max(MIN_IMAGE_WIDTH, startWidth + delta)
        );
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if ($isImageNode(node)) {
            node.setWidth(nextWidth);
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
    [editor, nodeKey, width]
  );
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: `re-image-wrap${isSelected ? " re-image-wrap-selected" : ""}${isResizing ? " re-image-wrap-resizing" : ""}`,
      contentEditable: false,
      "data-lexical-decorator": "true",
      children: [
        /* @__PURE__ */ jsx(
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
        /* @__PURE__ */ jsx(
          "span",
          {
            className: "re-image-resize-handle",
            onMouseDown: onResizeStart,
            "aria-hidden": "true"
          }
        )
      ]
    }
  );
}

// src/nodes/ImageNode.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
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
    return { element };
  }
  createDOM() {
    const span = document.createElement("span");
    span.className = "re-image-host";
    return span;
  }
  updateDOM() {
    return false;
  }
  decorate() {
    return /* @__PURE__ */ jsx2(
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
    return false;
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
  return $applyNodeReplacement2(
    new ImageNode(src, alt, fileId, width, aspectRatio)
  );
}
function $isImageNode(node) {
  return node instanceof ImageNode;
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
    const paragraph = $createParagraphNode();
    paragraph.append(imageNode);
    $insertNodes([paragraph]);
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

export {
  createLocalId,
  isImageMime,
  getFileKind,
  getFileExtension,
  formatFileSize,
  getReadyAttachmentPayloads,
  getAttachmentPreviewUrl,
  collectFilesFromDataTransfer,
  collectFilesFromClipboard,
  FileLinkNode,
  MIN_IMAGE_WIDTH,
  MAX_IMAGE_WIDTH,
  readImageDimensions,
  getDefaultImageDimensions,
  getAttachmentSource,
  insertImageAtSelection,
  insertFileLinkAtSelection,
  insertAttachmentAtSelection,
  ImageNode
};
//# sourceMappingURL=chunk-277JAGQP.js.map