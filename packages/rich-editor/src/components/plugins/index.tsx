"use client";

import { useEffect, useRef } from "react";
import { $generateNodesFromDOM } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createParagraphNode, $getRoot } from "lexical";
import { $clearStickyTextFormats } from "../../core/selectionFormat";

export function InitialHtmlPlugin({ html }: { html?: string }) {
  const [editor] = useLexicalComposerContext();
  const lastApplied = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (html === lastApplied.current) return;

      editor.update(() => {
        const root = $getRoot();
        root.clear();
        if (!html?.trim()) {
          const paragraph = $createParagraphNode();
          root.append(paragraph);
          paragraph.select();
          $clearStickyTextFormats();
          lastApplied.current = html;
          return;
        }
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom.body);
      root.append(...nodes);
      lastApplied.current = html;
    });
  }, [editor, html]);

  return null;
}

export function BlurCapturePlugin({
  rootRef,
  onBlur,
  getHtml,
}: {
  rootRef: React.RefObject<HTMLElement | null>;
  onBlur?: (html: string) => void;
  getHtml: () => string;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!onBlur) return;
    const root = rootRef.current;
    if (!root) return;

    const handler = (e: FocusEvent) => {
      const next = e.relatedTarget as Node | null;
      if (next && root.contains(next)) return;
      onBlur(getHtml());
    };
    root.addEventListener("focusout", handler);
    return () => root.removeEventListener("focusout", handler);
  }, [editor, getHtml, onBlur, rootRef]);

  return null;
}

export function FocusPlugin({
  focusRef,
}: {
  focusRef: React.MutableRefObject<(() => void) | null>;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    focusRef.current = () => editor.focus();
    return () => {
      focusRef.current = null;
    };
  }, [editor, focusRef]);

  return null;
}

export function SetHtmlPlugin({
  setHtmlRef,
}: {
  setHtmlRef: React.MutableRefObject<((html: string) => void) | null>;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    setHtmlRef.current = (html: string) => {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        if (!html.trim()) {
          const paragraph = $createParagraphNode();
          root.append(paragraph);
          paragraph.select();
          $clearStickyTextFormats();
          return;
        }
        const parser = new DOMParser();
        const dom = parser.parseFromString(html, "text/html");
        const nodes = $generateNodesFromDOM(editor, dom.body);
        root.append(...nodes);
      });
    };
    return () => {
      setHtmlRef.current = null;
    };
  }, [editor, setHtmlRef]);

  return null;
}

export function ClearPlugin({
  clearRef,
  resetFormatsRef,
}: {
  clearRef: React.MutableRefObject<(() => void) | null>;
  resetFormatsRef?: React.MutableRefObject<(() => void) | null>;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const resetFormats = () => {
      editor.update(() => {
        $clearStickyTextFormats();
      });
    };

    clearRef.current = () => {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        const paragraph = $createParagraphNode();
        root.append(paragraph);
        paragraph.select();
        $clearStickyTextFormats();
      });
      editor.focus();
    };

    if (resetFormatsRef) {
      resetFormatsRef.current = resetFormats;
    }

    return () => {
      clearRef.current = null;
      if (resetFormatsRef) {
        resetFormatsRef.current = null;
      }
    };
  }, [editor, clearRef, resetFormatsRef]);

  return null;
}

export function EmptyStatePlugin({
  onEmptyChange,
}: {
  onEmptyChange: (empty: boolean) => void;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const update = () => {
      editor.getEditorState().read(() => {
        onEmptyChange($getRoot().getTextContent().trim() === "");
      });
    };
    update();
    return editor.registerUpdateListener(() => update());
  }, [editor, onEmptyChange]);

  return null;
}

export { EnterPlugin } from "./EnterPlugin";
export { MarkdownPastePlugin } from "./MarkdownPastePlugin";
export { KeyboardShortcutsPlugin } from "./KeyboardShortcutsPlugin";
export { MentionsPlugin } from "./MentionsPlugin";
export { BlockBehaviorPlugin } from "./BlockBehaviorPlugin";
export { CodeHighlightPlugin } from "./CodeHighlightPlugin";
export { CodeLanguagePlugin } from "./CodeLanguagePlugin";
export { SelectionMenuPlugin } from "./SelectionMenuPlugin";
export { LineBreakPlugin } from "./LineBreakPlugin";
export { LinkUiPlugin } from "./LinkUiPlugin";
export { SpoilerPlugin } from "./SpoilerPlugin";
export { AttachmentsPlugin } from "./AttachmentsPlugin";
