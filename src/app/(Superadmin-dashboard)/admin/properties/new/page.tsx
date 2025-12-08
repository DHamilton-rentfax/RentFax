"use client";

import { useState } from "react";

export default function NewPropertyPage() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const submit = async () => {
    await fetch("/api/properties/create", {
      method: "POST",
      body: JSON.stringify({ name, address })
    });
  };

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add New Property</h1>

      <input
        className="border w-full p-2 mb-4"
        placeholder="Property Name"
        onChange={e => setName(e.target.value)}
      />

      <input
        className="border w-full p-2 mb-4"
        placeholder="Address"
        onChange={e => setAddress(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={submit}
      >
        Create Property
      </button>
    </div>
  );
}
