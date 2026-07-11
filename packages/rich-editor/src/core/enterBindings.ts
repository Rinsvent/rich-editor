import type { EnterBehavior } from "./features";

export type EnterKeyAction = "submit" | "newline";

export type EnterKeyBinding = {
  key: "Enter";
  shift?: boolean;
  mod?: boolean;
  alt?: boolean;
  action: EnterKeyAction;
};

/**
 * Default submit binding only. Plain Enter is handled by Lexical (markdown, lists, quotes…).
 */
export const defaultEnterKeyBindings: EnterKeyBinding[] = [
  { key: "Enter", mod: true, action: "submit" },
];

export function enterBehaviorToBindings(
  behavior: EnterBehavior,
): EnterKeyBinding[] {
  switch (behavior) {
    case "submit":
      return [
        { key: "Enter", shift: true, action: "newline" },
        { key: "Enter", action: "submit" },
      ];
    case "newline":
      return [{ key: "Enter", action: "newline" }];
    case "shift-newline":
      return [
        { key: "Enter", shift: true, action: "newline" },
        { key: "Enter", action: "submit" },
      ];
    default:
      return defaultEnterKeyBindings;
  }
}

export function resolveEnterKeyBindings(options: {
  enterBehavior?: EnterBehavior;
  enterKeyBindings?: EnterKeyBinding[];
}): EnterKeyBinding[] {
  if (options.enterKeyBindings?.length) {
    return options.enterKeyBindings;
  }
  if (options.enterBehavior) {
    return enterBehaviorToBindings(options.enterBehavior);
  }
  return defaultEnterKeyBindings;
}

export function matchesEnterKeyBinding(
  event: KeyboardEvent,
  binding: EnterKeyBinding,
): boolean {
  if (event.key !== binding.key) return false;
  const mod = event.metaKey || event.ctrlKey;
  if (!!binding.mod !== mod) return false;
  if (!!binding.shift !== event.shiftKey) return false;
  if (!!binding.alt !== event.altKey) return false;
  return true;
}

export function matchEnterKeyAction(
  event: KeyboardEvent,
  bindings: EnterKeyBinding[],
): EnterKeyAction | null {
  for (const binding of bindings) {
    if (matchesEnterKeyBinding(event, binding)) {
      return binding.action;
    }
  }
  return null;
}

/** Whether EnterPlugin should handle this action (plain Enter passes through to Lexical). */
export function shouldPluginHandleEnterAction(
  event: KeyboardEvent,
  action: EnterKeyAction,
  bindings: EnterKeyBinding[],
): boolean {
  if (action === "submit") return true;

  const isPlainEnter =
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey;

  if (action === "newline" && isPlainEnter) {
    const submitOnPlainEnter = bindings.some(
      (b) => b.action === "submit" && !b.mod && !b.shift && !b.alt,
    );
    return submitOnPlainEnter;
  }

  return true;
}

export function formatEnterKeyBinding(binding: EnterKeyBinding): string {
  const parts: string[] = [];
  if (binding.mod) parts.push("Ctrl");
  if (binding.shift) parts.push("Shift");
  if (binding.alt) parts.push("Alt");
  parts.push(binding.key);
  return parts.join("+");
}

/** Human-readable description of active enter bindings. */
export function describeEnterKeyBindings(
  bindings: EnterKeyBinding[],
): { enter: string; modEnter?: string; shiftEnter?: string } {
  const submit = bindings.find((b) => b.action === "submit");
  const newline = bindings.find((b) => b.action === "newline");

  const enterLabel = (() => {
    if (submit && !submit.mod && !submit.shift) return "Submit";
    if (newline && !newline.mod && !newline.shift) return "New line";
    return "New line";
  })();

  const modSubmit = bindings.find((b) => b.action === "submit" && b.mod);
  const shiftNewline = bindings.find((b) => b.action === "newline" && b.shift);

  return {
    enter: enterLabel,
    modEnter: modSubmit ? formatEnterKeyBinding(modSubmit) + " → Submit" : undefined,
    shiftEnter: shiftNewline
      ? formatEnterKeyBinding(shiftNewline) + " → New line"
      : undefined,
  };
}
