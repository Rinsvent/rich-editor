import type {
  Chat,
  CreateMessageResult,
  Draft,
  Message,
  RealtimeConfig,
  RealtimeToken,
  ScheduledMessage,
  User,
} from "./types";
import { plainTextFromHtml } from "./contentHtml";
import { getUserId } from "./auth";
import { isSameUser } from "./uuidBytes";
import { sortMessagesAsc } from "./messageOrder";

export { sortMessagesAsc } from "./messageOrder";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  status: number;
  body: string;

  constructor(status: number, body: string) {
    super(body || `HTTP ${status}`);
    this.status = status;
    this.body = body;
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const userId = getUserId();
  if (!userId) {
    throw new ApiError(401, "not authenticated");
  }

  const headers = new Headers(init.headers);
  headers.set("X-User-ID", userId);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });
  const text = await res.text();
  if (!res.ok) {
    throw new ApiError(res.status, text);
  }
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

function itemsOf<T>(data: { items?: T[] | null }): T[] {
  return data.items ?? [];
}

export const api = {
  me: () => request<User>("/v1/me"),

  listChats: async (limit = 50) => {
    const data = await request<{ items?: Chat[] | null }>(
      `/v1/chats?limit=${limit}`,
    );
    return { items: itemsOf(data) };
  },

  getChat: (id: string) => request<Chat>(`/v1/chats/${id}`),

  createChat: (title: string, type = "Conversation") =>
    request<Chat>("/v1/chats", {
      method: "POST",
      body: JSON.stringify({ title, type }),
    }),

  listMessages: (params: {
    chatId: string;
    threadId?: string;
    limit?: number;
    before?: string;
    after?: string;
    q?: string;
  }) => {
    const q = new URLSearchParams({ chat_id: params.chatId });
    if (params.threadId) q.set("thread_id", params.threadId);
    if (params.limit) q.set("limit", String(params.limit));
    if (params.before) q.set("before", params.before);
    if (params.after) q.set("after", params.after);
    if (params.q) q.set("q", params.q);
    return request<{ items: Message[] }>(`/v1/messages?${q}`).then((data) => ({
      items: itemsOf(data),
    }));
  },

  sendMessage: (
    chatId: string,
    content: string,
    idempotencyKey: string,
    threadId?: string,
  ) =>
    request<CreateMessageResult>("/v1/messages", {
      method: "POST",
      headers: { "X-Idempotency-Key": idempotencyKey },
      body: JSON.stringify({
        chat_id: chatId,
        content,
        ...(threadId ? { thread_id: threadId } : {}),
      }),
    }),

  realtimeToken: () => request<RealtimeToken>("/v1/realtime/token", { method: "POST" }),

  realtimeConfig: () => request<RealtimeConfig>("/v1/realtime/config"),

  syncUnread: (after = "", limit = 1000) => {
    const q = new URLSearchParams();
    if (after) q.set("after", after);
    if (limit) q.set("limit", String(limit));
    const qs = q.toString();
    return request<{ items: Message[] }>(
      `/v1/sync/unread${qs ? `?${qs}` : ""}`,
    ).then((data) => ({ items: itemsOf(data) }));
  },

  markRead: (chatId: string, lastViewAt?: string) =>
    request<void>(`/v1/chats/${encodeURIComponent(chatId)}/read`, {
      method: "PATCH",
      body: JSON.stringify(
        lastViewAt ? { last_view_at: lastViewAt } : {},
      ),
    }),

  getDraft: (chatId: string) =>
    request<Draft>(`/v1/drafts?chat_id=${encodeURIComponent(chatId)}`),

  saveDraft: (body: { id: string; chat_id: string; content: string }) =>
    request<Draft>("/v1/drafts", {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  deleteDraft: (chatId: string) =>
    request<void>(`/v1/drafts?chat_id=${encodeURIComponent(chatId)}`, {
      method: "DELETE",
    }),

  listScheduled: (chatId?: string) => {
    const q = chatId
      ? `?chat_id=${encodeURIComponent(chatId)}`
      : "";
    return request<{ items: ScheduledMessage[] }>(
      `/v1/scheduled-messages${q}`,
    ).then((data) => ({ items: itemsOf(data) }));
  },

  createScheduled: (body: {
    id: string;
    chat_id: string;
    content: string;
    send_at: string;
  }) =>
    request<ScheduledMessage>("/v1/scheduled-messages", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  patchScheduled: (
    id: string,
    body: { content?: string; send_at?: string },
  ) =>
    request<ScheduledMessage>(
      `/v1/scheduled-messages/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify(body),
      },
    ),

  deleteScheduled: (id: string) =>
    request<void>(
      `/v1/scheduled-messages/${encodeURIComponent(id)}`,
      { method: "DELETE" },
    ),
};

const SORTABLE_HEX_ID = /^[0-9a-f]{32}$/;

function isConfirmedId(id: string): boolean {
  return SORTABLE_HEX_ID.test(id);
}

function contentMatches(a: string, b: string): boolean {
  if (a === b) return true;
  return plainTextFromHtml(a) === plainTextFromHtml(b);
}

function dropDuplicateIds(messages: Message[], id: string, keepIndex: number): Message[] {
  return messages.filter((m, i) => i === keepIndex || m.id !== id);
}

export function dedupeMessages(messages: Message[]): Message[] {
  const confirmed = new Map<string, Message>();
  const rest: Message[] = [];

  for (const m of messages) {
    if (isConfirmedId(m.id) && !m.pending) {
      const prev = confirmed.get(m.id);
      if (!prev || prev.pending) {
        confirmed.set(m.id, m);
      }
    } else {
      rest.push(m);
    }
  }

  const confirmedPendingKeys = new Set<string>();
  for (const m of confirmed.values()) {
    if (m.pendingKey) confirmedPendingKeys.add(m.pendingKey);
  }

  const filteredRest = rest.filter((m) => {
    if (m.pending && m.pendingKey && confirmedPendingKeys.has(m.pendingKey)) {
      return false;
    }
    if (isConfirmedId(m.id) && confirmed.has(m.id)) {
      return false;
    }
    return true;
  });

  return sortMessagesAsc([...confirmed.values(), ...filteredRest]);
}

export function mergeMessage(existing: Message[], incoming: Message): Message[] {
  let next = [...existing];

  if (incoming.pendingKey) {
    const idx = next.findIndex((m) => m.pendingKey === incoming.pendingKey);
    if (idx >= 0) {
      next[idx] = { ...next[idx], ...incoming, pending: false };
      if (incoming.id) {
        next = dropDuplicateIds(next, incoming.id, idx);
      }
      return dedupeMessages(next);
    }
  }

  if (incoming.id) {
    const idx = next.findIndex((m) => m.id === incoming.id);
    if (idx >= 0) {
      next[idx] = { ...next[idx], ...incoming, pending: false };
      return dedupeMessages(next);
    }
  }

  const idxByContent = next.findIndex(
    (m) =>
      m.pending &&
      m.chat_id === incoming.chat_id &&
      isSameUser(m.author_id, incoming.author_id) &&
      contentMatches(m.content, incoming.content),
  );
  if (idxByContent >= 0) {
    next[idxByContent] = {
      ...next[idxByContent],
      ...incoming,
      pending: false,
      pendingKey: next[idxByContent].pendingKey,
    };
    if (incoming.id) {
      next = dropDuplicateIds(next, incoming.id, idxByContent);
    }
    return dedupeMessages(next);
  }

  if (incoming.id) {
    const pendingSameAuthor = next
      .map((m, i) => ({ m, i }))
      .filter(
        ({ m }) =>
          m.pending &&
          m.chat_id === incoming.chat_id &&
          isSameUser(m.author_id, incoming.author_id),
      );
    if (pendingSameAuthor.length === 1) {
      const { i } = pendingSameAuthor[0];
      next[i] = {
        ...pendingSameAuthor[0].m,
        ...incoming,
        pending: false,
      };
      next = dropDuplicateIds(next, incoming.id, i);
      return dedupeMessages(next);
    }
  }

  next.push(incoming);
  return dedupeMessages(next);
}

export function eventToMessage(evt: {
  message_id: string;
  chat_id: string;
  author_id: string;
  content: string;
  thread_id?: string;
}): Message {
  return {
    id: evt.message_id,
    chat_id: evt.chat_id,
    author_id: evt.author_id,
    content: evt.content,
    thread_id: evt.thread_id,
    schema_version: 1,
  };
}
