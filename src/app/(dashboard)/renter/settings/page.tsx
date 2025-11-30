'use client';

import { useState, useEffect } from "react";

export default function RenterSettingsPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/renter/profile");
      const data = await res.json();
      setEmail(data.email);
      setPhone(data.phone || "");
      setSmsEnabled(data.smsEnabled ?? true);
      setEmailEnabled(data.emailEnabled ?? true);
    }
    load();
  }, []);

  const save = async () => {
    await fetch("/api/renter/settings", {
      method: "POST",
      body: JSON.stringify({ email, phone, smsEnabled, emailEnabled }),
    });
    alert("Settings updated.");
  };

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-8">

      <h1 className="text-3xl font-bold">Settings</h1>

      {/* EMAIL */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-semibold mb-3">Email</h2>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* PHONE */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-xl font-semibold mb-3">Phone Number</h2>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded-lg"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      {/* NOTIFICATIONS */}
      <div className="bg-white p-6 rounded-xl shadow border space-y-3">
        <h2 className="text-xl font-semibold mb-3">Notifications</h2>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={smsEnabled}
            onChange={() => setSmsEnabled(!smsEnabled)}
          />
          SMS Alerts
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={emailEnabled}
            onChange={() => setEmailEnabled(!emailEnabled)}
          />
          Email Notifications
        </label>
      </div>

      <button
        onClick={save}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Save Changes
      </button>

      {/* DELETE ACCOUNT */}
      <div className="pt-10">
        <button className="text-red-600 underline">
          Delete Account
        </button>
      </div>

    </div>
  );
}
