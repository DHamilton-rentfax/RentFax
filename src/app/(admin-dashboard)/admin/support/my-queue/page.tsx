"use client";

import { useEffect, useState } from "react";

export default function MySupportQueue() {
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    fetch("/api/support/my-queue")
      .then((res) => res.json())
      .then((data) => setThreads(data.threads));
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">My Support Queue</h1>

      <div className="space-y-3">
        {threads.map((t: any) => (
          <a
            key={t.id}
            href={`/admin/support/inbox/${t.id}`}
            className="block border rounded-lg p-4 hover:bg-gray-50 transition"
          >
            <div className="flex justify-between items-center mb-1">
                <span className="font-semibold">
                    {t.category?.toUpperCase() || 'GENERAL'} • Priority: {t.priority?.toUpperCase() || 'NORMAL'}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${{
                    open: 'bg-blue-200 text-blue-800',
                    pending: 'bg-yellow-200 text-yellow-800',
                    needs_superadmin: 'bg-red-200 text-red-800',
                    closed: 'bg-gray-200 text-gray-800',
                }[t.status]}">
                    {t.status}
                </span>
            </div>
            <div className="text-sm text-gray-700 mb-2 truncate">
              {t.lastMessage}
            </div>
            <div className="text-xs text-gray-500">
              Last updated: {t.updatedAt && new Date(t.updatedAt._seconds * 1000).toLocaleString()}
            </div>
          </a>
        ))}

        {threads.length === 0 && (
            <p className="text-gray-500">Your queue is empty. Great job!</p>
        )}
      </div>
    </div>
  );
}
