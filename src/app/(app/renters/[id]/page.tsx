
"use client";
import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { FraudScoreSummaryCard } from "@/components/fraud-score-summary-card";

export default function RenterProfile({ params }: { params: { id: string } }) {
  const [renter, setRenter] = useState<any>(null);
  const [signals, setSignals] = useState<string[]>([]);
  const [fraudScore, setFraudScore] = useState<any>(null);

  async function loadRenterData() {
    const snap = await getDoc(doc(db, "renters", params.id));
    if (snap.exists()) {
      setRenter(snap.data());
      const res = await fetch(`/api/fraud?id=${params.id}`);
      setSignals(await res.json());
      
      const scoreSnap = await getDoc(doc(db, "fraud-scores", params.id));
      if (scoreSnap.exists()) {
        setFraudScore(scoreSnap.data());
      } else {
        // Mock data if no score is found
        setFraudScore({
          score: 0,
          signals: 0,
          status: "Not Reviewed",
          lastUpdated: new Date().toISOString(),
        });
      }
    }
  }

  useEffect(() => {
    loadRenterData();
  }, [params.id]);

  const handleMarkAsReviewed = async () => {
    await setDoc(doc(db, "fraud-scores", params.id), { ...fraudScore, status: "Reviewed" }, { merge: true });
    loadRenterData(); 
  };

  const handleFlagAsFraud = async () => {
    await setDoc(doc(db, "fraud-scores", params.id), { ...fraudScore, status: "Confirmed Fraud" }, { merge: true });
    loadRenterData();
  };

  if (!renter) return <p>Loading...</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
            {fraudScore && (
              <FraudScoreSummaryCard
                score={fraudScore.score}
                signals={fraudScore.signals}
                status={fraudScore.status}
                lastUpdated={new Date(fraudScore.lastUpdated).toLocaleString()}
                onMarkAsReviewed={handleMarkAsReviewed}
                onFlagAsFraud={handleFlagAsFraud}
              />
            )}
        </div>
        <div className="md:col-span-2">
            <h1 className="text-2xl font-bold">{renter.name}</h1>
            <p>Email: {renter.email}</p>
            <h2 className="mt-4 text-lg font-semibold">Fraud Signals</h2>
            <ul>
                {signals.length === 0 ? <li>None</li> : signals.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
        </div>
    </div>
  );
}
