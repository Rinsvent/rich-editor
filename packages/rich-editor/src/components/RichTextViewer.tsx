"use client";

import { useEffect, useRef } from "react";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import plaintext from "highlight.js/lib/languages/plaintext";
import typescript from "highlight.js/lib/languages/typescript";
import {
  resolveViewerFeatures,
  type ViewerFeatures,
} from "../core/features";
import { isHtmlContent, sanitizeHtml } from "../core/html";
import { cn } from "../core/cn";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("js", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("ts", typescript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("plaintext", plaintext);

export type RichTextViewerProps = {
  content: string;
  features?: Partial<ViewerFeatures>;
  className?: string;
  theme?: "light" | "dark";
};

export function RichTextViewer({
  content,
  features: featuresProp,
  className,
  theme = "dark",
}: RichTextViewerProps) {
  const features = resolveViewerFeatures(featuresProp);
  const ref = useRef<HTMLDivElement>(null);
  const isHtml = isHtmlContent(content);
  const html = isHtml ? sanitizeHtml(content) : "";

  useEffect(() => {
    if (!isHtml || !features.codeHighlight) return;
    const root = ref.current;
    if (!root) return;
    root.querySelectorAll("pre code").forEach((el) => {
      hljs.highlightElement(el as HTMLElement);
    });
  }, [content, features.codeHighlight, isHtml]);

  useEffect(() => {
    if (!isHtml || !features.linkTarget) return;
    const root = ref.current;
    if (!root) return;
    root.querySelectorAll("a[href]").forEach((a) => {
      a.setAttribute("target", features.linkTarget);
      a.setAttribute("rel", "noopener noreferrer");
    });
  }, [content, features.linkTarget, isHtml]);

  if (!isHtml) {
    return (
      <p
        data-re-theme={theme}
        className={cn("re-viewer re-viewer-plain", className)}
      >
        {content}
      </p>
    );
  }

  return (
    <div
      ref={ref}
      data-re-theme={theme}
      className={cn("re-viewer", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
