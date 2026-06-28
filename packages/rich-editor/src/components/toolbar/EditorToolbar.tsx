"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import type { EditorFeatures, EditorLabels } from "../../core/features";
import type { SlotMap } from "../slots/createSlot";
import { useFormatActions, useFormatState } from "./useFormatState";

function ToolbarButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      onClick={onClick}
      className="re-toolbar-btn"
    >
      {children}
    </button>
  );
}

export function EditorToolbar({
  features,
  labels,
  slots,
}: {
  features: EditorFeatures;
  labels: EditorLabels;
  slots: SlotMap;
}) {
  const active = useFormatState();
  const format = useFormatActions();
  const [menuOpen, setMenuOpen] = useState(false);
  const hasMenu = !!slots.toolbarMenu;

  return (
    <div className="re-toolbar">
      <div className="re-toolbar-group">
        {slots.toolbarStart}
        {features.bold && (
          <ToolbarButton
            label={labels.bold}
            active={active.bold}
            onClick={format.bold}
          >
            B
          </ToolbarButton>
        )}
        {features.italic && (
          <ToolbarButton
            label={labels.italic}
            active={active.italic}
            onClick={format.italic}
          >
            I
          </ToolbarButton>
        )}
        {features.strikethrough && (
          <ToolbarButton
            label={labels.strikethrough}
            active={active.strikethrough}
            onClick={format.strikethrough}
          >
            S
          </ToolbarButton>
        )}
        {features.code && (
          <ToolbarButton
            label={labels.code}
            active={active.code}
            onClick={format.code}
          >
            {"</>"}
          </ToolbarButton>
        )}
        {features.quote && (
          <ToolbarButton
            label={labels.quote}
            active={active.quote}
            onClick={format.quote}
          >
            "
          </ToolbarButton>
        )}
      </div>
      {(slots.toolbarEnd || hasMenu) && (
        <div className="re-toolbar-group" style={{ position: "relative" }}>
          {slots.toolbarEnd}
          {hasMenu && (
            <>
              <button
                type="button"
                aria-label={labels.menu}
                title={labels.menu}
                onClick={() => setMenuOpen((v) => !v)}
                className="re-toolbar-menu-btn"
              >
                ⋮
              </button>
              {menuOpen && (
                <>
                  <div
                    className="re-toolbar-menu-backdrop"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div
                    className="re-toolbar-menu"
                    onClick={() => setMenuOpen(false)}
                  >
                    {slots.toolbarMenu}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
