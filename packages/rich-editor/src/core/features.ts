export type EditorFeatures = {
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

export const defaultFeatures: EditorFeatures = {
  bold: true,
  italic: true,
  strikethrough: false,
  code: true,
  quote: true,
  lists: true,
  links: true,
  codeBlock: true,
  headings: false,
  markdownShortcuts: true,
  markdownPaste: true,
  keyboardShortcuts: true,
  mentions: false,
};

export function resolveFeatures(
  partial?: Partial<EditorFeatures>,
): EditorFeatures {
  return { ...defaultFeatures, ...partial };
}

export type EditorLabels = {
  bold: string;
  italic: string;
  strikethrough: string;
  code: string;
  quote: string;
  submit: string;
  menu: string;
  /** Accessible name for the editable area */
  editor: string;
  /** Accessible name for the formatting toolbar */
  toolbar: string;
  /** Accessible name for the @mention typeahead menu */
  mentionMenu: string;
};

export const defaultLabels: EditorLabels = {
  bold: "Bold",
  italic: "Italic",
  strikethrough: "Strikethrough",
  code: "Code",
  quote: "Quote",
  submit: "Submit",
  menu: "Menu",
  editor: "Rich text editor",
  toolbar: "Formatting",
  mentionMenu: "Mention suggestions",
};

export function resolveLabels(partial?: Partial<EditorLabels>): EditorLabels {
  return { ...defaultLabels, ...partial };
}

export type ViewerLabels = {
  /** Accessible name for rendered rich text */
  content: string;
  /** Accessible name for clickable @mentions, `{label}` is replaced */
  mention: string;
};

export const defaultViewerLabels: ViewerLabels = {
  content: "Rich text content",
  mention: "Mention {label}",
};

export function resolveViewerLabels(
  partial?: Partial<ViewerLabels>,
): ViewerLabels {
  return { ...defaultViewerLabels, ...partial };
}

export type EnterBehavior = "submit" | "newline" | "shift-newline";

export type ViewerFeatures = {
  codeHighlight: boolean;
  linkTarget: string;
};

export const defaultViewerFeatures: ViewerFeatures = {
  codeHighlight: true,
  linkTarget: "_blank",
};

export function resolveViewerFeatures(
  partial?: Partial<ViewerFeatures>,
): ViewerFeatures {
  return { ...defaultViewerFeatures, ...partial };
}

/** Approximate line height in px for minRows/maxRows sizing. */
export const EDITOR_LINE_HEIGHT_PX = 28;
