'use client';

import { useEffect, useState } from 'react';
import { db } from '@/firebase/client';
import { doc, getDoc, collection, query, where, orderBy, getDocs, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import { Card } from '@/components/dashboard/ui/Card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, Clock, AlertTriangle, Briefcase, Star, XCircle, Crown } from 'lucide-react';
import { toast } from 'sonner';

// Component to prompt user to upgrade
const UpgradePrompt = ({ role, onUpgrade }: { role: string; onUpgrade: (plan: string) => void }) => (
  <Card className="p-8 text-center">
    <Crown className="mx-auto h-12 w-12 text-yellow-500" />
    <h2 className="mt-4 text-xl font-bold">Upgrade Required</h2>
    <p className="mt-2 text-gray-600">Your plan is inactive. Please choose a plan to access the dashboard and manage cases.</p>
    <div className="mt-6 flex justify-center gap-4">
        <Button size="lg" onClick={() => onUpgrade('starter')}><Star className="mr-2 h-4 w-4"/> Starter Plan</Button>
        <Button size="lg" onClick={() => onUpgrade('pro')}><Crown className="mr-2 h-4 w-4"/> Pro Plan</Button>
    </div>
  </Card>
);

// Main dashboard component
export default function AgencyDashboardPage() {
  const { user } = useAuth();
  const [partner, setPartner] = useState<any>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBillingLoading, setBillingLoading] = useState(false);

  const fetchPartnerData = async () => {
    if (!user) return;
    try {
      const partnerRef = doc(db, "collectionAgencies", user.uid);
      const partnerSnap = await getDoc(partnerRef);
      if (partnerSnap.exists()) {
        setPartner({ id: partnerSnap.id, ...partnerSnap.data() });
      } else {
        toast.error("Partner data not found.");
      }
    } catch (error) {
      console.error("Error fetching partner data:", error);
    }
  };

  const fetchCases = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, "cases"), where("assignedAgencyId", "==", user.uid), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setCases(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error fetching cases:", error);
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([fetchPartnerData(), fetchCases()]).finally(() => setLoading(false));
    }
  }, [user]);

  const handleBillingAction = async (action: 'checkout' | 'portal', plan?: string) => {
    if (!user) return;
    setBillingLoading(true);
    const endpoint = action === 'checkout' ? '/api/billing/partner/checkout' : '/api/billing/partner/portal';
    const body = { userId: user.uid, role: 'agency', ...(plan && { plan }) };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "An unexpected error occurred.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to connect to billing service.");
    } finally {
      setBillingLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center py-20"><Loader2 className="h-10 w-10 animate-spin text-blue-600" /></div>;
  if (!user || !partner) return null; // Or a more specific error/login prompt

  // Access Gating Logic
  if (partner.billingStatus !== 'active') {
      return <UpgradePrompt role="agency" onUpgrade={(plan) => handleBillingAction('checkout', plan)} />;
  }

  // ... existing case update logic ...
  const updateCaseStatus = async (caseId: string, status: string) => { /* as before */ };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A2540] flex items-center gap-2"><Briefcase /> Agency Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome, {partner.name}.</p>
        </div>
        <Card className="p-4 flex items-center gap-6">
            <div>
                <p className=\"text-xs text-gray-500\">Plan</p>
                <p className=\"font-semibold capitalize\">{partner.plan || 'N/A'}</p>
            </div>
             <div>
                <p className=\"text-xs text-gray-500\">Case Credits</p>
                <p className=\"font-semibold\">{partner.caseCredits ?? 0} remaining</p>
            </div>
            <Button onClick={() => handleBillingAction('portal')} disabled={isBillingLoading}>
              {isBillingLoading ? <Loader2 className=\"mr-2 h-4 w-4 animate-spin\" /> : null}
              Manage Billing
            </Button>
        </Card>
      </div>

      {/* ... rest of the case display logic ... */}
    </div>
  );
}
