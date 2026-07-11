"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import type { EditorAttachment } from "../core/attachments";
import type { EditorLabels, EditorFeatures } from "../core/features";
import type { FormatActions } from "../components/toolbar/useFormatState";

export type FormatState = {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  code: boolean;
  quote: boolean;
  codeBlock: boolean;
  bulletList: boolean;
  numberedList: boolean;
  link: boolean;
  heading: boolean;
  spoiler: boolean;
};

export type RichTextEditorContextValue = {
  getHtml: () => string;
  setHtml: (html: string) => void;
  clear: () => void;
  focus: () => void;
  submit: () => void;
  isEmpty: boolean;
  attachments: EditorAttachment[];
  hasReadyAttachments: boolean;
  formatState: FormatState;
  format: FormatActions;
  disabled: boolean;
  features: EditorFeatures;
  labels: EditorLabels;
};

const RichTextEditorContext = createContext<RichTextEditorContextValue | null>(
  null,
);

export function RichTextEditorProvider({
  value,
  children,
}: {
  value: RichTextEditorContextValue;
  children: ReactNode;
}) {
  return (
    <RichTextEditorContext.Provider value={value}>
      {children}
    </RichTextEditorContext.Provider>
  );
}

export function useRichTextEditor(): RichTextEditorContextValue {
  const ctx = useContext(RichTextEditorContext);
  if (!ctx) {
    throw new Error("useRichTextEditor must be used within RichTextEditor");
  }
  return ctx;
}

export function useRichTextEditorOptional(): RichTextEditorContextValue | null {
  return useContext(RichTextEditorContext);
}
