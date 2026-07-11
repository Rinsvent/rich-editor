"use client";

import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import type { EditorFeatures } from "../../core/features";

export type SlotName =
  | "toolbarStart"
  | "toolbarEnd"
  | "toolbarMenu"
  | "submitButton"
  | "footer";

export type SlotMap = Partial<Record<SlotName, ReactNode>>;

type SlotComponent = React.FC<{ children?: ReactNode }> & {
  slotName: SlotName;
};

export function createSlot(name: SlotName): SlotComponent {
  const Slot = ({ children }: { children?: ReactNode }) => null;
  Slot.slotName = name;
  Slot.displayName = `RichTextEditor.${name}`;
  return Slot;
}

function isSlotComponent(
  child: ReactNode,
): child is ReactElement<{ children?: ReactNode }> {
  return (
    isValidElement(child) &&
    typeof child.type === "function" &&
    "slotName" in child.type &&
    typeof (child.type as SlotComponent).slotName === "string"
  );
}

export function collectSlots(children: ReactNode): SlotMap {
  const slots: SlotMap = {};

  Children.forEach(children, (child) => {
    if (!isSlotComponent(child)) return;
    const name = (child.type as SlotComponent).slotName;
    slots[name] = child.props.children;
  });

  return slots;
}

export function hasToolbar(
  features: EditorFeatures,
  slots: SlotMap,
): boolean {
  return (
    features.bold ||
    features.italic ||
    features.strikethrough ||
    features.code ||
    features.quote ||
    features.codeBlock ||
    features.lists ||
    features.links ||
    features.headings ||
    features.spoiler ||
    features.mentions ||
    !!slots.toolbarStart ||
    !!slots.toolbarEnd ||
    !!slots.toolbarMenu
  );
}
