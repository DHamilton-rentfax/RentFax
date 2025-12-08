"use client";

import { useEffect, useState } from "react";
import { Loader2, Clock, RefreshCcw, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Rebroadcast {
  id: string;
  sentAt: string;
  recipients: number;
}

interface Broadcast {
  id: string;
  message: string;
  audience: string;
  sentAt?: string;
  scheduleAt?: string;
  expireAt?: string;
  rebroadcasts?: Rebroadcast[];
}

export default function BroadcastHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/broadcast/history");
      const data = await res.json();
      setBroadcasts(data.broadcasts || []);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-[#1A2540] mb-6">
        Broadcast History
      </h1>

      {broadcasts.length === 0 && (
        <p className="text-gray-500 text-center mt-12">
          No broadcasts have been sent yet.
        </p>
      )}

      <div className="space-y-4">
        {broadcasts.map((b) => (
          <Card key={b.id} className="shadow-md">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="text-lg font-semibold text-[#1A2540]">
                    {b.message}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Audience:{" "}
                    <span className="font-medium text-gray-700 capitalize">
                      {b.audience}
                    </span>
                  </p>
                </div>
                <div className="text-right text-sm text-gray-400">
                  {b.sentAt ? (
                    <span>
                      Sent {formatDistanceToNow(new Date(b.sentAt))} ago
                    </span>
                  ) : (
                    <span>Scheduled</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 mb-3 text-sm text-gray-500">
                {b.scheduleAt && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-blue-500" />
                    Scheduled: {new Date(b.scheduleAt).toLocaleString()}
                  </span>
                )}
                {b.expireAt && (
                  <span className="flex items-center gap-1">
                    <Trash2 className="h-4 w-4 text-red-500" />
                    Expires: {new Date(b.expireAt).toLocaleString()}
                  </span>
                )}
              </div>

              {b.rebroadcasts && b.rebroadcasts.length > 0 && (
                <div className="bg-gray-50 rounded-md p-3 border border-gray-200 mt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                    <RefreshCcw className="h-4 w-4 text-green-600" />
                    Re-broadcasts
                  </h3>
                  <ul className="space-y-1 text-sm">
                    {b.rebroadcasts.map((r) => (
                      <li
                        key={r.id}
                        className="flex justify-between border-b border-gray-100 py-1"
                      >
                        <span>
                          Sent {formatDistanceToNow(new Date(r.sentAt))} ago
                        </span>
                        <span className="text-gray-500">
                          {r.recipients} recipients
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
