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
    theme?: "light" | "dark";
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
    theme?: "light" | "dark";
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
declare function plainTextFromHtml(html: string): string;
/** Normalize Lexical HTML export to our API subset (b/i/s, no nested duplicates). */
declare function normalizeHtml(html: string): string;

declare function buildMarkdownTransformers(features: EditorFeatures): Transformer[];
declare function looksLikeMarkdown(text: string): boolean;
declare function markdownToHtml(markdown: string): string;

export { type EditorFeatures, type EditorLabels, type EnterBehavior, type MentionOption, type MentionSearchFn, RichTextEditor, type RichTextEditorHandle, type RichTextEditorProps, RichTextViewer, type RichTextViewerProps, type ViewerFeatures, buildMarkdownTransformers, defaultFeatures, defaultLabels, defaultViewerFeatures, exportEditorHtml, isHtmlContent, looksLikeMarkdown, markdownToHtml, normalizeHtml, plainTextFromHtml, sanitizeHtml, useRichTextEditor };
