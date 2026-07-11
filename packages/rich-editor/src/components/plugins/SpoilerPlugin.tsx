"use client";

import { useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $findMatchingParent } from "@lexical/utils";
import { $getSelection, $isRangeSelection } from "lexical";
import { $isSpoilerNode } from "../../nodes/SpoilerNode";

export function SpoilerPlugin() {
  const [editor] = useLexicalComposerContext();
  const editingRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = editor.getRootElement();
    if (!root) return;

    const clearEditing = () => {
      if (editingRef.current) {
        editingRef.current.classList.remove("re-spoiler-editing");
        editingRef.current = null;
      }
    };

    const markEditing = (element: HTMLElement | null) => {
      clearEditing();
      if (!element) return;
      element.classList.add("re-spoiler-editing");
      editingRef.current = element;
    };

    const onClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest(".re-spoiler");
      if (!target || !root.contains(target)) {
        clearEditing();
        return;
      }
      markEditing(target as HTMLElement);
    };

    const removeUpdate = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const spoiler = $findMatchingParent(
          selection.anchor.getNode(),
          $isSpoilerNode,
        );
        if (!spoiler) return;

        markEditing(editor.getElementByKey(spoiler.getKey()));
      });
    });

    root.addEventListener("click", onClick);
    return () => {
      root.removeEventListener("click", onClick);
      removeUpdate();
      clearEditing();
    };
  }, [editor]);

  return null;
}
