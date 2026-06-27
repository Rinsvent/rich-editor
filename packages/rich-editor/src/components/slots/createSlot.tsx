"use client";

import {
  Children,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

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
  features: { bold: boolean; italic: boolean; code: boolean; quote: boolean },
  slots: SlotMap,
): boolean {
  return (
    features.bold ||
    features.italic ||
    features.code ||
    features.quote ||
    !!slots.toolbarStart ||
    !!slots.toolbarEnd ||
    !!slots.toolbarMenu
  );
}
