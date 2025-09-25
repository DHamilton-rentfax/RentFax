"use client";

import { useEffect, useState } from "react";

export default function DocDefaultsPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCat, setNewCat] = useState("");

  async function load() {
    const res = await fetch("/api/admin/doc-defaults");
    const data = await res.json();
    setCategories(data.categories || []);
  }

  useEffect(() => { load(); }, []);

  async function save() {
    await fetch("/api/admin/doc-defaults", {
      method: "POST",
      body: JSON.stringify({ categories }),
    });
    alert("Default categories updated!");
  }

  async function sync() {
    if (!confirm("Sync defaults to ALL existing orgs? This cannot be undone.")) return;
    await fetch("/api/admin/doc-defaults/sync", { method: "POST" });
    alert("Defaults synced to all orgs!");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Global Default Document Categories</h1>

      <ul className="space-y-2 mb-4">
        {categories.map((c, idx) => (
          <li key={idx} className="flex justify-between border p-2 rounded">
            <span>{c}</span>
            <button
              onClick={() => setCategories(categories.filter((_, i) => i !== idx))}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="flex gap-2 mb-4">
        <input
          value={newCat}
          onChange={e => setNewCat(e.target.value)}
          placeholder="New default category"
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={() => { if (newCat) setCategories([...categories, newCat]); setNewCat(""); }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      <div className="flex gap-4">
        <button onClick={save} className="bg-green-600 text-white px-6 py-2 rounded">
          Save Defaults
        </button>
        <button onClick={sync} className="bg-purple-600 text-white px-6 py-2 rounded">
          Sync to Existing Orgs
        </button>
      </div>
    </div>
  );
}
