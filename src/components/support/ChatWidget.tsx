"use client";

import { useState, useEffect } from "react";
import { db } from "@/firebase/client";
import {
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

export default function ChatWidget({ user }) {
  const [ticketId, setTicketId] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  // Create a new ticket when chat opens
  useEffect(() => {
    async function init() {
      if (!ticketId && user) {
        const docRef = await addDoc(collection(db, "support_tickets"), {
          userId: user.uid,
          role: user.role,
          status: "open",
          priority: "low",
          createdFrom: "chat",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        setTicketId(docRef.id);
      }
    }
    init();
  }, [user]);

  // Subscribe to messages
  useEffect(() => {
    if (!ticketId) return;

    const q = query(
      collection(db, "support_messages"),
      orderBy("createdAt", "asc")
    );

    return onSnapshot(q, (snap) => {
      const arr = [];
      snap.forEach((d) => arr.push(d.data()));
      setMessages(arr.filter((m) => m.ticketId === ticketId));
    });
  }, [ticketId]);

  async function sendMessage() {
    if (!input.trim()) return;

    await addDoc(collection(db, "support_messages"), {
      ticketId,
      sender: "user",
      senderId: user.uid,
      message: input,
      createdAt: serverTimestamp(),
    });

    setInput("");
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 rounded-2xl shadow-xl bg-white border">
      {/* Chat Window */}
      <div className="p-4 h-80 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-3 ${m.sender === "user" ? "text-right" : "text-left"}`}
          >
            <span
              className={`inline-block px-3 py-2 rounded-xl ${
                m.sender === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {m.message}
            </span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t p-3 flex gap-2">
        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Type a message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
