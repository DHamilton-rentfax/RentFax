// src/components/MockCheckoutButton.tsx
"use client";

import { useState } from "react";
import { doc, setDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";

import { db } from "@/firebase/client"; // Assuming this is your existing firebase client export

interface Props {
  companyName: string;
  companyId?: string; // optional, if user/company already exists
  planName: string;
  monthlyRevenue?: number;
}

export default function MockCheckoutButton({ companyName, companyId, planName, monthlyRevenue = 99 }: Props) {
  const [loading, setLoading] = useState(false);

  const handleMockCheckout = async () => {
    setLoading(true);
    toast.loading("Simulating checkout...");

    try {
      // Use a predefined ID for demo purposes or create a new one
      const compId = companyId || doc(collection(db, "companies")).id;

      // Create billing doc
      await setDoc(doc(db, "billing", compId), {
        companyId: compId,
        companyName,
        plan: planName,
        status: "active",
        monthlyRevenue,
        demo: true,
        createdAt: serverTimestamp(),
      });

      // Write audit log
      await addDoc(collection(db, "auditLogs"), {
        action: "DEMO_SUBSCRIPTION_CREATED",
        performedBy: "demo-customer",
        role: "CUSTOMER",
        targetId: compId,
        metadata: { plan: planName, companyName },
        timestamp: serverTimestamp(),
      });

      toast.dismiss();
      toast.success(`'${companyName}' is now subscribed to ${planName}! (Demo)`);

    } catch (err) {
      console.error("Mock checkout error", err);
      toast.dismiss();
      toast.error("Mock checkout failed. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleMockCheckout}
      disabled={loading}
      className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition disabled:bg-gray-400"
    >
      {loading ? "Processing..." : `Start ${planName}`}
    </button>
  );
}
