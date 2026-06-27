"use client";

import { useCallback, useEffect, useState } from "react";
import { DB_CHANGE, listChatsLocal, listMessagesForChat } from "./localDb";
import type { LocalChat } from "./localDb";
import type { Message } from "./types";

export function useLocalChats(): {
  chats: LocalChat[];
  reload: () => Promise<void>;
} {
  const [chats, setChats] = useState<LocalChat[]>([]);

  const reload = useCallback(async () => {
    setChats(await listChatsLocal());
  }, []);

  useEffect(() => {
    void reload();
    const onChange = () => void reload();
    window.addEventListener(DB_CHANGE, onChange);
    return () => window.removeEventListener(DB_CHANGE, onChange);
  }, [reload]);

  return { chats, reload };
}

export function useLocalMessages(
  chatId: string,
  opts?: { includeThreadReplies?: boolean },
): {
  messages: Message[];
  reload: () => Promise<void>;
} {
  const [messages, setMessages] = useState<Message[]>([]);
  const includeThreadReplies = opts?.includeThreadReplies ?? false;

  const reload = useCallback(async () => {
    if (!chatId) {
      setMessages([]);
      return;
    }
    setMessages(
      await listMessagesForChat(chatId, { includeThreadReplies }),
    );
  }, [chatId, includeThreadReplies]);

  useEffect(() => {
    void reload();
    const onChange = () => void reload();
    window.addEventListener(DB_CHANGE, onChange);
    return () => window.removeEventListener(DB_CHANGE, onChange);
  }, [reload]);

  return { messages, reload };
}
