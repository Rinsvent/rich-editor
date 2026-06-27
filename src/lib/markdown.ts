import {
  BOLD_STAR,
  BOLD_UNDERSCORE,
  CODE,
  HEADING,
  INLINE_CODE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  LINK,
  ORDERED_LIST,
  QUOTE,
  UNORDERED_LIST,
  type Transformer,
} from "@lexical/markdown";
import { marked } from "marked";
import { sanitizeMessageHtml } from "./contentHtml";

marked.setOptions({ gfm: true, breaks: true });

marked.use({
  renderer: {
    strong({ tokens }) {
      const text = this.parser.parseInline(tokens);
      return `<b>${text}</b>`;
    },
    em({ tokens }) {
      const text = this.parser.parseInline(tokens);
      return `<i>${text}</i>`;
    },
  },
});

/** Markdown transformers enabled in the composer (live shortcuts + paste). */
export const MESSAGE_MARKDOWN_TRANSFORMERS: Transformer[] = [
  HEADING,
  QUOTE,
  UNORDERED_LIST,
  ORDERED_LIST,
  CODE,
  INLINE_CODE,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  LINK,
];

export function looksLikeMarkdown(text: string): boolean {
  const t = text.trim();
  if (t.length < 2) return false;
  return (
    /^#{1,6}\s/m.test(t) ||
    /^>\s/m.test(t) ||
    /^[-*+]\s/m.test(t) ||
    /^\d+\.\s/m.test(t) ||
    /```[\s\S]*?```/.test(t) ||
    /\*\*[^*\n]+\*\*/.test(t) ||
    /(?:^|[^*])\*[^*\s][^*\n]*\*(?:[^*]|$)/.test(t) ||
    /`[^`\n]+`/.test(t) ||
    /\[[^\]]+\]\([^)]+\)/.test(t)
  );
}

export function markdownToHtml(markdown: string): string {
  const raw = marked.parse(markdown, { async: false }) as string;
  return sanitizeMessageHtml(raw);
}
