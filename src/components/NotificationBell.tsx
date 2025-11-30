"use client";

import { useEffect, useState } from "react";

export function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const s = new EventSource("/api/notifications/stream");
    s.onmessage = (msg) => {
      setCount(Number(msg.data));
    };
    return () => s.close();
  }, []);

  return (
    <div className="relative">
      <span className="material-icons">notifications</span>
      {count > 0 && (
        <span className="absolute top-0 right-0 bg-red-600 text-white text-xs px-1 rounded-full">
          {count}
        </span>
      )}
    </div>
  );
}
