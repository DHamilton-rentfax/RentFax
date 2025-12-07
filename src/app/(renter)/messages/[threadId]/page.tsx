"use client";

import { useEffect, useState } from "react";

export default function ThreadPage({ params }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(`/api/renter/messages/${params.threadId}`)
      .then((res) => res.json())
      .then((d) => setMessages(d.messages));
  }, []);

  async function send() {
    await fetch(`/api/renter/messages/${params.threadId}`, {
      method: "POST",
      body: JSON.stringify({ text }),
    });
    setText("");
  }

  return (
    <div className="p-10 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Message Thread</h1>

      <div className="border rounded p-4 space-y-3 h-[400px] overflow-auto">
        {messages.map((m, i) => (
          <div key={i}>
            <p className="font-semibold text-sm">{m.author}</p>
            <p className="text-sm">{m.text}</p>
          </div>
        ))}
      </div>

      <textarea
        className="w-full border p-3 rounded"
        placeholder="Write a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={send}
        className="bg-blue-600 text-white px-5 py-2 rounded"
      >
        Send
      </button>
    </div>
  );
}
