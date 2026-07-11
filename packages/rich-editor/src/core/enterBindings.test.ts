import { describe, expect, it } from "vitest";
import {
  defaultEnterKeyBindings,
  describeEnterKeyBindings,
  enterBehaviorToBindings,
  formatEnterKeyBinding,
  matchEnterKeyAction,
  resolveEnterKeyBindings,
  shouldPluginHandleEnterAction,
} from "./enterBindings";

describe("enterBindings", () => {
  it("defaults to mod+enter submit only", () => {
    expect(resolveEnterKeyBindings({})).toEqual(defaultEnterKeyBindings);
    expect(defaultEnterKeyBindings).toEqual([
      { key: "Enter", mod: true, action: "submit" },
    ]);
  });

  it("maps legacy shift-newline behavior", () => {
    expect(enterBehaviorToBindings("shift-newline")).toEqual([
      { key: "Enter", shift: true, action: "newline" },
      { key: "Enter", action: "submit" },
    ]);
  });

  it("passes plain Enter through to Lexical by default", () => {
    const event = {
      key: "Enter",
      metaKey: false,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
    } as KeyboardEvent;
    expect(matchEnterKeyAction(event, defaultEnterKeyBindings)).toBeNull();
  });

  it("matches mod+enter submit", () => {
    const event = {
      key: "Enter",
      metaKey: true,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
    } as KeyboardEvent;
    expect(matchEnterKeyAction(event, defaultEnterKeyBindings)).toBe("submit");
    expect(
      shouldPluginHandleEnterAction(event, "submit", defaultEnterKeyBindings),
    ).toBe(true);
  });

  it("does not let plugin handle plain Enter newline when submit is not on plain enter", () => {
    const event = {
      key: "Enter",
      metaKey: false,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
    } as KeyboardEvent;
    expect(
      shouldPluginHandleEnterAction(event, "newline", defaultEnterKeyBindings),
    ).toBe(false);
  });

  it("describes bindings", () => {
    expect(describeEnterKeyBindings(defaultEnterKeyBindings)).toMatchObject({
      enter: "New line",
      modEnter: "Ctrl+Enter → Submit",
    });
  });

  it("formats binding labels", () => {
    expect(formatEnterKeyBinding({ key: "Enter", mod: true, action: "submit" }))
      .toBe("Ctrl+Enter");
  });
});
