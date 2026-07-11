import { $isCodeNode, type CodeNode } from "@lexical/code";
import { $isListItemNode } from "@lexical/list";
import { $isQuoteNode, QuoteNode } from "@lexical/rich-text";
import { $findMatchingParent } from "@lexical/utils";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isElementNode,
  $isParagraphNode,
  $isRangeSelection,
  $isTextNode,
  type ElementNode,
  type LexicalNode,
  type RangeSelection,
} from "lexical";

export function $getBlockQuote(node: LexicalNode): QuoteNode | null {
  return $findMatchingParent(node, $isQuoteNode);
}

export function $getBlockCode(node: LexicalNode): CodeNode | null {
  return $findMatchingParent(node, $isCodeNode);
}

export function $isParagraphEmpty(node: LexicalNode): boolean {
  return $isParagraphNode(node) && node.getTextContent().trim() === "";
}

export function $countTrailingEmptyParagraphs(quote: QuoteNode): number {
  const children = quote.getChildren();
  let count = 0;
  for (let i = children.length - 1; i >= 0; i--) {
    if ($isParagraphEmpty(children[i])) count += 1;
    else break;
  }
  return count;
}

export function $isAtStartOfBlock(selection: RangeSelection): boolean {
  const anchor = selection.anchor;
  if (anchor.offset !== 0) return false;
  const node = anchor.getNode();
  if ($isTextNode(node)) {
    const parent = node.getParent();
    if ($isElementNode(parent)) {
      const firstChild = parent.getFirstChild();
      return firstChild === node || firstChild === null;
    }
  }
  if ($isParagraphNode(node)) return true;
  return false;
}

export function $isAtEndOfBlock(selection: RangeSelection): boolean {
  const focus = selection.focus;
  const node = focus.getNode();
  if ($isTextNode(node)) {
    return focus.offset === node.getTextContentSize();
  }
  if ($isParagraphNode(node)) {
    const lastDescendant = node.getLastDescendant();
    if (!lastDescendant) return true;
    if ($isTextNode(lastDescendant)) {
      return focus.offset === lastDescendant.getTextContentSize();
    }
  }
  return false;
}

export function $unwrapParagraphFromQuote(paragraph: ElementNode): void {
  const quote = paragraph.getParent();
  if (!$isQuoteNode(quote)) return;

  const newParagraph = $createParagraphNode();
  newParagraph.append(...paragraph.getChildren());
  quote.insertAfter(newParagraph);

  if (quote.getChildrenSize() === 1 && quote.getFirstChild() === paragraph) {
    quote.replace(newParagraph);
    return;
  }

  paragraph.remove();
  if (quote.getChildrenSize() === 0) {
    quote.remove();
  }
}

export function $insertParagraphBeforeBlock(block: ElementNode): void {
  const paragraph = $createParagraphNode();
  block.insertBefore(paragraph);
  paragraph.selectEnd();
}

export function $insertParagraphInsideQuoteAfter(
  quote: QuoteNode,
  after: ElementNode,
): void {
  const paragraph = $createParagraphNode();
  after.insertAfter(paragraph);
  paragraph.selectStart();
}

export function $exitQuoteWithEmptyLines(quote: QuoteNode): void {
  while (quote.getLastChild() && $isParagraphEmpty(quote.getLastChild()!)) {
    quote.getLastChild()!.remove();
  }

  const exitParagraph = $createParagraphNode();
  quote.insertAfter(exitParagraph);
  exitParagraph.selectStart();

  if (quote.getChildrenSize() === 0) {
    quote.remove();
  }
}

/** Unified Enter inside quote — same for Enter and Shift+Enter. */
export function $handleQuoteEnter(
  quote: QuoteNode,
  paragraph: ElementNode,
  selection: RangeSelection,
): void {
  if (!$isParagraphNode(paragraph) || paragraph.getParent() !== quote) {
    selection.insertParagraph();
    return;
  }

  if (
    $isAtStartOfBlock(selection) &&
    paragraph === quote.getFirstChild()
  ) {
    $insertParagraphBeforeBlock(quote);
    return;
  }

  if (!$isAtEndOfBlock(selection)) {
    selection.insertParagraph();
    return;
  }

  const trailingEmpty = $countTrailingEmptyParagraphs(quote);
  const isEmpty = $isParagraphEmpty(paragraph);

  if (isEmpty) {
    if (trailingEmpty >= 2) {
      $exitQuoteWithEmptyLines(quote);
    } else {
      $insertParagraphInsideQuoteAfter(quote, paragraph);
    }
    return;
  }

  $insertParagraphInsideQuoteAfter(quote, paragraph);
}

export function $handleQuoteBackspace(
  quote: QuoteNode,
  paragraph: ElementNode,
  selection: RangeSelection,
): void {
  if (!$isParagraphNode(paragraph) || paragraph.getParent() !== quote) return;
  if (!$isAtStartOfBlock(selection)) return;

  if ($isParagraphEmpty(paragraph)) {
    if (quote.getChildrenSize() <= 1) {
      const replacement = $createParagraphNode();
      quote.replace(replacement);
      replacement.selectStart();
      return;
    }

    const prev = paragraph.getPreviousSibling();
    paragraph.remove();
    if (prev && $isParagraphNode(prev)) {
      prev.selectEnd();
    } else {
      quote.getFirstChild()?.selectStart();
    }
    return;
  }

  if (quote.getChildrenSize() > 1) {
    $unwrapParagraphFromQuote(paragraph);
  }
}

export function $mergeAdjacentQuoteBlocks(): void {
  const root = $getRoot();
  const children = [...root.getChildren()];
  for (let i = 0; i < children.length - 1; i++) {
    const current = children[i];
    const next = children[i + 1];
    if ($isQuoteNode(current) && $isQuoteNode(next)) {
      for (const child of [...next.getChildren()]) {
        current.append(child);
      }
      next.remove();
      children.splice(i + 1, 1);
      i -= 1;
    }
  }
}

export function $mergeAdjacentCodeBlocks(): void {
  const root = $getRoot();
  const children = [...root.getChildren()];
  for (let i = 0; i < children.length - 1; i++) {
    const current = children[i];
    const next = children[i + 1];
    if ($isCodeNode(current) && $isCodeNode(next)) {
      const merged = current.getTextContent();
      const nextText = next.getTextContent();
      const join = merged.endsWith("\n") || nextText.startsWith("\n") ? "" : "\n";
      current.clear();
      current.append($createTextNode(merged + join + nextText));
      next.remove();
      children.splice(i + 1, 1);
      i -= 1;
    }
  }
}

export function $getCodeTrailingEmptyLines(codeNode: CodeNode): number {
  const text = codeNode.getTextContent();
  const lines = text.split("\n");
  let count = 0;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].trim() === "") count += 1;
    else break;
  }
  return count;
}

export function $isAtEndOfCodeBlock(selection: RangeSelection): boolean {
  const code = $getBlockCode(selection.focus.getNode());
  if (!code) return false;
  return selection.focus.offset === code.getTextContent().length;
}

export function $exitCodeBlock(codeNode: CodeNode): void {
  const text = codeNode.getTextContent().replace(/\n{1,2}$/, "");
  codeNode.clear();
  if (text) {
    codeNode.append($createTextNode(text));
  }

  const exitParagraph = $createParagraphNode();
  codeNode.insertAfter(exitParagraph);
  exitParagraph.selectStart();
}

export function $shouldSkipBlockBehavior(): boolean {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) return true;
  const node = selection.anchor.getNode();
  if ($findMatchingParent(node, $isListItemNode)) return true;
  return false;
}
