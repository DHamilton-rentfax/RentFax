"use client";

import { useState } from "react";

export default function BrandingPage() {
  const [logo, setLogo] = useState("");
  const [primary, setPrimary] = useState("#0d6efd");

  async function save() {
    await fetch("/api/settings/branding", {
      method: "POST",
      body: JSON.stringify({ logo, primary }),
    });
    alert("Branding saved!");
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">White-Label Branding</h1>
      <input type="text" value={logo} onChange={e => setLogo(e.target.value)} placeholder="Logo URL" className="border p-2 w-full mb-2"/>
      <input type="color" value={primary} onChange={e => setPrimary(e.target.value)} className="mb-2"/>
      <button onClick={save} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
    </div>
  );
}
