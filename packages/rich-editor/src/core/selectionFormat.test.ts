import { describe, expect, it } from "vitest";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  createEditor,
  ParagraphNode,
  type LexicalEditor,
} from "lexical";
import { $clearStickyTextFormats } from "./selectionFormat";

function createTestEditor(): LexicalEditor {
  const editor = createEditor({
    namespace: "selectionFormatTest",
    nodes: [ParagraphNode],
    onError: (error) => {
      throw error;
    },
  });
  const root = document.createElement("div");
  document.body.appendChild(root);
  editor.setRootElement(root);
  return editor;
}

describe("$clearStickyTextFormats", () => {
  it("clears active inline formats on the selection", () => {
    const editor = createTestEditor();

    editor.update(() => {
      const root = $getRoot();
      root.clear();
      const paragraph = $createParagraphNode();
      paragraph.append($createTextNode(""));
      root.append(paragraph);
      paragraph.selectEnd();

      const selection = $getSelection();
      if (!$isRangeSelection(selection)) throw new Error("expected range selection");
      selection.toggleFormat("bold");
      selection.toggleFormat("italic");
      expect(selection.hasFormat("bold")).toBe(true);
      expect(selection.hasFormat("italic")).toBe(true);

      $clearStickyTextFormats();
      expect(selection.hasFormat("bold")).toBe(false);
      expect(selection.hasFormat("italic")).toBe(false);
    });
  });
});
