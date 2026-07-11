"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isCodeNode, normalizeCodeLanguage } from "@lexical/code";
import { $findMatchingParent } from "@lexical/utils";
import {
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import type { EditorLabels } from "../../core/features";
import {
  HLJS_LANGUAGE_IDS,
  getHljsLanguageLabel,
} from "../../core/hljsLanguages";

type ToolbarState = {
  codeKey: string;
  language: string;
  top: number;
  right: number;
};

/** Map Prism language ids (stored on CodeNode) back to highlight.js select values. */
const PRISM_TO_HLJS_LANGUAGE: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  py: "python",
  plain: "plaintext",
  md: "markdown",
};

function toSelectLanguage(language: string | undefined): string {
  if (!language) return "plaintext";
  return PRISM_TO_HLJS_LANGUAGE[language] ?? language;
}

export function CodeLanguagePlugin({
  labels,
  containerRef,
}: {
  labels: EditorLabels;
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const [editor] = useLexicalComposerContext();
  const [toolbar, setToolbar] = useState<ToolbarState | null>(null);

  const languageOptions = useMemo(
    () =>
      HLJS_LANGUAGE_IDS.map((id) => ({
        id,
        label: getHljsLanguageLabel(id),
      })).sort((a, b) => a.label.localeCompare(b.label)),
    [],
  );

  useEffect(() => {
    const update = () => {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          setToolbar(null);
          return;
        }

        const code = $findMatchingParent(selection.anchor.getNode(), $isCodeNode);
        if (!code) {
          setToolbar(null);
          return;
        }

        const element = editor.getElementByKey(code.getKey());
        const container = containerRef.current;
        if (!element || !container) {
          setToolbar(null);
          return;
        }

        const rect = element.getBoundingClientRect();
        const host = container.getBoundingClientRect();
        const language = toSelectLanguage(code.getLanguage());

        setToolbar((prev) => {
          const next = {
            codeKey: code.getKey(),
            language,
            top: rect.top - host.top + 6,
            right: host.right - rect.right + 6,
          };
          if (
            prev &&
            prev.codeKey === next.codeKey &&
            prev.language === next.language &&
            prev.top === next.top &&
            prev.right === next.right
          ) {
            return prev;
          }
          return next;
        });
      });
    };

    update();
    const removeSelection = editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        update();
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    return () => {
      removeSelection();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [containerRef, editor]);

  const onChange = (language: string) => {
    if (!toolbar) return;
    const codeKey = toolbar.codeKey;

    editor.update(() => {
      const code = $getNodeByKey(codeKey);
      if (!$isCodeNode(code)) return;
      code.setLanguage(normalizeCodeLanguage(language));
    });

    setToolbar((current) =>
      current ? { ...current, language } : current,
    );
  };

  if (!toolbar || !containerRef.current) return null;

  return createPortal(
    <div
      className="re-code-language-toolbar"
      style={{
        top: `${toolbar.top}px`,
        right: `${toolbar.right}px`,
      }}
    >
      <label className="re-code-language-label">
        <span className="sr-only">{labels.codeLanguage}</span>
        <select
          className="re-code-language-select"
          value={toolbar.language}
          aria-label={labels.codeLanguage}
          onMouseDown={(event) => event.stopPropagation()}
          onChange={(event) => onChange(event.target.value)}
        >
          {languageOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>,
    containerRef.current,
  );
}
