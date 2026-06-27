"use client";

import { useState } from "react";
import { api } from "@/lib/api";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (chatId: string) => void;
};

export function NewChatDialog({ open, onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) {
      setError("Введите название чата");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const chat = await api.createChat(t);
      setTitle("");
      onCreated(chat.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось создать чат");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md animate-fade-in rounded-2xl border border-tg-border bg-tg-sidebar p-6 shadow-2xl">
        <h2 className="text-lg font-semibold">Новый чат</h2>
        <form onSubmit={handleCreate} className="mt-4 space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название"
            className="w-full rounded-xl border border-tg-border bg-tg-input px-4 py-3 outline-none focus:ring-2 focus:ring-tg-accent"
            autoFocus
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-tg-muted hover:bg-tg-hover"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-tg-accent px-4 py-2 font-medium text-white hover:bg-tg-accentHover disabled:opacity-60"
            >
              Создать
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
