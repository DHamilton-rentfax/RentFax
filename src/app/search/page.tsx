"use client";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/client";

export default function SearchPage() {
  const { user, plan } = useAuth();
  const [email, setEmail] = useState("");
  const [results, setResults] = useState<any[]>([]);

  async function handleSearch() {
    if (!user || plan === "FREE") {
      alert("Upgrade to search renters");
      return;
    }
    const q = query(collection(db, "renters"), where("email", "==", email));
    const snap = await getDocs(q);
    setResults(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Search Renters</h1>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2"
      />
      <button
        onClick={handleSearch}
        className="ml-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Search
      </button>

      <ul className="mt-4">
        {results.map((r) => (
          <li key={r.id} className="border p-2 mb-2">
            {r.name} ({r.email})
          </li>
        ))}
      </ul>
    </div>
  );
}
