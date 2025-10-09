
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import * as React from "react";

type Message = { id: string; from: string; text: string; createdAt: number };

export default function RenterMessagesPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch(`/api/renter/messages?token=${token}`).then(r => r.json()).then(setMessages);
  }, [token]);

  async function send() {
    if (!token) return;
    await fetch("/api/renter/messages", {
      method: "POST",
      body: JSON.stringify({ token, text }),
    });
    const updated = await fetch(`/api/renter/messages?token=${token}`).then(r => r.json());
    setMessages(updated);
    setText("");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <div className="space-y-2 mb-4">
        {messages.map(m => (
          <div key={m.id} className="p-2 border rounded bg-white">
            <p><b>{m.from}</b>: {m.text}</p>
            <p className="text-xs text-gray-500">{new Date(m.createdAt).toLocaleTimeString()}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write a message"
          className="border p-2 rounded flex-1"
        />
        <button onClick={send} className="bg-blue-600 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
