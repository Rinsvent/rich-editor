import { describe, expect, it } from "vitest";
import { looksLikeMarkdown, markdownToHtml } from "./markdown";

describe("quote markdown", () => {
  it("detects blockquote syntax", () => {
    expect(looksLikeMarkdown("> quoted line")).toBe(true);
  });

  it("renders blockquote with paragraph", () => {
    const html = markdownToHtml("> quoted line");
    expect(html).toContain("<blockquote");
    expect(html).toContain("quoted line");
  });
});
