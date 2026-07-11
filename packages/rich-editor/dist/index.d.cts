import * as react from 'react';
import { ReactNode } from 'react';
import { LexicalEditor } from 'lexical';
import { Transformer } from '@lexical/markdown';

type SlotName = "toolbarStart" | "toolbarEnd" | "toolbarMenu" | "submitButton" | "footer";

type EditorFeatures = {
    bold: boolean;
    italic: boolean;
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
};
declare const defaultFeatures: EditorFeatures;
type EditorLabels = {
    bold: string;
    italic: string;
    strikethrough: string;
    code: string;
    quote: string;
    submit: string;
    menu: string;
};
declare const defaultLabels: EditorLabels;
type EnterBehavior = "submit" | "newline" | "shift-newline";
type ViewerFeatures = {
    codeHighlight: boolean;
    linkTarget: string;
};
declare const defaultViewerFeatures: ViewerFeatures;

type MentionOption = {
    id: string;
    label: string;
};
type MentionSearchFn = (query: string) => MentionOption[] | Promise<MentionOption[]>;

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

type RichTextEditorHandle = {
    getHtml: () => string;
    setHtml: (html: string) => void;
    clear: () => void;
    focus: () => void;
    isEmpty: () => boolean;
};
type RichTextEditorProps = {
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
    theme?: EditorTheme;
    minRows?: number;
    maxRows?: number;
    mentionSearch?: MentionSearchFn;
    children?: ReactNode;
};
declare function exportEditorHtml(editor: LexicalEditor): string;
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
    className?: string;
    theme?: EditorTheme;
    onMentionClick?: (mention: MentionOption) => void;
};
declare function RichTextViewer({ content, features: featuresProp, className, theme, onMentionClick, }: RichTextViewerProps): react.JSX.Element;

type FormatState = {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    code: boolean;
    quote: boolean;
};
type RichTextEditorContextValue = {
    getHtml: () => string;
    setHtml: (html: string) => void;
    clear: () => void;
    focus: () => void;
    submit: () => void;
    isEmpty: boolean;
    formatState: FormatState;
    format: {
        bold: () => void;
        italic: () => void;
        strikethrough: () => void;
        code: () => void;
        quote: () => void;
    };
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

export { type EditorCssVariable, type EditorFeatures, type EditorLabels, type EditorTheme, type EditorThemePreset, type EnterBehavior, type MentionOption, type MentionSearchFn, type PreparedViewerContent, RichTextEditor, type RichTextEditorHandle, type RichTextEditorProps, RichTextViewer, type RichTextViewerProps, type ViewerFeatures, applyLinkTargetToHtml, buildMarkdownTransformers, defaultEditorTheme, defaultFeatures, defaultLabels, defaultViewerFeatures, editorCssVariables, editorThemePresets, exportEditorHtml, isEditorThemePreset, isHtmlContent, looksLikeMarkdown, markdownToHtml, normalizeHtml, plainTextFromHtml, prepareViewerContent, sanitizeHtml, useRichTextEditor };
