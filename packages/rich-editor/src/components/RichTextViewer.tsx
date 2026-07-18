"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  resolveViewerFeatures,
  resolveViewerLabels,
  type ViewerFeatures,
  type ViewerLabels,
} from "../core/features";
import type { EditorAttachmentPayload } from "../core/attachments";
import { cn } from "../core/cn";
import type { MentionOption } from "../core/mentions";
import { MENTION_ID_ATTR, MENTION_LABEL_ATTR } from "../core/mentions";
import { defaultEditorTheme, type EditorTheme } from "../core/presets";
import { themeDataAttribute } from "../core/themePresets";
import { prepareViewerContent } from "../core/viewerHtml";
import {
  highlightViewerCodeBlocks,
  storeViewerCodeText,
} from "./highlightViewerCode";
import { enhanceViewerCodeBlocks } from "./enhanceViewerCode";
import { ViewerAttachments } from "./attachments/ViewerAttachments";

export type RichTextViewerProps = {
  content: string;
  features?: Partial<ViewerFeatures>;
  labels?: Partial<ViewerLabels>;
  className?: string;
  theme?: EditorTheme;
  onMentionClick?: (mention: MentionOption) => void;
  attachments?: EditorAttachmentPayload[];
  /**
   * Show attachment previews below content.
   * Default: true when `attachments` is non-empty.
   */
  showAttachments?: boolean;
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
  attachments = [],
  showAttachments,
}: RichTextViewerProps) {
  const features = useMemo(
    () => resolveViewerFeatures(featuresProp),
    [featuresProp],
  );
  const labels = useMemo(
    () => resolveViewerLabels(labelsProp),
    [labelsProp],
  );
  const ref = useRef<HTMLDivElement>(null);
  const [displayHtml, setDisplayHtml] = useState<string | null>(null);

  const prepared = useMemo(
    () => prepareViewerContent(content, features),
    [content, features.linkTarget],
  );

  const preparedHtml = prepared.kind === "html" ? prepared.html : "";

  useEffect(() => {
    setDisplayHtml(null);
  }, [content, features.codeHighlight]);

  const shouldShowAttachments =
    (showAttachments ?? attachments.length > 0) && attachments.length > 0;

  const attachmentStrip = shouldShowAttachments ? (
    <ViewerAttachments attachments={attachments} labels={labels} />
  ) : null;

  useLayoutEffect(() => {
    if (prepared.kind !== "html") return;

    let cancelled = false;

    const run = async () => {
      if (features.codeHighlight) {
        await highlightViewerCodeBlocks(ref.current);
        const highlighted = ref.current?.innerHTML;
        if (!cancelled && highlighted && highlighted !== preparedHtml) {
          setDisplayHtml(highlighted);
        }
      } else {
        storeViewerCodeText(ref.current);
        if (!cancelled) setDisplayHtml(null);
      }
      return enhanceViewerCodeBlocks(ref.current, labels);
    };

    let cleanup: (() => void) | undefined;
    void run().then((dispose) => {
      if (!cancelled) cleanup = dispose;
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [
    features.codeHighlight,
    labels.copyCode,
    labels.copiedCode,
    preparedHtml,
  ]);

  useEffect(() => {
    if (prepared.kind !== "html") return;
    const root = ref.current;
    if (!root) return;

    const onSpoilerClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest(
        ".re-spoiler, re-spoiler",
      );
      if (!target || !root.contains(target)) return;
      target.classList.add("re-spoiler-revealed");
    };

    root.addEventListener("click", onSpoilerClick);
    return () => root.removeEventListener("click", onSpoilerClick);
  }, [preparedHtml]);

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
  }, [labels.mention, onMentionClick, preparedHtml]);

  if (prepared.kind === "plain") {
    return (
      <div
        {...themeDataAttribute(theme)}
        className={cn("re-viewer-shell", className)}
      >
        <p className="re-viewer re-viewer-plain" aria-label={labels.content}>
          {prepared.text}
        </p>
        {attachmentStrip}
      </div>
    );
  }

  return (
    <div
      {...themeDataAttribute(theme)}
      className={cn("re-viewer-shell", className)}
    >
      <div
        ref={ref}
        className="re-viewer"
        role="article"
        aria-label={labels.content}
        dangerouslySetInnerHTML={{ __html: displayHtml ?? preparedHtml }}
      />
      {attachmentStrip}
    </div>
  );
}
