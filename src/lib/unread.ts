import type { Message } from "./types";
import { compareMessageIds } from "./messageOrder";
import { timestampMsFromMessageId } from "./messageTime";
import { getUserId } from "./auth";
import { isSameUser } from "./uuidBytes";

export function unreadCountForChat(
  chatId: string,
  lastViewAt: string | null | undefined,
  messages: Message[],
): number {
  const userId = getUserId();
  let count = 0;
  const lastMs = lastViewAt ? Date.parse(lastViewAt) : null;

  for (const m of messages) {
    if (m.chat_id !== chatId) continue;
    if (userId && isSameUser(m.author_id, userId)) continue;
    if (m.pending) continue;

    if (lastMs != null && !Number.isNaN(lastMs)) {
      const msgMs = timestampMsFromMessageId(m.id);
      if (msgMs != null && msgMs <= lastMs) continue;
    } else if (lastViewAt && compareMessageIds(m.id, lastViewAt) <= 0) {
      continue;
    }

    count++;
  }
  return count;
}
