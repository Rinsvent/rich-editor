"use client";

import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  useBasicTypeaheadTriggerMatch,
} from "@lexical/react/LexicalTypeaheadMenuPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useMemo, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { type TextNode } from "lexical";
import type { MentionOption, MentionSearchFn } from "../../core/mentions";
import { $createMentionNode } from "../../nodes/MentionNode";

class MentionMenuOption extends MenuOption {
  id: string;
  label: string;

  constructor(option: MentionOption) {
    super(option.id);
    this.id = option.id;
    this.label = option.label;
  }
}

function MentionMenu({
  anchorElementRef,
  options,
  selectedIndex,
  selectOptionAndCleanUp,
  setHighlightedIndex,
}: {
  anchorElementRef: RefObject<HTMLElement | null>;
  options: MentionMenuOption[];
  selectedIndex: number | null;
  selectOptionAndCleanUp: (option: MentionMenuOption) => void;
  setHighlightedIndex: (index: number) => void;
}) {
  if (options.length === 0) return null;

  return createPortal(
    <div className="re-mention-menu" role="listbox">
      {options.map((option, index) => (
        <button
          key={option.key}
          type="button"
          role="option"
          aria-selected={selectedIndex === index}
          className="re-mention-menu-item"
          ref={(el) => option.setRefElement(el)}
          onMouseEnter={() => setHighlightedIndex(index)}
          onMouseDown={(e) => {
            e.preventDefault();
            selectOptionAndCleanUp(option);
          }}
        >
          @{option.label}
        </button>
      ))}
    </div>,
    anchorElementRef.current ?? document.body,
  );
}

export function MentionsPlugin({
  searchMentions,
}: {
  searchMentions: MentionSearchFn;
}) {
  const [editor] = useLexicalComposerContext();
  const [query, setQuery] = useState<string | null>(null);
  const [results, setResults] = useState<MentionOption[]>([]);

  const triggerFn = useBasicTypeaheadTriggerMatch("@", {
    minLength: 0,
    maxLength: 40,
  });

  useEffect(() => {
    if (query === null) {
      setResults([]);
      return;
    }

    let cancelled = false;
    void Promise.resolve(searchMentions(query)).then((items) => {
      if (!cancelled) setResults(items);
    });

    return () => {
      cancelled = true;
    };
  }, [query, searchMentions]);

  const options = useMemo(
    () => results.map((item) => new MentionMenuOption(item)),
    [results],
  );

  const onSelectOption = useCallback(
    (
      selectedOption: MentionMenuOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void,
    ) => {
      editor.update(() => {
        const mentionNode = $createMentionNode(
          selectedOption.id,
          selectedOption.label,
        );
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        }
        mentionNode.selectNext();
        closeMenu();
      });
    },
    [editor],
  );

  const menuRenderFn = useCallback(
    (
      anchorElementRef: RefObject<HTMLElement | null>,
      {
        selectedIndex,
        selectOptionAndCleanUp,
        setHighlightedIndex,
        options: menuOptions,
      }: {
        selectedIndex: number | null;
        selectOptionAndCleanUp: (option: MentionMenuOption) => void;
        setHighlightedIndex: (index: number) => void;
        options: MentionMenuOption[];
      },
    ) => (
      <MentionMenu
        anchorElementRef={anchorElementRef}
        options={menuOptions}
        selectedIndex={selectedIndex}
        selectOptionAndCleanUp={selectOptionAndCleanUp}
        setHighlightedIndex={setHighlightedIndex}
      />
    ),
    [],
  );

  return (
    <LexicalTypeaheadMenuPlugin<MentionMenuOption>
      onQueryChange={setQuery}
      onSelectOption={onSelectOption}
      triggerFn={triggerFn}
      options={options}
      menuRenderFn={menuRenderFn}
    />
  );
}
