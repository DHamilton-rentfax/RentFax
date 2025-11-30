"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import SearchRenterModalMaster from "@/components/search/SearchRenterModalMaster";
import { Search } from "lucide-react";
import { getBillingStatus, BillingStatus } from "@/app/actions/get-billing-status";
import BillingStatusCard from "@/components/dashboard/billing/BillingStatusCard";
import UpgradeModal from "@/components/dashboard/billing/UpgradeModal";
import RecentSearches from "./RecentSearches";
import { useAuth } from "@/hooks/use-auth";

export default function LandlordDashboardPage() {
  const { user } = useAuth();
  const [panelOpen, setPanelOpen] = useState(false);
  const [billingStatus, setBillingStatus] = useState<BillingStatus | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  // Load billing status
  useEffect(() => {
    async function load() {
      if (user?.uid) {
        try {
          const status = await getBillingStatus(user.uid);
          setBillingStatus(status);
        } catch (err) {
          console.error("Couldn't load billing status:", err);
        }
      }
    }
    load();
  }, [user]);

  return (
    <div className="p-8 space-y-10">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-[#1A2540]">
          Landlord Dashboard
        </h1>

        <Button
          className="bg-[#1A2540] hover:bg-[#27304f] text-white flex items-center gap-2"
          onClick={() => setPanelOpen(true)}
        >
          <Search size={18} />
          Search Renter
        </Button>
      </div>

      {/* Billing Status */}
      {billingStatus && (
        <BillingStatusCard
          status={billingStatus}
          onUpgrade={() => setUpgradeModalOpen(true)}
        />
      )}

      {/* Recent Searches */}
      {user && <RecentSearches userId={user.uid} />}

      {/* Search Modal (Option A – Results inside modal) */}
      <SearchRenterModalMaster
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        user={user}
      />

      <UpgradeModal open={upgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} />
    </div>
  );
}
