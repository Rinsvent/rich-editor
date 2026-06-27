"use client";

import { useEffect, useState } from "react";
import type { Chat } from "@/lib/types";
import type { LocalChat } from "@/lib/localDb";
import { DB_CHANGE, listMessagesForChat } from "@/lib/localDb";
import { unreadCountForChat } from "@/lib/unread";
import { Avatar } from "./Avatar";
import { cn, chatTitle } from "@/lib/utils";

type Props = {
  chats: LocalChat[];
  selectedId: string | null;
  loading: boolean;
  search: string;
  onSearchChange: (v: string) => void;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  displayName: string;
  connectionLabel: string;
  onLogout: () => void;
  theme: "dark" | "light";
  onToggleTheme: () => void;
};

export function ChatSidebar({
  chats,
  selectedId,
  loading,
  search,
  onSearchChange,
  onSelect,
  onNewChat,
  displayName,
  connectionLabel,
  onLogout,
  theme,
  onToggleTheme,
}: Props) {
  const q = search.trim().toLowerCase();
  const list = chats ?? [];
  const filtered = q
    ? list.filter((c) => c.title.toLowerCase().includes(q))
    : list;

  const unread = useUnreadCounts(list);

  return (
    <aside className="flex h-full w-full flex-col border-r border-tg-border bg-tg-sidebar md:w-[360px] md:min-w-[360px]">
      <header className="flex items-center gap-3 border-b border-tg-border px-4 py-3">
        <Avatar name={displayName} size="md" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{displayName}</p>
          <p className="text-xs text-tg-muted">{connectionLabel}</p>
        </div>
        <button
          type="button"
          onClick={onToggleTheme}
          className="rounded-lg p-2 text-tg-muted hover:bg-tg-hover"
          title="Тема"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-lg p-2 text-tg-muted hover:bg-tg-hover"
          title="Выйти"
        >
          ⎋
        </button>
      </header>

      <div className="p-3">
        <div className="relative">
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск"
            className="w-full rounded-xl border border-tg-border bg-tg-input py-2.5 pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-tg-accent"
          />
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tg-muted">
            🔍
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 pb-2">
        <span className="text-xs font-medium uppercase tracking-wide text-tg-accent">
          Чаты
        </span>
        <button
          type="button"
          onClick={onNewChat}
          className="rounded-lg px-2 py-1 text-sm text-tg-accent hover:bg-tg-hover"
        >
          + Новый
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-2">
        {loading && (
          <p className="px-3 py-4 text-sm text-tg-muted">Загрузка…</p>
        )}
        {!loading && filtered.length === 0 && (
          <p className="px-3 py-4 text-sm text-tg-muted">
            {q ? "Ничего не найдено" : "Создайте первый чат"}
          </p>
        )}
        <ul className="space-y-0.5">
          {filtered.map((chat) => {
            const n = unread[chat.id] ?? 0;
            return (
              <li key={chat.id}>
                <button
                  type="button"
                  onClick={() => onSelect(chat.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
                    selectedId === chat.id
                      ? "bg-tg-accent/15"
                      : "hover:bg-tg-hover",
                  )}
                >
                  <Avatar
                    name={chatTitle(chat.title, chat.id)}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {chatTitle(chat.title, "Без названия")}
                    </p>
                    <p className="truncate text-xs text-tg-muted">
                      {chat.type}
                    </p>
                  </div>
                  {n > 0 && (
                    <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-tg-accent px-1.5 text-xs font-semibold text-white">
                      {n > 99 ? "99+" : n}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

function useUnreadCounts(chats: Chat[]): Record<string, number> {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      const next: Record<string, number> = {};
      await Promise.all(
        chats.map(async (c) => {
          const messages = await listMessagesForChat(c.id);
          next[c.id] = unreadCountForChat(
            c.id,
            c.last_view_at,
            messages,
          );
        }),
      );
      if (!cancelled) setCounts(next);
    }

    void refresh();
    const onChange = () => void refresh();
    window.addEventListener(DB_CHANGE, onChange);
    return () => {
      cancelled = true;
      window.removeEventListener(DB_CHANGE, onChange);
    };
  }, [chats]);

  return counts;
}
