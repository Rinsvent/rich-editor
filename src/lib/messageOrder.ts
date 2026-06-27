import type { Message } from "./types";

const SORTABLE_HEX_ID = /^[0-9a-f]{32}$/;

/** Sortable 32-char hex ids compare lexicographically by time order. */
export function compareMessageIds(a: string, b: string): number {
  return a.localeCompare(b);
}

export function sortMessagesAsc(messages: Message[]): Message[] {
  return [...messages].sort((a, b) => {
    const aPending = a.pending && !SORTABLE_HEX_ID.test(a.id);
    const bPending = b.pending && !SORTABLE_HEX_ID.test(b.id);
    if (aPending && !bPending) return 1;
    if (!aPending && bPending) return -1;
    return compareMessageIds(a.id, b.id);
  });
}
