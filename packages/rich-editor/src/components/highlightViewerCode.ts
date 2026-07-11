import {
  ensureHljsLanguages,
  getHljs,
  loadHljsLanguage,
  resolveHljsLanguage,
} from "../core/hljsRuntime";

function detectLanguage(element: HTMLElement): string {
  const dataLanguage = element.getAttribute("data-language");
  if (dataLanguage) return dataLanguage;

  const languageClass = [...element.classList].find((name) =>
    name.startsWith("language-"),
  );
  if (languageClass) return languageClass.slice("language-".length);

  return "plaintext";
}

/** Client-only syntax highlighting for viewer code blocks. */
export async function highlightViewerCodeBlocks(
  root: HTMLElement | null,
): Promise<void> {
  if (!root) return;

  const blocks = root.querySelectorAll<HTMLElement>(
    "pre code, code.re-block-code, .re-block-code",
  );

  const needsHighlight = [...blocks].filter(
    (el) => el.querySelector(".token, .hljs") === null,
  );
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

  root.querySelectorAll<HTMLElement>(
    "pre code, code.re-block-code, .re-block-code",
  ).forEach((el) => {
    if (!el.dataset.code) {
      el.dataset.code = el.textContent ?? "";
    }
  });
}
