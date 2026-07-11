import { QuoteNode } from "@lexical/rich-text";
import { $applyNodeReplacement, type LexicalNode } from "lexical";

/** Quote node (Slack-like backspace handled in BlockBehaviorPlugin). */
export class RichQuoteNode extends QuoteNode {
  static getType(): string {
    return "quote";
  }

  static clone(node: RichQuoteNode): RichQuoteNode {
    return new RichQuoteNode(node.__key);
  }
}

export function $createRichQuoteNode(): RichQuoteNode {
  return $applyNodeReplacement(new RichQuoteNode());
}

export function $isRichQuoteNode(
  node: LexicalNode | null | undefined,
): node is RichQuoteNode {
  return node instanceof RichQuoteNode;
}
