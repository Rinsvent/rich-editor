import type PouchDB from "pouchdb";
import type { Chat, Message } from "./types";
import { compareMessageIds } from "./messageOrder";
import { dedupeMessages } from "./api";
import { isThreadReply } from "./thread";

export type LocalChat = Chat & {
  last_view_at?: string | null;
};

export type OutboxDoc = {
  _id: string;
  type: "outbox";
  pending_key: string;
  chat_id: string;
  content: string;
  thread_id?: string;
  idempotency_key: string;
  created_at: string;
};

export type SyncStateDoc = {
  _id: "sync_state";
  type: "sync_state";
  last_message_id: string;
};

type MessageDoc = Message & {
  _id: string;
  type: "message";
};

type ChatDoc = LocalChat & {
  _id: string;
  type: "chat";
};

const CHAT_PREFIX = "chat:";
const MESSAGE_PREFIX = "message:";
const OUTBOX_PREFIX = "outbox:";
const DRAFT_PREFIX = "draft:";

export type DraftLocal = {
  id: string;
  chat_id: string;
  content: string;
  updated_at: string;
  last_server_sync_at?: string;
};

type DraftDoc = DraftLocal & {
  _id: string;
  type: "draft";
};

export const DB_CHANGE = "localdb:change";

function emitChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(DB_CHANGE));
  }
}

type PouchDatabase = PouchDB.Database<Record<string, unknown>>;

let dbPromise: Promise<PouchDatabase> | null = null;

export async function getLocalDb(): Promise<PouchDatabase> {
  if (typeof window === "undefined") {
    throw new Error("local database is only available in the browser");
  }
  if (!dbPromise) {
    dbPromise = (async () => {
      const PouchDB = (await import("pouchdb")).default;
      return new PouchDB("smart-messenger") as PouchDatabase;
    })();
  }
  return dbPromise;
}

export async function resetLocalDb(): Promise<void> {
  const db = await getLocalDb();
  await db.destroy();
  dbPromise = null;
  emitChange();
}

function chatId(id: string) {
  return `${CHAT_PREFIX}${id}`;
}

function messageId(id: string) {
  return `${MESSAGE_PREFIX}${id}`;
}

function outboxId(pendingKey: string) {
  return `${OUTBOX_PREFIX}${pendingKey}`;
}

export async function getSyncCursor(): Promise<string> {
  const db = await getLocalDb();
  try {
    const doc = (await db.get("sync_state")) as SyncStateDoc;
    return doc.last_message_id ?? "";
  } catch (e: unknown) {
    const err = e as { status?: number };
    if (err.status === 404) return "";
    throw e;
  }
}

export async function setSyncCursor(lastMessageId: string): Promise<void> {
  const db = await getLocalDb();
  const doc: SyncStateDoc = {
    _id: "sync_state",
    type: "sync_state",
    last_message_id: lastMessageId,
  };
  try {
    const existing = (await db.get("sync_state")) as SyncStateDoc & {
      _rev?: string;
    };
    await db.put({ ...doc, _rev: existing._rev });
  } catch (e: unknown) {
    const err = e as { status?: number };
    if (err.status === 404) {
      await db.put(doc);
    } else {
      throw e;
    }
  }
  emitChange();
}

export async function upsertChat(chat: LocalChat): Promise<void> {
  const db = await getLocalDb();
  const _id = chatId(chat.id);
  const doc: ChatDoc = { ...chat, _id, type: "chat" };
  try {
    const existing = (await db.get(_id)) as ChatDoc & { _rev?: string };
    await db.put({ ...doc, _rev: existing._rev });
  } catch (e: unknown) {
    const err = e as { status?: number };
    if (err.status === 404) await db.put(doc);
    else throw e;
  }
  emitChange();
}

export async function upsertMessage(msg: Message): Promise<void> {
  if (!msg.id || msg.pending) return;
  const db = await getLocalDb();
  const _id = messageId(msg.id);
  const { pendingKey: _pk, pending: _p, failed: _f, ...rest } = msg;
  const doc: MessageDoc = { ...rest, _id, type: "message" };
  try {
    const existing = (await db.get(_id)) as MessageDoc & { _rev?: string };
    await db.put({ ...doc, _rev: existing._rev });
  } catch (e: unknown) {
    const err = e as { status?: number };
    if (err.status === 404) await db.put(doc);
    else throw e;
  }
  emitChange();
}

export async function upsertMessages(messages: Message[]): Promise<void> {
  for (const m of messages) {
    await upsertMessage(m);
  }
}

export async function listChatsLocal(): Promise<LocalChat[]> {
  const db = await getLocalDb();
  const res = await db.allDocs({
    include_docs: true,
    startkey: CHAT_PREFIX,
    endkey: `${CHAT_PREFIX}\ufff0`,
  });
  const chats: LocalChat[] = [];
  for (const row of res.rows) {
    const doc = row.doc as ChatDoc | undefined;
    if (!doc || doc.type !== "chat") continue;
    const { _id: _docId, type: _t, ...chat } = doc;
    chats.push(chat as LocalChat);
  }
  return chats.sort((a, b) => a.title.localeCompare(b.title));
}

export async function listMessagesForChat(
  chatId: string,
  opts?: { threadId?: string | null; includeThreadReplies?: boolean },
): Promise<Message[]> {
  const db = await getLocalDb();
  const res = await db.allDocs({
    include_docs: true,
    startkey: MESSAGE_PREFIX,
    endkey: `${MESSAGE_PREFIX}\ufff0`,
  });
  const items: Message[] = [];
  for (const row of res.rows) {
    const doc = row.doc as MessageDoc | undefined;
    if (!doc || doc.type !== "message" || doc.chat_id !== chatId) continue;
    if (opts?.threadId) {
      if (doc.thread_id !== opts.threadId) continue;
    } else if (!opts?.includeThreadReplies && isThreadReply(doc)) {
      continue;
    }
    const { _id: _docId, type: _t, ...msg } = doc;
    items.push(msg);
  }
  return dedupeMessages(items);
}

export async function getLatestMessageId(): Promise<string> {
  const db = await getLocalDb();
  const res = await db.allDocs({
    include_docs: true,
    startkey: MESSAGE_PREFIX,
    endkey: `${MESSAGE_PREFIX}\ufff0`,
  });
  let max = "";
  for (const row of res.rows) {
    const doc = row.doc as MessageDoc | undefined;
    if (!doc?.id) continue;
    if (!max || compareMessageIds(doc.id, max) > 0) max = doc.id;
  }
  return max;
}

export async function addOutbox(entry: Omit<OutboxDoc, "_id" | "type">): Promise<void> {
  const db = await getLocalDb();
  const doc: OutboxDoc = {
    _id: outboxId(entry.pending_key),
    type: "outbox",
    ...entry,
  };
  await db.put(doc);
  emitChange();
}

export async function listOutbox(): Promise<OutboxDoc[]> {
  const db = await getLocalDb();
  const res = await db.allDocs({
    include_docs: true,
    startkey: OUTBOX_PREFIX,
    endkey: `${OUTBOX_PREFIX}\ufff0`,
  });
  const items: OutboxDoc[] = [];
  for (const row of res.rows) {
    const doc = row.doc as OutboxDoc | undefined;
    if (doc?.type === "outbox") items.push(doc);
  }
  return items.sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export async function removeOutbox(pendingKey: string): Promise<void> {
  const db = await getLocalDb();
  const _id = outboxId(pendingKey);
  try {
    const doc = await db.get(_id);
    await db.remove(doc);
    emitChange();
  } catch (e: unknown) {
    const err = e as { status?: number };
    if (err.status !== 404) throw e;
  }
}

function draftKey(id: string) {
  return `${DRAFT_PREFIX}${id}`;
}

export async function upsertDraftLocal(draft: DraftLocal): Promise<void> {
  const db = await getLocalDb();
  const _id = draftKey(draft.id);
  const doc: DraftDoc = { ...draft, _id, type: "draft" };
  try {
    const existing = (await db.get(_id)) as DraftDoc & { _rev?: string };
    await db.put({ ...doc, _rev: existing._rev });
  } catch (e: unknown) {
    const err = e as { status?: number };
    if (err.status === 404) await db.put(doc);
    else throw e;
  }
  emitChange();
}

export async function getDraftLocal(id: string): Promise<DraftLocal | null> {
  const db = await getLocalDb();
  try {
    const doc = (await db.get(draftKey(id))) as DraftDoc;
    const { _id: _docId, type: _t, ...draft } = doc;
    return draft;
  } catch (e: unknown) {
    const err = e as { status?: number };
    if (err.status === 404) return null;
    throw e;
  }
}

export async function deleteDraftLocal(id: string): Promise<void> {
  const db = await getLocalDb();
  try {
    const doc = await db.get(draftKey(id));
    await db.remove(doc);
    emitChange();
  } catch (e: unknown) {
    const err = e as { status?: number };
    if (err.status !== 404) throw e;
  }
}

export async function hasChatLocal(id: string): Promise<boolean> {
  const db = await getLocalDb();
  try {
    await db.get(chatId(id));
    return true;
  } catch (e: unknown) {
    const err = e as { status?: number };
    return err.status === 404 ? false : Promise.reject(e);
  }
}
