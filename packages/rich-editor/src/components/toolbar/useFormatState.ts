"use client";

import { useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createCodeNode, $isCodeNode } from "@lexical/code";
import { $isLinkNode } from "@lexical/link";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import {
  $createHeadingNode,
  $isHeadingNode,
  $isQuoteNode,
} from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $findMatchingParent } from "@lexical/utils";
import {
  $createParagraphNode,
  $createTextNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import type { FormatState } from "../../context/EditorContext";
import { useLinkUiOptional } from "../../context/LinkUiContext";
import { $applyQuoteToSelection } from "../../core/quoteBlocks";
import { $createSpoilerNode, $isSpoilerNode } from "../../nodes/SpoilerNode";

const emptyFormat: FormatState = {
  bold: false,
  italic: false,
  strikethrough: false,
  code: false,
  quote: false,
  codeBlock: false,
  bulletList: false,
  numberedList: false,
  link: false,
  heading: false,
  spoiler: false,
};

export function useFormatState(): FormatState {
  const [editor] = useLexicalComposerContext();
  const [state, setState] = useState<FormatState>(emptyFormat);

  useEffect(() => {
    const update = () => {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          setState(emptyFormat);
          return;
        }

        const anchorNode = selection.anchor.getNode();
        const listNode = $findMatchingParent(anchorNode, $isListNode);

        setState({
          bold: selection.hasFormat("bold"),
          italic: selection.hasFormat("italic"),
          strikethrough: selection.hasFormat("strikethrough"),
          code: selection.hasFormat("code"),
          quote: !!$findMatchingParent(anchorNode, $isQuoteNode),
          codeBlock: !!$findMatchingParent(anchorNode, $isCodeNode),
          bulletList: listNode?.getListType() === "bullet",
          numberedList: listNode?.getListType() === "number",
          link: !!$findMatchingParent(anchorNode, $isLinkNode),
          heading: !!$findMatchingParent(anchorNode, $isHeadingNode),
          spoiler: !!$findMatchingParent(anchorNode, $isSpoilerNode),
        });
      });
    };

    const removeUpdate = editor.registerUpdateListener(() => update());
    const removeSelection = editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        update();
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
    return () => {
      removeUpdate();
      removeSelection();
    };
  }, [editor]);

  return state;
}

export function useFormatActions() {
  const [editor] = useLexicalComposerContext();
  const linkUi = useLinkUiOptional();

  return {
    bold: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold"),
    italic: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic"),
    strikethrough: () =>
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough"),
    code: () => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code"),
    quote: () => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;
        $applyQuoteToSelection(selection);
      });
    },
    codeBlock: () => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;
        const inCode = !!$findMatchingParent(
          selection.anchor.getNode(),
          $isCodeNode,
        );
        if (inCode) {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () => $createCodeNode());
        }
      });
    },
    bulletList: () => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;
        const listNode = $findMatchingParent(
          selection.anchor.getNode(),
          $isListNode,
        );
        if (listNode?.getListType() === "bullet") {
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        } else {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        }
      });
    },
    numberedList: () => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;
        const listNode = $findMatchingParent(
          selection.anchor.getNode(),
          $isListNode,
        );
        if (listNode?.getListType() === "number") {
          editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        } else {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        }
      });
    },
    link: () => {
      linkUi?.openLinkDialog();
    },
    heading: () => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;
        const heading = $findMatchingParent(
          selection.anchor.getNode(),
          $isHeadingNode,
        );
        if (heading) {
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          $setBlocksType(selection, () => $createHeadingNode("h2"));
        }
      });
    },
    mentionTrigger: () => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          selection.insertText("@");
        }
      });
      editor.focus();
    },
    spoiler: () => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection) || selection.isCollapsed()) return;

        const anchorNode = selection.anchor.getNode();
        const existing = $findMatchingParent(anchorNode, $isSpoilerNode);

        if (existing) {
          const textNode = $createTextNode(existing.getTextContent());
          existing.replace(textNode);
          textNode.select();
          return;
        }

        const text = selection.getTextContent();
        if (!text) return;

        selection.removeText();
        const spoiler = $createSpoilerNode();
        spoiler.append($createTextNode(text));
        selection.insertNodes([spoiler]);
      });
    },
  };
}

export type FormatActions = ReturnType<typeof useFormatActions>;
