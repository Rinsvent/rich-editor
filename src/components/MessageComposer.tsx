"use client";

import { useRef } from "react";
import {
  MessageEditor,
  type MessageEditorHandle,
} from "./editor/MessageEditor";
import { chatStreamClassName } from "@/lib/utils";

type Props = {
  chatId: string;
  draftHtml?: string;
  draftEditorKey?: string;
  submitMode?: "send" | "save";
  scheduledCount?: number;
  scheduleHint?: string | null;
  editorRef?: React.RefObject<MessageEditorHandle | null>;
  onBlurDraft?: (html: string) => void;
  onOpenScheduledList?: () => void;
  onScheduleNew?: () => void;
  onSubmit: (html: string) => Promise<void>;
  clearAfterSubmit?: boolean;
  disabled?: boolean;
};

export function MessageComposer({
  chatId,
  draftHtml,
  draftEditorKey,
  submitMode,
  scheduledCount,
  scheduleHint,
  editorRef,
  onBlurDraft,
  onOpenScheduledList,
  onScheduleNew,
  onSubmit,
  clearAfterSubmit,
  disabled,
}: Props) {
  const localRef = useRef<MessageEditorHandle | null>(null);
  const ref = editorRef ?? localRef;

  return (
    <div className="border-t border-tg-border bg-tg-header px-4 py-3">
      <div className={chatStreamClassName}>
        <MessageEditor
        ref={ref}
        key={draftEditorKey ?? chatId}
        disabled={disabled}
        initialHtml={draftHtml}
        submitMode={submitMode}
        scheduledCount={scheduledCount}
        scheduleHint={scheduleHint}
        onBlurDraft={onBlurDraft}
        onOpenScheduledList={onOpenScheduledList}
        onScheduleNew={onScheduleNew}
        onSubmit={onSubmit}
        clearAfterSubmit={clearAfterSubmit}
        />
      </div>
    </div>
  );
}
