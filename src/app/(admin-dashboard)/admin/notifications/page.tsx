"use client";
import { useEffect, useState } from "react";

export default function NotificationsFeed() {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetch("/api/notifications/list")
      .then(r => r.json())
      .then(setList);
  }, []);

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>

      {list.map(n => (
        <div key={n.id} className="border-b py-4">
          <p className="font-bold">{n.title}</p>
          <p className="text-sm text-gray-600">{n.message}</p>
          {n.link && <a href={n.link} className="text-blue-600">View Details →</a>}
        </div>
      ))}
    </div>
  );
}
