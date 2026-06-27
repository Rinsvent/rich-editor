export type EditorFeatures = {
  bold: boolean;
  italic: boolean;
  code: boolean;
  quote: boolean;
  lists: boolean;
  links: boolean;
  codeBlock: boolean;
  headings: boolean;
  markdownShortcuts: boolean;
  markdownPaste: boolean;
};

export const defaultFeatures: EditorFeatures = {
  bold: true,
  italic: true,
  code: true,
  quote: true,
  lists: true,
  links: true,
  codeBlock: true,
  headings: false,
  markdownShortcuts: true,
  markdownPaste: true,
};

export function resolveFeatures(
  partial?: Partial<EditorFeatures>,
): EditorFeatures {
  return { ...defaultFeatures, ...partial };
}

export type EditorLabels = {
  bold: string;
  italic: string;
  code: string;
  quote: string;
  submit: string;
  menu: string;
};

export const defaultLabels: EditorLabels = {
  bold: "Bold",
  italic: "Italic",
  code: "Code",
  quote: "Quote",
  submit: "Submit",
  menu: "Menu",
};

export function resolveLabels(partial?: Partial<EditorLabels>): EditorLabels {
  return { ...defaultLabels, ...partial };
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
