'use client';

import { useEffect, useState } from "react";

export default function SecurityPage() {
  const [sessions, setSessions] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/renter/security");
      const data = await res.json();
      setSessions(data.sessions || []);
      setHistory(data.history || []);
    }
    load();
  }, []);

  const logoutAll = async () => {
    await fetch("/api/renter/security/logout-all", { method: "POST" });
    alert("Logged out everywhere.");
    window.location.href = "/login";
  };

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-10">

      <h1 className="text-3xl font-bold">Security & Login</h1>

      {/* Change Password */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-semibold pb-3">Change Password</h2>
        <a href="/reset-password" className="text-blue-600 underline">
          Reset your password
        </a>
      </div>

      {/* Active Sessions */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-semibold pb-3">Active Sessions</h2>
        <ul className="space-y-3">
          {sessions.map((s) => (
            <li key={s.id} className="border p-3 rounded-lg text-sm">
              <p>{s.browser} on {s.os}</p>
              <p className="text-gray-500">{s.ip}</p>
              <p className="text-gray-500">Last active: {s.lastActive}</p>
            </li>
          ))}
        </ul>

        <button
          onClick={logoutAll}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Logout All Devices
        </button>
      </div>

      {/* Login History */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-semibold pb-3">Login History</h2>
        <ul className="space-y-3 text-sm">
          {history.map((entry) => (
            <li key={entry.id} className="border p-3 rounded-lg">
              <p>{entry.browser} on {entry.os}</p>
              <p className="text-gray-500">{entry.ip}</p>
              <p className="text-gray-500">{entry.time}</p>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}
