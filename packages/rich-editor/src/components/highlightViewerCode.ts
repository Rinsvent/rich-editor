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

  const [hljsModule, javascript, typescript, json, plaintext] =
    await Promise.all([
      import("highlight.js/lib/core"),
      import("highlight.js/lib/languages/javascript"),
      import("highlight.js/lib/languages/typescript"),
      import("highlight.js/lib/languages/json"),
      import("highlight.js/lib/languages/plaintext"),
    ]);

  const hljs = hljsModule.default;
  hljs.registerLanguage("javascript", javascript.default);
  hljs.registerLanguage("js", javascript.default);
  hljs.registerLanguage("typescript", typescript.default);
  hljs.registerLanguage("ts", typescript.default);
  hljs.registerLanguage("json", json.default);
  hljs.registerLanguage("plaintext", plaintext.default);

  for (const el of needsHighlight) {
    const text = el.textContent ?? "";
    if (!text.trim()) continue;

    const languageClass = [...el.classList].find((name) =>
      name.startsWith("language-"),
    );
    const language = languageClass?.slice("language-".length) ?? "plaintext";
    const result = hljs.highlight(text, {
      language: hljs.getLanguage(language) ? language : "plaintext",
    });

    el.innerHTML = result.value;
    el.classList.add("hljs");
  }
}
