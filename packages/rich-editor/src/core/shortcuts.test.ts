import { describe, expect, it } from "vitest";
import { defaultFeatures } from "./features";
import {
  getActiveFormatShortcuts,
  getEnterBehaviorDescription,
  shortcutById,
} from "./shortcuts";

describe("shortcuts", () => {
  it("filters format shortcuts by enabled features", () => {
    const shortcuts = getActiveFormatShortcuts({
      ...defaultFeatures,
      strikethrough: false,
    });
    expect(shortcuts.map((item) => item.id)).toEqual([
      "format.bold",
      "format.italic",
      "format.code",
    ]);
  });

  it("returns empty list when keyboard shortcuts disabled", () => {
    expect(
      getActiveFormatShortcuts({
        ...defaultFeatures,
        keyboardShortcuts: false,
      }),
    ).toEqual([]);
  });

  it("describes enter behavior", () => {
    expect(getEnterBehaviorDescription("submit")).toEqual({
      enter: "Submit",
      shiftEnter: "New line",
    });
  });

  it("looks up shortcut by id", () => {
    expect(shortcutById("format.bold")?.keys).toBe("Ctrl+B");
  });
});
