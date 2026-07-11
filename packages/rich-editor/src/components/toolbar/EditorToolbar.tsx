"use client";

import { useState, useId, useEffect } from "react";
import type { ReactNode } from "react";
import type { EditorFeatures, EditorLabels } from "../../core/features";
import { shortcutById } from "../../core/shortcuts";
import type { SlotMap } from "../slots/createSlot";
import { useFormatActions, useFormatState } from "./useFormatState";

function ToolbarButton({
  label,
  active,
  onClick,
  shortcutId,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  shortcutId?: string;
  children: ReactNode;
}) {
  const shortcut = shortcutId ? shortcutById(shortcutId) : undefined;

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      aria-keyshortcuts={shortcut?.ariaKeyshortcuts}
      title={shortcut ? `${label} (${shortcut.keys})` : label}
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
  editorInputId,
}: {
  features: EditorFeatures;
  labels: EditorLabels;
  slots: SlotMap;
  editorInputId: string;
}) {
  const active = useFormatState();
  const format = useFormatActions();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const hasMenu = !!slots.toolbarMenu;

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <div
      className="re-toolbar"
      role="toolbar"
      aria-label={labels.toolbar}
      aria-controls={editorInputId}
    >
      <div className="re-toolbar-group">
        {slots.toolbarStart}
        {features.bold && (
          <ToolbarButton
            label={labels.bold}
            active={active.bold}
            onClick={format.bold}
            shortcutId="format.bold"
          >
            B
          </ToolbarButton>
        )}
        {features.italic && (
          <ToolbarButton
            label={labels.italic}
            active={active.italic}
            onClick={format.italic}
            shortcutId="format.italic"
          >
            I
          </ToolbarButton>
        )}
        {features.strikethrough && (
          <ToolbarButton
            label={labels.strikethrough}
            active={active.strikethrough}
            onClick={format.strikethrough}
            shortcutId="format.strikethrough"
          >
            S
          </ToolbarButton>
        )}
        {features.code && (
          <ToolbarButton
            label={labels.code}
            active={active.code}
            onClick={format.code}
            shortcutId="format.code"
          >
            {"</>"}
          </ToolbarButton>
        )}
        {features.quote && (
          <ToolbarButton label={labels.quote} active={active.quote} onClick={format.quote}>
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
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                aria-controls={menuId}
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
                    aria-hidden="true"
                  />
                  <div
                    id={menuId}
                    role="menu"
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
