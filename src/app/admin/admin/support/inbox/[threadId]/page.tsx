'use client';

import { useEffect, useState } from "react";

function formatDuration(ms: number) {
    if (ms < 0) {
        return `breached by ${formatDuration(-ms)}`;
    }
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) {
        return `${days}d ${hours % 24}h`;
    }
    if (hours > 0) {
        return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
}

function SlaTimer({ sla }: { sla: any }) {
  if (!sla) return null;

  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  const responseMs = sla.responseDueAt.toMillis() - now;
  const resolutionMs = sla.resolutionDueAt.toMillis() - now;

  return (
    <div className="border rounded-lg p-3 bg-gray-50 mb-4">
      <div className="text-sm">
        Response SLA:{" "}
        <span className={responseMs < 0 ? "text-red-600" : "text-green-600"}>
          {formatDuration(responseMs)}
        </span>
      </div>
      <div className="text-sm">
        Resolution SLA:{" "}
        <span className={resolutionMs < 0 ? "text-red-600" : "text-green-600"}>
          {formatDuration(resolutionMs)}
        </span>
      </div>
    </div>
  );
}


export default function SupportThreadPage({ params }: { params: { threadId: string } }) {
    const [thread, setThread] = useState<any>(null);

    useEffect(() => {
        // In a real app, you would fetch the thread data here
        const mockSla = {
            responseDueAt: {
                toMillis: () => Date.now() + 1000 * 60 * 30, // 30 minutes from now
            },
            resolutionDueAt: {
                toMillis: () => Date.now() + 1000 * 60 * 60 * 4, // 4 hours from now
            },
        }
        setThread({ id: params.threadId, sla: mockSla });
    }, [params.threadId]);

    return (
        <div className="max-w-4xl mx-auto py-10">
            <h1 className="text-2xl font-semibold">Support Thread: {params.threadId}</h1>

            {thread && <SlaTimer sla={thread.sla} />}

            {/* Rest of the thread UI */}
        </div>
    );
}
