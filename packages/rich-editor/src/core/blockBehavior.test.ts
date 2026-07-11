import { describe, expect, it } from "vitest";
import { QuoteNode, $createQuoteNode, $isQuoteNode } from "@lexical/rich-text";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  createEditor,
  ParagraphNode,
  type LexicalEditor,
} from "lexical";
import {
  $handleQuoteBackspace,
  $isAtStartOfBlock,
  $pruneEmptyQuotes,
  $unwrapParagraphFromQuote,
} from "./blockBehavior";
import { $normalizeAllQuotes } from "./quoteBlocks";

function createTestEditor(): LexicalEditor {
  const editor = createEditor({
    namespace: "blockBehaviorTest",
    nodes: [QuoteNode, ParagraphNode],
    onError: (error) => {
      throw error;
    },
  });
  const root = document.createElement("div");
  document.body.appendChild(root);
  editor.setRootElement(root);
  return editor;
}

function readStructure(editor: LexicalEditor): string {
  let structure = "";
  editor.getEditorState().read(() => {
    const parts: string[] = [];
    for (const child of $getRoot().getChildren()) {
      if ($isQuoteNode(child)) {
        parts.push(`quote(${child.getTextContent()})`);
      } else if ($isParagraphNode(child)) {
        parts.push(`p(${child.getTextContent()})`);
      }
    }
    structure = parts.join("|");
  });
  return structure;
}

describe("quote markdown shortcut", () => {
  it("keeps an empty quote created by > shortcut while user continues typing", async () => {
    const editor = createTestEditor();

    await editor.update(() => {
      const quote = $createQuoteNode();
      const paragraph = $createParagraphNode();
      quote.append(paragraph);
      $getRoot().append(quote);
      paragraph.select(0, 0);
    });

    await editor.update(() => {
      $normalizeAllQuotes();
    });

    editor.getEditorState().read(() => {
      const children = $getRoot().getChildren();
      expect(children).toHaveLength(1);
      expect($isQuoteNode(children[0])).toBe(true);
    });
  });
});

async function withQuoteLines(
  editor: LexicalEditor,
  lines: string[],
): Promise<void> {
  await editor.update(() => {
    const root = $getRoot();
    root.clear();
    const quote = $createQuoteNode();
    for (const line of lines) {
      const paragraph = $createParagraphNode();
      paragraph.append($createTextNode(line));
      quote.append(paragraph);
    }
    root.append(quote);
  });
}

async function selectTextStart(
  editor: LexicalEditor,
  text: string,
): Promise<void> {
  await editor.update(() => {
    const textNode = $getRoot()
      .getAllTextNodes()
      .find((node) => node.getTextContent() === text);
    if (!textNode) throw new Error(`Text node "${text}" not found`);
    textNode.select(0, 0);
  });
}

describe("$isAtStartOfBlock", () => {
  it("returns true at offset 0 of the first text node in a paragraph", async () => {
    const editor = createTestEditor();
    await withQuoteLines(editor, ["1"]);
    await selectTextStart(editor, "1");

    editor.getEditorState().read(() => {
      const selection = $getSelection();
      expect($isRangeSelection(selection)).toBe(true);
      expect($isAtStartOfBlock(selection)).toBe(true);
    });
  });
});

describe("$unwrapParagraphFromQuote", () => {
  it("moves the first line before the quote", async () => {
    const editor = createTestEditor();
    await withQuoteLines(editor, ["1", "2", "3"]);

    await editor.update(() => {
      const quote = $getRoot().getFirstChild();
      const paragraph = quote?.getFirstChild();
      if (!quote || !paragraph) throw new Error("Missing quote paragraph");
      $unwrapParagraphFromQuote(paragraph as never);
      $pruneEmptyQuotes();
    });

    expect(readStructure(editor)).toBe("p(1)|quote(2\n\n3)");
  });

  it("moves the last line after the quote", async () => {
    const editor = createTestEditor();
    await withQuoteLines(editor, ["1", "2", "3"]);

    await editor.update(() => {
      const quote = $getRoot().getFirstChild();
      const paragraph = quote?.getLastChild();
      if (!quote || !paragraph) throw new Error("Missing quote paragraph");
      $unwrapParagraphFromQuote(paragraph as never);
      $pruneEmptyQuotes();
    });

    expect(readStructure(editor)).toBe("quote(1\n\n2)|p(3)");
  });
});

describe("$handleQuoteBackspace", () => {
  it("unwraps the first quoted line before the remaining quote", async () => {
    const editor = createTestEditor();
    await withQuoteLines(editor, ["1", "2", "3"]);
    await selectTextStart(editor, "1");

    await editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) throw new Error("No range selection");
      const quote = $getBlockQuoteFromRoot();
      const paragraph = quote?.getFirstChild();
      if (!quote || !paragraph) throw new Error("Missing quote paragraph");
      $handleQuoteBackspace(quote, paragraph as never, selection);
      $pruneEmptyQuotes();
    });

    expect(readStructure(editor)).toBe("p(1)|quote(2\n\n3)");
  });

  it("unwraps the last quoted line after the remaining quote", async () => {
    const editor = createTestEditor();
    await withQuoteLines(editor, ["1", "2", "3"]);
    await selectTextStart(editor, "3");

    await editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) throw new Error("No range selection");
      const quote = $getBlockQuoteFromRoot();
      const paragraph = quote?.getLastChild();
      if (!quote || !paragraph) throw new Error("Missing quote paragraph");
      $handleQuoteBackspace(quote, paragraph as never, selection);
      $pruneEmptyQuotes();
    });

    expect(readStructure(editor)).toBe("quote(1\n\n2)|p(3)");
  });
});

function $getBlockQuoteFromRoot() {
  const child = $getRoot().getFirstChild();
  return child && $isQuoteNode(child) ? child : null;
}
