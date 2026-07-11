import {
  $applyNodeReplacement,
  type DOMConversionMap,
  type DOMExportOutput,
  type EditorConfig,
  ElementNode,
  type LexicalNode,
  type NodeKey,
  type SerializedElementNode,
  type Spread,
} from "lexical";
import {
  FILE_ID_ATTR,
  FILE_MIME_ATTR,
  FILE_NAME_ATTR,
} from "../core/attachments";

export type SerializedFileLinkNode = Spread<
  {
    fileId: string;
    fileName: string;
    fileUrl: string;
    mimeType: string;
  },
  SerializedElementNode
>;

export class FileLinkNode extends ElementNode {
  __fileId: string;
  __fileName: string;
  __fileUrl: string;
  __mimeType: string;

  static getType(): string {
    return "file-link";
  }

  static clone(node: FileLinkNode): FileLinkNode {
    return new FileLinkNode(
      node.__fileId,
      node.__fileName,
      node.__fileUrl,
      node.__mimeType,
      node.__key,
    );
  }

  static importJSON(serializedNode: SerializedFileLinkNode): FileLinkNode {
    return $createFileLinkNode({
      fileId: serializedNode.fileId,
      fileName: serializedNode.fileName,
      fileUrl: serializedNode.fileUrl,
      mimeType: serializedNode.mimeType,
    });
  }

  static importDOM(): DOMConversionMap | null {
    return {
      a: (domNode: HTMLElement) => {
        const fileId = domNode.getAttribute(FILE_ID_ATTR);
        if (!fileId) return null;
        const fileName =
          domNode.getAttribute(FILE_NAME_ATTR) ??
          domNode.textContent?.trim() ??
          "File";
        const fileUrl = domNode.getAttribute("href") ?? "";
        const mimeType =
          domNode.getAttribute(FILE_MIME_ATTR) ??
          "application/octet-stream";
        return {
          conversion: () => ({
            node: $createFileLinkNode({
              fileId,
              fileName,
              fileUrl,
              mimeType,
            }),
          }),
          priority: 2,
        };
      },
    };
  }

  constructor(
    fileId: string,
    fileName: string,
    fileUrl: string,
    mimeType: string,
    key?: NodeKey,
  ) {
    super(key);
    this.__fileId = fileId;
    this.__fileName = fileName;
    this.__fileUrl = fileUrl;
    this.__mimeType = mimeType;
  }

  exportJSON(): SerializedFileLinkNode {
    return {
      ...super.exportJSON(),
      fileId: this.__fileId,
      fileName: this.__fileName,
      fileUrl: this.__fileUrl,
      mimeType: this.__mimeType,
      type: "file-link",
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
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

  updateDOM(): false {
    return false;
  }

  exportDOM(): DOMExportOutput {
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

  isInline(): true {
    return true;
  }

  canBeEmpty(): false {
    return false;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }

  getFileId(): string {
    return this.getLatest().__fileId;
  }

  getFileName(): string {
    return this.getLatest().__fileName;
  }

  getFileUrl(): string {
    return this.getLatest().__fileUrl;
  }

  getMimeType(): string {
    return this.getLatest().__mimeType;
  }
}

export function $createFileLinkNode({
  fileId,
  fileName,
  fileUrl,
  mimeType,
}: {
  fileId: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
}): FileLinkNode {
  return $applyNodeReplacement(
    new FileLinkNode(fileId, fileName, fileUrl, mimeType),
  );
}

export function $isFileLinkNode(
  node: LexicalNode | null | undefined,
): node is FileLinkNode {
  return node instanceof FileLinkNode;
}
