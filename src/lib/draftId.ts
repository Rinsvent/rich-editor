/** Server/local draft id: canonical userId + chatId (no separator). */
export function draftDocId(userId: string, chatId: string): string {
  return userId + chatId;
}
