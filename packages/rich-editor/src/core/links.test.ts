import { describe, expect, it } from "vitest";
import { $createLinkNode, $isLinkNode, LinkNode } from "@lexical/link";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  createEditor,
  ParagraphNode,
  type LexicalEditor,
} from "lexical";
import { $applyLinkForm } from "./links";

function createTestEditor(): LexicalEditor {
  const editor = createEditor({
    namespace: "linksTest",
    nodes: [LinkNode, ParagraphNode],
    onError: (error) => {
      throw error;
    },
  });
  const root = document.createElement("div");
  document.body.appendChild(root);
  editor.setRootElement(root);
  return editor;
}

describe("$applyLinkForm", () => {
  it("updates link text and url when editing", async () => {
    const editor = createTestEditor();
    let linkKey = "";

    await editor.update(() => {
      const paragraph = $createParagraphNode();
      const link = $createLinkNode("https://old.example");
      link.append($createTextNode("old text"));
      paragraph.append(link);
      $getRoot().append(paragraph);
      linkKey = link.getKey();
    });

    await editor.update(() => {
      $applyLinkForm(
        { text: "new text", url: "https://new.example" },
        linkKey,
      );
    });

    editor.getEditorState().read(() => {
      const paragraph = $getRoot().getFirstChild();
      const link = paragraph?.getFirstChild();
      expect($isLinkNode(link)).toBe(true);
      if ($isLinkNode(link)) {
        expect(link.getTextContent()).toBe("new text");
        expect(link.getURL()).toBe("https://new.example");
      }
    });
  });
});
