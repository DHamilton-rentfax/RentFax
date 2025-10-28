
// ===========================================
// RentFAX | Authenticated Dashboard Modal
// Location: src/components/dashboard/DashboardSearchModal.tsx
// ===========================================

"use client";
import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import countryList from "react-select-country-list";
import Select from "react-select";
import { Loader2 } from "lucide-react";
import { useModal } from "@/context/ModalContext";
import { useAuth } from "@/hooks/use-auth";
import { doc, getDoc, updateDoc, increment, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/client";
import Link from 'next/link';


interface RenterForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  license: string;
}

type SearchResult = { match: boolean; renterId?: string } | null;
type PlanType = "free" | "pro50" | "pro300" | "unlimited";

export default function DashboardSearchModal() {
  const { isModalOpen, closeModal } = useModal();
  const { user } = useAuth();
  const countries = useMemo(() => countryList().getData(), []);

  const [form, setForm] = useState<RenterForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
    country: "US",
    license: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult>(null);
  const [userPlan, setUserPlan] = useState<PlanType>("free");
  const [remainingCredits, setRemainingCredits] = useState(0);
  const [showNoCredits, setShowNoCredits] = useState(false);

  useEffect(() => {
    const fetchUserPlan = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserPlan(userData.planType || "free");
          setRemainingCredits(userData.remainingCredits || 0);
        }
      }
    };
    if(isModalOpen) {
        fetchUserPlan();
    }
  }, [user, isModalOpen]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    if (!user) {
        closeModal();
        // Maybe redirect to login here
        return;
    }

    const hasCredits = userPlan === 'unlimited' || (userPlan !== 'free' && remainingCredits > 0);
    if (!hasCredits) {
        setShowNoCredits(true);
        setLoading(false);
        return;
    }

    try {
      const res = await fetch("/api/report/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data);

      // Deduct credit and log search
      if (userPlan !== 'free' && userPlan !== 'unlimited') {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, {
            remainingCredits: increment(-1)
        });
        setRemainingCredits(prev => prev -1);
      }
      
      await addDoc(collection(db, `searchLogs/${user.uid}/logs`), {
          renterName: form.name,
          timestamp: serverTimestamp(),
          result: data.match ? "match" : "no-match",
          usedCredit: userPlan !== 'free',
          renterRef: data.renterId || null
      });

    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  const getButtonText = () => {
    if (userPlan === 'free') return "Upgrade to Search";
    if (userPlan === 'unlimited') return "Search Renter (Unlimited)";
    return `Search Using 1 Credit (${remainingCredits} left)`;
  }

  const resetModal = () => {
    setForm({ name: "", email: "", phone: "", address: "", country: "US", license: "" });
    setResult(null);
    setShowNoCredits(false);
    setLoading(false);
    closeModal();
  }

  const handleReportAction = (action: 'view' | 'basic') => {
    // In a real app, you might have different logic for 'basic' lookup
    if(result?.renterId) {
        window.location.href = `/report/${result.renterId}`;
    }
  }

  const renderContent = () => {
    if(loading) return <div className="flex justify-center items-center p-10"><Loader2 className="h-12 w-12 animate-spin text-blue-600" /></div>;
    
    if(showNoCredits) return (
        <div className="text-center py-4">
            <h3 className="text-lg font-semibold">No Credits Remaining</h3>
            <p className="text-sm text-gray-600 mt-2 mb-4">You've used all your available reports for this month. Please upgrade your plan or purchase more credits to continue.</p>
            <Link href="/pricing#add-ons" passHref>
                <Button className="w-full mb-2">Buy More Credits</Button>
            </Link>
            <Link href="/pricing" passHref>
                <Button variant="outline" className="w-full">Upgrade Plan</Button>
            </Link>
            <Button variant="link" onClick={() => setShowNoCredits(false)} className="mt-2">Go Back</Button>
        </div>
    );

    if(result) return (
        <div className="text-center py-4">
            {result.match ? (
                <>
                    <h3 className="text-lg font-semibold">Match Found!</h3>
                    <p className="text-sm text-gray-600 mt-2 mb-4">We found an existing record for this renter. View a detailed report containing incidents, disputes, and risk score.</p>
                    <Button onClick={() => handleReportAction('view')} className="w-full">View Full Report (1 Credit)</Button>
                </>
            ) : (
                <>
                    <h3 className="text-lg font-semibold">No Report Found</h3>
                    <p className="text-sm text-gray-600 mt-2 mb-4">No records matched your search. You can perform a basic verification check to confirm renter authenticity.</p>
                    <Button onClick={() => handleReportAction('basic')} className="w-full">Run Basic Lookup (1 Credit)</Button>
                </>
            )}
            <Button variant="link" onClick={() => setResult(null)} className="mt-2">Search again</Button>
        </div>
    );

    return (
        <form onSubmit={handleSearch} className="space-y-4">
            <div><Input id="name" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
            <div><Input id="email" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required/></div>
            <PhoneInput country={form.country.toLowerCase()} value={form.phone} onChange={(phone, country: any) => setForm({...form, phone, country: country.countryCode.toUpperCase()})} inputStyle={{width: '100%'}}/>
            <div><Input id="address" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}/></div>
            <div><Input id="license" placeholder="Driver’s License / ID Number" value={form.license} onChange={(e) => setForm({ ...form, license: e.target.value })}/></div>
            <Select options={countries} value={countries.find(c => c.value === form.country)} onChange={(val: any) => setForm({ ...form, country: val.value})} />
            <Button type="submit" className="w-full" disabled={(userPlan === 'pro50' || userPlan === 'pro300') && remainingCredits <= 0}>{getButtonText()}</Button>
        </form>
    )
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-md bg-white p-6 rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle>Search Renter Records</DialogTitle>
          {(userPlan === 'pro50' || userPlan === 'pro300') && 
            <DialogDescription>This will use 1 of your {remainingCredits} monthly credits. Credits reset on your billing date.</DialogDescription>
          }
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
