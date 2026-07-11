import type { EditorTheme } from "./presets";

export function themeDataAttribute(
  theme: EditorTheme,
): Record<string, string> | undefined {
  if (theme === "none") return undefined;
  return { "data-re-theme": theme };
}
