"use client";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/client";
import Papa from "papaparse";

export default function RentersPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleManualAdd() {
    setLoading(true);
    await addDoc(collection(db, "renters"), {
      name,
      email,
      createdAt: new Date(),
    });
    setName(""); setEmail(""); setLoading(false);
  }

  async function handleCSVUpload() {
    if (!csvFile) return;
    Papa.parse(csvFile, {
      header: true,
      complete: async (results) => {
        const renters = results.data as any[];
        for (const renter of renters) {
          await addDoc(collection(db, "renters"), {
            name: renter.name,
            email: renter.email,
            createdAt: new Date(),
          });
        }
      }
    });
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Renters</h1>

      {/* Manual Add */}
      <div className="mt-4 space-y-2">
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2"
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2"
        />
        <button onClick={handleManualAdd} className="bg-blue-500 text-white px-4 py-2 rounded">
          {loading ? "Adding..." : "Add Renter"}
        </button>
      </div>

      {/* CSV Upload */}
      <div className="mt-6">
        <input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files?.[0] || null)} />
        <button onClick={handleCSVUpload} className="bg-green-500 text-white px-4 py-2 rounded">
          Upload CSV
        </button>
      </div>
    </div>
  );
}