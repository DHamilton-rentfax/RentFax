"use client";

import Link from "next/link";

export default function TicketCard({ ticket }: any) {
  return (
    <Link
      href={`/support-staff/tickets/${ticket.id}`}
      className="block border p-4 rounded-xl hover:bg-gray-50 transition"
    >
      <h3 className="font-semibold text-lg">{ticket.subject}</h3>
      <p className="text-sm text-gray-600 mt-1">{ticket.lastMessage}</p>
      <div className="flex gap-4 text-xs text-gray-500 mt-2">
        <span>Status: {ticket.status}</span>
        <span>Category: {ticket.category}</span>
      </div>
    </Link>
  );
}
