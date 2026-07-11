"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { EditorLabels } from "../../core/features";
import type { EditorAttachment } from "../../core/attachments";
import { AttachmentStrip } from "../attachments/AttachmentStrip";
import { handleInsertAttachment } from "../plugins/AttachmentsPlugin";

export function AttachmentsBridge({
  attachments,
  labels,
  disabled,
  onRemove,
}: {
  attachments: EditorAttachment[];
  labels: EditorLabels;
  disabled?: boolean;
  onRemove: (localId: string) => void;
}) {
  const [editor] = useLexicalComposerContext();

  return (
    <AttachmentStrip
      attachments={attachments}
      labels={labels}
      disabled={disabled}
      onRemove={onRemove}
      onInsert={(localId) => {
        void handleInsertAttachment(editor, attachments, localId);
      }}
    />
  );
}
