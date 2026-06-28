"use client";

import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isQuoteNode, QuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $findMatchingParent } from "@lexical/utils";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import type { FormatState } from "../../context/EditorContext";

const emptyFormat: FormatState = {
  bold: false,
  italic: false,
  strikethrough: false,
  code: false,
  quote: false,
};

export function useFormatState(): FormatState {
  const [editor] = useLexicalComposerContext();
  const [state, setState] = useState<FormatState>(emptyFormat);

  useEffect(() => {
    const update = () => {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          setState(emptyFormat);
          return;
        }
        setState({
          bold: selection.hasFormat("bold"),
          italic: selection.hasFormat("italic"),
          strikethrough: selection.hasFormat("strikethrough"),
          code: selection.hasFormat("code"),
          quote: !!$findMatchingParent(
            selection.anchor.getNode(),
            $isQuoteNode,
          ),
        });
      });
    };

    const removeUpdate = editor.registerUpdateListener(() => update());
    const removeSelection = editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        update();
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
    return () => {
      removeUpdate();
      removeSelection();
    };
  }, [editor]);

  return state;
}

export function useFormatActions() {
  const [editor] = useLexicalComposerContext();

  return {
    bold: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold"),
    italic: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic"),
    strikethrough: () =>
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough"),
    code: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code"),
    quote: () => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;
        const inQuote = !!$findMatchingParent(
          selection.anchor.getNode(),
          $isQuoteNode,
        );
        if (inQuote) {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () => new QuoteNode());
        }
      });
    },
  };
}
