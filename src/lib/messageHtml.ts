/** Normalize Lexical HTML export to our API subset (b/i, no nested duplicates). */
export function normalizeMessageHtml(html: string): string {
  if (typeof document === "undefined") {
    return html
      .replace(/<\/?strong\b[^>]*>/gi, (tag) => (tag.startsWith("</") ? "</b>" : "<b>"))
      .replace(/<\/?em\b[^>]*>/gi, (tag) => (tag.startsWith("</") ? "</i>" : "<i>"));
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

  container.querySelectorAll("code span").forEach((span) => {
    const code = span.parentElement;
    if (!code) return;
    while (span.firstChild) {
      code.insertBefore(span.firstChild, span);
    }
    span.remove();
  });

  flattenTag(container, "b");
  flattenTag(container, "i");

  return container.innerHTML.trim();
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
