"use client";

import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  KEY_ENTER_COMMAND,
} from "lexical";
import type { EnterKeyBinding } from "../../core/enterBindings";
import {
  matchEnterKeyAction,
  shouldPluginHandleEnterAction,
} from "../../core/enterBindings";

export function EnterPlugin({
  bindings,
  onSubmit,
}: {
  bindings: EnterKeyBinding[];
  onSubmit?: () => void;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!bindings.length) return;

    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        if (!(event instanceof KeyboardEvent)) return false;

        const action = matchEnterKeyAction(event, bindings);
        if (!action) return false;

        if (!shouldPluginHandleEnterAction(event, action, bindings)) {
          return false;
        }

        if (action === "newline") {
          event.preventDefault();
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              selection.insertParagraph();
            }
          });
          return true;
        }

        if (action === "submit" && onSubmit) {
          event.preventDefault();
          onSubmit();
          return true;
        }

        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [bindings, editor, onSubmit]);

  return null;
}
