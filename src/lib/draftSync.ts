import { api } from "./api";
import { draftDocId } from "./draftId";
import { getUserId } from "./auth";
import { deleteDraftLocal, getDraftLocal, upsertDraftLocal } from "./localDb";
import { plainTextFromHtml } from "./contentHtml";

export const DRAFT_SERVER_MIN_INTERVAL_MS = 60_000;

let skipNextDraftSave = false;
const lastServerSyncByChat = new Map<string, number>();

export function markDraftSkipAfterSend(): void {
  skipNextDraftSave = true;
}

export async function clearDraft(chatId: string): Promise<void> {
  const userId = getUserId();
  if (!userId) return;
  await deleteDraftLocal(draftDocId(userId, chatId));
  try {
    await api.deleteDraft(chatId);
  } catch {
    /* ignore */
  }
  lastServerSyncByChat.delete(chatId);
}

export async function loadDraftForChat(chatId: string): Promise<string> {
  const userId = getUserId();
  if (!userId) return "";

  const local = await getDraftLocal(draftDocId(userId, chatId));
  let content = local?.content ?? "";

  try {
    const remote = await api.getDraft(chatId);
    const remoteMs = Date.parse(remote.updated_at);
    const localMs = local?.updated_at ? Date.parse(local.updated_at) : 0;
    if (!content || (remoteMs > localMs && remote.content)) {
      content = remote.content;
      await upsertDraftLocal({
        id: remote.id,
        chat_id: remote.chat_id,
        content: remote.content,
        updated_at: remote.updated_at,
      });
    }
  } catch {
    /* no remote draft */
  }

  return content;
}

/** Save to IndexedDB immediately; sync to API at most once per minute. */
export async function persistDraft(chatId: string, html: string): Promise<void> {
  if (skipNextDraftSave) {
    skipNextDraftSave = false;
    return;
  }

  const userId = getUserId();
  if (!userId) return;

  const normalized = html.trim();
  const isEmpty =
    !normalized || plainTextFromHtml(normalized).trim() === "";

  if (isEmpty) {
    await clearDraft(chatId);
    return;
  }

  const id = draftDocId(userId, chatId);
  const updatedAt = new Date().toISOString();
  await upsertDraftLocal({
    id,
    chat_id: chatId,
    content: normalized,
    updated_at: updatedAt,
  });

  const lastSync = lastServerSyncByChat.get(chatId) ?? 0;
  if (Date.now() - lastSync < DRAFT_SERVER_MIN_INTERVAL_MS) {
    return;
  }

  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return;
  }

  try {
    await api.saveDraft({ id, chat_id: chatId, content: normalized });
    lastServerSyncByChat.set(chatId, Date.now());
    await upsertDraftLocal({
      id,
      chat_id: chatId,
      content: normalized,
      updated_at: updatedAt,
      last_server_sync_at: new Date().toISOString(),
    });
  } catch {
    /* retry on next persist */
  }
}
