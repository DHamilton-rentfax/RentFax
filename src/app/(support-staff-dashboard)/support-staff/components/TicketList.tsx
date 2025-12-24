"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase/client";
import Link from "next/link";

export default function TicketList() {
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "support_tickets"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const arr: any[] = [];
      snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
      setTickets(arr);
    });

    return () => unsub();
  }, []);

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => (
        <Link
          key={ticket.id}
          href={`/support-staff/tickets/${ticket.id}`}
          className="p-4 border rounded-xl bg-white hover:bg-gray-50 shadow-sm block"
        >
          <div className="font-semibold">{ticket.email}</div>
          <div className="text-gray-600 text-sm">{ticket.message}</div>
        </Link>
      ))}
    </div>
  );
}
