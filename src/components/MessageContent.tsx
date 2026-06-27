"use client";

import { useEffect, useRef } from "react";
import hljs from "highlight.js/lib/core";
import go from "highlight.js/lib/languages/go";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import plaintext from "highlight.js/lib/languages/plaintext";
import typescript from "highlight.js/lib/languages/typescript";
import "highlight.js/styles/github-dark.min.css";
import { isHtmlContent, sanitizeMessageHtml } from "@/lib/contentHtml";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("js", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("ts", typescript);
hljs.registerLanguage("go", go);
hljs.registerLanguage("json", json);
hljs.registerLanguage("plaintext", plaintext);

type Props = {
  content: string;
};

export function MessageContent({ content }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.querySelectorAll("pre code").forEach((el) => {
      hljs.highlightElement(el as HTMLElement);
    });
  }, [content]);

  if (!isHtmlContent(content)) {
    return (
      <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
        {content}
      </p>
    );
  }

  return (
    <div
      ref={ref}
      className="message-content text-[15px] leading-relaxed break-words"
      dangerouslySetInnerHTML={{ __html: sanitizeMessageHtml(content) }}
    />
  );
}
