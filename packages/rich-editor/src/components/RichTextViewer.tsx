"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  resolveViewerFeatures,
  type ViewerFeatures,
} from "../core/features";
import { cn } from "../core/cn";
import type { MentionOption } from "../core/mentions";
import { MENTION_ID_ATTR, MENTION_LABEL_ATTR } from "../core/mentions";
import { defaultEditorTheme, type EditorTheme } from "../core/presets";
import { themeDataAttribute } from "../core/themePresets";
import { prepareViewerContent } from "../core/viewerHtml";
import { highlightViewerCodeBlocks } from "./highlightViewerCode";

export type RichTextViewerProps = {
  content: string;
  features?: Partial<ViewerFeatures>;
  className?: string;
  theme?: EditorTheme;
  onMentionClick?: (mention: MentionOption) => void;
};

export function RichTextViewer({
  content,
  features: featuresProp,
  className,
  theme = defaultEditorTheme,
  onMentionClick,
}: RichTextViewerProps) {
  const features = resolveViewerFeatures(featuresProp);
  const ref = useRef<HTMLDivElement>(null);

  const prepared = useMemo(
    () => prepareViewerContent(content, features),
    [content, features],
  );

  useEffect(() => {
    if (prepared.kind !== "html" || !features.codeHighlight) return;
    void highlightViewerCodeBlocks(ref.current);
  }, [prepared, features.codeHighlight]);

  useEffect(() => {
    if (prepared.kind !== "html" || !onMentionClick) return;
    const root = ref.current;
    if (!root) return;

    const handler = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest(
        `[${MENTION_ID_ATTR}]`,
      );
      if (!target || !root.contains(target)) return;
      const id = target.getAttribute(MENTION_ID_ATTR);
      if (!id) return;
      const label =
        target.getAttribute(MENTION_LABEL_ATTR) ??
        target.textContent?.replace(/^@/, "") ??
        id;
      onMentionClick({ id, label });
    };

    root.addEventListener("click", handler);
    return () => root.removeEventListener("click", handler);
  }, [prepared, onMentionClick]);

  if (prepared.kind === "plain") {
    return (
      <p
        {...themeDataAttribute(theme)}
        className={cn("re-viewer re-viewer-plain", className)}
      >
        {prepared.text}
      </p>
    );
  }

  return (
    <div
      ref={ref}
      {...themeDataAttribute(theme)}
      className={cn("re-viewer", className)}
      dangerouslySetInnerHTML={{ __html: prepared.html }}
    />
  );
}
