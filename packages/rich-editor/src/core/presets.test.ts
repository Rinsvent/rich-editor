import { describe, expect, it } from "vitest";
import {
  editorThemePresets,
  isEditorThemePreset,
} from "./presets";

describe("editor theme presets", () => {
  it("includes expected presets", () => {
    expect(editorThemePresets).toEqual([
      "dark",
      "light",
      "telegram",
      "slack",
      "clickup",
    ]);
  });

  it("validates preset names", () => {
    expect(isEditorThemePreset("slack")).toBe(true);
    expect(isEditorThemePreset("unknown")).toBe(false);
  });
});
