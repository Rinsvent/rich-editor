import {
  ensureHljsLanguages,
  getHljs,
  loadHljsLanguage,
  resolveHljsLanguage,
} from "../core/hljsRuntime";

function isAlreadyHighlighted(element: HTMLElement): boolean {
  if (element.classList.contains("hljs")) return true;
  return (
    element.querySelector(
      ".token, .hljs, [class*='hljs-']",
    ) !== null
  );
}

function detectLanguage(element: HTMLElement): string {
  const dataLanguage = element.getAttribute("data-language");
  if (dataLanguage) return dataLanguage;

  const languageClass = [...element.classList].find((name) =>
    name.startsWith("language-"),
  );
  if (languageClass) return languageClass.slice("language-".length);

  return "plaintext";
}

function collectHighlightTargets(root: HTMLElement): HTMLElement[] {
  const result: HTMLElement[] = [];
  root.querySelectorAll("pre").forEach((pre) => {
    const code = pre.querySelector("code");
    result.push(code instanceof HTMLElement ? code : pre);
  });
  root.querySelectorAll("code.re-block-code").forEach((code) => {
    if (!(code instanceof HTMLElement)) return;
    if (code.closest("pre")) return;
    result.push(code);
  });
  return result;
}

/** Client-only syntax highlighting for viewer code blocks. */
export async function highlightViewerCodeBlocks(
  root: HTMLElement | null,
): Promise<void> {
  if (!root) return;

  const blocks = collectHighlightTargets(root);

  const needsHighlight = blocks.filter((el) => !isAlreadyHighlighted(el));
  if (needsHighlight.length === 0) return;

  const languages = needsHighlight.map((el) => detectLanguage(el));
  await ensureHljsLanguages(languages);

  const hljs = await getHljs();

  for (const el of needsHighlight) {
    const text = el.textContent ?? "";
    if (!text.trim()) continue;

    el.dataset.code = text;
    const language = resolveHljsLanguage(hljs, detectLanguage(el));
    const result = hljs.highlight(text, { language });

    el.innerHTML = result.value;
    el.classList.add("hljs");
    el.setAttribute("data-language", language);
  }
}

/** Store raw code text on blocks that are already highlighted (e.g. from editor). */
export function storeViewerCodeText(root: HTMLElement | null): void {
  if (!root) return;

  collectHighlightTargets(root).forEach((el) => {
    if (!el.dataset.code) {
      el.dataset.code = el.textContent ?? "";
    }
  });
}
