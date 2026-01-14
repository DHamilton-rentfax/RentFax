"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ChatSidebar() {
  const { data } = useSWR("/api/support/live-chat/conversations", fetcher, {
    refreshInterval: 2500,
  });

  return (
    <aside className="w-80 border-r p-4 bg-gray-50">
      <h2 className="font-bold text-lg mb-4">Live Chats</h2>

      <div className="space-y-3">
        {data?.conversations?.map((c: any) => (
          <div key={c.id} className="p-3 rounded-lg bg-white shadow">
            <p className="font-semibold">{c.userRole} • {c.userId}</p>
            <p className="text-sm text-gray-600">{c.lastMessage}</p>
            <p className="text-xs text-gray-400">{c.status}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
