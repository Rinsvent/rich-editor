/** CSS theme presets applied via `data-re-theme` on editor/viewer root. */
export const editorThemePresets = [
  "dark",
  "light",
  "telegram",
  "slack",
  "clickup",
] as const;

export type EditorThemePreset = (typeof editorThemePresets)[number];

/** Disable built-in preset; style via your own CSS targeting `.re-editor-root`. */
export type EditorTheme = EditorThemePreset | "none";

export const defaultEditorTheme: EditorThemePreset = "dark";

export function isEditorThemePreset(value: string): value is EditorThemePreset {
  return (editorThemePresets as readonly string[]).includes(value);
}

/** CSS custom properties consumed by `editor.css`. Override on a parent element. */
export const editorCssVariables = [
  "--re-bg",
  "--re-border",
  "--re-text",
  "--re-muted",
  "--re-accent",
  "--re-accent-hover",
  "--re-hover",
  "--re-code-bg",
  "--re-pre-bg",
  "--re-font-size",
  "--re-line-height",
] as const;

export type EditorCssVariable = (typeof editorCssVariables)[number];
