"use client";

import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  KEY_DOWN_COMMAND,
} from "lexical";
import type { EditorFeatures } from "../../core/features";

function isModKey(event: KeyboardEvent): boolean {
  return event.metaKey || event.ctrlKey;
}

export function KeyboardShortcutsPlugin({
  features,
  disabled,
}: {
  features: EditorFeatures;
  disabled?: boolean;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!features.keyboardShortcuts || disabled) return;

    return editor.registerCommand(
      KEY_DOWN_COMMAND,
      (event) => {
        if (!(event instanceof KeyboardEvent) || !isModKey(event)) {
          return false;
        }

        const key = event.key.toLowerCase();

        if (key === "b" && features.bold) {
          event.preventDefault();
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
          return true;
        }

        if (key === "i" && features.italic) {
          event.preventDefault();
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
          return true;
        }

        if (key === "e" && features.code && !event.shiftKey) {
          event.preventDefault();
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
          return true;
        }

        if (
          event.shiftKey &&
          key === "x" &&
          features.strikethrough
        ) {
          event.preventDefault();
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
          return true;
        }

        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [disabled, editor, features]);

  return null;
}
