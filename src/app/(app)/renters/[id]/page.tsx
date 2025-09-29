
"use client";
import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { doc, getDoc } from "firebase/firestore";

export default function RenterProfile({ params }: { params: { id: string } }) {
  const [renter, setRenter] = useState<any>(null);
  const [signals, setSignals] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, "renters", params.id));
      if (snap.exists()) {
        setRenter(snap.data());
        const res = await fetch(`/api/fraud?id=${params.id}`);
        setSignals(await res.json());
      }
    }
    load();
  }, [params.id]);

  if (!renter) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{renter.name}</h1>
      <p>Email: {renter.email}</p>
      <h2 className="mt-4 text-lg font-semibold">Fraud Signals</h2>
      <ul>
        {signals.length === 0 ? <li>None</li> : signals.map((s, i) => <li key={i}>{s}</li>)}
      </ul>
    </div>
  );
}
