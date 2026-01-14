"use client";

import useSWR from "swr";
import TicketCard from "./TicketCard";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function TicketList() {
  const { data, isLoading } = useSWR("/api/support/tickets/list", fetcher, {
    refreshInterval: 3000,
  });

  if (isLoading) return <p>Loading tickets...</p>;

  return (
    <div className="space-y-4">
      {data?.tickets?.map((ticket: any) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
