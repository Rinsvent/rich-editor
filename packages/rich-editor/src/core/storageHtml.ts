/**
 * Minimal HTML for DB storage (Telegram-inspired).
 * Browser display classes are stripped on export and re-applied in the viewer.
 */

const BLOCK_TAGS = new Set([
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

const KEEP_ATTRS_GLOBAL = new Set([
  "href",
  "src",
  "alt",
  "width",
  "height",
  "target",
  "rel",
  "data-mention-id",
  "data-mention-label",
  "data-file-id",
  "data-file-name",
  "data-file-mime",
  "data-aspect-ratio",
  "data-language",
]);

function isElement(node: Node): node is Element {
  return node.nodeType === Node.ELEMENT_NODE;
}

function unwrapElementKeepChildren(el: Element): void {
  const parent = el.parentNode;
  if (!parent) return;
  while (el.firstChild) {
    parent.insertBefore(el.firstChild, el);
  }
  el.remove();
}

function stripHighlightMarkup(container: Element): void {
  container.querySelectorAll("pre, code").forEach((block) => {
    const spans = block.querySelectorAll("span");
    spans.forEach((span) => {
      unwrapElementKeepChildren(span);
    });
  });
}

function convertSpoilersToCustomTag(container: Element): void {
  container
    .querySelectorAll("span.re-spoiler, span[data-re-spoiler]")
    .forEach((span) => {
      const spoiler = document.createElement("re-spoiler");
      while (span.firstChild) {
        spoiler.appendChild(span.firstChild);
      }
      span.replaceWith(spoiler);
    });
}

function convertCustomSpoilersToSpans(container: Element): void {
  container.querySelectorAll("re-spoiler").forEach((el) => {
    const span = document.createElement("span");
    span.className = "re-spoiler";
    span.setAttribute("data-re-spoiler", "");
    while (el.firstChild) {
      span.appendChild(el.firstChild);
    }
    el.replaceWith(span);
  });
}

function stripDecorativeAttributes(container: Element): void {
  container.querySelectorAll("*").forEach((el) => {
    const tag = el.tagName.toLowerCase();
    for (const attr of Array.from(el.attributes)) {
      const name = attr.name.toLowerCase();
      if (KEEP_ATTRS_GLOBAL.has(name)) continue;
      if (name === "style" && tag === "img") {
        // Keep only width from inline style for restore; drop the rest.
        const width = el.getAttribute("width");
        if (width) {
          el.setAttribute("style", `width: ${width}px`);
        } else {
          el.removeAttribute("style");
        }
        continue;
      }
      el.removeAttribute(attr.name);
    }
  });
}

function paragraphIsBlank(p: Element): boolean {
  const text = p.textContent?.replace(/\u00a0/g, " ").trim() ?? "";
  if (text) return false;
  if (p.querySelector("img, video, [data-file-id], re-spoiler")) return false;
  return true;
}

/** Replace <p> siblings with content separated by <br> (Telegram-like). */
function flattenParagraphs(parent: Element): void {
  for (const child of Array.from(parent.children)) {
    const tag = child.tagName.toLowerCase();
    if (tag === "blockquote" || tag === "li") {
      flattenParagraphs(child);
    }
  }

  const out: Node[] = [];
  let afterParagraph = false;

  for (const child of Array.from(parent.childNodes)) {
    if (isElement(child) && child.tagName.toLowerCase() === "p") {
      if (paragraphIsBlank(child)) {
        if (out.length > 0) {
          out.push(document.createElement("br"));
        }
        afterParagraph = true;
        continue;
      }
      if (afterParagraph && out.length > 0) {
        out.push(document.createElement("br"));
      }
      while (child.firstChild) {
        out.push(child.removeChild(child.firstChild));
      }
      afterParagraph = true;
      continue;
    }

    if (isElement(child) && BLOCK_TAGS.has(child.tagName.toLowerCase())) {
      out.push(child);
      afterParagraph = true;
      continue;
    }

    out.push(child);
    afterParagraph = false;
  }

  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  for (const node of out) {
    parent.appendChild(node);
  }
}

function isBlockElement(el: Element): boolean {
  return BLOCK_TAGS.has(el.tagName.toLowerCase());
}

/** Rebuild <p> structure from <br>-separated minimal HTML for Lexical import. */
function expandBreaksToParagraphs(parent: Element): void {
  for (const child of Array.from(parent.children)) {
    const tag = child.tagName.toLowerCase();
    if (tag === "blockquote" || tag === "li") {
      if (!child.querySelector(":scope > p")) {
        expandBreaksToParagraphs(child);
      }
    }
  }

  if (parent.querySelector(":scope > p")) return;

  const snapshot = Array.from(parent.childNodes);
  const rebuilt: Node[] = [];
  let currentP: HTMLParagraphElement | null = null;

  const flushP = () => {
    if (currentP) {
      rebuilt.push(currentP);
      currentP = null;
    }
  };

  const ensureP = () => {
    if (!currentP) {
      currentP = document.createElement("p");
    }
    return currentP;
  };

  for (const child of snapshot) {
    if (isElement(child) && child.tagName.toLowerCase() === "br") {
      flushP();
      continue;
    }
    if (isElement(child) && isBlockElement(child)) {
      flushP();
      rebuilt.push(child);
      continue;
    }
    ensureP().appendChild(child);
  }
  flushP();

  if (rebuilt.length === 0) {
    rebuilt.push(document.createElement("p"));
  }

  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
  for (const node of rebuilt) {
    parent.appendChild(node);
  }
}

/**
 * Compact HTML for persistence: no theme classes, paragraphs → &lt;br&gt;,
 * spoilers as &lt;re-spoiler&gt;, keep only semantic tags + needed data attrs.
 */
export function minimizeStorageHtml(html: string): string {
  const trimmed = html.trim();
  if (!trimmed) return "";

  if (typeof document === "undefined") {
    return trimmed
      .replace(/\s+class="[^"]*"/gi, "")
      .replace(/\s+spellcheck="[^"]*"/gi, "")
      .replace(/\s+contenteditable="[^"]*"/gi, "")
      .replace(
        /<span([^>]*\bre-spoiler\b[^>]*)>([\s\S]*?)<\/span>/gi,
        "<re-spoiler>$2</re-spoiler>",
      );
  }

  const container = document.createElement("div");
  container.innerHTML = trimmed;

  stripHighlightMarkup(container);
  convertSpoilersToCustomTag(container);
  stripDecorativeAttributes(container);
  flattenParagraphs(container);

  return container.innerHTML.trim();
}

/**
 * Expand compact storage HTML back into Lexical-friendly markup
 * (&lt;p&gt; blocks, span.re-spoiler). Accepts legacy classful HTML unchanged.
 */
export function expandStorageHtml(html: string): string {
  const trimmed = html.trim();
  if (!trimmed) return "";

  if (typeof document === "undefined") {
    return trimmed.replace(
      /<re-spoiler>([\s\S]*?)<\/re-spoiler>/gi,
      '<span class="re-spoiler" data-re-spoiler="">$1</span>',
    );
  }

  const container = document.createElement("div");
  container.innerHTML = trimmed;

  convertCustomSpoilersToSpans(container);
  expandBreaksToParagraphs(container);

  return container.innerHTML.trim();
}

/**
 * Re-apply presentation classes for the viewer without changing storage format.
 */
export function decorateViewerHtml(html: string): string {
  const trimmed = html.trim();
  if (!trimmed || typeof document === "undefined") return trimmed;

  const container = document.createElement("div");
  container.innerHTML = trimmed;

  container.querySelectorAll("re-spoiler").forEach((el) => {
    el.classList.add("re-spoiler");
    if (!el.hasAttribute("data-re-spoiler")) {
      el.setAttribute("data-re-spoiler", "");
    }
  });

  container.querySelectorAll("span[data-re-spoiler]").forEach((el) => {
    el.classList.add("re-spoiler");
  });

  container.querySelectorAll("img[data-file-id], img").forEach((el) => {
    el.classList.add("re-image");
  });

  container.querySelectorAll("pre").forEach((el) => {
    el.classList.add("re-block-code");
  });

  container.querySelectorAll("[data-mention-id]").forEach((el) => {
    el.classList.add("re-mention");
  });

  container.querySelectorAll(`a[${"data-file-id"}]`).forEach((el) => {
    el.classList.add("re-file-link");
  });

  return container.innerHTML;
}
