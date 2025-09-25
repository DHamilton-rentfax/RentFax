'use client';

import { useState } from "react";

export default function ClientSettingsPage() {
  const [digest, setDigest] = useState("weekly");

  async function save() {
    await fetch("/api/client/settings", {
      method: "POST",
      body: JSON.stringify({ orgId: "demo-org", digest }),
    });
    alert("Settings saved!");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <label className="block mb-2">Digest Frequency</label>
      <select value={digest} onChange={e => setDigest(e.target.value)} className="border p-2 rounded">
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="none">None</option>
      </select>
      <div className="mt-4">
        <button onClick={save} className="bg-green-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </div>
    </div>
  );
}
