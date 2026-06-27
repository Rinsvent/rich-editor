"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import type { Message } from "@/lib/types";
import {
  calendarDayKey,
  formatDaySeparator,
  formatMessageTime,
  formatTimeFromMs,
  timestampMsFromMessageId,
} from "@/lib/messageTime";
import { canonicalUserId } from "@/lib/uuidBytes";
import { replyCountForMessage } from "@/lib/thread";
import { chatStreamClassName, cn } from "@/lib/utils";
import { MessageBubble } from "./MessageBubble";

type Props = {
  messages: Message[];
  userId: string;
  selfDisplayName?: string | null;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onOpenThread?: (message: Message) => void;
  threadReplyCounts?: Map<string, number>;
  listKey?: string;
};

type ListRow =
  | { kind: "day"; label: string; key: string }
  | {
      kind: "message";
      message: Message;
      showAvatar: boolean;
      showAuthorName: boolean;
      timeLabel: string;
      key: string;
    };

function messageTimestampMs(message: Message): number | null {
  if (message.id) {
    return timestampMsFromMessageId(message.id);
  }
  return null;
}

function buildRows(messages: Message[]): ListRow[] {
  const rows: ListRow[] = [];
  let lastDay: string | null = null;
  let lastAuthor: string | null = null;

  for (const m of messages) {
    const ms = messageTimestampMs(m);
    const hasTimestamp = ms !== null;

    if (hasTimestamp) {
      const day = calendarDayKey(ms);
      if (day !== lastDay) {
        rows.push({
          kind: "day",
          label: formatDaySeparator(ms),
          key: `day-${day}`,
        });
        lastDay = day;
        lastAuthor = null;
      }
    } else {
      lastAuthor = null;
    }

    const authorKey = canonicalUserId(m.author_id);
    const showAvatar = !hasTimestamp || authorKey !== lastAuthor;
    const showAuthorName = showAvatar;
    lastAuthor = hasTimestamp ? authorKey : null;

    const timeLabel = hasTimestamp
      ? formatTimeFromMs(ms)
      : formatMessageTime(m.id);

    rows.push({
      kind: "message",
      message: m,
      showAvatar,
      showAuthorName,
      timeLabel,
      key: m.id || m.pendingKey || `msg-${rows.length}`,
    });
  }

  return rows;
}

function DaySeparator({ label }: { label: string }) {
  return (
    <div className="relative my-4 flex items-center gap-3">
      <div className="h-px flex-1 bg-tg-border" />
      <span className="shrink-0 text-xs font-medium text-tg-muted">{label}</span>
      <div className="h-px flex-1 bg-tg-border" />
    </div>
  );
}

export function MessageList({
  messages,
  userId,
  selfDisplayName,
  loading,
  loadingMore,
  hasMore,
  onLoadMore,
  onOpenThread,
  threadReplyCounts,
  listKey = "main",
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  const didInitScroll = useRef(false);

  // On initial mount / reload we want to land at the newest message (bottom).
  // Browser scroll restoration may put us at the top, so we force-scroll once.
  useLayoutEffect(() => {
    didInitScroll.current = false;
    stickToBottom.current = true;
  }, [listKey]);

  useLayoutEffect(() => {
    if (didInitScroll.current) return;
    if (loading) return;
    if (messages.length === 0) return;

    didInitScroll.current = true;
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [loading, messages.length, listKey]);

  useEffect(() => {
    if (!didInitScroll.current) return;
    if (stickToBottom.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  function handleScroll() {
    const el = containerRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    stickToBottom.current = nearBottom;
    if (el.scrollTop < 80 && hasMore && !loadingMore) {
      onLoadMore();
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center text-tg-muted">
        Загрузка сообщений…
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center text-tg-muted">
        <p className="text-lg">Нет сообщений</p>
        <p className="text-sm">Напишите первым — сообщение появится здесь</p>
      </div>
    );
  }

  const rows = buildRows(messages);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto px-4 py-3"
    >
      {loadingMore && (
        <p className="mb-3 text-center text-xs text-tg-muted">
          Загрузка истории…
        </p>
      )}
      <div className={cn(chatStreamClassName, "flex flex-col")}>
        {rows.map((row) =>
          row.kind === "day" ? (
            <DaySeparator key={row.key} label={row.label} />
          ) : (
            <MessageBubble
              key={row.key}
              message={row.message}
              currentUserId={userId}
              selfDisplayName={selfDisplayName}
              showAvatar={row.showAvatar}
              showAuthorName={row.showAuthorName}
              timeLabel={row.timeLabel}
              onOpenThread={onOpenThread}
              replyCount={
                threadReplyCounts
                  ? replyCountForMessage(threadReplyCounts, row.message.id)
                  : 0
              }
            />
          ),
        )}
      </div>
      <div ref={bottomRef} className="h-1" />
    </div>
  );
}
