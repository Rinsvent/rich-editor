"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import {
  $getNodeByKey,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  type NodeKey,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import { $isImageNode } from "../../nodes/ImageNode";
import { MAX_IMAGE_WIDTH, MIN_IMAGE_WIDTH } from "../../core/attachmentInsert";

export function ImageComponent({
  src,
  alt,
  width,
  aspectRatio,
  nodeKey,
}: {
  src: string;
  alt: string;
  width: number;
  aspectRatio: number;
  nodeKey: NodeKey;
}) {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const imageRef = useRef<HTMLImageElement>(null);
  const [isResizing, setIsResizing] = useState(false);

  const height = Math.max(1, Math.round(width / aspectRatio));

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (event) => {
          const target = event.target as Node | null;
          if (!imageRef.current?.contains(target)) return false;
          if (event.shiftKey) {
            setSelected(!isSelected);
          } else {
            clearSelection();
            setSelected(true);
          }
          return true;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [clearSelection, editor, isSelected, setSelected]);

  const onResizeStart = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsResizing(true);
      const startX = event.clientX;
      const startWidth = width;

      const onMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startX;
        const nextWidth = Math.min(
          MAX_IMAGE_WIDTH,
          Math.max(MIN_IMAGE_WIDTH, startWidth + delta),
        );
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if ($isImageNode(node)) {
            node.setWidth(nextWidth);
          }
        });
      };

      const onUp = () => {
        setIsResizing(false);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [editor, nodeKey, width],
  );

  return (
    <span
      className={`re-image-wrap${isSelected ? " re-image-wrap-selected" : ""}${isResizing ? " re-image-wrap-resizing" : ""}`}
      contentEditable={false}
      data-lexical-decorator="true"
    >
      <img
        ref={imageRef}
        className="re-image"
        src={src}
        alt={alt}
        width={width}
        height={height}
        draggable={false}
      />
      <span
        className="re-image-resize-handle"
        onMouseDown={onResizeStart}
        aria-hidden="true"
      />
    </span>
  );
}
