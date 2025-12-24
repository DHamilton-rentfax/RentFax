"use client";

import { useState, useEffect } from "react";

// This is a simplified customer chat window. 
// In a real app, you'd fetch user details and handle state more robustly.

export default function ChatWindowCustomer({ close }: { close: () => void }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);

  // 1. Start or get existing conversation on load
  useEffect(() => {
    async function startChat() {
      const res = await fetch("/api/support/live-chat/start", {
        method: "POST",
        body: JSON.stringify({ 
          userId: "customer-placeholder", // Replace with actual useAuth()
          userRole: "RENTER" 
        }),
      });
      const data = await res.json();
      setConversationId(data.conversationId);
    }
    startChat();
  }, []);

  // 2. Poll for new messages
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

    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, [conversationId]);


  // 3. Send a message
  async function send() {
    if (!text.trim() || !conversationId) return;

    await fetch("/api/support/live-chat/send", {
      method: "POST",
      body: JSON.stringify({
        conversationId,
        senderId: "customer-placeholder", // Replace w/ useAuth
        senderRole: "USER",
        message: text,
      }),
    });

    setText("");
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white shadow-xl rounded-lg flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-bold">RentFAX Support</h3>
        <button onClick={close}>X</button>
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map(msg => (
          <div key={msg.id} className={`p-2 my-1 rounded-lg max-w-xs ${
            msg.senderRole === 'USER' ? 'bg-gray-200 ml-auto' : 'bg-blue-100 mr-auto'
          }`}>
            {msg.message}
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex gap-2">
        <input 
          className="flex-1 border p-2 rounded"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={send} className="bg-blue-600 text-white px-4 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
