"use client";

import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isCodeNode } from "@lexical/code";
import { $isQuoteNode } from "@lexical/rich-text";
import {
  $getRoot,
  $getSelection,
  $isParagraphNode,
  $isRangeSelection,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_HIGH,
  KEY_BACKSPACE_COMMAND,
  KEY_ENTER_COMMAND,
} from "lexical";
import {
  $exitCodeBlock,
  $getBlockCode,
  $getBlockQuote,
  $getCodeTrailingEmptyLines,
  $handleQuoteBackspace,
  $handleQuoteEnter,
  $isAtEndOfCodeBlock,
  $mergeAdjacentCodeBlocks,
  $mergeAdjacentQuoteBlocks,
  $shouldSkipBlockBehavior,
} from "../../core/blockBehavior";

function $needsBlockMerge(): boolean {
  const children = $getRoot().getChildren();
  for (let i = 0; i < children.length - 1; i++) {
    const current = children[i];
    const next = children[i + 1];
    if ($isQuoteNode(current) && $isQuoteNode(next)) return true;
    if ($isCodeNode(current) && $isCodeNode(next)) return true;
  }
  return false;
}

export function BlockBehaviorPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const removeMerge = editor.registerUpdateListener(({ editorState }) => {
      const needsMerge = editorState.read(() => $needsBlockMerge());
      if (!needsMerge) return;
      editor.update(
        () => {
          $mergeAdjacentQuoteBlocks();
          $mergeAdjacentCodeBlocks();
        },
        { discrete: true },
      );
    });

    const removeEnter = editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        if ($shouldSkipBlockBehavior()) return false;

        let handled = false;
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return;

          const quote = $getBlockQuote(selection.anchor.getNode());
          if (quote && $isQuoteNode(quote)) {
            event?.preventDefault();
            const paragraph = selection.anchor
              .getNode()
              .getTopLevelElementOrThrow();
            $handleQuoteEnter(quote, paragraph, selection);
            handled = true;
            return;
          }

          const code = $getBlockCode(selection.anchor.getNode());
          if (code && $isCodeNode(code) && $isAtEndOfCodeBlock(selection)) {
            const trailingEmpty = $getCodeTrailingEmptyLines(code);
            const text = code.getTextContent();
            const atEmptyLine =
              selection.focus.offset === text.length && text.endsWith("\n");

            if (atEmptyLine && trailingEmpty >= 2) {
              event?.preventDefault();
              $exitCodeBlock(code);
              handled = true;
            }
          }
        });

        return handled;
      },
      COMMAND_PRIORITY_HIGH,
    );

    const removeBackspace = editor.registerCommand(
      KEY_BACKSPACE_COMMAND,
      (event) => {
        if ($shouldSkipBlockBehavior()) return false;

        let handled = false;
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection) || !selection.isCollapsed()) return;

          const quote = $getBlockQuote(selection.anchor.getNode());
          if (!quote || !$isQuoteNode(quote)) return;

          const paragraph = selection.anchor
            .getNode()
            .getTopLevelElementOrThrow();
          if (!$isParagraphNode(paragraph) || paragraph.getParent() !== quote) {
            return;
          }

          event?.preventDefault();
          $handleQuoteBackspace(quote, paragraph, selection);
          handled = true;
        });

        return handled;
      },
      COMMAND_PRIORITY_CRITICAL,
    );

    return () => {
      removeMerge();
      removeEnter();
      removeBackspace();
    };
  }, [editor]);

  return null;
}
