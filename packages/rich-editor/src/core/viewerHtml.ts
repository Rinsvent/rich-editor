import type { ViewerFeatures } from "./features";
import { applyLinkTargetToHtml, isHtmlContent, sanitizeHtml } from "./html";

export type PreparedViewerContent =
  | { kind: "plain"; text: string }
  | { kind: "html"; html: string };

/** Sanitize and enrich HTML for RichTextViewer (safe on server and client). */
export function prepareViewerContent(
  content: string,
  features: Pick<ViewerFeatures, "linkTarget">,
): PreparedViewerContent {
  if (!isHtmlContent(content)) {
    return { kind: "plain", text: content };
  }

  let html = sanitizeHtml(content);
  if (features.linkTarget) {
    html = applyLinkTargetToHtml(html, features.linkTarget);
  }

  return { kind: "html", html };
}
