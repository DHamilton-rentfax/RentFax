"use client";

import { useState } from "react";
import { writeBatch, doc } from "firebase/firestore";
import Link from "next/link";
import { useNotifications } from "@/hooks/use-notifications";
import { db } from "@/firebase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotificationsPage() {
  const { notifications, loading, markAsRead } = useNotifications();
  const [filter, setFilter] = useState("ALL");

  async function markAllAsRead() {
    const batch = writeBatch(db);
    notifications.forEach((n) => {
      if (!n.read) {
        const notifRef = doc(db, "notifications", n.id);
        batch.update(notifRef, { read: true });
      }
    });
    await batch.commit();
  }

  function exportCSV() {
    const headers = [
      "ID",
      "Message",
      "Type",
      "Priority",
      "Read",
      "Link",
      "Created At",
    ];
    const rows = filtered.map((n) => [
      n.id,
      `"${n.message.replace(/"/g, '""')}"`,
      n.type,
      n.priority || "normal",
      n.read ? "Yes" : "No",
      n.link || "",
      new Date(n.createdAt).toISOString(),
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notifications.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const filtered = notifications.filter((n) => {
    if (filter === "ALL") return true;
    if (filter === "PRIORITY_HIGH") return n.priority === "high";
    if (filter === "PRIORITY_NORMAL") return n.priority === "normal";
    if (filter === "PRIORITY_LOW") return n.priority === "low";
    return n.type === filter;
  });

  const notificationTypes = [...new Set(notifications.map((n) => n.type))];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Notifications Center</h1>

      <div className="flex justify-between items-center mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2 bg-white"
        >
          <option value="ALL">All Types</option>
          <optgroup label="By Priority">
            <option value="PRIORITY_HIGH">High Priority</option>
            <option value="PRIORITY_NORMAL">Normal Priority</option>
            <option value="PRIORITY_LOW">Low Priority</option>
          </optgroup>
          <optgroup label="By Type">
            {notificationTypes.map((type) => (
              <option key={type} value={type}>
                {type.replace(/_/g, " ").toLowerCase()}
              </option>
            ))}
          </optgroup>
        </select>

        <div className="space-x-2">
          <button
            onClick={markAllAsRead}
            className="... rounded-md text-sm font-medium"
          >
            Mark All Read
          </button>
          <button
            onClick={exportCSV}
            className="... rounded-md text-sm font-medium"
          >
            Export CSV
          </button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{filtered.length} Notification(s)</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-gray-500 text-center py-10">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              No notifications found.
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filtered.map((n) => (
                <li
                  key={n.id}
                  className={`... p-4 transition-colors ${
                    n.read
                      ? "bg-gray-50 text-gray-500"
                      : "font-semibold bg-white"
                  }`}
                >
                  <Link href={n.link || "#"} className="flex-grow pr-4">
                    <p>{n.message}</p>
                    <p
                      className={`text-xs ${n.read ? "text-gray-400" : "text-gray-500"} font-normal`}
                    >
                      {new Date(n.createdAt).toLocaleString()} - Priority:{" "}
                      {n.priority || "normal"}
                    </p>
                  </Link>
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="... rounded-full whitespace-nowrap"
                    >
                      Mark Read
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
