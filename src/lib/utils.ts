export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function shortId(id: string): string {
  if (id.length <= 8) return id;
  return id.slice(0, 8);
}

export { formatMessageTime } from "./messageTime";

export function chatTitle(title: string, fallback: string): string {
  const t = title.trim();
  return t || fallback;
}

/** Plain-text snippet for headers and previews. */
export function plainTextPreview(html: string, maxLen = 80): string {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!text) return "";
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 1)}…`;
}

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Shared width for message list and composer (edges align). */
export const chatStreamClassName = "w-full";
