"use client";

import { useState, useEffect } from "react";

export default function PrivacySettings() {
  const [visibility, setVisibility] = useState("FULL");

  useEffect(() => {
    fetch("/api/renter/settings/privacy")
      .then((res) => res.json())
      .then((d) => setVisibility(d.visibility));
  }, []);

  async function save() {
    await fetch("/api/renter/settings/privacy", {
      method: "POST",
      body: JSON.stringify({ visibility }),
    });
    alert("Settings updated");
  }

  return (
    <div className="p-10 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Privacy Settings</h1>

      <select
        className="w-full border p-3 rounded"
        value={visibility}
        onChange={(e) => setVisibility(e.target.value)}
      >
        <option value="FULL">Public (Recommended)</option>
        <option value="LIMITED">Limited</option>
        <option value="HIDDEN">Hidden</option>
      </select>

      <button onClick={save} className="bg-blue-600 text-white px-6 py-2 rounded">
        Save
      </button>
    </div>
  );
}
