"use client";

import {
  $applyNodeReplacement,
  DecoratorNode,
  type DOMConversionMap,
  type DOMExportOutput,
  type LexicalNode,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
} from "lexical";
import type { JSX } from "react";
import { ImageComponent } from "../components/attachments/ImageComponent";
import {
  FILE_ID_ATTR,
  IMAGE_ASPECT_ATTR,
} from "../core/attachments";

export type SerializedImageNode = Spread<
  {
    src: string;
    alt: string;
    fileId: string;
    width: number;
    aspectRatio: number;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __alt: string;
  __fileId: string;
  __width: number;
  __aspectRatio: number;

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__alt,
      node.__fileId,
      node.__width,
      node.__aspectRatio,
      node.__key,
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return $createImageNode({
      src: serializedNode.src,
      alt: serializedNode.alt,
      fileId: serializedNode.fileId,
      width: serializedNode.width,
      aspectRatio: serializedNode.aspectRatio,
    });
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (domNode: HTMLElement) => {
        if (!(domNode instanceof HTMLImageElement)) return null;
        const fileId = domNode.getAttribute(FILE_ID_ATTR);
        if (!fileId) return null;
        const src = domNode.getAttribute("src") ?? "";
        const alt = domNode.getAttribute("alt") ?? "";
        const width = Number(domNode.getAttribute("width")) || 320;
        const aspectRatio =
          Number(domNode.getAttribute(IMAGE_ASPECT_ATTR)) ||
          (domNode.width && domNode.height
            ? domNode.width / domNode.height
            : 4 / 3);
        return {
          conversion: () => ({
            node: $createImageNode({
              src,
              alt,
              fileId,
              width,
              aspectRatio,
            }),
          }),
          priority: 2,
        };
      },
    };
  }

  constructor(
    src: string,
    alt: string,
    fileId: string,
    width: number,
    aspectRatio: number,
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__alt = alt;
    this.__fileId = fileId;
    this.__width = width;
    this.__aspectRatio = aspectRatio;
  }

  exportJSON(): SerializedImageNode {
    return {
      type: "image",
      version: 1,
      src: this.__src,
      alt: this.__alt,
      fileId: this.__fileId,
      width: this.__width,
      aspectRatio: this.__aspectRatio,
    };
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("img");
    element.src = this.__src;
    element.alt = this.__alt;
    element.setAttribute(FILE_ID_ATTR, this.__fileId);
    element.width = this.__width;
    element.height = Math.max(1, Math.round(this.__width / this.__aspectRatio));
    element.setAttribute(IMAGE_ASPECT_ATTR, String(this.__aspectRatio));
    element.style.width = `${this.__width}px`;
    return { element };
  }

  createDOM(): HTMLElement {
    const span = document.createElement("span");
    span.className = "re-image-host";
    span.style.display = "inline-block";
    span.style.maxWidth = "100%";
    span.style.verticalAlign = "bottom";
    return span;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <ImageComponent
        src={this.__src}
        alt={this.__alt}
        width={this.__width}
        aspectRatio={this.__aspectRatio}
        nodeKey={this.getKey()}
      />
    );
  }

  isInline(): true {
    return true;
  }

  getSrc(): string {
    return this.getLatest().__src;
  }

  getAlt(): string {
    return this.getLatest().__alt;
  }

  getFileId(): string {
    return this.getLatest().__fileId;
  }

  getWidth(): number {
    return this.getLatest().__width;
  }

  getAspectRatio(): number {
    return this.getLatest().__aspectRatio;
  }

  setWidth(width: number): void {
    const writable = this.getWritable();
    writable.__width = width;
  }

  setSrc(src: string): void {
    const writable = this.getWritable();
    writable.__src = src;
  }

  setFileId(fileId: string): void {
    const writable = this.getWritable();
    writable.__fileId = fileId;
  }
}

export function $createImageNode({
  src,
  alt,
  fileId,
  width,
  aspectRatio,
}: {
  src: string;
  alt: string;
  fileId: string;
  width: number;
  aspectRatio: number;
}): ImageNode {
  return $applyNodeReplacement(
    new ImageNode(src, alt, fileId, width, aspectRatio),
  );
}

export function $isImageNode(
  node: LexicalNode | null | undefined,
): node is ImageNode {
  return node instanceof ImageNode;
}
