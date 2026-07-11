"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $nodesOfType,
  COMMAND_PRIORITY_HIGH,
  PASTE_COMMAND,
} from "lexical";
import { useEffect, useRef } from "react";
import {
  collectFilesFromClipboard,
  collectFilesFromDataTransfer,
  getFileKind,
  isImageMime,
  type EditorAttachment,
} from "../../core/attachments";
import { insertAttachmentAtSelection, insertImageAtSelection } from "../../core/attachmentInsert";
import { $isImageNode, ImageNode } from "../../nodes/ImageNode";

function syncUploadedImages(
  editor: ReturnType<typeof useLexicalComposerContext>[0],
  attachments: EditorAttachment[],
): void {
  editor.update(() => {
    const imageNodes = $nodesOfType(ImageNode);
    for (const attachment of attachments) {
      if (attachment.status !== "ready" || !attachment.id || !attachment.url) {
        continue;
      }
      for (const node of imageNodes) {
        if (node.getFileId() !== attachment.localId) continue;
        node.setSrc(attachment.url);
        node.setFileId(attachment.id);
      }
    }
  });
}

export function AttachmentsPlugin({
  disabled,
  attachments,
  addFiles,
  containerRef,
  insertInlineOnDrop = true,
}: {
  disabled?: boolean;
  attachments: EditorAttachment[];
  addFiles: (files: File[]) => EditorAttachment[];
  containerRef: React.RefObject<HTMLElement | null>;
  insertInlineOnDrop?: boolean;
}) {
  const [editor] = useLexicalComposerContext();
  const dragDepthRef = useRef(0);

  useEffect(() => {
    if (disabled) return;
    syncUploadedImages(editor, attachments);
  }, [attachments, disabled, editor]);

  useEffect(() => {
    if (disabled) return;

    return editor.registerCommand(
      PASTE_COMMAND,
      (event) => {
        if (!(event instanceof ClipboardEvent)) return false;
        const files = collectFilesFromClipboard(event.clipboardData);
        if (files.length === 0) return false;

        event.preventDefault();
        const added = addFiles(files);
        const imageAttachment = added.find((item) => isImageMime(item.mimeType));
        if (imageAttachment) {
          void insertImageAtSelection(editor, imageAttachment);
        }
        return true;
      },
      COMMAND_PRIORITY_HIGH,
    );
  }, [addFiles, disabled, editor]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || disabled) return;

    const setDragOver = (active: boolean) => {
      container.classList.toggle("re-editor-drag-over", active);
    };

    const onDragEnter = (event: DragEvent) => {
      if (!event.dataTransfer?.types.includes("Files")) return;
      event.preventDefault();
      dragDepthRef.current += 1;
      setDragOver(true);
    };

    const onDragLeave = (event: DragEvent) => {
      if (!event.dataTransfer?.types.includes("Files")) return;
      dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
      if (dragDepthRef.current === 0) setDragOver(false);
    };

    const onDragOver = (event: DragEvent) => {
      if (!event.dataTransfer?.types.includes("Files")) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    };

    const onDrop = (event: DragEvent) => {
      const files = collectFilesFromDataTransfer(event.dataTransfer);
      if (files.length === 0) return;
      event.preventDefault();
      dragDepthRef.current = 0;
      setDragOver(false);

      const added = addFiles(files);
      if (!insertInlineOnDrop) return;

      const imageAttachment = added.find(
        (item) => getFileKind(item.mimeType) === "image",
      );
      if (imageAttachment) {
        void insertImageAtSelection(editor, imageAttachment);
      }
    };

    container.addEventListener("dragenter", onDragEnter);
    container.addEventListener("dragleave", onDragLeave);
    container.addEventListener("dragover", onDragOver);
    container.addEventListener("drop", onDrop);

    return () => {
      container.removeEventListener("dragenter", onDragEnter);
      container.removeEventListener("dragleave", onDragLeave);
      container.removeEventListener("dragover", onDragOver);
      container.removeEventListener("drop", onDrop);
      setDragOver(false);
    };
  }, [addFiles, containerRef, disabled, editor, insertInlineOnDrop]);

  return null;
}

export async function handleInsertAttachment(
  editor: ReturnType<typeof useLexicalComposerContext>[0],
  attachments: EditorAttachment[],
  localId: string,
): Promise<void> {
  const attachment = attachments.find((item) => item.localId === localId);
  if (!attachment) return;
  await insertAttachmentAtSelection(editor, attachment);
}
