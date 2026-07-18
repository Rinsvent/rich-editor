import { describe, expect, it } from "vitest";
import {
  decorateViewerHtml,
  expandStorageHtml,
  minimizeStorageHtml,
} from "./storageHtml";

describe("minimizeStorageHtml", () => {
  it("strips theme classes and flattens paragraphs to br", () => {
    const input =
      '<p class="re-paragraph"><b>hi</b></p><p class="re-paragraph">there</p>';
    expect(minimizeStorageHtml(input)).toBe("<b>hi</b><br>there");
  });

  it("minimizes blockquotes without nested paragraph wrappers", () => {
    const input =
      '<blockquote class="re-quote"><p class="re-paragraph"><i>q</i></p></blockquote>';
    expect(minimizeStorageHtml(input)).toBe("<blockquote><i>q</i></blockquote>");
  });

  it("converts spoiler spans to re-spoiler", () => {
    const input =
      '<p class="re-paragraph"><span class="re-spoiler" data-re-spoiler="">secret</span></p>';
    expect(minimizeStorageHtml(input)).toBe("<re-spoiler>secret</re-spoiler>");
  });

  it("keeps code language and strips highlight spans", () => {
    const input =
      '<pre class="re-block-code" spellcheck="false" data-language="javascript"><span class="token keyword">const</span> x</pre>';
    const out = minimizeStorageHtml(input);
    expect(out).toBe('<pre data-language="javascript">const x</pre>');
  });

  it("keeps image size attrs without class", () => {
    const input =
      '<p class="re-paragraph"><img class="re-image" src="https://cdn.example/a.png" alt="shot" width="240" height="180" data-file-id="1" data-aspect-ratio="1.333" style="width: 240px; max-width: 100%; height: auto;"></p>';
    const out = minimizeStorageHtml(input);
    expect(out).toContain("<img");
    expect(out).toContain('src="https://cdn.example/a.png"');
    expect(out).toContain('width="240"');
    expect(out).toContain('data-file-id="1"');
    expect(out).toContain('data-aspect-ratio="1.333"');
    expect(out).not.toContain("re-image");
    expect(out).not.toContain("class=");
  });
});

describe("expandStorageHtml", () => {
  it("rebuilds paragraphs and spoiler spans for Lexical", () => {
    const input = "<b>hi</b><br>there<br><re-spoiler>x</re-spoiler>";
    const out = expandStorageHtml(input);
    expect(out).toContain("<p>");
    expect(out).toContain('<span class="re-spoiler"');
    expect(out).toContain("there");
  });

  it("leaves legacy paragraph HTML intact", () => {
    const input = "<p><b>legacy</b></p>";
    expect(expandStorageHtml(input)).toBe("<p><b>legacy</b></p>");
  });
});

describe("decorateViewerHtml", () => {
  it("adds presentation classes for viewer", () => {
    const out = decorateViewerHtml(
      '<img src="https://x/a.png" data-file-id="1" width="100"><pre data-language="js">x</pre><re-spoiler>s</re-spoiler>',
    );
    expect(out).toContain('class="re-image"');
    expect(out).toContain('class="re-block-code"');
    expect(out).toContain("re-spoiler");
  });
});
