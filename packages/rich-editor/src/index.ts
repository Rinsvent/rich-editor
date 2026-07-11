export {
  RichTextEditor,
  exportEditorHtml,
  type RichTextEditorHandle,
  type RichTextEditorProps,
} from "./components/RichTextEditor";

export {
  RichTextViewer,
  type RichTextViewerProps,
} from "./components/RichTextViewer";

export { useRichTextEditor } from "./context/EditorContext";

export type {
  EditorFeatures,
  EditorLabels,
  EnterBehavior,
  ViewerFeatures,
} from "./core/features";

export type { MentionOption, MentionSearchFn } from "./core/mentions";

export type {
  EditorTheme,
  EditorThemePreset,
  EditorCssVariable,
} from "./core/presets";

export {
  editorThemePresets,
  defaultEditorTheme,
  editorCssVariables,
  isEditorThemePreset,
} from "./core/presets";

export {
  defaultFeatures,
  defaultLabels,
  defaultViewerFeatures,
} from "./core/features";

export {
  sanitizeHtml,
  normalizeHtml,
  isHtmlContent,
  plainTextFromHtml,
  applyLinkTargetToHtml,
} from "./core/html";

export { prepareViewerContent } from "./core/viewerHtml";
export type { PreparedViewerContent } from "./core/viewerHtml";

export {
  buildMarkdownTransformers,
  looksLikeMarkdown,
  markdownToHtml,
} from "./core/markdown";
