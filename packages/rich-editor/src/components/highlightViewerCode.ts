/** Client-only syntax highlighting for viewer code blocks. */
export async function highlightViewerCodeBlocks(
  root: HTMLElement | null,
): Promise<void> {
  if (!root) return;

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

  root.querySelectorAll("pre code").forEach((el) => {
    hljs.highlightElement(el as HTMLElement);
  });
}
