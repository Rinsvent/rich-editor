import type { EditorFeatures, EnterBehavior } from "./features";

export type KeyboardShortcut = {
  /** Stable id, e.g. `format.bold` */
  id: string;
  /** Human-readable combo, e.g. `Ctrl+B` */
  keys: string;
  /** WAI-ARIA `aria-keyshortcuts` value */
  ariaKeyshortcuts: string;
  action: string;
};

export type MarkdownShortcut = {
  pattern: string;
  action: string;
};

export const formatKeyboardShortcuts: KeyboardShortcut[] = [
  {
    id: "format.bold",
    keys: "Ctrl+B",
    ariaKeyshortcuts: "Control+b",
    action: "Bold",
  },
  {
    id: "format.italic",
    keys: "Ctrl+I",
    ariaKeyshortcuts: "Control+i",
    action: "Italic",
  },
  {
    id: "format.code",
    keys: "Ctrl+E",
    ariaKeyshortcuts: "Control+e",
    action: "Inline code",
  },
  {
    id: "format.strikethrough",
    keys: "Ctrl+Shift+X",
    ariaKeyshortcuts: "Control+Shift+x",
    action: "Strikethrough",
  },
];

export const mentionKeyboardShortcuts: KeyboardShortcut[] = [
  {
    id: "mention.open",
    keys: "@",
    ariaKeyshortcuts: "@",
    action: "Open mention menu",
  },
  {
    id: "mention.navigate",
    keys: "↑ / ↓",
    ariaKeyshortcuts: "ArrowUp ArrowDown",
    action: "Navigate mention options",
  },
  {
    id: "mention.select",
    keys: "Enter",
    ariaKeyshortcuts: "Enter",
    action: "Select mention",
  },
  {
    id: "mention.dismiss",
    keys: "Esc",
    ariaKeyshortcuts: "Escape",
    action: "Close mention menu",
  },
];

export const markdownShortcuts: MarkdownShortcut[] = [
  { pattern: "**text** or __text__", action: "Bold" },
  { pattern: "*text* or _text_", action: "Italic" },
  { pattern: "~~text~~", action: "Strikethrough" },
  { pattern: "`code`", action: "Inline code" },
  { pattern: "> quote", action: "Block quote" },
  { pattern: "- item", action: "Unordered list" },
  { pattern: "1. item", action: "Ordered list" },
  { pattern: "```lang", action: "Code block" },
  { pattern: "[text](url)", action: "Link" },
  { pattern: "# Heading", action: "Heading (when enabled)" },
  { pattern: "||spoiler||", action: "Spoiler (when enabled)" },
];

const defaultEnterShortcuts = {
  enter: "New line",
  modEnter: "Submit",
};

const legacyEnterBehaviorShortcuts: Record<
  EnterBehavior,
  { enter: string; shiftEnter: string }
> = {
  submit: {
    enter: "Submit",
    shiftEnter: "New line",
  },
  newline: {
    enter: "New line",
    shiftEnter: "New line",
  },
  "shift-newline": {
    enter: "New line",
    shiftEnter: "New line",
  },
};

export function getActiveFormatShortcuts(
  features: Pick<
    EditorFeatures,
    "bold" | "italic" | "code" | "strikethrough" | "keyboardShortcuts"
  >,
): KeyboardShortcut[] {
  if (!features.keyboardShortcuts) return [];

  return formatKeyboardShortcuts.filter((shortcut) => {
    switch (shortcut.id) {
      case "format.bold":
        return features.bold;
      case "format.italic":
        return features.italic;
      case "format.code":
        return features.code;
      case "format.strikethrough":
        return features.strikethrough;
      default:
        return true;
    }
  });
}

export function getEnterBehaviorDescription(behavior?: EnterBehavior): {
  enter: string;
  shiftEnter: string;
  modEnter?: string;
} {
  if (!behavior) {
    return {
      enter: defaultEnterShortcuts.enter,
      shiftEnter: defaultEnterShortcuts.enter,
      modEnter: defaultEnterShortcuts.modEnter,
    };
  }
  return legacyEnterBehaviorShortcuts[behavior];
}

export function shortcutById(id: string): KeyboardShortcut | undefined {
  return [...formatKeyboardShortcuts, ...mentionKeyboardShortcuts].find(
    (item) => item.id === id,
  );
}
