"use client";

import { useState, useEffect } from "react";
import SearchRenterModal from "@/components/search/SearchRenterModal";
import { Button } from "@/components/ui/button";
import RecentCompanySearches from "./RecentCompanySearches";
import { useAuth } from "@/hooks/use-auth";
import { BillingUsageCard } from "./BillingUsageCard";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/client";

export default function CompanyDashboardPage() {
  const { user } = useAuth();
  const [openSearch, setOpenSearch] = useState(false);
  const [companyStats, setCompanyStats] = useState<any>(null);

  useEffect(() => {
    if (!user?.companyId) return;

    async function loadStats() {
      const ref = doc(db, "companies", user.companyId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const d = snap.data();

        setCompanyStats({
          identityChecks: d.identityChecksPurchased || 0,
          reportsPurchased: d.reportsPurchased || 0,
          totalSpend: d.totalSpend || 0,
        });
      }
    }

    loadStats();
  }, [user]);

  // -------------------------------
  // Handle Search Payload
  // -------------------------------

  async function runSearch(payload: any) {
    try {
      const res = await fetch("/api/search-renter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          userId: user?.uid ?? null,
          companyId: user?.companyId ?? null,
          role: "company",
        }),
      });

      const data = await res.json();
      return data; // <-- the modal receives ResultData
    } catch (err) {
      console.error("Company search failed:", err);
      throw err;
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-[#1A2540]">Company Dashboard</h1>

        <Button
          onClick={() => setOpenSearch(true)}
          className="bg-[#1A2540] hover:bg-[#27304f] text-white"
        >
          Search Renter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {companyStats && <BillingUsageCard stats={companyStats} />}
      </div>

      {user && <RecentCompanySearches userId={user.uid} />}

      {/* SEARCH MODAL */}
      <SearchRenterModal
        open={openSearch}
        onClose={() => setOpenSearch(false)}
        onSearch={runSearch}
        user={user}
      />
    </div>
  );
}
