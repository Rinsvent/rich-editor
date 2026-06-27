"use client";

import { useCallback, useEffect, useState } from "react";
import type { ScheduledMessage } from "@/lib/types";
import { api } from "@/lib/api";
import { formatScheduleDisplay } from "@/lib/scheduledTime";
import { plainTextFromHtml } from "@/lib/contentHtml";
import { cn } from "@/lib/utils";

type Props = {
  chatId: string;
  open: boolean;
  selectedId: string | null;
  onClose: () => void;
  onSelect: (item: ScheduledMessage) => void;
  onReschedule: (item: ScheduledMessage) => void;
  onChanged: () => void;
};

export function ScheduledMessagesPanel({
  chatId,
  open,
  selectedId,
  onClose,
  onSelect,
  onReschedule,
  onChanged,
}: Props) {
  const [items, setItems] = useState<ScheduledMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { items: list } = await api.listScheduled(chatId);
      setItems(list);
    } finally {
      setLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  async function remove(id: string) {
    await api.deleteScheduled(id);
    await load();
    onChanged();
  }

  if (!open) return null;

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-tg-panel">
      <div className="flex items-start justify-between gap-3 border-b border-tg-border px-4 py-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold">Отложенные сообщения</h3>
          <p className="mt-1 text-xs text-tg-muted">
            Выберите сообщение — оно откроется в редакторе внизу
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg p-2 text-tg-muted hover:bg-tg-hover hover:text-tg-text"
          aria-label="Закрыть"
          title="Закрыть"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
        {loading && (
          <p className="text-sm text-tg-muted">Загрузка…</p>
        )}
        {!loading && items.length === 0 && (
          <p className="text-sm text-tg-muted">Нет отложенных сообщений</p>
        )}
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="group">
              <div
                className={cn(
                  "flex items-center gap-2 rounded-xl border p-3 transition",
                  selectedId === item.id
                    ? "border-tg-accent bg-tg-accent/10"
                    : "border-tg-border bg-tg-sidebar hover:bg-tg-hover",
                )}
              >
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  className="min-w-0 flex-1 text-left"
                >
                  <p className="text-xs font-medium text-tg-accent">
                    {formatScheduleDisplay(item.send_at)}
                  </p>
                  <p className="mt-1 line-clamp-3 text-sm text-tg-text">
                    {plainTextFromHtml(item.content) || "…"}
                  </p>
                </button>
                <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                  <IconButton
                    label="Изменить время"
                    onClick={() => onReschedule(item)}
                  >
                    <ClockIcon />
                  </IconButton>
                  <IconButton
                    label="Удалить"
                    onClick={() => void remove(item.id)}
                  >
                    <TrashIcon />
                  </IconButton>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="rounded-lg p-2 text-tg-muted hover:bg-tg-panel hover:text-tg-text"
    >
      {children}
    </button>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 7h16M9 7V5h6v2M7 7l1 12h8l1-12" />
    </svg>
  );
}
