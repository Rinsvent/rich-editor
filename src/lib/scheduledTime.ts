const MIN_LEAD_MS = 60_000;
const MAX_HORIZON_MS = 2 * 365 * 24 * 60 * 60 * 1000;

export function newScheduledId(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

export function minScheduleDateValue(): string {
  const d = new Date(Date.now() + MIN_LEAD_MS);
  return toDateValue(d);
}

export function maxScheduleDateValue(): string {
  return toDateValue(new Date(Date.now() + MAX_HORIZON_MS));
}

export function defaultScheduleDateValue(): string {
  const d = new Date(Date.now() + MIN_LEAD_MS);
  return toDateValue(d);
}

export function defaultScheduleTimeValue(): string {
  const d = new Date(Date.now() + MIN_LEAD_MS);
  return toTimeValue(d);
}

export function combineDateAndTime(dateStr: string, timeStr: string): Date | null {
  if (!dateStr || !timeStr) return null;
  const d = new Date(`${dateStr}T${timeStr}`);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

export function splitScheduleDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return { date: toDateValue(d), time: toTimeValue(d) };
}

export function validateScheduleTime(d: Date): string | null {
  const now = Date.now();
  const t = d.getTime();
  if (t < now + MIN_LEAD_MS) {
    return "Время отправки — не раньше чем через 1 минуту";
  }
  if (t > now + MAX_HORIZON_MS) {
    return "Не более чем на 2 года вперёд";
  }
  return null;
}

export function formatScheduleDisplay(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toDateValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function toTimeValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
