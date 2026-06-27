"use client";

import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  KEY_ENTER_COMMAND,
} from "lexical";
import type { EnterBehavior } from "../../core/features";

export function EnterPlugin({
  behavior,
  onSubmit,
}: {
  behavior: EnterBehavior;
  onSubmit?: () => void;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        if (behavior === "newline") return false;

        if (behavior === "shift-newline") {
          if (event?.shiftKey) {
            event.preventDefault();
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                selection.insertParagraph();
              }
            });
            return true;
          }
          if (onSubmit) {
            event?.preventDefault();
            onSubmit();
            return true;
          }
          return false;
        }

        if (behavior === "submit") {
          if (event?.shiftKey) {
            event.preventDefault();
            editor.update(() => {
              const selection = $getSelection();
              if ($isRangeSelection(selection)) {
                selection.insertParagraph();
              }
            });
            return true;
          }
          if (onSubmit) {
            event?.preventDefault();
            onSubmit();
            return true;
          }
        }

        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [behavior, editor, onSubmit]);

  return null;
}
