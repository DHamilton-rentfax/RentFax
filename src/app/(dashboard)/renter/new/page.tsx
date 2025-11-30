"use client";
import { useState } from "react";

export default function AddRenter() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [unitId, setUnitId] = useState("");

  const submit = async () => {
    await fetch("/api/landlord/renters/create", {
      method: "POST",
      body: JSON.stringify({ name, phone, unitId }),
    });
  };

  return (
    <div className="p-10 max-w-xl">
      <h1 className="text-2xl font-bold">Add Renter</h1>

      <input className="border w-full p-2 mt-3" placeholder="Full Name" onChange={(e) => setName(e.target.value)} />
      <input className="border w-full p-2 mt-3" placeholder="Phone Number" onChange={(e) => setPhone(e.target.value)} />

      <button className="bg-blue-600 text-white px-4 py-2 rounded mt-4" onClick={submit}>
        Save Renter
      </button>
    </div>
  );
}
