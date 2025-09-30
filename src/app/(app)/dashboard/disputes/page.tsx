
"use client";
import { useState } from "react";
import { addDoc, collection, updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/client";

export default function DisputesPage() {
  const [id, setIncidentId] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState("DRAFT");

  async function createDispute() {
    await addDoc(collection(db, "disputes"), {
      id,
      details,
      status,
      createdAt: new Date(),
    });
    setIncidentId(""); setDetails("");
  }

  async function updateDisputeStatus(id: string, newStatus: string) {
    await updateDoc(doc(db, "disputes", id), { status: newStatus });
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Disputes</h1>
      <input
        placeholder="Incident ID"
        value={id}
        onChange={(e) => setIncidentId(e.target.value)}
        className="border p-2 block"
      />
      <textarea
        placeholder="Dispute details"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        className="border p-2 block mt-2"
      />
      <button onClick={createDispute} className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
        Create Dispute
      </button>
    </div>
  );
}
