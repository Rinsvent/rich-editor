"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Chat, Message, ScheduledMessage } from "@/lib/types";
import { api, dedupeMessages } from "@/lib/api";
import { subscribeChat } from "@/lib/realtime";
import { getDisplayName, getUserId } from "@/lib/auth";
import {
  getConnectionState,
  subscribeConnection,
} from "@/lib/connection";
import { addOutbox, listMessagesForChat, upsertMessage } from "@/lib/localDb";
import { refreshChatsFromApi } from "@/lib/syncEngine";
import { useLocalMessages } from "@/lib/useLocalDb";
import {
  clearDraft,
  loadDraftForChat,
  markDraftSkipAfterSend,
  persistDraft,
} from "@/lib/draftSync";
import { plainTextFromHtml } from "@/lib/contentHtml";
import { formatScheduleDisplay, newScheduledId } from "@/lib/scheduledTime";
import type { MessageEditorHandle } from "./editor/MessageEditor";
import { Avatar } from "./Avatar";
import { MessageComposer } from "./MessageComposer";
import { MessageList } from "./MessageList";
import { ScheduledMessagesPanel } from "./ScheduledMessagesPanel";
import { SchedulePickerModal } from "./SchedulePickerModal";
import { chatTitle, plainTextPreview } from "@/lib/utils";
import {
  buildThreadReplyCounts,
  isThreadReply,
  rootMessageIdFromThreadId,
  threadIdForMessage,
} from "@/lib/thread";

type Props = {
  chatId: string;
  chat: Chat | null;
  onBack?: () => void;
};

const PAGE_SIZE = 50;

export function ChatView({ chatId, chat, onBack }: Props) {
  const userId = getUserId() ?? "";
  const selfDisplayName = getDisplayName();
  const editorRef = useRef<MessageEditorHandle | null>(null);
  const { messages: localMessages, reload } = useLocalMessages(chatId, {
    includeThreadReplies: true,
  });
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [pending, setPending] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [connState, setConnState] = useState(getConnectionState);
  const [connected, setConnected] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [draftHtml, setDraftHtml] = useState("");
  const [draftEditorKey, setDraftEditorKey] = useState("0");
  const [scheduledOpen, setScheduledOpen] = useState(false);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [editingScheduled, setEditingScheduled] =
    useState<ScheduledMessage | null>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleModalError, setScheduleModalError] = useState<string | null>(
    null,
  );
  const [rescheduleTarget, setRescheduleTarget] =
    useState<ScheduledMessage | null>(null);

  const allMessages = useMemo(
    () => dedupeMessages([...localMessages, ...pending]),
    [localMessages, pending],
  );

  const mainMessages = useMemo(
    () => allMessages.filter((m) => !isThreadReply(m)),
    [allMessages],
  );

  const threadMessages = useMemo(() => {
    if (!activeThreadId) return [];
    const rootId = rootMessageIdFromThreadId(activeThreadId);
    const root = allMessages.find((m) => m.id === rootId);
    const replies = allMessages.filter((m) => m.thread_id === activeThreadId);
    return root ? dedupeMessages([root, ...replies]) : dedupeMessages(replies);
  }, [allMessages, activeThreadId]);

  const displayedMessages = activeThreadId ? threadMessages : mainMessages;

  const threadReplyCounts = useMemo(
    () => buildThreadReplyCounts(allMessages),
    [allMessages],
  );

  const refreshScheduledCount = useCallback(async () => {
    try {
      const { items } = await api.listScheduled(chatId);
      setScheduledCount(items.length);
    } catch {
      setScheduledCount(0);
    }
  }, [chatId]);

  useEffect(() => {
    void refreshScheduledCount();
  }, [refreshScheduledCount]);

  useEffect(() => {
    setActiveThreadId(null);
  }, [chatId]);

  useEffect(() => {
    let cancelled = false;
    setEditingScheduled(null);
    void loadDraftForChat(chatId).then((html) => {
      if (!cancelled) {
        setDraftHtml(html);
        setDraftEditorKey(`${chatId}-${Date.now()}`);
      }
    });
    return () => {
      cancelled = true;
      const html = editorRef.current?.getHtml() ?? "";
      void persistDraft(chatId, html);
    };
  }, [chatId]);

  useEffect(() => {
    const flush = () => {
      const html = editorRef.current?.getHtml() ?? "";
      void persistDraft(chatId, html);
    };
    window.addEventListener("pagehide", flush);
    window.addEventListener("beforeunload", flush);
    return () => {
      window.removeEventListener("pagehide", flush);
      window.removeEventListener("beforeunload", flush);
    };
  }, [chatId]);

  const loadInitial = useCallback(async () => {
    setLoading(true);
    try {
      if (searchQ && !activeThreadId) {
        const { items } = await api.listMessages({
          chatId,
          limit: PAGE_SIZE,
          q: searchQ,
        });
        for (const m of items) await upsertMessage(m);
        await reload();
        setHasMore(items.length >= PAGE_SIZE);
        return;
      }
      await reload();
      if (activeThreadId) {
        const stored = await listMessagesForChat(chatId, {
          threadId: activeThreadId,
        });
        if (stored.length === 0) {
          const { items } = await api.listMessages({
            chatId,
            threadId: activeThreadId,
            limit: PAGE_SIZE,
          });
          for (const m of items) await upsertMessage(m);
          await reload();
          setHasMore(items.length >= PAGE_SIZE);
        } else {
          setHasMore(true);
        }
        return;
      }
      const stored = await listMessagesForChat(chatId);
      if (stored.length === 0) {
        const { items } = await api.listMessages({
          chatId,
          limit: PAGE_SIZE,
        });
        for (const m of items) await upsertMessage(m);
        await reload();
        setHasMore(items.length >= PAGE_SIZE);
      } else {
        setHasMore(true);
      }
    } finally {
      setLoading(false);
    }
  }, [chatId, searchQ, activeThreadId, reload]);

  useEffect(() => {
    const t = setTimeout(() => void loadInitial(), searchQ ? 300 : 0);
    return () => clearTimeout(t);
  }, [loadInitial, searchQ]);

  useEffect(() => {
    void api.markRead(chatId).then(() => refreshChatsFromApi());
  }, [chatId]);

  useEffect(() => subscribeConnection(setConnState), []);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    void subscribeChat(chatId, {
      onMessage: () => void reload(),
      onState: setConnected,
    }).then((fn) => {
      unsub = fn;
    });
    return () => unsub?.();
  }, [chatId, reload]);

  function selectScheduled(item: ScheduledMessage) {
    setEditingScheduled(item);
    setDraftHtml(item.content);
    setDraftEditorKey(`scheduled-${item.id}-${Date.now()}`);
    setScheduledOpen(false);
  }

  async function loadMore() {
    if (loadingMore || !hasMore || displayedMessages.length === 0 || searchQ) {
      return;
    }
    const paginated = activeThreadId
      ? displayedMessages.filter((m) => m.thread_id === activeThreadId)
      : displayedMessages;
    const oldest = paginated[0]?.id;
    if (!oldest) return;
    setLoadingMore(true);
    try {
      const { items } = await api.listMessages({
        chatId,
        threadId: activeThreadId ?? undefined,
        limit: PAGE_SIZE,
        before: oldest,
        q: searchQ || undefined,
      });
      for (const m of items) await upsertMessage(m);
      await reload();
      if (items.length < PAGE_SIZE) setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }

  function openThread(message: Message) {
    setScheduledOpen(false);
    setActiveThreadId(threadIdForMessage(message.id));
  }

  function closeThread() {
    setActiveThreadId(null);
  }

  async function handleComposerSubmit(contentHtml: string) {
    if (editingScheduled) {
      await api.patchScheduled(editingScheduled.id, {
        content: contentHtml,
      });
      setEditingScheduled(null);
      await clearDraft(chatId);
      setDraftHtml("");
      setDraftEditorKey(`${chatId}-saved-${Date.now()}`);
      await refreshScheduledCount();
      return;
    }

    markDraftSkipAfterSend();
    const pendingKey = crypto.randomUUID();
    const idempotencyKey = crypto.randomUUID();
    const threadId = activeThreadId ?? undefined;
    const optimistic: Message = {
      id: pendingKey,
      pendingKey,
      chat_id: chatId,
      author_id: userId,
      content: contentHtml,
      thread_id: threadId,
      schema_version: 1,
      pending: true,
    };
    setPending((prev) => dedupeMessages([...prev, optimistic]));

    if (connState === "offline") {
      await addOutbox({
        pending_key: pendingKey,
        chat_id: chatId,
        content: contentHtml,
        thread_id: threadId,
        idempotency_key: idempotencyKey,
        created_at: new Date().toISOString(),
      });
      return;
    }

    try {
      const res = await api.sendMessage(
        chatId,
        contentHtml,
        idempotencyKey,
        threadId,
      );
      const confirmed = {
        ...optimistic,
        id: res.message_id,
        pending: false,
      };
      await upsertMessage(confirmed);
      setPending((prev) =>
        prev.filter((m) => m.pendingKey !== pendingKey),
      );
      await reload();
      await clearDraft(chatId);
      setDraftHtml("");
      setDraftEditorKey(`${chatId}-sent-${Date.now()}`);
    } catch {
      setPending((prev) =>
        prev.map((m) =>
          m.pendingKey === pendingKey
            ? { ...m, pending: false, failed: true }
            : m,
        ),
      );
    }
  }

  const title = chat ? chatTitle(chat.title, "Чат") : "…";
  const threadRootId = activeThreadId
    ? rootMessageIdFromThreadId(activeThreadId)
    : null;
  const threadRoot = threadRootId
    ? allMessages.find((m) => m.id === threadRootId)
    : null;
  const threadTitle = threadRoot
    ? plainTextPreview(threadRoot.content, 48) || "Тред"
    : "Тред";
  const statusLabel =
    connState === "syncing"
      ? "синхронизация…"
      : connState === "offline"
        ? "офлайн"
        : connected
          ? "real-time подключён"
          : "подключение…";

  const scheduleHint = editingScheduled
    ? `Отложено на ${formatScheduleDisplay(editingScheduled.send_at)}`
    : null;

  async function createScheduledNow(sendAt: Date): Promise<boolean> {
    const html = editorRef.current?.getHtml() ?? "";
    if (!plainTextFromHtml(html).trim()) {
      setScheduleModalError("Напишите текст сообщения в редакторе");
      return false;
    }
    markDraftSkipAfterSend();
    await api.createScheduled({
      id: newScheduledId(),
      chat_id: chatId,
      content: html,
      send_at: sendAt.toISOString(),
    });
    setEditingScheduled(null);
    await clearDraft(chatId);
    setDraftHtml("");
    setDraftEditorKey(`${chatId}-scheduled-${Date.now()}`);
    await refreshScheduledCount();
    setScheduleModalError(null);
    return true;
  }

  return (
    <section className="flex h-full min-w-0 flex-1 flex-col bg-tg-header">
      <header className="flex items-center gap-3 border-b border-tg-border bg-tg-header px-4 py-3">
        {activeThreadId ? (
          <button
            type="button"
            onClick={closeThread}
            className="rounded-lg p-2 text-tg-muted hover:bg-tg-hover"
            aria-label="Выйти из треда"
          >
            ←
          </button>
        ) : (
          onBack && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-lg p-2 text-tg-muted hover:bg-tg-hover md:hidden"
              aria-label="Назад"
            >
              ←
            </button>
          )
        )}
        <Avatar name={activeThreadId ? threadTitle : title} size="md" />
        <div className="min-w-0 flex-1">
          <h2 className="truncate font-semibold">
            {activeThreadId ? threadTitle : title}
          </h2>
          <p className="text-xs text-tg-muted">
            {activeThreadId ? "Тред" : statusLabel}
          </p>
        </div>
        {!activeThreadId && (
          <input
            type="search"
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Поиск в чате"
            className="hidden w-44 rounded-lg border border-tg-border bg-tg-input px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-tg-accent sm:block"
          />
        )}
      </header>

      <div className="flex min-h-0 flex-1 flex-col bg-tg-header">
        {scheduledOpen ? (
          <ScheduledMessagesPanel
            chatId={chatId}
            open={scheduledOpen}
            selectedId={editingScheduled?.id ?? null}
            onClose={() => setScheduledOpen(false)}
            onSelect={selectScheduled}
            onReschedule={(item) => {
              setRescheduleTarget(item);
              setScheduleModalOpen(true);
            }}
            onChanged={() => void refreshScheduledCount()}
          />
        ) : (
          <MessageList
            key={activeThreadId ?? "main"}
            listKey={activeThreadId ?? "main"}
            messages={displayedMessages}
            userId={userId}
            selfDisplayName={selfDisplayName}
            loading={loading}
            loadingMore={loadingMore}
            hasMore={hasMore && !searchQ}
            onLoadMore={() => void loadMore()}
            onOpenThread={activeThreadId ? undefined : openThread}
            threadReplyCounts={
              activeThreadId ? undefined : threadReplyCounts
            }
          />
        )}

        <MessageComposer
          chatId={chatId}
          editorRef={editorRef}
          draftHtml={draftHtml}
          draftEditorKey={draftEditorKey}
          submitMode={editingScheduled ? "save" : "send"}
          scheduledCount={scheduledCount}
          scheduleHint={scheduleHint}
          clearAfterSubmit={!editingScheduled}
          onBlurDraft={(html) => void persistDraft(chatId, html)}
          onOpenScheduledList={() => setScheduledOpen((v) => !v)}
          onScheduleNew={() => {
            setRescheduleTarget(null);
            setScheduleModalError(null);
            setScheduleModalOpen(true);
          }}
          onSubmit={handleComposerSubmit}
        />
      </div>

      <SchedulePickerModal
        open={scheduleModalOpen}
        title={
          rescheduleTarget
            ? "Изменить время отправки"
            : "Отложить отправку"
        }
        initialSendAt={rescheduleTarget?.send_at}
        externalError={rescheduleTarget ? null : scheduleModalError}
        onClose={() => {
          setScheduleModalOpen(false);
          setRescheduleTarget(null);
          setScheduleModalError(null);
        }}
        onConfirm={async (sendAt) => {
          if (rescheduleTarget) {
            await api.patchScheduled(rescheduleTarget.id, {
              send_at: sendAt.toISOString(),
            });
            if (editingScheduled?.id === rescheduleTarget.id) {
              setEditingScheduled({
                ...editingScheduled,
                send_at: sendAt.toISOString(),
              });
            }
            await refreshScheduledCount();
            setRescheduleTarget(null);
            return true;
          }
          if (scheduleModalError) setScheduleModalError(null);
          return createScheduledNow(sendAt);
        }}
      />
    </section>
  );
}
