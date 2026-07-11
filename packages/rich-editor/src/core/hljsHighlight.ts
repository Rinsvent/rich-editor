import { $createCodeHighlightNode, type CodeNode } from "@lexical/code";
import {
  $createLineBreakNode,
  $createTabNode,
  type LexicalNode,
} from "lexical";
import {
  getHljsSync,
  loadHljsLanguage,
  resolveHljsLanguage,
} from "./hljsRuntime";

const HLJS_CLASS_TO_TOKEN: Record<string, string> = {
  "hljs-keyword": "keyword",
  "hljs-built_in": "builtin",
  "hljs-type": "type",
  "hljs-literal": "literal",
  "hljs-number": "number",
  "hljs-string": "string",
  "hljs-regexp": "regex",
  "hljs-symbol": "symbol",
  "hljs-comment": "comment",
  "hljs-doctag": "doctype",
  "hljs-meta": "meta",
  "hljs-title": "title",
  "hljs-section": "section",
  "hljs-name": "name",
  "hljs-class": "class-name",
  "hljs-function": "function",
  "hljs-params": "params",
  "hljs-attr": "attr",
  "hljs-attribute": "attr-name",
  "hljs-variable": "variable",
  "hljs-template-variable": "variable",
  "hljs-selector-tag": "tag",
  "hljs-selector-id": "id",
  "hljs-selector-class": "class",
  "hljs-selector-attr": "attr-name",
  "hljs-selector-pseudo": "pseudo-class",
  "hljs-addition": "inserted",
  "hljs-deletion": "deleted",
};

function appendTextWithBreaks(
  nodes: LexicalNode[],
  text: string,
  tokenType?: string,
): void {
  const parts = text.split(/(\n|\t)/);
  for (const part of parts) {
    if (!part) continue;
    if (part === "\n" || part === "\r\n") {
      nodes.push($createLineBreakNode());
      continue;
    }
    if (part === "\t") {
      nodes.push($createTabNode());
      continue;
    }
    nodes.push($createCodeHighlightNode(part, tokenType));
  }
}

function walkHighlightDom(
  nodes: LexicalNode[],
  node: Node,
  tokenType?: string,
): void {
  if (node.nodeType === Node.TEXT_NODE) {
    appendTextWithBreaks(nodes, node.textContent ?? "", tokenType);
    return;
  }

  if (!(node instanceof HTMLElement)) return;

  if (node.tagName === "BR") {
    nodes.push($createLineBreakNode());
    return;
  }

  const hljsClass = [...node.classList].find((name) => name.startsWith("hljs-"));
  const nextType = hljsClass
    ? (HLJS_CLASS_TO_TOKEN[hljsClass] ?? tokenType)
    : tokenType;

  for (const child of node.childNodes) {
    walkHighlightDom(nodes, child, nextType);
  }
}

export function highlightHtmlToNodes(html: string): LexicalNode[] {
  const container = document.createElement("div");
  container.innerHTML = html;
  const nodes: LexicalNode[] = [];
  for (const child of container.childNodes) {
    walkHighlightDom(nodes, child);
  }
  return nodes;
}

export function getPlainCodeNodes(code: string): LexicalNode[] {
  const nodes: LexicalNode[] = [];
  appendTextWithBreaks(nodes, code);
  return nodes;
}

export function getHljsHighlightNodes(
  codeNode: CodeNode,
  language: string,
): LexicalNode[] {
  const hljs = getHljsSync();
  const code = codeNode.getTextContent();
  if (!hljs || !code) return getPlainCodeNodes(code);

  const lang = resolveHljsLanguage(hljs, language);
  try {
    const { value } = hljs.highlight(code, { language: lang });
    return highlightHtmlToNodes(value);
  } catch {
    return getPlainCodeNodes(code);
  }
}

export async function preloadHljsLanguage(language: string): Promise<void> {
  await loadHljsLanguage(language);
}
