import { describe, expect, it } from "vitest";
import { isHtmlContent, normalizeHtml, sanitizeHtml } from "./html";

describe("sanitizeHtml", () => {
  it("keeps allowed formatting tags", () => {
    expect(sanitizeHtml("<p><b>x</b> <i>y</i> <s>z</s></p>")).toBe(
      "<p><b>x</b> <i>y</i> <s>z</s></p>",
    );
  });

  it("strips script tags", () => {
    expect(sanitizeHtml('<p>ok</p><script>alert(1)</script>')).toBe("<p>ok</p>");
  });
});

describe("normalizeHtml", () => {
  it("converts strong/em to b/i", () => {
    expect(normalizeHtml("<p><strong>a</strong> <em>b</em></p>")).toBe(
      "<p><b>a</b> <i>b</i></p>",
    );
  });

  it("converts del/strike to s", () => {
    expect(normalizeHtml("<p><del>x</del> <strike>y</strike></p>")).toBe(
      "<p><s>x</s> <s>y</s></p>",
    );
  });
});

describe("isHtmlContent", () => {
  it("detects html", () => {
    expect(isHtmlContent("<p>x</p>")).toBe(true);
    expect(isHtmlContent("plain")).toBe(false);
  });
});
