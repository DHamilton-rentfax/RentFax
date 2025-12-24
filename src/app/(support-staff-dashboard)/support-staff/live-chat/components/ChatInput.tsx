"use client";

import { useState } from "react";

export default function ChatInput({ conversationId }: any) {
  const [text, setText] = useState("");

  async function send() {
    if (!text.trim()) return;

    await fetch("/api/support/live-chat/send", {
      method: "POST",
      body: JSON.stringify({
        conversationId,
        senderId: "support-staff-placeholder", // Replace w/ useAuth
        senderRole: "SUPPORT_STAFF",
        message: text,
      }),
    });

    setText("");
  }

  return (
    <div className="p-4 border-t flex gap-2">
      <input
        className="flex-1 border rounded p-2"
        placeholder="Reply…"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button className="bg-blue-600 text-white px-4 rounded" onClick={send}>
        Send
      </button>
    </div>
  );
}
