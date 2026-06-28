import { describe, expect, it } from "vitest";
import { defaultFeatures } from "./features";
import {
  buildMarkdownTransformers,
  looksLikeMarkdown,
  markdownToHtml,
} from "./markdown";

describe("buildMarkdownTransformers", () => {
  it("includes strikethrough when enabled", () => {
    const transformers = buildMarkdownTransformers({
      ...defaultFeatures,
      strikethrough: true,
    });
    const formats = transformers.flatMap((t) =>
      "format" in t ? t.format : [],
    );
    expect(formats).toContain("strikethrough");
  });

  it("omits strikethrough by default", () => {
    const transformers = buildMarkdownTransformers(defaultFeatures);
    const formats = transformers.flatMap((t) =>
      "format" in t ? t.format : [],
    );
    expect(formats).not.toContain("strikethrough");
  });
});

describe("looksLikeMarkdown", () => {
  it("detects strikethrough", () => {
    expect(looksLikeMarkdown("~~deleted~~")).toBe(true);
  });
});

describe("markdownToHtml", () => {
  it("renders strikethrough as s", () => {
    expect(markdownToHtml("~~deleted~~")).toContain("<s>deleted</s>");
  });
});
