"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { AlertTriangle, ShieldCheck, Search } from "lucide-react";
import { Card } from "./ui/Card";
import { Table } from "./ui/Table";
import Loader from "./ui/Loader";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function AdminFraudPanel() {
  const [flaggedRenters, setFlaggedRenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const q = query(
      collection(db, "renterProfiles"),
      where("alert", "==", true),
      orderBy("riskScore", "desc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const results = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setFlaggedRenters(results);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <Loader />;

  const headers = ["Name", "Email", "License", "Fraud Score", "Shared IDs", "Action"];
  const rows = flaggedRenters.map((r) => [
    r.name,
    r.emails?.[0] ?? "—",
    r.licenseHash?.slice(0, 10) + "...",
    <span
      className={`font-semibold ${
        r.riskScore >= 8
          ? "text-red-600"
          : r.riskScore >= 5
          ? "text-yellow-600"
          : "text-green-600"
      }`}
    >
      {r.riskScore ?? "N/A"}
    </span>,
    r.sharedIdentifiers?.length ?? 0,
    <Button
      size="sm"
      variant="outline"
      onClick={() => router.push(`/admin/renters/${r.id}`)}
    >
      <Search className="h-4 w-4 mr-1" /> View
    </Button>,
  ]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" /> Fraud Detection
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/admin/fraud/reports")}
        >
          View All
        </Button>
      </div>

      {flaggedRenters.length === 0 ? (
        <p className="text-gray-500 text-sm">No flagged renters at this time.</p>
      ) : (
        <Table headers={headers} rows={rows} />
      )}
    </Card>
  );
}
