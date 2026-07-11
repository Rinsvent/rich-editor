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
  STRIKETHROUGH,
  UNORDERED_LIST,
  type TextMatchTransformer,
  type Transformer,
} from "@lexical/markdown";
import { $createTextNode } from "lexical";
import { marked } from "marked";
import type { EditorFeatures } from "./features";
import { sanitizeHtml } from "./html";
import { $createSpoilerNode, $isSpoilerNode, SpoilerNode } from "../nodes/SpoilerNode";

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
    del({ tokens }) {
      const text = this.parser.parseInline(tokens);
      return `<s>${text}</s>`;
    },
  },
});

const SPOILER: TextMatchTransformer = {
  dependencies: [SpoilerNode],
  export: (node) => {
    if (!$isSpoilerNode(node)) return null;
    return `||${node.getTextContent()}||`;
  },
  importRegExp: /(?:^|\s)\|\|([^|]+?)\|\|/,
  regExp: /\|\|([^|]+?)\|\|$/,
  replace: (textNode, match) => {
    const spoiler = $createSpoilerNode();
    spoiler.append($createTextNode(match[1]));
    textNode.replace(spoiler);
  },
  trigger: "|",
  type: "text-match",
};

export function buildMarkdownTransformers(
  features: EditorFeatures,
): Transformer[] {
  const transformers: Transformer[] = [];

  if (features.headings) transformers.push(HEADING);
  if (features.quote) transformers.push(QUOTE);
  if (features.lists) {
    transformers.push(UNORDERED_LIST, ORDERED_LIST);
  }
  if (features.codeBlock) transformers.push(CODE);
  if (features.code) transformers.push(INLINE_CODE);
  if (features.bold) {
    transformers.push(BOLD_STAR, BOLD_UNDERSCORE);
  }
  if (features.italic) {
    transformers.push(ITALIC_STAR, ITALIC_UNDERSCORE);
  }
  if (features.strikethrough) transformers.push(STRIKETHROUGH);
  if (features.links) transformers.push(LINK);
  if (features.spoiler) transformers.push(SPOILER);

  return transformers;
}

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
    /~~[^~\n]+~~/.test(t) ||
    /\|\|[^|\n]+\|\|/.test(t) ||
    /\[[^\]]+\]\([^)]+\)/.test(t)
  );
}

export function markdownToHtml(markdown: string): string {
  const raw = marked.parse(markdown, { async: false }) as string;
  return sanitizeHtml(raw);
}
