import type { ViewerFeatures } from "./features";
import { applyLinkTargetToHtml, isHtmlContent, sanitizeHtml } from "./html";
import { decorateViewerHtml } from "./storageHtml";

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
  html = decorateViewerHtml(html);
  if (features.linkTarget) {
    html = applyLinkTargetToHtml(html, features.linkTarget);
  }

  return { kind: "html", html };
}
