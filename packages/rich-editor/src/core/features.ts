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
  spoiler: boolean;
  selectionMenu: boolean;
  attachments: boolean;
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
  spoiler: false,
  selectionMenu: false,
  attachments: false,
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

export const defaultLabels: EditorLabels = {
  bold: "Bold",
  italic: "Italic",
  strikethrough: "Strikethrough",
  code: "Inline code",
  codeBlock: "Code block",
  quote: "Quote",
  bulletList: "Bullet list",
  numberedList: "Numbered list",
  link: "Link",
  linkText: "Text",
  linkUrl: "URL",
  linkAdd: "Add link",
  linkEdit: "Edit link",
  linkRemove: "Remove link",
  linkSave: "Save",
  linkCancel: "Cancel",
  linkToolbar: "Link actions",
  heading: "Heading",
  mention: "Mention",
  spoiler: "Spoiler",
  submit: "Submit",
  menu: "Menu",
  editor: "Rich text editor",
  toolbar: "Formatting",
  mentionMenu: "Mention suggestions",
  selectionMenu: "Selection formatting",
  codeLanguage: "Code language",
  attachFile: "Attach file",
  attachments: "Attachments",
  removeAttachment: "Remove attachment",
  insertAttachment: "Insert into message",
  uploading: "Uploading",
  uploadFailed: "Upload failed",
};

export function resolveLabels(partial?: Partial<EditorLabels>): EditorLabels {
  return { ...defaultLabels, ...partial };
}

export type ViewerLabels = {
  /** Accessible name for rendered rich text */
  content: string;
  /** Accessible name for clickable @mentions, `{label}` is replaced */
  mention: string;
  copyCode: string;
  copiedCode: string;
};

export const defaultViewerLabels: ViewerLabels = {
  content: "Rich text content",
  mention: "Mention {label}",
  copyCode: "Copy code",
  copiedCode: "Copied",
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
export const EDITOR_LINE_HEIGHT_PX = 24;
