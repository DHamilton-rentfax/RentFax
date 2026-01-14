'use client';

import { useEffect, useState } from "react";
import Link from "next/link";

interface Thread {
  id: string;
  userRole: string;
  context: string;
  lastMessage?: string;
  lastMessageAt?: any;
}

export default function SupportInboxPage() {
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    fetch("/api/support/inbox")
      .then(res => res.json())
      .then(data => setThreads(data.threads));
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-6">Support Inbox</h1>

      <div className="border rounded-xl divide-y">
        {threads.map(t => (
          <Link
            key={t.id}
            href={`/admin/support/inbox/${t.id}`}
            className="flex justify-between items-center p-4 hover:bg-gray-50"
          >
            <div>
              <div className="font-medium">
                {t.userRole} • {t.context}
              </div>
              <div className="text-sm text-gray-500">
                {t.lastMessage?.slice(0, 80)}
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {t.lastMessageAt && new Date(t.lastMessageAt._seconds * 1000).toLocaleString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
