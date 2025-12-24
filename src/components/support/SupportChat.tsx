'use client';

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export default function SupportChat({ context }: { context: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [sending, setSending] = useState(false);

  async function sendMessage() {
    if (!message.trim()) return;
    setSending(true);

    const userMessage = {
      sender: "user",
      text: message,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const res = await fetch("/api/support/chat", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        context,
      }),
    });

    const data = await res.json();

    const botMessage = {
      sender: "bot",
      text: data.reply,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
    setMessage("");
    setSending(false);
  }

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {open && (
        <div className="fixed bottom-4 right-4 w-96 bg-white shadow-2xl rounded-xl overflow-hidden border">
          {/* Header */}
          <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-2">
            <h2 className="text-lg font-semibold">RentFAX Support</h2>
            <button onClick={() => setOpen(false)}>
              <X />
            </button>
          </div>

          {/* Messages */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[80%] ${
                  m.sender === "user"
                    ? "ml-auto bg-blue-100"
                    : "mr-auto bg-gray-200"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 flex gap-2 border-t">
            <input
              className="flex-1 border rounded-lg px-3 py-2"
              placeholder="Ask a question…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              disabled={sending}
              className="bg-blue-600 text-white rounded-lg px-3 py-2"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
