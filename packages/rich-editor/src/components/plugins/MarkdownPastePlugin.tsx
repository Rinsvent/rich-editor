"use client";

import { $generateNodesFromDOM } from "@lexical/html";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  COMMAND_PRIORITY_HIGH,
  PASTE_COMMAND,
} from "lexical";
import { useEffect } from "react";
import type { EditorFeatures } from "../../core/features";
import { sanitizeHtml } from "../../core/html";
import { looksLikeMarkdown, markdownToHtml } from "../../core/markdown";

function htmlToNodes(
  editor: ReturnType<typeof useLexicalComposerContext>[0],
  html: string,
) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return $generateNodesFromDOM(editor, doc.body);
}

export function MarkdownPastePlugin({
  features,
}: {
  features: EditorFeatures;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!features.markdownPaste) return;

    return editor.registerCommand(
      PASTE_COMMAND,
      (event) => {
        if (!(event instanceof ClipboardEvent)) return false;
        const clipboard = event.clipboardData;
        if (!clipboard) return false;

        const text = clipboard.getData("text/plain");
        const htmlRaw = clipboard.getData("text/html");

        if (text && looksLikeMarkdown(text)) {
          event.preventDefault();
          const html = markdownToHtml(text);
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            if (!selection.isCollapsed()) {
              selection.removeText();
            }
            const nodes = htmlToNodes(editor, html);
            if (nodes.length > 0) {
              $insertNodes(nodes);
            }
          });
          return true;
        }

        if (htmlRaw && htmlRaw.trim() && !looksLikeMarkdown(text)) {
          event.preventDefault();
          const html = sanitizeHtml(htmlRaw);
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            if (!selection.isCollapsed()) {
              selection.removeText();
            }
            const nodes = htmlToNodes(editor, html);
            if (nodes.length > 0) {
              $insertNodes(nodes);
            }
          });
          return true;
        }

        return false;
      },
      COMMAND_PRIORITY_HIGH,
    );
  }, [editor, features.markdownPaste]);

  return null;
}
