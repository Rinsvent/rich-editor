import { $isCodeNode, type CodeNode } from "@lexical/code";
import { $isListItemNode } from "@lexical/list";
import { $createQuoteNode, $isQuoteNode, QuoteNode } from "@lexical/rich-text";
import { $findMatchingParent } from "@lexical/utils";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $getNodeByKey,
  $isElementNode,
  $isParagraphNode,
  $isRangeSelection,
  $isTextNode,
  type ElementNode,
  type LexicalNode,
  type RangeSelection,
} from "lexical";
import { $ensureQuoteParagraphStructure, $getQuoteParagraph } from "./quoteBlocks";

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
  const paragraph = $findMatchingParent(node, $isParagraphNode);

  if (paragraph) {
    let current: LexicalNode | null = node;
    while (current !== null && current !== paragraph) {
      const parent = current.getParent();
      if (parent === null) return false;
      if (parent.getFirstChild() !== current) return false;
      current = parent;
    }
    return true;
  }

  if ($isParagraphNode(node)) return true;

  if ($isTextNode(node)) {
    const parent = node.getParent();
    if ($isElementNode(parent)) {
      return parent.getFirstChild() === node;
    }
  }

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

  const paragraphs = quote.getChildren().filter($isParagraphNode);
  const index = paragraphs.findIndex((p) => p.getKey() === paragraph.getKey());
  if (index === -1) return;

  const total = paragraphs.length;
  const newParagraph = $createParagraphNode();
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

  const afterQuote = $createQuoteNode();
  for (let i = index + 1; i < paragraphs.length; i += 1) {
    afterQuote.append(paragraphs[i]);
  }

  quote.insertAfter(newParagraph);
  if (afterQuote.getChildrenSize() > 0) {
    newParagraph.insertAfter(afterQuote);
  }
  newParagraph.selectStart();
}

/** Remove blockquotes that contain no visible text. */
export function $pruneEmptyQuotes(): void {
  for (const child of [...$getRoot().getChildren()]) {
    if (!$isQuoteNode(child)) continue;
    if (child.getTextContent().trim() === "") {
      child.remove();
    }
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
  $ensureQuoteParagraphStructure(quote);

  if (!$isParagraphNode(paragraph) || paragraph.getParent() !== quote) {
    const resolved = quote.getChildren().find($isParagraphNode);
    if (!resolved) {
      selection.insertParagraph();
      return;
    }
    paragraph = resolved;
  }

  if (
    $isAtStartOfBlock(selection) &&
    paragraph === quote.getFirstChild()
  ) {
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

export function $handleQuoteBackspace(
  quote: QuoteNode,
  paragraph: ElementNode,
  selection: RangeSelection,
): void {
  const liveQuote = $getNodeByKey(quote.getKey());
  if (!liveQuote || !$isQuoteNode(liveQuote)) return;
  quote = liveQuote;

  const liveParagraph = $getQuoteParagraph(selection.anchor.getNode());
  if (!liveParagraph || liveParagraph.getParent() !== quote) return;
  paragraph = liveParagraph;

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

  $unwrapParagraphFromQuote(paragraph);
  $pruneEmptyQuotes();
}

export function $mergeAdjacentQuoteBlocks(): void {
  const root = $getRoot();
  const children = [...root.getChildren()];
  for (let i = 0; i < children.length - 1; i++) {
    const current = children[i];
    const next = children[i + 1];
    if ($isQuoteNode(current) && $isQuoteNode(next)) {
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
