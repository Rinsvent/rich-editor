"use client";

import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { registerHljsCodeHighlighting } from "../../core/hljsCodeHighlight";
import { getHljs } from "../../core/hljsRuntime";

export function HljsCodeHighlightPlugin({ enabled }: { enabled: boolean }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!enabled) return;
    void getHljs();
    return registerHljsCodeHighlighting(editor);
  }, [editor, enabled]);

  return null;
}
