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
  DELETE_CHARACTER_COMMAND,
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
  $isAtStartOfBlock,
  $mergeAdjacentCodeBlocks,
  $mergeAdjacentQuoteBlocks,
  $shouldSkipBlockBehavior,
} from "../../core/blockBehavior";
import {
  $getQuoteParagraph,
  $normalizeAllQuotes,
} from "../../core/quoteBlocks";

function $needsQuoteNormalization(): boolean {
  for (const child of $getRoot().getChildren()) {
    if (!$isQuoteNode(child)) continue;
    const children = child.getChildren();
    if (children.length === 0 || children.some((node) => !$isParagraphNode(node))) {
      return true;
    }
  }
  return false;
}

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
      const needsWork = editorState.read(
        () => $needsBlockMerge() || $needsQuoteNormalization(),
      );
      if (!needsWork) return;
      editor.update(
        () => {
          $normalizeAllQuotes();
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

        const quoteContext = editor.getEditorState().read(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return null;
          const quote = $getBlockQuote(selection.anchor.getNode());
          if (!quote || !$isQuoteNode(quote)) return null;
          const paragraph = $getQuoteParagraph(selection.anchor.getNode());
          if (!paragraph || paragraph.getParent() !== quote) return null;
          return { quote, paragraph };
        });

        if (quoteContext) {
          event?.preventDefault();
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            $handleQuoteEnter(
              quoteContext.quote,
              quoteContext.paragraph,
              selection,
            );
          });
          return true;
        }

        const shouldExitCode = editor.getEditorState().read(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return false;
          const code = $getBlockCode(selection.anchor.getNode());
          if (!code || !$isCodeNode(code) || !$isAtEndOfCodeBlock(selection)) {
            return false;
          }
          const trailingEmpty = $getCodeTrailingEmptyLines(code);
          const text = code.getTextContent();
          const atEmptyLine =
            selection.focus.offset === text.length && text.endsWith("\n");
          return atEmptyLine && trailingEmpty >= 2;
        });

        if (shouldExitCode) {
          event?.preventDefault();
          editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;
            const code = $getBlockCode(selection.anchor.getNode());
            if (code && $isCodeNode(code)) {
              $exitCodeBlock(code);
            }
          });
          return true;
        }

        return false;
      },
      COMMAND_PRIORITY_CRITICAL,
    );

    const removeBackspace = editor.registerCommand(
      DELETE_CHARACTER_COMMAND,
      (isBackward) => {
        if (!isBackward) return false;
        if ($shouldSkipBlockBehavior()) return false;

        const selection = $getSelection();
        if (!$isRangeSelection(selection) || !selection.isCollapsed()) return false;
        if (!$isAtStartOfBlock(selection)) return false;

        const quote = $getBlockQuote(selection.anchor.getNode());
        if (!quote || !$isQuoteNode(quote)) return false;

        const paragraph = $getQuoteParagraph(selection.anchor.getNode());
        if (!paragraph || paragraph.getParent() !== quote) return false;

        $handleQuoteBackspace(quote, paragraph, selection);
        return true;
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
