import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "s",
  "del",
  "strike",
  "code",
  "pre",
  "blockquote",
  "a",
  "ul",
  "ol",
  "li",
  "span",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "img",
];

const ALLOWED_URI_REGEXP =
  /^(?:(?:https?|mailto|tel|blob):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i;

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: [
      "href",
      "class",
      "target",
      "rel",
      "style",
      "data-mention-id",
      "data-mention-label",
      "data-re-spoiler",
      "src",
      "alt",
      "width",
      "height",
      "data-file-id",
      "data-file-name",
      "data-file-mime",
      "data-aspect-ratio",
    ],
    ALLOWED_URI_REGEXP,
  });
}

export function isHtmlContent(content: string): boolean {
  return /<[a-z][\s\S]*>/i.test(content.trim());
}

/** Add target/rel to links for SSR-safe viewer output. */
export function applyLinkTargetToHtml(html: string, target: string): string {
  return html.replace(/<a\b([^>]*)>/gi, (match, attrs: string) => {
    if (/\btarget\s*=/.test(attrs)) return match;
    let next = attrs;
    if (!/\brel\s*=/.test(next)) {
      next = `${next} rel="noopener noreferrer"`;
    }
    return `<a${next} target="${target}">`;
  });
}

export function plainTextFromHtml(html: string): string {
  if (typeof document === "undefined") {
    return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
  const el = document.createElement("div");
  el.innerHTML = sanitizeHtml(html);
  return el.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

/** Normalize Lexical HTML export to our API subset (b/i/s, no nested duplicates). */
export function normalizeHtml(html: string): string {
  if (typeof document === "undefined") {
    return html
      .replace(/<\/?strong\b[^>]*>/gi, (tag) =>
        tag.startsWith("</") ? "</b>" : "<b>",
      )
      .replace(/<\/?em\b[^>]*>/gi, (tag) =>
        tag.startsWith("</") ? "</i>" : "<i>",
      )
      .replace(/<\/?del\b[^>]*>/gi, (tag) =>
        tag.startsWith("</") ? "</s>" : "<s>",
      )
      .replace(/<\/?strike\b[^>]*>/gi, (tag) =>
        tag.startsWith("</") ? "</s>" : "<s>",
      );
  }

  const container = document.createElement("div");
  container.innerHTML = html;

  container.querySelectorAll("strong").forEach((node) => {
    const b = document.createElement("b");
    b.innerHTML = node.innerHTML;
    node.replaceWith(b);
  });

  container.querySelectorAll("em").forEach((node) => {
    const i = document.createElement("i");
    i.innerHTML = node.innerHTML;
    node.replaceWith(i);
  });

  for (const tag of ["del", "strike"] as const) {
    container.querySelectorAll(tag).forEach((node) => {
      const s = document.createElement("s");
      s.innerHTML = node.innerHTML;
      node.replaceWith(s);
    });
  }

  container.querySelectorAll('[style*="line-through"]').forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    const s = document.createElement("s");
    s.innerHTML = node.innerHTML;
    node.replaceWith(s);
  });

  container.querySelectorAll("code span").forEach((span) => {
    const code = span.parentElement;
    if (!code) return;
    if (code.classList.contains("re-block-code")) return;
    while (span.firstChild) {
      code.insertBefore(span.firstChild, span);
    }
    span.remove();
  });

  flattenTag(container, "b");
  flattenTag(container, "i");
  flattenTag(container, "s");

  mergeAdjacentBlockquotes(container);

  return container.innerHTML.trim();
}

const BLOCK_CONTAINER_TAGS = new Set(["blockquote", "ul", "ol"]);
const TRIMMABLE_BLOCK_TAGS = new Set([
  "p",
  "blockquote",
  "pre",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
]);

function isTrimableBreak(node: Node): boolean {
  if (node.nodeType === Node.TEXT_NODE) {
    return !node.textContent?.replace(/\u00a0/g, " ").trim();
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    return (node as Element).tagName.toLowerCase() === "br";
  }
  return false;
}

function trimEdgeBreaks(el: Element, edge: "start" | "end"): void {
  if (edge === "start") {
    while (el.firstChild && isTrimableBreak(el.firstChild)) {
      el.firstChild.remove();
    }
    return;
  }
  while (el.lastChild && isTrimableBreak(el.lastChild)) {
    el.lastChild.remove();
  }
}

function isExportNodeEmpty(node: Node): boolean {
  if (node.nodeType === Node.TEXT_NODE) {
    return !node.textContent?.replace(/\u00a0/g, " ").trim();
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return true;

  const el = node as Element;
  const tag = el.tagName.toLowerCase();
  if (tag === "br") return true;

  const text = el.textContent?.replace(/\u00a0/g, " ").trim() ?? "";
  if (text) return false;

  const children = Array.from(el.childNodes);
  if (children.length === 0) return true;
  return children.every(isExportNodeEmpty);
}

function isEmptyBlockElement(el: Element): boolean {
  const tag = el.tagName.toLowerCase();
  if (!TRIMMABLE_BLOCK_TAGS.has(tag) && !BLOCK_CONTAINER_TAGS.has(tag)) {
    return false;
  }
  return isExportNodeEmpty(el);
}

function trimContainerEdges(el: Element): void {
  while (el.firstElementChild && isEmptyBlockElement(el.firstElementChild)) {
    el.firstElementChild.remove();
  }
  while (el.lastElementChild && isEmptyBlockElement(el.lastElementChild)) {
    el.lastElementChild.remove();
  }

  trimEdgeBreaks(el, "start");
  trimEdgeBreaks(el, "end");

  const first = el.firstElementChild;
  const last = el.lastElementChild;
  if (first && BLOCK_CONTAINER_TAGS.has(first.tagName.toLowerCase())) {
    trimContainerEdges(first);
  }
  if (
    last &&
    last !== first &&
    BLOCK_CONTAINER_TAGS.has(last.tagName.toLowerCase())
  ) {
    trimContainerEdges(last);
  }
}

/** Remove leading/trailing empty blocks and line breaks from exported editor HTML. */
export function trimEditorHtml(html: string): string {
  const trimmed = html.trim();
  if (!trimmed) return "";

  if (typeof document === "undefined") {
    return trimmed
      .replace(/^(?:<p[^>]*>(?:\s|<br\s*\/?>)*<\/p>\s*)+/gi, "")
      .replace(/(?:\s*<p[^>]*>(?:\s|<br\s*\/?>)*<\/p>)+$/gi, "")
      .replace(/^(<(?:p|blockquote|h[1-6])[^>]*>)<br\s*\/?>/i, "$1")
      .replace(/<br\s*\/?>(<\/(?:p|blockquote|h[1-6])>)$/i, "$1")
      .trim();
  }

  const container = document.createElement("div");
  container.innerHTML = trimmed;

  trimContainerEdges(container);

  while (container.firstElementChild && isEmptyBlockElement(container.firstElementChild)) {
    container.firstElementChild.remove();
  }
  while (container.lastElementChild && isEmptyBlockElement(container.lastElementChild)) {
    container.lastElementChild.remove();
  }

  const first = container.firstElementChild;
  const last = container.lastElementChild;
  if (first) trimContainerEdges(first);
  if (last && last !== first) trimContainerEdges(last);

  return container.innerHTML.trim();
}

function mergeAdjacentBlockquotes(container: Element): void {
  const parents = new Set<Element>();
  container.querySelectorAll("blockquote").forEach((quote) => {
    if (quote.parentElement) parents.add(quote.parentElement);
  });

  for (const parent of parents) {
    const children = Array.from(parent.children);
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child.tagName.toLowerCase() !== "blockquote") continue;
      let next = child.nextElementSibling;
      while (next && next.tagName.toLowerCase() === "blockquote") {
        while (next.firstChild) {
          child.appendChild(next.firstChild);
        }
        const toRemove = next;
        next = next.nextElementSibling;
        toRemove.remove();
      }
    }
  }
}

function flattenTag(container: Element, tagName: string): void {
  const lower = tagName.toLowerCase();
  let changed = true;
  while (changed) {
    changed = false;
    for (const el of Array.from(container.getElementsByTagName(tagName))) {
      const parent = el.parentElement;
      if (parent && parent.tagName.toLowerCase() === lower) {
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el);
        }
        el.remove();
        changed = true;
      }
    }
  }
}
