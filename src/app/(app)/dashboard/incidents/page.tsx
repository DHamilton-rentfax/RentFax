
"use client";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/client";

export default function IncidentsPage() {
  const [renterId, setRenterId] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit() {
    await addDoc(collection(db, "incidents"), {
      renterId,
      description,
      status: "OPEN",
      createdAt: new Date(),
    });
    setRenterId(""); setDescription("");
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Create Incident</h1>
      <input
        placeholder="Renter ID"
        value={renterId}
        onChange={(e) => setRenterId(e.target.value)}
        className="border p-2 block"
      />
      <textarea
        placeholder="Incident description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 block mt-2"
      />
      <button onClick={handleSubmit} className="bg-red-500 text-white px-4 py-2 rounded mt-2">
        Create
      </button>
    </div>
  );
}
