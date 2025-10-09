
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import * as React from "react";

type Message = { id: string; text: string; sender: string };

export default function RenterPortal() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch(`/api/renter/messages?token=${token}`).then(r => r.json()).then(setMessages);
  }, [token]);

  async function sendMessage() {
    if (!token) return;
    await fetch("/api/renter/messages", {
      method: "POST",
      body: JSON.stringify({ token, text: input, sender: "RENTER" }),
    });
    setInput("");
    const updated = await fetch(`/api/renter/messages?token=${token}`).then(r => r.json());
    setMessages(updated);
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Renter Portal</h1>
      <div className="border p-2 rounded h-80 overflow-y-scroll bg-gray-50">
        {messages.map(m => (
          <p key={m.id} className={m.sender === "RENTER" ? "text-blue-600" : "text-red-600"}>
            <b>{m.sender}:</b> {m.text}
          </p>
        ))}
      </div>
      <div className="flex mt-4 gap-2">
        <input
          className="flex-1 border p-2 rounded"
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
