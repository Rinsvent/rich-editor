export type SelectionMenuItem =
  | "bold"
  | "italic"
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
  "strikethrough",
  "code",
  "link",
  "spoiler",
];

export const allSelectionMenuItems: SelectionMenuItem[] = [
  "bold",
  "italic",
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
