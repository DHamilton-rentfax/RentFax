"use client";

import { useEffect, useState } from "react";

interface Notification {
  id: string;
  title: string;
  body: string;
  severity: string;
  link?: string;
  createdAt: string;
  readAt?: string;
  dismissedAt?: string;
}

export default function NotificationsPage() {
  const [status, setStatus] = useState<"all" | "unread" | "read">("unread");
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/notifications?status=${status}&limit=100`);
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, [status]);

  async function markRead(id: string) {
    await fetch(`/api/notifications/${id}/read`, { method: "POST" });
    load();
  }

  async function dismiss(id: string) {
    await fetch(`/api/notifications/${id}/dismiss`, { method: "POST" });
    load();
  }

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-semibold">Notifications</h1>

      <div className="flex gap-2">
        {(['unread','all','read'] as const).map(s => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-3 py-2 rounded-lg border text-sm ${status === s ? "bg-black text-white" : ""}`}>
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-sm text-gray-600">Loading…</div>
      ) : (
        <div className="border rounded-xl divide-y bg-white">
          {items.map(n => (
            <div key={n.id} className="p-4 flex justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold truncate">{n.title}</span>
                  <span className="text-xs px-2 py-0.5 rounded border">{n.severity}</span>
                  {!n.readAt && !n.dismissedAt && (
                    <span className="text-xs text-blue-600">NEW</span>
                  )}
                </div>
                <div className="text-sm text-gray-700 mt-1">{n.body}</div>
                {n.link && (
                  <a className="text-sm text-blue-600 underline mt-2 inline-block" href={n.link}>
                    View details
                  </a>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                </div>
              </div>

              <div className="flex flex-col gap-2 items-end">
                {!n.readAt && !n.dismissedAt && (
                  <button onClick={() => markRead(n.id)} className="text-xs px-3 py-2 rounded border">
                    Mark read
                  </button>
                )}
                {!n.dismissedAt && (
                  <button onClick={() => dismiss(n.id)} className="text-xs px-3 py-2 rounded border">
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="p-6 text-sm text-gray-500">No notifications.</div>
          )}
        </div>
      )}
    </div>
  );
}