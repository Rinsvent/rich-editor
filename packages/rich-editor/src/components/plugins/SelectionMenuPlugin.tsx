"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { cn } from "../../core/cn";
import type { EditorFeatures, EditorLabels } from "../../core/features";
import type { SelectionMenuItem } from "../../core/selectionMenu";
import { defaultSelectionMenuItems } from "../../core/selectionMenu";
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
} from "../toolbar/ToolbarIcons";
import { useFormatActions, useFormatState } from "../toolbar/useFormatState";

function isItemEnabled(item: SelectionMenuItem, features: EditorFeatures): boolean {
  switch (item) {
    case "bold":
      return features.bold;
    case "italic":
      return features.italic;
    case "strikethrough":
      return features.strikethrough;
    case "code":
      return features.code;
    case "quote":
      return features.quote;
    case "codeBlock":
      return features.codeBlock;
    case "bulletList":
    case "numberedList":
      return features.lists;
    case "link":
      return features.links;
    case "heading":
      return features.headings;
    case "mention":
      return features.mentions;
    case "spoiler":
      return features.spoiler;
    default:
      return false;
  }
}

function MenuIcon({ item }: { item: SelectionMenuItem }) {
  switch (item) {
    case "bold":
      return <IconBold />;
    case "italic":
      return <IconItalic />;
    case "strikethrough":
      return <IconStrikethrough />;
    case "code":
      return <IconCode />;
    case "quote":
      return <IconQuote />;
    case "codeBlock":
      return <IconCodeBlock />;
    case "bulletList":
      return <IconBulletList />;
    case "numberedList":
      return <IconNumberedList />;
    case "link":
      return <IconLink />;
    case "heading":
      return <IconHeading />;
    case "mention":
      return <IconMention />;
    case "spoiler":
      return <IconSpoiler />;
    default:
      return null;
  }
}

function itemLabel(item: SelectionMenuItem, labels: EditorLabels): string {
  switch (item) {
    case "bold":
      return labels.bold;
    case "italic":
      return labels.italic;
    case "strikethrough":
      return labels.strikethrough;
    case "code":
      return labels.code;
    case "quote":
      return labels.quote;
    case "codeBlock":
      return labels.codeBlock;
    case "bulletList":
      return labels.bulletList;
    case "numberedList":
      return labels.numberedList;
    case "link":
      return labels.link;
    case "heading":
      return labels.heading;
    case "mention":
      return labels.mention;
    case "spoiler":
      return labels.spoiler;
    default:
      return item;
  }
}

function runItemAction(
  item: SelectionMenuItem,
  format: ReturnType<typeof useFormatActions>,
): void {
  switch (item) {
    case "bold":
      format.bold();
      break;
    case "italic":
      format.italic();
      break;
    case "strikethrough":
      format.strikethrough();
      break;
    case "code":
      format.code();
      break;
    case "quote":
      format.quote();
      break;
    case "codeBlock":
      format.codeBlock();
      break;
    case "bulletList":
      format.bulletList();
      break;
    case "numberedList":
      format.numberedList();
      break;
    case "link":
      format.link();
      break;
    case "heading":
      format.heading();
      break;
    case "mention":
      format.mentionTrigger();
      break;
    case "spoiler":
      format.spoiler();
      break;
  }
}

function isItemActive(
  item: SelectionMenuItem,
  active: ReturnType<typeof useFormatState>,
): boolean {
  switch (item) {
    case "bold":
      return active.bold;
    case "italic":
      return active.italic;
    case "strikethrough":
      return active.strikethrough;
    case "code":
      return active.code;
    case "quote":
      return active.quote;
    case "codeBlock":
      return active.codeBlock;
    case "bulletList":
      return active.bulletList;
    case "numberedList":
      return active.numberedList;
    case "link":
      return active.link;
    case "heading":
      return active.heading;
    case "spoiler":
      return active.spoiler;
    default:
      return false;
  }
}

export function SelectionMenuPlugin({
  features,
  labels,
  items = defaultSelectionMenuItems,
  containerRef,
}: {
  features: EditorFeatures;
  labels: EditorLabels;
  items?: SelectionMenuItem[];
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const [editor] = useLexicalComposerContext();
  const active = useFormatState();
  const format = useFormatActions();
  const [position, setPosition] = useState<{ top: number; left: number } | null>(
    null,
  );

  const visibleItems = items.filter((item) => isItemEnabled(item, features));

  useEffect(() => {
    if (!features.selectionMenu || visibleItems.length === 0) {
      setPosition(null);
      return;
    }

    const update = () => {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || selection.isCollapsed()) {
          setPosition(null);
          return;
        }

        const native = window.getSelection();
        const container = containerRef.current;
        if (!native || native.rangeCount === 0 || !container) {
          setPosition(null);
          return;
        }

        const range = native.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const host = container.getBoundingClientRect();

        if (rect.width === 0 && rect.height === 0) {
          setPosition(null);
          return;
        }

        const menuHeight = 44;
        const gap = 8;
        const spaceAbove = rect.top - host.top;
        const showBelow = spaceAbove < menuHeight + gap;

        setPosition({
          top: showBelow
            ? rect.bottom - host.top + gap
            : rect.top - host.top - menuHeight - gap,
          left: rect.left - host.left + rect.width / 2,
        });
      });
    };

    update();
    const removeSelection = editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        update();
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
    const removeUpdate = editor.registerUpdateListener(update);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    return () => {
      removeSelection();
      removeUpdate();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [containerRef, editor, features.selectionMenu, visibleItems.length]);

  if (!features.selectionMenu || !position || visibleItems.length === 0) {
    return null;
  }

  const menu = (
    <div
      className="re-selection-menu"
      style={{
        top: `${Math.max(0, position.top)}px`,
        left: `${position.left}px`,
      }}
      role="toolbar"
      aria-label={labels.selectionMenu}
    >
      {visibleItems.map((item) => (
        <button
          key={item}
          type="button"
          className={cn(
            "re-selection-menu-btn",
            isItemActive(item, active) && "re-selection-menu-btn-active",
          )}
          aria-label={itemLabel(item, labels)}
          aria-pressed={isItemActive(item, active)}
          onMouseDown={(event) => {
            event.preventDefault();
            runItemAction(item, format);
          }}
        >
          <MenuIcon item={item} />
        </button>
      ))}
    </div>
  );

  return createPortal(menu, containerRef.current ?? document.body);
}
