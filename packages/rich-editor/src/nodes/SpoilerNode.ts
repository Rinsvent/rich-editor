import {
  $applyNodeReplacement,
  type DOMConversionMap,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalNode,
  type NodeKey,
  type SerializedElementNode,
  type Spread,
  ElementNode,
} from "lexical";

export type SerializedSpoilerNode = Spread<
  {
    type: "spoiler";
  },
  SerializedElementNode
>;

export class SpoilerNode extends ElementNode {
  static getType(): string {
    return "spoiler";
  }

  static clone(node: SpoilerNode): SpoilerNode {
    return new SpoilerNode(node.__key);
  }

  static importJSON(_serialized: SerializedSpoilerNode): SpoilerNode {
    return $createSpoilerNode();
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.classList.contains("re-spoiler")) return null;
        return {
          conversion: () => ({ node: $createSpoilerNode() }),
          priority: 2,
        };
      },
    };
  }

  constructor(key?: NodeKey) {
    super(key);
  }

  isInline(): true {
    return true;
  }

  canBeEmpty(): boolean {
    return false;
  }

  canInsertTextBefore(): boolean {
    return true;
  }

  canInsertTextAfter(): boolean {
    return true;
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const dom = document.createElement("span");
    dom.className = "re-spoiler";
    dom.setAttribute("data-re-spoiler", "");
    dom.style.display = "inline";
    return dom;
  }

  extractWithChild(): boolean {
    return true;
  }

  updateDOM(): boolean {
    return false;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("span");
    element.className = "re-spoiler";
    element.setAttribute("data-re-spoiler", "");
    return { element };
  }

  exportJSON(): SerializedSpoilerNode {
    return {
      ...super.exportJSON(),
      type: "spoiler",
    };
  }
}

export function $createSpoilerNode(): SpoilerNode {
  return $applyNodeReplacement(new SpoilerNode());
}

export function $isSpoilerNode(
  node: LexicalNode | null | undefined,
): node is SpoilerNode {
  return node instanceof SpoilerNode;
}
