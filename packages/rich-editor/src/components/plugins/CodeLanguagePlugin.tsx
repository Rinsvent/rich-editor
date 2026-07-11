"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  getHljsLanguageLabel,
  resolveCodeLanguages,
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
  codeLanguages,
}: {
  labels: EditorLabels;
  containerRef: React.RefObject<HTMLElement | null>;
  codeLanguages?: string[];
}) {
  const [editor] = useLexicalComposerContext();
  const [toolbar, setToolbar] = useState<ToolbarState | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const languageOptions = useMemo(() => {
    const ids = resolveCodeLanguages(codeLanguages);
    return ids
      .map((id) => ({
        id,
        label: getHljsLanguageLabel(id),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [codeLanguages]);

  const allowedLanguages = useMemo(
    () => new Set(languageOptions.map((option) => option.id)),
    [languageOptions],
  );

  const update = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        setToolbar(null);
        setMenuOpen(false);
        return;
      }

      const code = $findMatchingParent(selection.anchor.getNode(), $isCodeNode);
      if (!code || !code.isAttached()) {
        setToolbar(null);
        setMenuOpen(false);
        return;
      }

      const element = editor.getElementByKey(code.getKey());
      const container = containerRef.current;
      if (!element || !container || !container.contains(element)) {
        setToolbar(null);
        setMenuOpen(false);
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
  }, [containerRef, editor]);

  useEffect(() => {
    update();
    const removeSelection = editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        update();
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
    const removeUpdate = editor.registerUpdateListener(() => {
      update();
    });
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    return () => {
      removeSelection();
      removeUpdate();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [editor, update]);

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (toolbarRef.current?.contains(target)) return;
      setMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [menuOpen]);

  const setLanguage = (language: string) => {
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
    setMenuOpen(false);
  };

  if (!toolbar || !containerRef.current) return null;

  const currentLabel =
    languageOptions.find((option) => option.id === toolbar.language)?.label ??
    getHljsLanguageLabel(toolbar.language);

  const resolvedLanguage = allowedLanguages.has(toolbar.language)
    ? toolbar.language
    : (languageOptions[0]?.id ?? toolbar.language);

  return createPortal(
    <div
      ref={toolbarRef}
      className="re-code-language-toolbar"
      style={{
        top: `${toolbar.top}px`,
        right: `${toolbar.right}px`,
      }}
    >
      <div className="re-code-language-picker">
        <button
          type="button"
          className="re-code-language-trigger"
          aria-label={labels.codeLanguage}
          aria-haspopup="listbox"
          aria-expanded={menuOpen}
          onMouseDown={(event) => event.stopPropagation()}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="re-code-language-trigger-label">{currentLabel}</span>
          <svg
            className="re-code-language-chevron"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            aria-hidden="true"
          >
            <path
              d="M2 3.5 5 6.5 8 3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {menuOpen && (
          <ul
            className="re-code-language-menu re-scrollbar"
            role="listbox"
            aria-label={labels.codeLanguage}
          >
            {languageOptions.map((option) => (
              <li key={option.id} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={option.id === resolvedLanguage}
                  className="re-code-language-menu-item"
                  onMouseDown={(event) => event.stopPropagation()}
                  onClick={() => setLanguage(option.id)}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>,
    containerRef.current,
  );
}
