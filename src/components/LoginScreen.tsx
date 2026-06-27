"use client";

import { useState } from "react";
import { createUserId, saveSession } from "@/lib/auth";
import { api } from "@/lib/api";

type Props = {
  onReady: () => void;
};

export function LoginScreen({ onReady }: Props) {
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = displayName.trim();
    if (!name) {
      setError("Введите имя");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const userId = createUserId();
      saveSession(userId, name);
      await api.me();
      onReady();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-tg-bg">
      <div className="w-full max-w-md animate-fade-in">
        <div className="rounded-3xl border border-tg-border bg-tg-sidebar p-8 shadow-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-tg-accent text-2xl font-bold text-white shadow-lg shadow-tg-accent/30">
            SM
          </div>
          <h1 className="text-center text-2xl font-semibold tracking-tight">
            Smart Messenger
          </h1>
          <p className="mt-2 text-center text-sm text-tg-muted">
            Введите имя — для dev-режима создаётся локальный профиль
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm text-tg-muted">Имя</span>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Как вас называть в чатах"
                className="w-full rounded-xl border border-tg-border bg-tg-input px-4 py-3 text-tg-text outline-none transition focus:ring-2 focus:ring-tg-accent"
                autoFocus
              />
            </label>
            {error && (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-tg-accent py-3 font-medium text-white transition hover:bg-tg-accentHover disabled:opacity-60"
            >
              {loading ? "Подключение…" : "Начать"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
