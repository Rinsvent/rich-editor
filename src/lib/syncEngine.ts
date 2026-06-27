import { api } from "./api";
import type { Chat, Message } from "./types";
import { compareMessageIds } from "./messageOrder";
import {
  getSyncCursor,
  hasChatLocal,
  setSyncCursor,
  upsertChat,
  upsertMessages,
  listOutbox,
  removeOutbox,
  type LocalChat,
} from "./localDb";

function maxMessageId(messages: Message[], current: string): string {
  let max = current;
  for (const m of messages) {
    if (!m.id) continue;
    if (!max || compareMessageIds(m.id, max) > 0) max = m.id;
  }
  return max;
}

async function ensureChatsForMessages(messages: Message[]): Promise<void> {
  const missing = new Set<string>();
  for (const m of messages) {
    if (!(await hasChatLocal(m.chat_id))) {
      missing.add(m.chat_id);
    }
  }
  await Promise.all(
    [...missing].map(async (id) => {
      try {
        const chat = await api.getChat(id);
        await upsertChat(chat);
      } catch {
        /* chat may have been removed */
      }
    }),
  );
}

export async function refreshChatsFromApi(): Promise<LocalChat[]> {
  const { items } = await api.listChats();
  for (const item of items) {
    await upsertChat(item);
  }
  return items;
}

export async function runSyncUnread(pageSize: number): Promise<void> {
  await refreshChatsFromApi();

  let after = await getSyncCursor();
  for (;;) {
    const { items } = await api.syncUnread(after, pageSize);
    if (items.length === 0) break;

    await ensureChatsForMessages(items);
    await upsertMessages(items);

    after = maxMessageId(items, after);
    await setSyncCursor(after);

    if (items.length < pageSize) break;
  }
}

export async function flushOutbox(): Promise<void> {
  const pending = await listOutbox();
  for (const row of pending) {
    try {
      await api.sendMessage(
        row.chat_id,
        row.content,
        row.idempotency_key,
        row.thread_id,
      );
      await removeOutbox(row.pending_key);
    } catch {
      /* keep in outbox until next online cycle */
    }
  }
}

export function toLocalChat(chat: Chat & { last_view_at?: string | null }): LocalChat {
  return chat;
}
