'use client';

import { useState, useEffect } from "react";

export default function AlertsPage() {
  const [phone, setPhone] = useState("");
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  useEffect(() => {
    // TODO: fetch real data
  }, []);

  const save = async () => {
    await fetch("/api/renter/alerts", {
      method: "POST",
      body: JSON.stringify({ phone, smsEnabled, emailEnabled }),
    });
    alert("Preferences saved");
  };

  return (
    <div className="max-w-xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold">Alerts & Notifications</h1>

      <input
        type="text"
        placeholder="Phone number"
        className="w-full border px-4 py-2 rounded-lg"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={smsEnabled}
          onChange={() => setSmsEnabled(!smsEnabled)}
        />
        Enable SMS Alerts
      </label>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={emailEnabled}
          onChange={() => setEmailEnabled(!emailEnabled)}
        />
        Enable Email Alerts
      </label>

      <button
        onClick={save}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg"
      >
        Save Preferences
      </button>
    </div>
  );
}
