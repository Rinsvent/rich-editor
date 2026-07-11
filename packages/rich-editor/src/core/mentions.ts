export type MentionOption = {
  id: string;
  label: string;
};

export type MentionSearchFn = (
  query: string,
) => MentionOption[] | Promise<MentionOption[]>;

export const MENTION_ID_ATTR = "data-mention-id";
export const MENTION_LABEL_ATTR = "data-mention-label";

export function mentionDisplayText(label: string): string {
  return `@${label}`;
}
