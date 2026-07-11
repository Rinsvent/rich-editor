import type { HLJSApi } from "highlight.js";

const HLJS_LANGUAGE_ALIASES: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  py: "python",
  md: "markdown",
  sh: "bash",
  shell: "bash",
  text: "plaintext",
  plain: "plaintext",
};

let hljsInstance: HLJSApi | null = null;
let hljsInit: Promise<HLJSApi> | null = null;
const loadingLanguages = new Map<string, Promise<string>>();

export function normalizeHljsLanguage(language: string | undefined): string {
  if (!language) return "plaintext";
  const normalized = language.trim().toLowerCase();
  return HLJS_LANGUAGE_ALIASES[normalized] ?? normalized;
}

export function getHljsSync(): HLJSApi | null {
  return hljsInstance;
}

export async function getHljs(): Promise<HLJSApi> {
  if (hljsInstance) return hljsInstance;
  if (!hljsInit) {
    hljsInit = import("highlight.js/lib/core").then(async (mod) => {
      hljsInstance = mod.default;
      await loadHljsLanguage("plaintext");
      return hljsInstance;
    });
  }
  return hljsInit;
}

export function isHljsLanguageLoaded(language: string): boolean {
  const hljs = getHljsSync();
  if (!hljs) return normalizeHljsLanguage(language) === "plaintext";
  return !!hljs.getLanguage(normalizeHljsLanguage(language));
}

export async function loadHljsLanguage(language: string): Promise<string> {
  const hljs = await getHljs();
  const id = normalizeHljsLanguage(language);

  if (hljs.getLanguage(id)) return id;

  const pending = loadingLanguages.get(id);
  if (pending) return pending;

  const loadPromise = (async () => {
    try {
      const mod = await import(
        /* @vite-ignore */
        `highlight.js/lib/languages/${id}`
      );
      hljs.registerLanguage(id, mod.default);
      return id;
    } catch {
      if (!hljs.getLanguage("plaintext")) {
        const plain = await import("highlight.js/lib/languages/plaintext");
        hljs.registerLanguage("plaintext", plain.default);
      }
      return "plaintext";
    } finally {
      loadingLanguages.delete(id);
    }
  })();

  loadingLanguages.set(id, loadPromise);
  return loadPromise;
}

export async function ensureHljsLanguages(
  languages: Iterable<string>,
): Promise<void> {
  await Promise.all([...new Set(languages)].map((lang) => loadHljsLanguage(lang)));
}

export function resolveHljsLanguage(
  hljs: HLJSApi,
  language: string,
): string {
  const id = normalizeHljsLanguage(language);
  return hljs.getLanguage(id) ? id : "plaintext";
}
