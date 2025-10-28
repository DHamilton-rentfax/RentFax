"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Card } from "./ui/Card";
import { ShieldAlert, ShieldCheck, AlertTriangle, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FraudRiskSummaryCardProps {
  renterId: string;
}

export default function FraudRiskSummaryCard({ renterId }: FraudRiskSummaryCardProps) {
  const [renter, setRenter] = useState<any>(null);
  const [fraudSignals, setFraudSignals] = useState<any[]>([]);
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiInsight, setAiInsight] = useState<string>("Analyzing...");
  const [confidence, setConfidence] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const renterRef = doc(db, "renterProfiles", renterId);
      const renterSnap = await getDoc(renterRef);
      if (renterSnap.exists()) setRenter(renterSnap.data());

      const sigSnap = await getDocs(
        query(collection(db, "fraudSignals"), where("renterId", "==", renterId))
      );
      setFraudSignals(sigSnap.docs.map((d) => d.data()));

      const disputeSnap = await getDocs(
        query(collection(db, "disputes"), where("renterId", "==", renterId))
      );
      setDisputes(disputeSnap.docs.map((d) => d.data()));

      setLoading(false);
    }

    async function fetchAI() {
      if (!renterId) return;
      try {
        const res = await fetch("/api/ai/fraud-insight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ renterId }),
        });
        if (res.ok) {
            const data = await res.json();
            setAiInsight(data.insight || "No insight available");
            setConfidence(data.confidence || null);
        } else {
            setAiInsight("Could not load AI insight.");
        }
      } catch (error) {
        setAiInsight("Error fetching AI insight.");
      }
    }

    fetchData();
    fetchAI();
  }, [renterId]);

  if (loading) return <Card className="text-gray-500 text-sm">Analyzing fraud data...</Card>;
  if (!renter) return <Card className="text-gray-500 text-sm">Renter not found.</Card>;

  const risk = renter.riskScore ?? 0;
  const riskLevel =
    risk >= 8 ? "High Risk" : risk >= 5 ? "Moderate Risk" : "Low Risk";

  const riskColor =
    risk >= 8
      ? "text-red-600"
      : risk >= 5
      ? "text-yellow-600"
      : "text-green-600";

  const signalCount = fraudSignals.length;
  const openDisputes = disputes.filter((d) => d.status !== "resolved").length;

  const icon =
    risk >= 8 ? (
      <ShieldAlert className="h-6 w-6 text-red-500" />
    ) : risk >= 5 ? (
      <AlertTriangle className="h-6 w-6 text-yellow-500" />
    ) : (
      <ShieldCheck className="h-6 w-6 text-green-500" />
    );

  return (
    <Card className="p-5 border border-gray-200 bg-white shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-lg font-semibold text-gray-800">
            Fraud Risk Overview
          </h3>
        </div>
        <span
          className={cn(
            "text-sm font-medium",
            risk >= 8
              ? "text-red-600"
              : risk >= 5
              ? "text-yellow-600"
              : "text-green-600"
          )}
        >
          {riskLevel}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
        <div>
          <p className="text-gray-500 text-xs">Fraud Score</p>
          <p className={`font-bold text-xl ${riskColor}`}>{risk}/10</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Fraud Signals</p>
          <p className="font-bold">{signalCount}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Open Disputes</p>
          <p className="font-bold">{openDisputes}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs">Last Verified</p>
          <p className="font-bold">
            {renter.verifiedAt
              ? new Date(renter.verifiedAt.seconds * 1000).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-start gap-2 mb-4">
        <Brain className="h-5 w-5 text-blue-500 mt-0.5" />
        <p className="text-sm text-gray-700">
          {aiInsight}
          {confidence && (
            <span className="text-xs text-gray-500 ml-2">
              (Confidence: {confidence}%)
            </span>
          )}
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => (window.location.href = `/admin/fraud/signals?renter=${renterId}`)}
        >
          View Fraud Signals
        </Button>
        <Button
          size="sm"
          className="bg-[#1A2540] text-white hover:bg-[#2a3660]"
          onClick={() => (window.location.href = `/admin/renters/${renterId}`)}
        >
          View Full Report
        </Button>
      </div>
    </Card>
  );
}
