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
import type { EnterKeyBinding } from "../core/enterBindings";
import { resolveEnterKeyBindings } from "../core/enterBindings";
import type { MentionSearchFn } from "../core/mentions";
import type { SelectionMenuItem } from "../core/selectionMenu";
import { defaultSelectionMenuItems } from "../core/selectionMenu";
import {
  defaultEditorTheme,
  type EditorTheme,
} from "../core/presets";
import { themeDataAttribute } from "../core/themePresets";
import { MentionNode } from "../nodes/MentionNode";
import { SpoilerNode } from "../nodes/SpoilerNode";
import { ImageNode } from "../nodes/ImageNode";
import { FileLinkNode } from "../nodes/FileLinkNode";
import {
  getReadyAttachmentPayloads,
  type RichTextSubmitPayload,
  type UploadFileFn,
  type EditorAttachment,
} from "../core/attachments";
import { normalizeHtml, trimEditorHtml } from "../core/html";
import { minimizeStorageHtml } from "../core/storageHtml";
import { buildMarkdownTransformers } from "../core/markdown";
import { editorTheme } from "../core/theme";
import { cn } from "../core/cn";
import {
  BlurCapturePlugin,
  BlockBehaviorPlugin,
  ClearPlugin,
  CodeHighlightPlugin,
  CodeLanguagePlugin,
  EmptyStatePlugin,
  EnterPlugin,
  FocusPlugin,
  InitialHtmlPlugin,
  KeyboardShortcutsPlugin,
  LineBreakPlugin,
  LinkUiPlugin,
  MarkdownPastePlugin,
  MentionsPlugin,
  SelectionMenuPlugin,
  SetHtmlPlugin,
  SpoilerPlugin,
  AttachmentsPlugin,
} from "./plugins";
import { AttachmentsBridge } from "./attachments/AttachmentsBridge";
import { useAttachmentUploads } from "./attachments/AttachmentStrip";
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
  getAttachments: () => EditorAttachment[];
};

export type { RichTextSubmitPayload, UploadFileFn, EditorAttachment };

export type RichTextEditorProps = {
  value?: string;
  onSubmit?: (payload: RichTextSubmitPayload) => void | Promise<void>;
  onBlur?: (html: string) => void;
  placeholder?: string;
  disabled?: boolean;
  features?: Partial<EditorFeatures>;
  labels?: Partial<EditorLabels>;
  enterBehavior?: EnterBehavior;
  /** Custom Enter/Ctrl+Enter bindings. Default: Enter → newline, Ctrl/Cmd+Enter → submit */
  enterKeyBindings?: EnterKeyBinding[];
  selectionMenuItems?: SelectionMenuItem[];
  clearOnSubmit?: boolean;
  /** Limit code block language options. All highlight.js languages when omitted. */
  codeLanguages?: string[];
  /** Trim empty blocks and edge line breaks from exported HTML. */
  useTrim?: boolean;
  className?: string;
  theme?: EditorTheme;
  minRows?: number;
  maxRows?: number;
  mentionSearch?: MentionSearchFn;
  /** Upload handler for attachments (S3-compatible API on your backend). */
  onUploadFile?: UploadFileFn;
  /** Optional accept filter for file picker, e.g. "image/*,.pdf". */
  acceptFiles?: string;
  children?: ReactNode;
};

function onError(error: Error) {
  console.error(error);
}

export function exportEditorHtml(
  editor: LexicalEditor,
  options?: { useTrim?: boolean },
): string {
  let html = "";
  editor.getEditorState().read(() => {
    html = $generateHtmlFromNodes(editor, null);
  });
  html = normalizeHtml(html.trim());
  if (options?.useTrim) {
    html = trimEditorHtml(html);
  }
  return minimizeStorageHtml(html);
}

function EditorRefPlugin({
  getHtmlRef,
  useTrim,
}: {
  getHtmlRef: React.MutableRefObject<(() => string) | null>;
  useTrim?: boolean;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    getHtmlRef.current = () => exportEditorHtml(editor, { useTrim });
    return () => {
      getHtmlRef.current = null;
    };
  }, [editor, getHtmlRef, useTrim]);

  return null;
}

function DefaultSubmitButton({
  disabled,
  onSubmit,
  label,
  show,
}: {
  disabled?: boolean;
  onSubmit: () => void;
  label: string;
  show: boolean;
}) {
  if (!show) return null;

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
  showSubmit,
}: {
  slots: SlotMap;
  disabled?: boolean;
  sending: boolean;
  onSubmit: () => void;
  label: string;
  showDefault: boolean;
  showSubmit: boolean;
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
      show={showSubmit}
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
  attachments,
  hasReadyAttachments,
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
  attachments: EditorAttachment[];
  hasReadyAttachments: boolean;
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
      attachments,
      hasReadyAttachments,
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
      hasReadyAttachments,
      isEmpty,
      labels,
      attachments,
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
    enterBehavior,
    enterKeyBindings,
    selectionMenuItems = defaultSelectionMenuItems,
    clearOnSubmit = false,
    codeLanguages,
    useTrim = false,
    className,
    theme = defaultEditorTheme,
    minRows = 1,
    maxRows = 8,
    mentionSearch,
    onUploadFile,
    acceptFiles,
    children,
  }: RichTextEditorProps,
  ref: React.Ref<RichTextEditorHandle>,
) {
  const features = useMemo(() => resolveFeatures(featuresProp), [featuresProp]);
  const labels = useMemo(() => resolveLabels(labelsProp), [labelsProp]);
  const slots = useMemo(() => collectSlots(children), [children]);
  const rootId = useId();
  const editorInputId = `${rootId}-input`;
  const placeholderId = `${rootId}-placeholder`;
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const getHtmlRef = useRef<(() => string) | null>(null);
  const setHtmlRef = useRef<((html: string) => void) | null>(null);
  const clearRef = useRef<(() => void) | null>(null);
  const resetFormatsRef = useRef<(() => void) | null>(null);
  const focusRef = useRef<(() => void) | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [sending, setSending] = useState(false);
  const attachmentsEnabled = features.attachments && !!onUploadFile;
  const uploads = useAttachmentUploads({
    onUploadFile:
      onUploadFile ??
      (async () => {
        throw new Error("onUploadFile is required when attachments feature is enabled");
      }),
    disabled: disabled || !attachmentsEnabled,
  });

  const inputStyle = useMemo(
    () => ({
      minHeight: `${minRows * EDITOR_LINE_HEIGHT_PX}px`,
      maxHeight: `${maxRows * EDITOR_LINE_HEIGHT_PX}px`,
    }),
    [minRows, maxRows],
  );

  const enterBindings = useMemo(
    () => resolveEnterKeyBindings({ enterBehavior, enterKeyBindings }),
    [enterBehavior, enterKeyBindings],
  );

  const initialConfig = useMemo(
    () => ({
      namespace: "RichTextEditor",
      theme: editorTheme,
      editable: !disabled,
      onError,
      nodes: [
        HeadingNode,
        ...(features.quote ? [QuoteNode] : []),
        ListNode,
        ListItemNode,
        CodeNode,
        CodeHighlightNode,
        LinkNode,
        AutoLinkNode,
        ...(features.mentions ? [MentionNode] : []),
        ...(features.spoiler ? [SpoilerNode] : []),
        ...(attachmentsEnabled ? [ImageNode, FileLinkNode] : []),
      ],
    }),
    [attachmentsEnabled, disabled, features.mentions, features.quote, features.spoiler],
  );

  const transformers = useMemo(
    () =>
      features.markdownShortcuts ? buildMarkdownTransformers(features) : [],
    [features],
  );

  const getHtml = useCallback(() => getHtmlRef.current?.() ?? "", []);

  const submit = useCallback(async () => {
    if (disabled || sending || !onSubmit) return;
    const html = getHtml();
    const attachmentPayloads = getReadyAttachmentPayloads(uploads.attachments);
    if (!html && attachmentPayloads.length === 0) return;
    if (uploads.hasUploadingAttachments) return;
    setSending(true);
    try {
      await onSubmit({ html, attachments: attachmentPayloads });
      if (clearOnSubmit) {
        clearRef.current?.();
        uploads.clearAttachments();
      } else {
        resetFormatsRef.current?.();
      }
    } finally {
      setSending(false);
    }
  }, [
    clearOnSubmit,
    disabled,
    getHtml,
    onSubmit,
    sending,
    uploads,
  ]);

  const canSubmit = !isEmpty || uploads.hasReadyAttachments;

  useImperativeHandle(
    ref,
    () => ({
      getHtml,
      setHtml: (html) => setHtmlRef.current?.(html),
      clear: () => {
        clearRef.current?.();
        uploads.clearAttachments();
      },
      focus: () => focusRef.current?.(),
      isEmpty: () => isEmpty,
      getAttachments: () => uploads.attachments,
    }),
    [getHtml, isEmpty, uploads],
  );

  const showToolbar = hasToolbar(features, slots);
  const showDefaultSubmit = !!onSubmit && slots.submitButton === undefined;
  const bodyHasSubmitPadding =
    slots.submitButton !== undefined || (showDefaultSubmit && canSubmit);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <EditorRefPlugin getHtmlRef={getHtmlRef} useTrim={useTrim} />
      <SetHtmlPlugin setHtmlRef={setHtmlRef} />
      <ClearPlugin clearRef={clearRef} resetFormatsRef={resetFormatsRef} />
      <FocusPlugin focusRef={focusRef} />
      <EmptyStatePlugin onEmptyChange={setIsEmpty} />
      <LinkUiPlugin labels={labels} containerRef={bodyRef} enabled={features.links}>
      <ContextBridge
        disabled={disabled}
        features={features}
        labels={labels}
        isEmpty={isEmpty}
        getHtmlRef={getHtmlRef}
        focusRef={focusRef}
        setHtmlRef={setHtmlRef}
        clearRef={clearRef}
        attachments={uploads.attachments}
        hasReadyAttachments={uploads.hasReadyAttachments}
        onSubmit={() => void submit()}
      >
        <div
          ref={rootRef}
          id={rootId}
          {...themeDataAttribute(theme)}
          className={cn("re-editor-root", className)}
        >
          {showToolbar && (
            <EditorToolbar
              features={features}
              labels={labels}
              slots={slots}
              editorInputId={editorInputId}
              showMentionButton={features.mentions && !!mentionSearch}
              showAttachButton={attachmentsEnabled}
              onAttachFiles={uploads.addFiles}
              acceptFiles={acceptFiles}
            />
          )}
          <BlurCapturePlugin
            rootRef={rootRef}
            onBlur={onBlur}
            getHtml={getHtml}
          />
          <div
            ref={bodyRef}
            className={cn(
              "re-editor-body",
              bodyHasSubmitPadding && "re-editor-body-has-submit",
            )}
          >
            <BlockBehaviorPlugin />
            <LineBreakPlugin />
            {features.spoiler && <SpoilerPlugin />}
            <InitialHtmlPlugin html={value} />
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  id={editorInputId}
                  className="re-editor-input"
                  style={inputStyle}
                  role="textbox"
                  aria-label={labels.editor}
                  aria-multiline
                  aria-disabled={disabled}
                  aria-describedby={placeholder ? placeholderId : undefined}
                />
              }
              placeholder={
                placeholder ? (
                  <div id={placeholderId} className="re-editor-placeholder" aria-hidden="true">
                    {placeholder}
                  </div>
                ) : null
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            {features.lists && <ListPlugin />}
            {features.links && <LinkPlugin />}
            {features.codeBlock && (
              <>
                <CodeHighlightPlugin enabled={!disabled} />
                <CodeLanguagePlugin
                  labels={labels}
                  containerRef={bodyRef}
                  codeLanguages={codeLanguages}
                />
              </>
            )}
            {transformers.length > 0 && (
              <MarkdownShortcutPlugin transformers={transformers} />
            )}
            <MarkdownPastePlugin features={features} />
            <KeyboardShortcutsPlugin features={features} disabled={disabled} />
            {features.mentions && mentionSearch && (
              <MentionsPlugin searchMentions={mentionSearch} />
            )}
            {attachmentsEnabled && (
              <AttachmentsPlugin
                disabled={disabled}
                attachments={uploads.attachments}
                addFiles={uploads.addFiles}
                containerRef={bodyRef}
              />
            )}
            <EnterPlugin
              bindings={enterBindings}
              onSubmit={onSubmit ? () => void submit() : undefined}
            />
            {features.selectionMenu && (
              <SelectionMenuPlugin
                features={features}
                labels={labels}
                items={selectionMenuItems}
                containerRef={bodyRef}
              />
            )}
            {attachmentsEnabled && (
              <AttachmentsBridge
                attachments={uploads.attachments}
                labels={labels}
                disabled={disabled}
                onRemove={uploads.removeAttachment}
              />
            )}
            <SubmitArea
              slots={slots}
              disabled={disabled}
              sending={sending}
              onSubmit={() => void submit()}
              label={labels.submit}
              showDefault={showDefaultSubmit}
              showSubmit={canSubmit}
            />
          </div>
          {slots.footer && <div className="re-footer">{slots.footer}</div>}
        </div>
      </ContextBridge>
      </LinkUiPlugin>
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
