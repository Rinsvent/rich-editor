import { describe, expect, it } from "vitest";
import { highlightViewerCodeBlocks } from "./highlightViewerCode";

describe("highlightViewerCodeBlocks", () => {
  it("highlights static code blocks with hljs classes", async () => {
    const root = document.createElement("div");
    root.innerHTML =
      '<pre class="re-block-code" data-language="javascript">const x = 1;</pre>';

    await highlightViewerCodeBlocks(root);

    const block = root.querySelector("pre.re-block-code");
    expect(block?.classList.contains("hljs")).toBe(true);
    expect(block?.querySelector("[class*='hljs-']")).not.toBeNull();
  });
});
