"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginScreen } from "./LoginScreen";
import { ChatSidebar } from "./ChatSidebar";
import { ChatView } from "./ChatView";
import { NewChatDialog } from "./NewChatDialog";
import {
  clearSession,
  getDisplayName,
  getUserId,
} from "@/lib/auth";
import { api } from "@/lib/api";
import { disconnectAll } from "@/lib/realtime";
import {
  getConnectionState,
  startConnectionMonitor,
  subscribeConnection,
} from "@/lib/connection";
import { resetLocalDb, upsertChat } from "@/lib/localDb";
import { refreshChatsFromApi } from "@/lib/syncEngine";
import { useLocalChats } from "@/lib/useLocalDb";
import type { Chat } from "@/lib/types";

export function MessengerApp() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[100dvh] items-center justify-center text-tg-muted">
          Загрузка…
        </div>
      }
    >
      <MessengerShell />
    </Suspense>
  );
}

function MessengerShell() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chat");

  const [ready, setReady] = useState(false);
  const { chats, reload: reloadChats } = useLocalChats();
  const [chatsLoading, setChatsLoading] = useState(false);
  const [sidebarSearch, setSidebarSearch] = useState("");
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [connState, setConnState] = useState(getConnectionState);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    setReady(!!getUserId());
  }, []);

  useEffect(() => {
    if (!ready) return;
    return startConnectionMonitor();
  }, [ready]);

  useEffect(() => subscribeConnection(setConnState), []);

  const loadChats = useCallback(async () => {
    setChatsLoading(true);
    try {
      await refreshChatsFromApi();
      await reloadChats();
    } finally {
      setChatsLoading(false);
    }
  }, [reloadChats]);

  useEffect(() => {
    if (ready) void loadChats();
  }, [ready, loadChats]);

  useEffect(() => {
    if (!chatId || !ready) {
      setActiveChat(null);
      return;
    }
    const found = chats.find((c) => c.id === chatId);
    if (found) {
      setActiveChat(found);
      return;
    }
    void api.getChat(chatId).then(async (c) => {
      await upsertChat(c);
      await reloadChats();
      setActiveChat(c);
    }).catch(() => setActiveChat(null));
  }, [chatId, chats, ready, reloadChats]);

  function selectChat(id: string) {
    router.push(`/?chat=${encodeURIComponent(id)}`, { scroll: false });
  }

  async function handleLogout() {
    disconnectAll();
    await resetLocalDb();
    clearSession();
    setReady(false);
    router.push("/", { scroll: false });
  }

  if (!ready) {
    return <LoginScreen onReady={() => setReady(true)} />;
  }

  const displayName = getDisplayName() ?? "User";
  const showChatOnMobile = !!chatId;

  const statusLabel =
    connState === "syncing"
      ? "Синхронизация…"
      : connState === "offline"
        ? "Офлайн"
        : "В сети";

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <div
        className={`h-full shrink-0 ${
          showChatOnMobile ? "hidden md:flex" : "flex w-full md:w-auto"
        }`}
      >
        <ChatSidebar
          chats={chats}
          selectedId={chatId}
          loading={chatsLoading}
          search={sidebarSearch}
          onSearchChange={setSidebarSearch}
          onSelect={selectChat}
          onNewChat={() => setNewChatOpen(true)}
          displayName={displayName}
          connectionLabel={statusLabel}
          onLogout={() => void handleLogout()}
          theme={theme}
          onToggleTheme={() =>
            setTheme((t) => (t === "dark" ? "light" : "dark"))
          }
        />
      </div>

      <div
        className={`min-w-0 flex-1 ${
          showChatOnMobile ? "flex" : "hidden md:flex"
        }`}
      >
        {chatId ? (
          <ChatView
            chatId={chatId}
            chat={activeChat}
            onBack={() => router.push("/", { scroll: false })}
          />
        ) : (
          <EmptyState />
        )}
      </div>

      <NewChatDialog
        open={newChatOpen}
        onClose={() => setNewChatOpen(false)}
        onCreated={(id) => {
          void loadChats();
          selectChat(id);
        }}
      />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-4 bg-tg-panel p-8 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-tg-accent/10 text-4xl">
        💬
      </div>
      <div>
        <h2 className="text-xl font-semibold">Smart Messenger</h2>
        <p className="mt-2 max-w-sm text-tg-muted">
          Выберите чат слева или создайте новый — переписка в реальном времени
        </p>
      </div>
    </div>
  );
}
