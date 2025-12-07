"use client";
import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";
import FraudScoreCard from "@/components/FraudScoreCard";
import { useAuth } from "@/hooks/use-auth";
import { runCodeAudit } from "@/lib/codesage";

export default function RenterProfile({ params }: { params: { id: string } }) {
  const [renter, setRenter] = useState<any>(null);
  const [signals, setSignals] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, "renters", params.id));
      if (snap.exists()) {
        setRenter({ id: snap.id, ...snap.data() });
        const res = await fetch(`/api/fraud?id=${params.id}`);
        setSignals(await res.json());
      }
    }
    load();
  }, [params.id]);

  if (!renter || !user) return <p>Loading...</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <FraudScoreCard renterId={params.id} userId={user.uid} />
      </div>
      <div className="md:col-span-2">
        <h1 className="text-2xl font-bold">{renter.name}</h1>
        <p>Email: {renter.email}</p>
        <h2 className="mt-4 text-lg font-semibold">Fraud Signals</h2>
        <ul>
          {signals.length === 0 ? (
            <li>None</li>
          ) : (
            signals.map((s, i) => <li key={i}>{s}</li>)
          )}
        </ul>
        <button
          onClick={async () => {
            const issues = await runCodeAudit(renter.id, renter.codeSample || "");
            if (issues.length > 0) {
              await addDoc(collection(db, "aiAudits"), {
                renterId: renter.id,
                createdAt: new Date(),
                issues
              });
            }
            if (issues.length === 0) alert("No issues found!");
            else alert(`Found ${issues.length} code issues.`);
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mt-4"
        >
          Run AI Code Audit
        </button>
      </div>
    </div>
  );
}
