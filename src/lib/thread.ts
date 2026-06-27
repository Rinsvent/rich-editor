import type { Message } from "./types";

const PREFIX = "message:";

/** Thread id for replies rooted at a chat message. */
export function threadIdForMessage(messageId: string): string {
  return `${PREFIX}${messageId}`;
}

/** Root message id from thread_id, or null if invalid. */
export function rootMessageIdFromThreadId(threadId: string): string | null {
  if (!threadId.startsWith(PREFIX)) return null;
  const root = threadId.slice(PREFIX.length);
  return root || null;
}

export function isThreadReply(message: { thread_id?: string }): boolean {
  return Boolean(message.thread_id?.trim());
}

/** Count replies per thread_id from loaded messages. */
export function buildThreadReplyCounts(
  messages: Iterable<Message>,
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const m of messages) {
    const tid = m.thread_id?.trim();
    if (!tid) continue;
    counts.set(tid, (counts.get(tid) ?? 0) + 1);
  }
  return counts;
}

export function replyCountForMessage(
  counts: Map<string, number>,
  messageId: string,
): number {
  return counts.get(threadIdForMessage(messageId)) ?? 0;
}

/** Russian label for reply count (Slack-style). */
export function formatReplyCount(count: number): string {
  const n = Math.abs(Math.floor(count));
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return `${n} ответов`;
  if (mod10 === 1) return `${n} ответ`;
  if (mod10 >= 2 && mod10 <= 4) return `${n} ответа`;
  return `${n} ответов`;
}
