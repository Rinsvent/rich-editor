import { describe, expect, it } from "vitest";
import { isHtmlContent, normalizeHtml, sanitizeHtml, trimEditorHtml } from "./html";

describe("sanitizeHtml", () => {
  it("keeps allowed formatting tags", () => {
    expect(sanitizeHtml("<p><b>x</b> <i>y</i> <s>z</s></p>")).toBe(
      "<p><b>x</b> <i>y</i> <s>z</s></p>",
    );
  });

  it("strips script tags", () => {
    expect(sanitizeHtml('<p>ok</p><script>alert(1)</script>')).toBe("<p>ok</p>");
  });

  it("keeps inline images with blob src and width style", () => {
    const html =
      '<p>text<img class="re-image" src="blob:http://localhost/abc" alt="shot" width="240" style="width: 240px; max-width: 100%; height: auto;" data-file-id="1"></p>';
    const sanitized = sanitizeHtml(html);
    expect(sanitized).toContain('src="blob:http://localhost/abc"');
    expect(sanitized).toContain('class="re-image"');
    expect(sanitized).toContain('width="240"');
    expect(sanitized).toContain("width: 240px");
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

  it("merges adjacent blockquotes", () => {
    expect(
      normalizeHtml("<blockquote><p>a</p></blockquote><blockquote><p>b</p></blockquote>"),
    ).toBe("<blockquote><p>a</p><p>b</p></blockquote>");
  });

  it("preserves syntax tokens inside block code", () => {
    expect(
      normalizeHtml(
        '<code class="re-block-code"><span class="token keyword">const</span> x</code>',
      ),
    ).toContain('class="token keyword"');
  });
});

describe("isHtmlContent", () => {
  it("detects html", () => {
    expect(isHtmlContent("<p>x</p>")).toBe(true);
    expect(isHtmlContent("plain")).toBe(false);
  });
});

describe("trimEditorHtml", () => {
  it("removes leading and trailing empty paragraphs", () => {
    expect(trimEditorHtml('<p><br></p><p>hi</p><p><br></p>')).toBe("<p>hi</p>");
  });

  it("removes leading and trailing line breaks inside blocks", () => {
    expect(trimEditorHtml("<p><br>hi<br></p>")).toBe("<p>hi</p>");
  });

  it("returns empty string for whitespace-only content", () => {
    expect(trimEditorHtml("<p><br></p>")).toBe("");
    expect(trimEditorHtml("<p><br><br></p>")).toBe("");
  });

  it("trims empty blocks inside leading and trailing blockquotes", () => {
    expect(
      trimEditorHtml(
        "<blockquote><p><br></p><p>hi</p></blockquote><p>x</p><blockquote><p><br></p></blockquote>",
      ),
    ).toBe("<blockquote><p>hi</p></blockquote><p>x</p>");
  });

  it("keeps meaningful content unchanged", () => {
    expect(trimEditorHtml("<p>hello</p>")).toBe("<p>hello</p>");
    expect(trimEditorHtml("<p>hello<br>world</p>")).toBe("<p>hello<br>world</p>");
  });
});
