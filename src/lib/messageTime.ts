import {
  parseUuidBytes,
  sortableToRFC,
} from "./uuidBytes";

/** UUID epoch offset: 100-ns intervals from 1582-10-15 to Unix epoch. */
const UUID_EPOCH_100NS = BigInt("0x01b21dd213814000");

/** Extract Unix ms from sortable hex (32 chars) or dashed UUID v1. */
export function timestampMsFromMessageId(id: string): number | null {
  const raw = parseUuidBytes(id);
  if (!raw) return null;

  const rfc = id.includes("-") ? raw : sortableToRFC(raw);

  const timeLow =
    ((rfc[0] << 24) >>> 0) |
    ((rfc[1] << 16) >>> 0) |
    ((rfc[2] << 8) >>> 0) |
    rfc[3];
  const timeMid = (rfc[4] << 8) | rfc[5];
  const timeHi = (rfc[6] << 8) | rfc[7];

  const ts100ns =
    (BigInt(timeHi & 0x0fff) << BigInt(48)) |
    (BigInt(timeMid) << BigInt(32)) |
    BigInt(timeLow >>> 0);

  const unixMs = Number((ts100ns - UUID_EPOCH_100NS) / BigInt(10000));
  if (!Number.isFinite(unixMs) || unixMs <= 0) return null;
  return unixMs;
}

export function formatMessageTime(id: string): string {
  const ms = timestampMsFromMessageId(id);
  if (ms === null) return "";
  return formatTimeFromMs(ms);
}

export function formatTimeFromMs(ms: number): string {
  return new Date(ms).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function calendarDayKey(ms: number): string {
  const d = new Date(ms);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Centered label for day separator between message groups. */
export function formatDaySeparator(ms: number): string {
  const d = new Date(ms);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameCalendarDay(d, today)) return "Сегодня";
  if (isSameCalendarDay(d, yesterday)) return "Вчера";

  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
  };
  if (d.getFullYear() !== today.getFullYear()) {
    return d.toLocaleDateString("ru-RU", { ...opts, year: "numeric" });
  }
  return d.toLocaleDateString("ru-RU", opts);
}
