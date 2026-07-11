"use client";

import { useState, useId, useEffect } from "react";
import type { ReactNode } from "react";
import type { EditorFeatures, EditorLabels } from "../../core/features";
import { shortcutById } from "../../core/shortcuts";
import type { SlotMap } from "../slots/createSlot";
import { useFormatActions, useFormatState } from "./useFormatState";
import { AttachmentUploadButton } from "../attachments/AttachmentStrip";
import {
  IconBold,
  IconBulletList,
  IconCode,
  IconCodeBlock,
  IconHeading,
  IconItalic,
  IconLink,
  IconMention,
  IconNumberedList,
  IconQuote,
  IconSpoiler,
  IconStrikethrough,
} from "./ToolbarIcons";

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
  showMentionButton,
  showAttachButton,
  onAttachFiles,
  acceptFiles,
}: {
  features: EditorFeatures;
  labels: EditorLabels;
  slots: SlotMap;
  editorInputId: string;
  showMentionButton?: boolean;
  showAttachButton?: boolean;
  onAttachFiles?: (files: File[]) => void;
  acceptFiles?: string;
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
      <div className="re-toolbar-group re-toolbar-group-main">
        {slots.toolbarStart}
        {features.bold && (
          <ToolbarButton
            label={labels.bold}
            active={active.bold}
            onClick={format.bold}
            shortcutId="format.bold"
          >
            <IconBold />
          </ToolbarButton>
        )}
        {features.italic && (
          <ToolbarButton
            label={labels.italic}
            active={active.italic}
            onClick={format.italic}
            shortcutId="format.italic"
          >
            <IconItalic />
          </ToolbarButton>
        )}
        {features.strikethrough && (
          <ToolbarButton
            label={labels.strikethrough}
            active={active.strikethrough}
            onClick={format.strikethrough}
            shortcutId="format.strikethrough"
          >
            <IconStrikethrough />
          </ToolbarButton>
        )}
        {features.code && (
          <ToolbarButton
            label={labels.code}
            active={active.code}
            onClick={format.code}
            shortcutId="format.code"
          >
            <IconCode />
          </ToolbarButton>
        )}
        {features.spoiler && (
          <ToolbarButton
            label={labels.spoiler}
            active={active.spoiler}
            onClick={format.spoiler}
          >
            <IconSpoiler />
          </ToolbarButton>
        )}
        {features.quote && (
          <ToolbarButton
            label={labels.quote}
            active={active.quote}
            onClick={format.quote}
          >
            <IconQuote />
          </ToolbarButton>
        )}
        {features.codeBlock && (
          <ToolbarButton
            label={labels.codeBlock}
            active={active.codeBlock}
            onClick={format.codeBlock}
          >
            <IconCodeBlock />
          </ToolbarButton>
        )}
        {features.lists && (
          <>
            <ToolbarButton
              label={labels.bulletList}
              active={active.bulletList}
              onClick={format.bulletList}
            >
              <IconBulletList />
            </ToolbarButton>
            <ToolbarButton
              label={labels.numberedList}
              active={active.numberedList}
              onClick={format.numberedList}
            >
              <IconNumberedList />
            </ToolbarButton>
          </>
        )}
        {features.links && (
          <ToolbarButton
            label={labels.link}
            active={active.link}
            onClick={format.link}
          >
            <IconLink />
          </ToolbarButton>
        )}
        {features.headings && (
          <ToolbarButton
            label={labels.heading}
            active={active.heading}
            onClick={format.heading}
          >
            <IconHeading />
          </ToolbarButton>
        )}
        {showMentionButton && (
          <ToolbarButton label={labels.mention} onClick={format.mentionTrigger}>
            <IconMention />
          </ToolbarButton>
        )}
        {showAttachButton && onAttachFiles && (
          <AttachmentUploadButton
            labels={labels}
            accept={acceptFiles}
            onFilesSelected={onAttachFiles}
          />
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
