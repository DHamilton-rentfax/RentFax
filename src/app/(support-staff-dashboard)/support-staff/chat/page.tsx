"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function SupportStaffChatPage() {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Load all open tickets
  useEffect(() => {
    const q = query(
      collection(db, "support_tickets"),
      where("status", "==", "open")
    );

    return onSnapshot(q, (snap) => {
      const arr = [];
      snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
      setTickets(arr);
    });
  }, []);

  // Load messages for selected ticket
  useEffect(() => {
    if (!selectedTicket) return;

    const q = query(
      collection(db, "support_messages"),
      where("ticketId", "==", selectedTicket.id),
      orderBy("createdAt", "asc")
    );

    return onSnapshot(q, (snap) => {
      const arr = [];
      snap.forEach((d) => arr.push(d.data()));
      setMessages(arr);
    });
  }, [selectedTicket]);

  async function sendMessage() {
    if (!input.trim() || !selectedTicket) return;

    await addDoc(collection(db, "support_messages"), {
      ticketId: selectedTicket.id,
      sender: "support",
      senderId: "support-staff",
      message: input,
      createdAt: serverTimestamp(),
    });

    setInput("");
  }

  async function suggestFAQ(message) {
    await addDoc(collection(db, "faq_suggestions"), {
      ticketId: selectedTicket.id,
      question: message,
      answerDraft: "",
      status: "pending",
      createdAt: serverTimestamp(),
    });
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Ticket list */}
      <aside className="w-80 border-r bg-white p-4">
        <h2 className="font-bold text-lg mb-4">Open Tickets</h2>
        <div className="space-y-3">
          {tickets.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTicket(t)}
              className="w-full text-left border p-3 rounded-lg hover:bg-gray-50"
            >
              <p className="font-semibold">{t.subject || "Chat Ticket"}</p>
              <p className="text-sm text-gray-600">{t.role}</p>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat panel */}
      <main className="flex-1 flex flex-col">
        {selectedTicket ? (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`mb-4 ${
                    m.sender === "support" ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`inline-block px-4 py-2 rounded-xl ${
                      m.sender === "support"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {m.message}
                  </div>

                  {/* Add to FAQ button */}
                  <button
                    onClick={() => suggestFAQ(m.message)}
                    className="text-xs text-blue-600 underline ml-2"
                  >
                    Add to FAQ
                  </button>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t flex gap-2">
              <input
                className="flex-1 border rounded-lg px-3 py-2"
                placeholder="Reply…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500">
            Select a ticket to begin
          </div>
        )}
      </main>
    </div>
  );
}
