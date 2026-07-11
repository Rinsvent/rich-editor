"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

type LinkUiContextValue = {
  openLinkDialog: () => void;
};

const LinkUiContext = createContext<LinkUiContextValue | null>(null);

export function LinkUiProvider({
  openLinkDialog,
  children,
}: {
  openLinkDialog: () => void;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ openLinkDialog }), [openLinkDialog]);
  return (
    <LinkUiContext.Provider value={value}>{children}</LinkUiContext.Provider>
  );
}

export function useLinkUi(): LinkUiContextValue {
  const ctx = useContext(LinkUiContext);
  if (!ctx) {
    throw new Error("useLinkUi must be used within LinkUiProvider");
  }
  return ctx;
}

export function useLinkUiOptional(): LinkUiContextValue | null {
  return useContext(LinkUiContext);
}
