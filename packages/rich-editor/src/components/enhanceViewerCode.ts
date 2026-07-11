import { copyTextToClipboard } from "../core/clipboard";
import type { ViewerLabels } from "../core/features";

function collectCodeBlocks(root: HTMLElement): Element[] {
  const blocks: Element[] = [];
  root.querySelectorAll("pre").forEach((pre) => blocks.push(pre));
  root
    .querySelectorAll("code.re-block-code, .re-block-code")
    .forEach((code) => {
      if (!code.closest("pre")) blocks.push(code);
    });
  return blocks;
}

function getCodeElement(block: Element): HTMLElement {
  if (block instanceof HTMLPreElement) {
    return block.querySelector("code") ?? block;
  }
  return block as HTMLElement;
}

function getCodeText(element: HTMLElement): string {
  return element.dataset.code ?? element.textContent ?? "";
}

function ensureWrapped(block: Element): HTMLElement {
  const existing = block.closest(".re-code-block-wrap");
  if (existing instanceof HTMLElement) return existing;

  const wrap = document.createElement("div");
  wrap.className = "re-code-block-wrap";
  block.parentNode?.insertBefore(wrap, block);
  wrap.appendChild(block);
  return wrap;
}

function createCopyButton(labels: ViewerLabels): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "re-code-copy-btn";
  button.setAttribute("aria-label", labels.copyCode);
  button.title = labels.copyCode;
  button.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
  return button;
}

function flashCopied(button: HTMLButtonElement, labels: ViewerLabels): void {
  const previous = button.title;
  button.classList.add("re-code-copy-btn-copied");
  button.title = labels.copiedCode;
  window.setTimeout(() => {
    button.classList.remove("re-code-copy-btn-copied");
    button.title = previous;
  }, 1500);
}

/** Enhance viewer code blocks with copy-on-click and a copy button. */
export function enhanceViewerCodeBlocks(
  root: HTMLElement | null,
  labels: ViewerLabels,
): () => void {
  if (!root) return () => {};

  const cleanups: Array<() => void> = [];

  collectCodeBlocks(root).forEach((block) => {
    const codeElement = getCodeElement(block);
    const wrap = ensureWrapped(block);

    let button = wrap.querySelector<HTMLButtonElement>(".re-code-copy-btn");
    if (!button) {
      button = createCopyButton(labels);
      wrap.appendChild(button);
    }

    const copy = async () => {
      const copied = await copyTextToClipboard(getCodeText(codeElement));
      if (copied) flashCopied(button!, labels);
    };

    const onButtonClick = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      void copy();
    };

    const onCodeClick = (event: MouseEvent) => {
      event.preventDefault();
      void copy();
    };

    button.addEventListener("click", onButtonClick);
    codeElement.addEventListener("click", onCodeClick);
    codeElement.classList.add("re-code-copyable");

    cleanups.push(() => {
      button?.removeEventListener("click", onButtonClick);
      codeElement.removeEventListener("click", onCodeClick);
      codeElement.classList.remove("re-code-copyable");
    });
  });

  return () => {
    for (const cleanup of cleanups) cleanup();
  };
}
