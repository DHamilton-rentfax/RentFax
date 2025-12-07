"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Card } from "./ui/Card";
import { ShieldCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RenterFraudSummaryCardProps {
  renterId: string;
}

export default function RenterFraudSummaryCard({
  renterId,
}: RenterFraudSummaryCardProps) {
  const [renter, setRenter] = useState<any>(null);
  const [openDisputes, setOpenDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!renterId) {
        setLoading(false);
        return;
    };

    async function fetchData() {
      // Fetch renter profile
      const renterRef = doc(db, "renterProfiles", renterId);
      const renterSnap = await getDoc(renterRef);
      if (renterSnap.exists()) {
        setRenter(renterSnap.data());
      }

      // Fetch open disputes using the new schema in mind
      const disputeQuery = query(
        collection(db, "disputes"),
        where("renterId", "==", renterId),
        where("status", "!=", "resolved")
      );
      const disputeSnap = await getDocs(disputeQuery);
      setOpenDisputes(disputeSnap.docs.map((d) => d.data()));

      setLoading(false);
    }
    fetchData();
  }, [renterId]);

  if (loading) {
    return <Card className="p-4 text-sm text-gray-500">Loading your summary...</Card>;
  }

  if (!renter) {
    return <Card className="p-4 text-sm text-gray-500">Could not find your profile.</Card>;
  }

  const riskScore = renter.riskScore ?? 0;
  const hasOpenDisputes = openDisputes.length > 0;

  let statusMessage = "Your account is verified. No issues detected.";
  let icon = <ShieldCheck className="h-6 w-6 text-green-500" />;

  if (hasOpenDisputes) {
    const filerName = openDisputes[0].filedByName || "a landlord or property manager";
    statusMessage = `You have ${
      openDisputes.length
    } open dispute(s) filed by ${filerName}. Please review to resolve.`;
    icon = <ShieldAlert className="h-6 w-6 text-yellow-500" />;
  } else if (riskScore > 4) {
    statusMessage =
      "Your account has some inconsistencies that may require re-verification. Please review your details to ensure accuracy.";
    icon = <ShieldAlert className="h-6 w-6 text-yellow-500" />;
  }

  return (
    <Card className="p-5 bg-white shadow-sm border border-gray-200 rounded-lg">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Your Account Status
            </h3>
            <p className="text-sm text-gray-600">{statusMessage}</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0 ml-4">
          <p className="text-gray-500 text-xs font-medium">Integrity Score</p>
          <p
            className={`font-bold text-xl ${
              riskScore > 4 ? "text-yellow-600" : "text-green-600"
            }`}
          >
            {riskScore}/10
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-100">
        <span>
          Last Verified:{" "}
          <span className="font-medium text-gray-700">
            {renter.verifiedAt
              ? new Date(renter.verifiedAt.seconds * 1000).toLocaleDateString()
              : "Not verified"}
          </span>
        </span>
        <Button
          variant="default"
          size="sm"
          className="bg-[#1A2540] text-white hover:bg-[#2a3660]"
          onClick={() => (window.location.href = `/portal/disputes`)}
        >
          {hasOpenDisputes ? "Review Dispute(s)" : "View My Account"}
        </Button>
      </div>
    </Card>
  );
}
