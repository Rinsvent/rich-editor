export type SelectionMenuItem =
  | "bold"
  | "italic"
  | "underline"
  | "strikethrough"
  | "code"
  | "quote"
  | "codeBlock"
  | "bulletList"
  | "numberedList"
  | "link"
  | "heading"
  | "mention"
  | "spoiler";

export const defaultSelectionMenuItems: SelectionMenuItem[] = [
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "code",
  "link",
  "spoiler",
];

export const allSelectionMenuItems: SelectionMenuItem[] = [
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "code",
  "quote",
  "codeBlock",
  "bulletList",
  "numberedList",
  "link",
  "heading",
  "mention",
  "spoiler",
];
