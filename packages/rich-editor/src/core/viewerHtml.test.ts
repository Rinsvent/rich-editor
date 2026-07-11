/**
 * @vitest-environment node
 */
import { describe, expect, it } from "vitest";
import { defaultViewerFeatures } from "./features";
import { applyLinkTargetToHtml, sanitizeHtml } from "./html";
import { prepareViewerContent } from "./viewerHtml";

describe("SSR viewer html", () => {
  it("sanitizes html without browser APIs", () => {
    expect(sanitizeHtml("<p><b>hi</b></p>")).toBe("<p><b>hi</b></p>");
    expect(sanitizeHtml('<p>x</p><script>alert(1)</script>')).toBe("<p>x</p>");
  });

  it("prepareViewerContent adds link target on server", () => {
    const result = prepareViewerContent(
      '<p><a href="https://example.com">link</a></p>',
      defaultViewerFeatures,
    );
    expect(result.kind).toBe("html");
    if (result.kind === "html") {
      expect(result.html).toContain('target="_blank"');
      expect(result.html).toContain('rel="noopener noreferrer"');
    }
  });

  it("prepareViewerContent returns plain text", () => {
    expect(prepareViewerContent("hello", defaultViewerFeatures)).toEqual({
      kind: "plain",
      text: "hello",
    });
  });

  it("applyLinkTargetToHtml preserves existing target", () => {
    const html = '<a href="/x" target="_self">x</a>';
    expect(applyLinkTargetToHtml(html, "_blank")).toBe(html);
  });
});
