import { describe, expect, it } from "vitest";
import { sanitizeHtml } from "./html";
import { MENTION_ID_ATTR, MENTION_LABEL_ATTR } from "./mentions";

describe("mention html", () => {
  it("preserves mention spans with data attributes", () => {
    const html = `<p>Hi <span class="re-mention" ${MENTION_ID_ATTR}="u1" ${MENTION_LABEL_ATTR}="alice">@alice</span></p>`;
    expect(sanitizeHtml(html)).toBe(html);
  });
});
