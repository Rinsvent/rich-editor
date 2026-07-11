"use client";

import { $generateHtmlFromNodes } from "@lexical/html";
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
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { type LexicalEditor } from "lexical";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  RichTextEditorProvider,
  useRichTextEditor,
  type RichTextEditorContextValue,
} from "../context/EditorContext";
import {
  type EditorFeatures,
  type EditorLabels,
  type EnterBehavior,
  EDITOR_LINE_HEIGHT_PX,
  resolveFeatures,
  resolveLabels,
} from "../core/features";
import type { MentionSearchFn } from "../core/mentions";
import { MentionNode } from "../nodes/MentionNode";
import { normalizeHtml } from "../core/html";
import { buildMarkdownTransformers } from "../core/markdown";
import { editorTheme } from "../core/theme";
import { cn } from "../core/cn";
import {
  BlurCapturePlugin,
  ClearPlugin,
  EmptyStatePlugin,
  EnterPlugin,
  FocusPlugin,
  InitialHtmlPlugin,
  KeyboardShortcutsPlugin,
  MarkdownPastePlugin,
  MentionsPlugin,
  SetHtmlPlugin,
} from "./plugins";
import { EditorToolbar } from "./toolbar/EditorToolbar";
import { useFormatActions, useFormatState } from "./toolbar/useFormatState";
import {
  collectSlots,
  createSlot,
  hasToolbar,
  type SlotMap,
} from "./slots/createSlot";

export type RichTextEditorHandle = {
  getHtml: () => string;
  setHtml: (html: string) => void;
  clear: () => void;
  focus: () => void;
  isEmpty: () => boolean;
};

export type RichTextEditorProps = {
  value?: string;
  onSubmit?: (html: string) => void | Promise<void>;
  onBlur?: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  features?: Partial<EditorFeatures>;
  labels?: Partial<EditorLabels>;
  enterBehavior?: EnterBehavior;
  clearOnSubmit?: boolean;
  className?: string;
  theme?: "light" | "dark";
  minRows?: number;
  maxRows?: number;
  mentionSearch?: MentionSearchFn;
  children?: ReactNode;
};

function onError(error: Error) {
  console.error(error);
}

export function exportEditorHtml(editor: LexicalEditor): string {
  let html = "";
  editor.getEditorState().read(() => {
    html = $generateHtmlFromNodes(editor, null);
  });
  return normalizeHtml(html.trim());
}

function EditorRefPlugin({
  getHtmlRef,
}: {
  getHtmlRef: React.MutableRefObject<(() => string) | null>;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    getHtmlRef.current = () => exportEditorHtml(editor);
    return () => {
      getHtmlRef.current = null;
    };
  }, [editor, getHtmlRef]);

  return null;
}

function DefaultSubmitButton({
  disabled,
  onSubmit,
  label,
}: {
  disabled?: boolean;
  onSubmit: () => void;
  label: string;
}) {
  const { isEmpty } = useRichTextEditor();
  if (isEmpty) return null;

  return (
    <button
      type="button"
      onClick={onSubmit}
      disabled={disabled}
      className="re-submit-btn"
      aria-label={label}
      title={label}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
      </svg>
    </button>
  );
}

function SubmitArea({
  slots,
  disabled,
  sending,
  onSubmit,
  label,
  showDefault,
}: {
  slots: SlotMap;
  disabled?: boolean;
  sending: boolean;
  onSubmit: () => void;
  label: string;
  showDefault: boolean;
}) {
  if (slots.submitButton !== undefined) {
    return <>{slots.submitButton}</>;
  }
  if (!showDefault) return null;
  return (
    <DefaultSubmitButton
      disabled={disabled || sending}
      onSubmit={onSubmit}
      label={label}
    />
  );
}

function ContextBridge({
  disabled,
  features,
  labels,
  isEmpty,
  getHtmlRef,
  focusRef,
  setHtmlRef,
  clearRef,
  onSubmit,
  children,
}: {
  disabled: boolean;
  features: EditorFeatures;
  labels: EditorLabels;
  isEmpty: boolean;
  getHtmlRef: React.MutableRefObject<(() => string) | null>;
  focusRef: React.MutableRefObject<(() => void) | null>;
  setHtmlRef: React.MutableRefObject<((html: string) => void) | null>;
  clearRef: React.MutableRefObject<(() => void) | null>;
  onSubmit: () => void;
  children: ReactNode;
}) {
  const formatState = useFormatState();
  const format = useFormatActions();

  const ctx: RichTextEditorContextValue = useMemo(
    () => ({
      getHtml: () => getHtmlRef.current?.() ?? "",
      setHtml: (html) => setHtmlRef.current?.(html),
      clear: () => clearRef.current?.(),
      focus: () => focusRef.current?.(),
      submit: onSubmit,
      isEmpty,
      formatState,
      format,
      disabled,
      features,
      labels,
    }),
    [
      clearRef,
      disabled,
      features,
      focusRef,
      format,
      formatState,
      getHtmlRef,
      isEmpty,
      labels,
      setHtmlRef,
      onSubmit,
    ],
  );

  return (
    <RichTextEditorProvider value={ctx}>{children}</RichTextEditorProvider>
  );
}

function RichTextEditorInner(
  {
    value,
    onSubmit,
    onBlur,
    placeholder = "",
    disabled = false,
    features: featuresProp,
    labels: labelsProp,
    enterBehavior = "shift-newline",
    clearOnSubmit = false,
    className,
    theme = "dark",
    minRows = 1,
    maxRows = 8,
    mentionSearch,
    children,
  }: RichTextEditorProps,
  ref: React.Ref<RichTextEditorHandle>,
) {
  const features = useMemo(() => resolveFeatures(featuresProp), [featuresProp]);
  const labels = useMemo(() => resolveLabels(labelsProp), [labelsProp]);
  const slots = useMemo(() => collectSlots(children), [children]);
  const rootId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const getHtmlRef = useRef<(() => string) | null>(null);
  const setHtmlRef = useRef<((html: string) => void) | null>(null);
  const clearRef = useRef<(() => void) | null>(null);
  const focusRef = useRef<(() => void) | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [sending, setSending] = useState(false);

  const inputStyle = useMemo(
    () => ({
      minHeight: `${minRows * EDITOR_LINE_HEIGHT_PX}px`,
      maxHeight: `${maxRows * EDITOR_LINE_HEIGHT_PX}px`,
    }),
    [minRows, maxRows],
  );

  const initialConfig = useMemo(
    () => ({
      namespace: "RichTextEditor",
      theme: editorTheme,
      editable: !disabled,
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
        ...(features.mentions ? [MentionNode] : []),
      ],
    }),
    [disabled, features.mentions],
  );

  const transformers = useMemo(
    () =>
      features.markdownShortcuts ? buildMarkdownTransformers(features) : [],
    [features],
  );

  const getHtml = useCallback(() => getHtmlRef.current?.() ?? "", []);

  const submit = useCallback(async () => {
    if (disabled || sending || isEmpty || !onSubmit) return;
    const html = getHtml();
    if (!html) return;
    setSending(true);
    try {
      await onSubmit(html);
      if (clearOnSubmit) {
        clearRef.current?.();
      }
    } finally {
      setSending(false);
    }
  }, [clearOnSubmit, disabled, getHtml, isEmpty, onSubmit, sending]);

  useImperativeHandle(
    ref,
    () => ({
      getHtml,
      setHtml: (html) => setHtmlRef.current?.(html),
      clear: () => clearRef.current?.(),
      focus: () => focusRef.current?.(),
      isEmpty: () => isEmpty,
    }),
    [getHtml, isEmpty],
  );

  const showToolbar = hasToolbar(features, slots);
  const showDefaultSubmit = !!onSubmit && slots.submitButton === undefined;

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <EditorRefPlugin getHtmlRef={getHtmlRef} />
      <SetHtmlPlugin setHtmlRef={setHtmlRef} />
      <ClearPlugin clearRef={clearRef} />
      <FocusPlugin focusRef={focusRef} />
      <EmptyStatePlugin onEmptyChange={setIsEmpty} />
      <ContextBridge
        disabled={disabled}
        features={features}
        labels={labels}
        isEmpty={isEmpty}
        getHtmlRef={getHtmlRef}
        focusRef={focusRef}
        setHtmlRef={setHtmlRef}
        clearRef={clearRef}
        onSubmit={() => void submit()}
      >
        <div
          ref={rootRef}
          id={rootId}
          data-re-theme={theme}
          className={cn("re-editor-root", className)}
        >
          {showToolbar && (
            <EditorToolbar features={features} labels={labels} slots={slots} />
          )}
          <BlurCapturePlugin
            rootRef={rootRef}
            onBlur={onBlur}
            getHtml={getHtml}
          />
          <div className="re-editor-body">
            <InitialHtmlPlugin html={value} />
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="re-editor-input"
                  style={inputStyle}
                />
              }
              placeholder={
                placeholder ? (
                  <div className="re-editor-placeholder">{placeholder}</div>
                ) : null
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            {features.lists && <ListPlugin />}
            {features.links && <LinkPlugin />}
            {transformers.length > 0 && (
              <MarkdownShortcutPlugin transformers={transformers} />
            )}
            <MarkdownPastePlugin features={features} />
            <KeyboardShortcutsPlugin features={features} disabled={disabled} />
            {features.mentions && mentionSearch && (
              <MentionsPlugin searchMentions={mentionSearch} />
            )}
            {onSubmit && (
              <EnterPlugin
                behavior={enterBehavior}
                onSubmit={() => void submit()}
              />
            )}
            <SubmitArea
              slots={slots}
              disabled={disabled}
              sending={sending}
              onSubmit={() => void submit()}
              label={labels.submit}
              showDefault={showDefaultSubmit}
            />
          </div>
          {slots.footer && <div className="re-footer">{slots.footer}</div>}
        </div>
      </ContextBridge>
    </LexicalComposer>
  );
}

const RichTextEditorBase = forwardRef(RichTextEditorInner);

const ToolbarStart = createSlot("toolbarStart");
const ToolbarEnd = createSlot("toolbarEnd");
const ToolbarMenu = createSlot("toolbarMenu");
const SubmitButton = createSlot("submitButton");
const Footer = createSlot("footer");

export const RichTextEditor = Object.assign(RichTextEditorBase, {
  ToolbarStart,
  ToolbarEnd,
  ToolbarMenu,
  SubmitButton,
  Footer,
});
