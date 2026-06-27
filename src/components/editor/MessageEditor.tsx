"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { $isQuoteNode, HeadingNode, QuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $findMatchingParent } from "@lexical/utils";
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  KEY_ENTER_COMMAND,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { cn } from "@/lib/utils";
import { normalizeMessageHtml } from "@/lib/messageHtml";
import { MESSAGE_MARKDOWN_TRANSFORMERS } from "@/lib/markdown";
import { MarkdownPastePlugin } from "./MarkdownPastePlugin";
import { editorTheme } from "./editorTheme";

export type MessageEditorHandle = {
  getHtml: () => string;
};

type Props = {
  disabled?: boolean;
  initialHtml?: string;
  editorKey?: string;
  submitMode?: "send" | "save";
  scheduledCount?: number;
  scheduleHint?: string | null;
  onBlurDraft?: (html: string) => void;
  onOpenScheduledList?: () => void;
  onScheduleNew?: () => void;
  onSubmit: (html: string) => Promise<void>;
  clearAfterSubmit?: boolean;
};

type FormatState = {
  bold: boolean;
  italic: boolean;
  code: boolean;
  quote: boolean;
};

const emptyFormat: FormatState = {
  bold: false,
  italic: false,
  code: false,
  quote: false,
};

function onError(error: Error) {
  console.error(error);
}

export function exportEditorHtml(editor: LexicalEditor): string {
  let html = "";
  editor.getEditorState().read(() => {
    html = $generateHtmlFromNodes(editor, null);
  });
  return normalizeMessageHtml(html.trim());
}

function isEditorEmpty(editor: LexicalEditor): boolean {
  let empty = true;
  editor.getEditorState().read(() => {
    empty = $getRoot().getTextContent().trim() === "";
  });
  return empty;
}

function useFormatState(): FormatState {
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
          code: selection.hasFormat("code"),
          quote: !!$findMatchingParent(selection.anchor.getNode(), $isQuoteNode),
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

function InitialHtmlPlugin({ html }: { html?: string }) {
  const [editor] = useLexicalComposerContext();
  const applied = useRef(false);

  useEffect(() => {
    applied.current = false;
  }, [html]);

  useEffect(() => {
    if (!html?.trim()) return;
    applied.current = false;
    editor.update(() => {
      const root = $getRoot();
      root.clear();
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom.body);
      root.append(...nodes);
    });
    applied.current = true;
  }, [editor, html]);

  return null;
}

function BlurCapture({
  onBlurDraft,
}: {
  onBlurDraft?: (html: string) => void;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!onBlurDraft) return;
    const root = document.getElementById("message-editor-root");
    if (!root) return;

    const handler = (e: FocusEvent) => {
      const next = e.relatedTarget as Node | null;
      if (next && root.contains(next)) return;
      onBlurDraft(exportEditorHtml(editor));
    };
    root.addEventListener("focusout", handler);
    return () => root.removeEventListener("focusout", handler);
  }, [editor, onBlurDraft]);

  return null;
}

function EditorRefPlugin({
  editorRef,
}: {
  editorRef: React.RefObject<MessageEditorHandle | null>;
}) {
  const [editor] = useLexicalComposerContext();
  useImperativeHandle(editorRef, () => ({
    getHtml: () => exportEditorHtml(editor),
  }));
  return null;
}

function EnterPlugin({ onSubmit }: { onSubmit: () => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
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
        event?.preventDefault();
        onSubmit();
        return true;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor, onSubmit]);

  return null;
}

function EditorToolbar({
  scheduledCount,
  onOpenScheduledList,
  onScheduleNew,
}: {
  scheduledCount?: number;
  onOpenScheduledList?: () => void;
  onScheduleNew?: () => void;
}) {
  const [editor] = useLexicalComposerContext();
  const active = useFormatState();
  const [menuOpen, setMenuOpen] = useState(false);

  function formatText(type: "bold" | "italic" | "code") {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, type);
  }

  function formatQuote() {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      const inQuote = !!$findMatchingParent(selection.anchor.getNode(), $isQuoteNode);
      if (inQuote) {
        $setBlocksType(selection, () => $createParagraphNode());
      } else {
        $setBlocksType(selection, () => new QuoteNode());
      }
    });
  }

  return (
    <div className="relative flex items-center justify-between gap-1 border-b border-tg-border/60 px-2 py-1.5">
      <div className="flex flex-wrap gap-1">
        <ToolbarButton label="Жирный" active={active.bold} onClick={() => formatText("bold")}>B</ToolbarButton>
        <ToolbarButton label="Курсив" active={active.italic} onClick={() => formatText("italic")}>I</ToolbarButton>
        <ToolbarButton label="Код" active={active.code} onClick={() => formatText("code")}>{"</>"}</ToolbarButton>
        <ToolbarButton label="Цитата" active={active.quote} onClick={formatQuote}>“</ToolbarButton>
      </div>
      <div className="relative flex shrink-0 items-center gap-2 pr-0.5">
        <button
          type="button"
          aria-label="Отложенные"
          title="Отложенные"
          onClick={onOpenScheduledList}
          className="relative mr-0.5 rounded-lg p-2 text-tg-muted hover:bg-tg-hover hover:text-tg-text"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          {(scheduledCount ?? 0) > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-tg-accent px-1 text-[10px] font-bold leading-none text-white">
              {scheduledCount! > 9 ? "9+" : scheduledCount}
            </span>
          )}
        </button>
        <button
          type="button"
          aria-label="Меню"
          title="Меню"
          onClick={() => setMenuOpen((v) => !v)}
          className="rounded-lg p-2 text-tg-muted hover:bg-tg-hover hover:text-tg-text"
        >
          ⋮
        </button>
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 top-full z-20 mt-1 min-w-[180px] rounded-lg border border-tg-border bg-tg-panel py-1 shadow-lg">
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-tg-hover"
                onClick={() => {
                  setMenuOpen(false);
                  onScheduleNew?.();
                }}
              >
                Отложить отправку…
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ToolbarButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      onClick={onClick}
      className={cn(
        "rounded-md px-2 py-1 text-xs font-medium transition",
        active
          ? "bg-tg-accent/25 text-tg-accent"
          : "text-tg-muted hover:bg-tg-hover hover:text-tg-text",
      )}
    >
      {children}
    </button>
  );
}

function SubmitButton({
  disabled,
  mode,
  clearAfterSubmit,
  onSubmit,
}: {
  disabled?: boolean;
  mode: "send" | "save";
  clearAfterSubmit?: boolean;
  onSubmit: (html: string) => Promise<void>;
}) {
  const [editor] = useLexicalComposerContext();
  const [sending, setSending] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  const submit = useCallback(async () => {
    if (disabled || sending || isEditorEmpty(editor)) return;
    const html = exportEditorHtml(editor);
    if (!html) return;
    setSending(true);
    try {
      await onSubmit(html);
      if (clearAfterSubmit) {
        editor.update(() => {
          $getRoot().clear();
        });
      }
    } finally {
      setSending(false);
    }
  }, [clearAfterSubmit, disabled, editor, onSubmit, sending]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        setCanSubmit(!disabled && !sending && $getRoot().getTextContent().trim() !== "");
      });
    });
  }, [disabled, editor, sending]);

  const label = mode === "save" ? "Сохранить" : "Отправить";

  return (
    <>
      <EnterPlugin onSubmit={() => void submit()} />
      {canSubmit && (
        <button
          type="button"
          onClick={() => void submit()}
          disabled={disabled || sending}
          className="absolute bottom-1.5 right-1.5 z-10 p-1 text-tg-accent transition hover:text-tg-accentHover disabled:opacity-40"
          aria-label={label}
          title={label}
        >
          {mode === "save" ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-7 16v-4h2v4h-2zm5-10H7V5h8v4z" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
        </button>
      )}
    </>
  );
}

function MessageEditorInner(
  {
    disabled,
    initialHtml,
    submitMode = "send",
    scheduledCount,
    scheduleHint,
    onBlurDraft,
    onOpenScheduledList,
    onScheduleNew,
    onSubmit,
    clearAfterSubmit = true,
  }: Props,
  ref: React.Ref<MessageEditorHandle>,
) {
  const handleRef = useRef<MessageEditorHandle | null>(null);
  const initialConfig = {
    namespace: "MessageEditor",
    theme: editorTheme,
    onError,
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
      AutoLinkNode,
    ],
  };

  useImperativeHandle(ref, () => ({
    getHtml: () => handleRef.current?.getHtml() ?? "",
  }));

  const placeholder = scheduleHint
    ? scheduleHint
    : submitMode === "save"
      ? "Редактирование отложенного · Enter — сохранить"
      : "Markdown: **жирный**, *курсив*, `код` · Shift+Enter — строка";

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <EditorRefPlugin editorRef={handleRef} />
      <div
        id="message-editor-root"
        className="flex min-h-[44px] w-full flex-col rounded-xl border border-tg-border bg-tg-input"
      >
        <EditorToolbar
          scheduledCount={scheduledCount}
          onOpenScheduledList={onOpenScheduledList}
          onScheduleNew={onScheduleNew}
        />
        <BlurCapture onBlurDraft={onBlurDraft} />
        <div className="relative min-h-[44px] px-3 py-2 pr-10">
          <InitialHtmlPlugin html={initialHtml} />
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="editor-input min-h-[28px] max-h-32 overflow-y-auto text-[15px] outline-none" />
            }
            placeholder={
              <div className="editor-placeholder pointer-events-none absolute left-3 top-2 right-10 text-[15px] text-tg-muted">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <ListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin transformers={MESSAGE_MARKDOWN_TRANSFORMERS} />
          <MarkdownPastePlugin />
          <SubmitButton
            disabled={disabled}
            mode={submitMode}
            clearAfterSubmit={clearAfterSubmit}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </LexicalComposer>
  );
}

export const MessageEditor = forwardRef(MessageEditorInner);
