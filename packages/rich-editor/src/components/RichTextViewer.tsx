"use client";

import { useEffect, useMemo, useRef } from "react";
import {
  resolveViewerFeatures,
  resolveViewerLabels,
  type ViewerFeatures,
  type ViewerLabels,
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
  labels?: Partial<ViewerLabels>;
  className?: string;
  theme?: EditorTheme;
  onMentionClick?: (mention: MentionOption) => void;
};

function mentionAriaLabel(template: string, label: string): string {
  return template.replace("{label}", label);
}

function readMentionFromElement(element: Element): MentionOption | null {
  const id = element.getAttribute(MENTION_ID_ATTR);
  if (!id) return null;
  const label =
    element.getAttribute(MENTION_LABEL_ATTR) ??
    element.textContent?.replace(/^@/, "") ??
    id;
  return { id, label };
}

export function RichTextViewer({
  content,
  features: featuresProp,
  labels: labelsProp,
  className,
  theme = defaultEditorTheme,
  onMentionClick,
}: RichTextViewerProps) {
  const features = resolveViewerFeatures(featuresProp);
  const labels = resolveViewerLabels(labelsProp);
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
    if (prepared.kind !== "html") return;
    const root = ref.current;
    if (!root) return;

    const onSpoilerClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest(".re-spoiler");
      if (!target || !root.contains(target)) return;
      target.classList.add("re-spoiler-revealed");
    };

    root.addEventListener("click", onSpoilerClick);
    return () => root.removeEventListener("click", onSpoilerClick);
  }, [prepared]);

  useEffect(() => {
    if (prepared.kind !== "html" || !onMentionClick) return;
    const root = ref.current;
    if (!root) return;

    const mentions = root.querySelectorAll(`[${MENTION_ID_ATTR}]`);
    mentions.forEach((element) => {
      const mention = readMentionFromElement(element);
      if (!mention) return;
      element.setAttribute("role", "button");
      element.setAttribute("tabindex", "0");
      element.setAttribute(
        "aria-label",
        mentionAriaLabel(labels.mention, mention.label),
      );
    });

    const activateMention = (target: Element) => {
      const mention = readMentionFromElement(target);
      if (mention) onMentionClick(mention);
    };

    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest(
        `[${MENTION_ID_ATTR}]`,
      );
      if (!target || !root.contains(target)) return;
      activateMention(target);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const target = (event.target as HTMLElement).closest(
        `[${MENTION_ID_ATTR}]`,
      );
      if (!target || !root.contains(target)) return;
      event.preventDefault();
      activateMention(target);
    };

    root.addEventListener("click", onClick);
    root.addEventListener("keydown", onKeyDown);
    return () => {
      root.removeEventListener("click", onClick);
      root.removeEventListener("keydown", onKeyDown);
    };
  }, [labels.mention, onMentionClick, prepared]);

  if (prepared.kind === "plain") {
    return (
      <p
        {...themeDataAttribute(theme)}
        className={cn("re-viewer re-viewer-plain", className)}
        aria-label={labels.content}
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
      role="article"
      aria-label={labels.content}
      dangerouslySetInnerHTML={{ __html: prepared.html }}
    />
  );
}
