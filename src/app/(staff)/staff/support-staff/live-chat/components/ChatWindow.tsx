"use client";

import { useState, useEffect } from "react";
import ChatMessageBubble from "./ChatMessageBubble";
import ChatInput from "./ChatInput";

export default function ChatWindow() {
  const [messages, setMessages] = useState<any[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    const loadMessages = async () => {
      const res = await fetch("/api/support/live-chat/messages", {
        method: "POST",
        body: JSON.stringify({ conversationId }),
      });
      const data = await res.json();
      setMessages(data.messages);
    };

    loadMessages();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, [conversationId]);

  return (
    <div className="flex flex-col flex-1">
      {/* HEADER */}
      <div className="border-b p-4 font-semibold">
        {conversationId ? `Chat: ${conversationId}` : "Select a conversation"}
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
        {messages.map((msg) => (
          <ChatMessageBubble key={msg.id} msg={msg} />
        ))}
      </div>

      {/* INPUT */}
      {conversationId && <ChatInput conversationId={conversationId} />}
    </div>
  );
}
