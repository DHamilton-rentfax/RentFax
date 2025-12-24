"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function TicketDetailPage() {
  const { ticketId } = useParams();
  const [ticket, setTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [reply, setReply] = useState("");

  useEffect(() => {
    fetch("/api/support/tickets/get", {
      method: "POST",
      body: JSON.stringify({ ticketId }),
    })
      .then((r) => r.json())
      .then((data) => {
        setTicket(data.ticket);
        setMessages(data.messages);
      });
  }, [ticketId]);

  async function sendReply() {
    await fetch("/api/support/tickets/reply", {
      method: "POST",
      body: JSON.stringify({
        ticketId,
        uid: "support-staff-uid-placeholder", // Replace with useAuth()
        role: "SUPPORT_STAFF",
        message: reply,
      }),
    });
    setReply("");
  }

  if (!ticket) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">{ticket.subject}</h1>

      <div className="space-y-2 border p-4 rounded-lg bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg ${
              msg.senderRole === "SUPPORT_STAFF"
                ? "bg-blue-100 ml-auto"
                : "bg-gray-200"
            }`}
          >
            <p>{msg.message}</p>
            <p className="text-xs text-gray-500 mt-1">{msg.senderRole}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          className="border rounded p-2 flex-1"
          placeholder="Write a reply..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />
        <button
          onClick={sendReply}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
