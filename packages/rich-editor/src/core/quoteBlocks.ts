import { $isQuoteNode, $createQuoteNode, type QuoteNode } from "@lexical/rich-text";
import { $findMatchingParent } from "@lexical/utils";
import {
  $createParagraphNode,
  $getRoot,
  $isElementNode,
  $isParagraphNode,
  $isRootOrShadowRoot,
  type ElementNode,
  type LexicalNode,
  type RangeSelection,
} from "lexical";

function $getTopLevelBlock(node: LexicalNode): ElementNode | null {
  let current: LexicalNode | null = node;
  while (current !== null && !$isRootOrShadowRoot(current.getParent())) {
    current = current.getParent();
  }
  return $isElementNode(current) ? current : null;
}

function $getSelectedTopLevelBlocks(selection: RangeSelection): ElementNode[] {
  const blocks = new Map<string, ElementNode>();

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

export function $ensureQuoteParagraphStructure(quote: QuoteNode): void {
  const children = [...quote.getChildren()];
  if (children.length > 0 && children.every($isParagraphNode)) return;

  const normalized: ElementNode[] = [];
  let pending: ElementNode | null = null;

  for (const child of children) {
    if ($isParagraphNode(child)) {
      normalized.push(child);
      pending = null;
      continue;
    }
    if (!pending) {
      pending = $createParagraphNode();
      normalized.push(pending);
    }
    pending.append(child);
  }

  if (normalized.length === 0) {
    normalized.push($createParagraphNode());
  }

  quote.clear();
  quote.append(...normalized);
}

export function $getQuoteParagraph(node: LexicalNode): ElementNode | null {
  const quote = $findMatchingParent(node, $isQuoteNode);
  if (!quote) return null;

  let current: LexicalNode | null = node;
  while (current !== null && current !== quote) {
    if ($isParagraphNode(current) && current.getParent() === quote) {
      return current;
    }
    current = current.getParent();
  }

  $ensureQuoteParagraphStructure(quote);

  current = node;
  while (current !== null && current !== quote) {
    if ($isParagraphNode(current) && current.getParent() === quote) {
      return current;
    }
    current = current.getParent();
  }

  const first = quote.getFirstChild();
  return $isParagraphNode(first) ? first : null;
}

function $unwrapQuote(quote: QuoteNode): void {
  $ensureQuoteParagraphStructure(quote);
  const paragraphs = quote.getChildren().filter($isParagraphNode);
  if (paragraphs.length === 0) {
    quote.replace($createParagraphNode());
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

function $wrapParagraphInQuote(paragraph: ElementNode): QuoteNode {
  const quote = $createQuoteNode();
  const inner = $createParagraphNode();
  inner.append(...paragraph.getChildren());
  quote.append(inner);
  paragraph.replace(quote);
  return quote;
}

export function $applyQuoteToSelection(selection: RangeSelection): void {
  const inQuote = $findMatchingParent(selection.anchor.getNode(), $isQuoteNode);
  if (inQuote) {
    $unwrapQuote(inQuote);
    return;
  }

  const blocks = $getSelectedTopLevelBlocks(selection);
  const paragraphs = blocks.filter($isParagraphNode);
  if (paragraphs.length === 0) return;

  if (paragraphs.length === 1) {
    $wrapParagraphInQuote(paragraphs[0]);
    return;
  }

  const quote = $createQuoteNode();
  for (const block of paragraphs) {
    const inner = $createParagraphNode();
    inner.append(...block.getChildren());
    quote.append(inner);
  }

  paragraphs[0].replace(quote);
  for (let i = 1; i < paragraphs.length; i++) {
    paragraphs[i].remove();
  }

  quote.selectEnd();
}

export function $normalizeAllQuotes(): void {
  for (const child of $getRoot().getChildren()) {
    if ($isQuoteNode(child)) {
      $ensureQuoteParagraphStructure(child);
    }
  }
}
