"use client";

import { useEffect, useState } from "react";
import {
  combineDateAndTime,
  defaultScheduleDateValue,
  defaultScheduleTimeValue,
  maxScheduleDateValue,
  minScheduleDateValue,
  splitScheduleDateTime,
  validateScheduleTime,
} from "@/lib/scheduledTime";

type Props = {
  open: boolean;
  title: string;
  initialSendAt?: string;
  externalError?: string | null;
  onClose: () => void;
  onConfirm: (sendAt: Date) => void | boolean | Promise<void | boolean>;
};

export function SchedulePickerModal({
  open,
  title,
  initialSendAt,
  externalError,
  onClose,
  onConfirm,
}: Props) {
  const [date, setDate] = useState(defaultScheduleDateValue());
  const [time, setTime] = useState(defaultScheduleTimeValue());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (initialSendAt) {
      const parts = splitScheduleDateTime(initialSendAt);
      setDate(parts.date);
      setTime(parts.time);
    } else {
      setDate(defaultScheduleDateValue());
      setTime(defaultScheduleTimeValue());
    }
    setError(null);
  }, [open, initialSendAt]);

  if (!open) return null;

  async function handleConfirm() {
    const at = combineDateAndTime(date, time);
    if (!at) {
      setError("Укажите дату и время");
      return;
    }
    const err = validateScheduleTime(at);
    if (err) {
      setError(err);
      return;
    }
    const result = await onConfirm(at);
    if (result !== false) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-xl border border-tg-border bg-tg-panel p-5 shadow-xl">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="mt-4 space-y-3">
          <label className="block text-sm text-tg-muted">
            День
            <input
              type="date"
              value={date}
              min={minScheduleDateValue()}
              max={maxScheduleDateValue()}
              onChange={(e) => {
                setDate(e.target.value);
                setError(null);
              }}
              className="mt-1 w-full rounded-lg border border-tg-border bg-tg-input px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm text-tg-muted">
            Время
            <input
              type="time"
              value={time}
              onChange={(e) => {
                setTime(e.target.value);
                setError(null);
              }}
              className="mt-1 w-full rounded-lg border border-tg-border bg-tg-input px-3 py-2 text-sm"
            />
          </label>
          {(error || externalError) && (
            <p className="text-sm text-red-400">{error ?? externalError}</p>
          )}
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-tg-muted hover:bg-tg-hover"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-lg bg-tg-accent px-4 py-2 text-sm font-medium text-white hover:bg-tg-accentHover"
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  );
}
