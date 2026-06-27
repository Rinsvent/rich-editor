import type { Message } from "@/lib/types";
import { resolveAuthorDisplay } from "@/lib/authorDisplay";
import { formatReplyCount } from "@/lib/thread";
import { cn } from "@/lib/utils";
import { Avatar } from "./Avatar";
import { MessageContent } from "./MessageContent";

type Props = {
  message: Message;
  currentUserId: string;
  selfDisplayName?: string | null;
  showAvatar: boolean;
  showAuthorName: boolean;
  timeLabel: string;
  onOpenThread?: (message: Message) => void;
  replyCount?: number;
};

export function MessageBubble({
  message,
  currentUserId,
  selfDisplayName,
  showAvatar,
  showAuthorName,
  timeLabel,
  onOpenThread,
  replyCount = 0,
}: Props) {
  const { label: authorLabel, avatarName } = resolveAuthorDisplay(
    message.author_id,
    currentUserId,
    selfDisplayName,
  );

  return (
    <div
      className={cn(
        "group relative flex w-full animate-fade-in gap-2 rounded-md px-2 transition-colors hover:bg-[var(--tg-hover)]",
        showAvatar ? "py-1.5" : "py-0.5",
        message.pending && "opacity-70",
      )}
    >
      <div className="flex w-11 shrink-0 flex-col items-center justify-start pt-0.5">
        {showAvatar ? (
          <Avatar name={avatarName} size="sm" />
        ) : (
          <span
            className={cn(
              "w-full text-right text-[11px] leading-tight text-tg-muted tabular-nums transition-opacity",
              "opacity-0 group-hover:opacity-100",
            )}
            title={timeLabel}
          >
            {timeLabel}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1 pr-9">
        {showAuthorName && (
          <div className="mb-0.5 flex items-baseline gap-2">
            <p className="text-sm font-semibold leading-tight text-tg-text">
              {authorLabel}
            </p>
            <span className="text-[11px] tabular-nums text-tg-muted">
              {timeLabel}
            </span>
          </div>
        )}
        <div
          className={cn(
            "message-content text-[15px] leading-snug text-tg-text",
            message.failed &&
              "rounded ring-1 ring-red-400/40 ring-offset-2 ring-offset-transparent",
          )}
        >
          <MessageContent content={message.content} />
        </div>
        {(message.pending || message.failed) && (
          <p className="mt-0.5 text-[11px] text-tg-muted">
            {message.pending && <span>Отправка…</span>}
            {message.failed && (
              <span className="text-red-400">
                {message.pending ? " · " : ""}
                Не удалось отправить
              </span>
            )}
          </p>
        )}
        {replyCount > 0 && onOpenThread && !message.thread_id && (
          <button
            type="button"
            className="mt-1.5 block text-left text-xs font-medium text-tg-accent hover:underline"
            onClick={(e) => {
              e.preventDefault();
              onOpenThread(message);
            }}
          >
            {formatReplyCount(replyCount)}
          </button>
        )}
      </div>

      <div className="absolute right-1 top-1 flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        {onOpenThread && !message.thread_id && (
          <button
            type="button"
            className="rounded p-1 text-tg-muted hover:bg-[var(--tg-hover)] hover:text-tg-text"
            aria-label="Открыть тред"
            title="Ответить в треде"
            onClick={(e) => {
              e.preventDefault();
              onOpenThread(message);
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        )}
        <button
          type="button"
          className="rounded p-1 text-tg-muted hover:bg-[var(--tg-hover)] hover:text-tg-text"
          aria-label="Действия с сообщением"
          title="Действия"
          onClick={(e) => e.preventDefault()}
        >
          <span className="text-base leading-none" aria-hidden>
            ⋯
          </span>
        </button>
      </div>
    </div>
  );
}
