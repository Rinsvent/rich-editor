import * as react from 'react';
import { ReactNode } from 'react';
import { LexicalEditor } from 'lexical';
import { Transformer } from '@lexical/markdown';

type EditorFeatures = {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    code: boolean;
    quote: boolean;
    lists: boolean;
    links: boolean;
    codeBlock: boolean;
    headings: boolean;
    markdownShortcuts: boolean;
    markdownPaste: boolean;
    keyboardShortcuts: boolean;
    mentions: boolean;
    spoiler: boolean;
    selectionMenu: boolean;
    attachments: boolean;
};
declare const defaultFeatures: EditorFeatures;
type EditorLabels = {
    bold: string;
    italic: string;
    underline: string;
    strikethrough: string;
    code: string;
    codeBlock: string;
    quote: string;
    bulletList: string;
    numberedList: string;
    link: string;
    linkText: string;
    linkUrl: string;
    linkAdd: string;
    linkEdit: string;
    linkRemove: string;
    linkSave: string;
    linkCancel: string;
    linkToolbar: string;
    heading: string;
    mention: string;
    spoiler: string;
    submit: string;
    menu: string;
    editor: string;
    toolbar: string;
    mentionMenu: string;
    selectionMenu: string;
    codeLanguage: string;
    attachFile: string;
    attachments: string;
    removeAttachment: string;
    insertAttachment: string;
    uploading: string;
    uploadFailed: string;
};
declare const defaultLabels: EditorLabels;
type ViewerLabels = {
    /** Accessible name for rendered rich text */
    content: string;
    /** Accessible name for clickable @mentions, `{label}` is replaced */
    mention: string;
    copyCode: string;
    copiedCode: string;
    attachments: string;
};
declare const defaultViewerLabels: ViewerLabels;
type EnterBehavior = "submit" | "newline" | "shift-newline";
type ViewerFeatures = {
    codeHighlight: boolean;
    linkTarget: string;
};
declare const defaultViewerFeatures: ViewerFeatures;

type SlotName = "toolbarStart" | "toolbarEnd" | "toolbarMenu" | "submitButton" | "footer";

type EnterKeyAction = "submit" | "newline";
type EnterKeyBinding = {
    key: "Enter";
    shift?: boolean;
    mod?: boolean;
    alt?: boolean;
    action: EnterKeyAction;
};
/**
 * Default submit binding only. Plain Enter is handled by Lexical (markdown, lists, quotes…).
 */
declare const defaultEnterKeyBindings: EnterKeyBinding[];
declare function enterBehaviorToBindings(behavior: EnterBehavior): EnterKeyBinding[];
declare function resolveEnterKeyBindings(options: {
    enterBehavior?: EnterBehavior;
    enterKeyBindings?: EnterKeyBinding[];
}): EnterKeyBinding[];
declare function matchEnterKeyAction(event: KeyboardEvent, bindings: EnterKeyBinding[]): EnterKeyAction | null;
/** Whether EnterPlugin should handle this action (plain Enter passes through to Lexical). */
declare function shouldPluginHandleEnterAction(event: KeyboardEvent, action: EnterKeyAction, bindings: EnterKeyBinding[]): boolean;
declare function formatEnterKeyBinding(binding: EnterKeyBinding): string;
/** Human-readable description of active enter bindings. */
declare function describeEnterKeyBindings(bindings: EnterKeyBinding[]): {
    enter: string;
    modEnter?: string;
    shiftEnter?: string;
};

type MentionOption = {
    id: string;
    label: string;
};
type MentionSearchFn = (query: string) => MentionOption[] | Promise<MentionOption[]>;

type SelectionMenuItem = "bold" | "italic" | "underline" | "strikethrough" | "code" | "quote" | "codeBlock" | "bulletList" | "numberedList" | "link" | "heading" | "mention" | "spoiler";
declare const defaultSelectionMenuItems: SelectionMenuItem[];
declare const allSelectionMenuItems: SelectionMenuItem[];

/** CSS theme presets applied via `data-re-theme` on editor/viewer root. */
declare const editorThemePresets: readonly ["dark", "light", "telegram", "slack", "clickup"];
type EditorThemePreset = (typeof editorThemePresets)[number];
/** Disable built-in preset; style via your own CSS targeting `.re-editor-root`. */
type EditorTheme = EditorThemePreset | "none";
declare const defaultEditorTheme: EditorThemePreset;
declare function isEditorThemePreset(value: string): value is EditorThemePreset;
/** CSS custom properties consumed by `editor.css`. Override on a parent element. */
declare const editorCssVariables: readonly ["--re-bg", "--re-border", "--re-text", "--re-muted", "--re-accent", "--re-accent-hover", "--re-hover", "--re-code-bg", "--re-pre-bg", "--re-font-size", "--re-line-height"];
type EditorCssVariable = (typeof editorCssVariables)[number];

type UploadedFile = {
    id: string;
    url: string;
    name: string;
    mimeType: string;
    size: number;
    thumbnailUrl?: string;
};
type UploadFileFn = (file: File, options?: {
    signal?: AbortSignal;
    onProgress?: (progress: number) => void;
}) => Promise<UploadedFile>;
type EditorAttachment = {
    localId: string;
    id?: string;
    name: string;
    mimeType: string;
    size: number;
    url?: string;
    thumbnailUrl?: string;
    previewUrl?: string;
    status: "uploading" | "ready" | "error";
    progress?: number;
    error?: string;
};
type RichTextSubmitPayload = {
    html: string;
    attachments: EditorAttachmentPayload[];
};
type EditorAttachmentPayload = {
    id: string;
    name: string;
    mimeType: string;
    size: number;
    url: string;
    thumbnailUrl?: string;
};

type RichTextEditorHandle = {
    getHtml: () => string;
    setHtml: (html: string) => void;
    clear: () => void;
    focus: () => void;
    isEmpty: () => boolean;
    getAttachments: () => EditorAttachment[];
};

type RichTextEditorProps = {
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
declare function exportEditorHtml(editor: LexicalEditor, options?: {
    useTrim?: boolean;
}): string;
declare const RichTextEditor: react.ForwardRefExoticComponent<RichTextEditorProps & react.RefAttributes<RichTextEditorHandle>> & {
    ToolbarStart: react.FC<{
        children?: ReactNode;
    }> & {
        slotName: SlotName;
    };
    ToolbarEnd: react.FC<{
        children?: ReactNode;
    }> & {
        slotName: SlotName;
    };
    ToolbarMenu: react.FC<{
        children?: ReactNode;
    }> & {
        slotName: SlotName;
    };
    SubmitButton: react.FC<{
        children?: ReactNode;
    }> & {
        slotName: SlotName;
    };
    Footer: react.FC<{
        children?: ReactNode;
    }> & {
        slotName: SlotName;
    };
};

type RichTextViewerProps = {
    content: string;
    features?: Partial<ViewerFeatures>;
    labels?: Partial<ViewerLabels>;
    className?: string;
    theme?: EditorTheme;
    onMentionClick?: (mention: MentionOption) => void;
    attachments?: EditorAttachmentPayload[];
    /** Show attachment previews below content. Default: false */
    showAttachments?: boolean;
};
declare function RichTextViewer({ content, features: featuresProp, labels: labelsProp, className, theme, onMentionClick, attachments, showAttachments, }: RichTextViewerProps): react.JSX.Element;

declare function useFormatActions(): {
    bold: () => boolean;
    italic: () => boolean;
    underline: () => boolean;
    strikethrough: () => boolean;
    code: () => boolean;
    quote: () => void;
    codeBlock: () => void;
    bulletList: () => void;
    numberedList: () => void;
    link: () => void;
    heading: () => void;
    mentionTrigger: () => void;
    spoiler: () => void;
};
type FormatActions = ReturnType<typeof useFormatActions>;

type FormatState = {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    code: boolean;
    quote: boolean;
    codeBlock: boolean;
    bulletList: boolean;
    numberedList: boolean;
    link: boolean;
    heading: boolean;
    spoiler: boolean;
};
type RichTextEditorContextValue = {
    getHtml: () => string;
    setHtml: (html: string) => void;
    clear: () => void;
    focus: () => void;
    submit: () => void;
    isEmpty: boolean;
    attachments: EditorAttachment[];
    hasReadyAttachments: boolean;
    formatState: FormatState;
    format: FormatActions;
    disabled: boolean;
    features: EditorFeatures;
    labels: EditorLabels;
};
declare function useRichTextEditor(): RichTextEditorContextValue;

declare function sanitizeHtml(html: string): string;
declare function isHtmlContent(content: string): boolean;
/** Add target/rel to links for SSR-safe viewer output. */
declare function applyLinkTargetToHtml(html: string, target: string): string;
declare function plainTextFromHtml(html: string): string;
/** Normalize Lexical HTML export to our API subset (b/i/s, no nested duplicates). */
declare function normalizeHtml(html: string): string;
/** Remove leading/trailing empty blocks and line breaks from exported editor HTML. */
declare function trimEditorHtml(html: string): string;

type PreparedViewerContent = {
    kind: "plain";
    text: string;
} | {
    kind: "html";
    html: string;
};
/** Sanitize and enrich HTML for RichTextViewer (safe on server and client). */
declare function prepareViewerContent(content: string, features: Pick<ViewerFeatures, "linkTarget">): PreparedViewerContent;

declare function buildMarkdownTransformers(features: EditorFeatures): Transformer[];
declare function looksLikeMarkdown(text: string): boolean;
declare function markdownToHtml(markdown: string): string;

type KeyboardShortcut = {
    /** Stable id, e.g. `format.bold` */
    id: string;
    /** Human-readable combo, e.g. `Ctrl+B` */
    keys: string;
    /** WAI-ARIA `aria-keyshortcuts` value */
    ariaKeyshortcuts: string;
    action: string;
};
type MarkdownShortcut = {
    pattern: string;
    action: string;
};
declare const formatKeyboardShortcuts: KeyboardShortcut[];
declare const mentionKeyboardShortcuts: KeyboardShortcut[];
declare const markdownShortcuts: MarkdownShortcut[];
declare function getActiveFormatShortcuts(features: Pick<EditorFeatures, "bold" | "italic" | "underline" | "code" | "strikethrough" | "keyboardShortcuts">): KeyboardShortcut[];
declare function getEnterBehaviorDescription(behavior?: EnterBehavior): {
    enter: string;
    shiftEnter: string;
    modEnter?: string;
};
declare function shortcutById(id: string): KeyboardShortcut | undefined;

export { type EditorAttachment, type EditorAttachmentPayload, type EditorCssVariable, type EditorFeatures, type EditorLabels, type EditorTheme, type EditorThemePreset, type EnterBehavior, type EnterKeyAction, type EnterKeyBinding, type KeyboardShortcut, type MarkdownShortcut, type MentionOption, type MentionSearchFn, type PreparedViewerContent, RichTextEditor, type RichTextEditorHandle, type RichTextEditorProps, type RichTextSubmitPayload, RichTextViewer, type RichTextViewerProps, type UploadFileFn, type UploadedFile, type ViewerFeatures, type ViewerLabels, allSelectionMenuItems, applyLinkTargetToHtml, buildMarkdownTransformers, defaultEditorTheme, defaultEnterKeyBindings, defaultFeatures, defaultLabels, defaultSelectionMenuItems, defaultViewerFeatures, defaultViewerLabels, describeEnterKeyBindings, editorCssVariables, editorThemePresets, enterBehaviorToBindings, exportEditorHtml, formatEnterKeyBinding, formatKeyboardShortcuts, getActiveFormatShortcuts, getEnterBehaviorDescription, isEditorThemePreset, isHtmlContent, looksLikeMarkdown, markdownShortcuts, markdownToHtml, matchEnterKeyAction, mentionKeyboardShortcuts, normalizeHtml, plainTextFromHtml, prepareViewerContent, resolveEnterKeyBindings, sanitizeHtml, shortcutById, shouldPluginHandleEnterAction, trimEditorHtml, useRichTextEditor };
