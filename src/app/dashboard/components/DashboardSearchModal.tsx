// ===========================================
// RentFAX | Authenticated Dashboard Search Modal
// Location: src/app/dashboard/components/DashboardSearchModal.tsx
// ===========================================
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useModal } from "@/context/ModalContext";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/firebase/client";
import { doc, getDoc, updateDoc, increment, addDoc, collection } from "firebase/firestore";

export default function DashboardSearchModal() {
  const { isModalOpen, closeModal } = useModal();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    license: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { match: boolean; renterId?: string }>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [planType, setPlanType] = useState<string>("");

  // ---- Fetch user plan + credits on mount ----
  useEffect(() => {
    if (!user) return;
    (async () => {
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        setCredits(data.remainingCredits ?? 0);
        setPlanType(data.planType ?? "free");
      }
    })();
  }, [user]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return alert("You must be logged in to search renters.");

    // ---- Enforce credit / plan gating ----
    if (planType === "free") {
      return alert("Upgrade to a paid plan to perform searches.");
    }
    if ((credits ?? 0) <= 0) {
      return alert("You have no remaining credits. Please buy more or upgrade your plan.");
    }

    setLoading(true);
    setResult(null);

    try {
      // Call API route
      const res = await fetch("/api/report/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      // Deduct 1 credit
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { remainingCredits: increment(-1) });

      // Log search
      await addDoc(collection(db, "searchLogs"), {
        userId: user.uid,
        renterName: form.name,
        renterRef: data.renterId || null,
        timestamp: Date.now(),
        result: data.match ? "match" : "no_match",
        usedCredit: true,
      });

      setResult(data);
      setCredits((prev) => (prev ? prev - 1 : 0));
    } catch (err) {
      console.error("Search failed:", err);
      alert("Something went wrong while searching. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const resetModal = () => {
    setForm({ name: "", email: "", phone: "", address: "", license: "" });
    setResult(null);
    setLoading(false);
    closeModal();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={resetModal}>
      <DialogContent className="max-w-md bg-white p-6 rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle>Search Renter Records</DialogTitle>
          <DialogDescription>
            Use one credit to search RentFAX’s global renter database. Credits refresh monthly based on your plan.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
          </div>
        ) : result ? (
          <div className="text-center py-4 space-y-3">
            {result.match ? (
              <>
                <h3 className="text-lg font-semibold">Match Found!</h3>
                <p className="text-sm text-gray-600">We found an existing record for this renter.</p>
                <Button
                  onClick={() => (window.location.href = `/reports/${result.renterId}`)}
                  className="w-full"
                >
                  View Full Report
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold">No Report Found</h3>
                <p className="text-sm text-gray-600">
                  No report exists yet for this renter. You can start a new one using your credit.
                </p>
                <Button
                  onClick={() => (window.location.href = `/reports/create?name=${form.name}`)}
                  className="w-full"
                >
                  Create Report
                </Button>
              </>
            )}
            <Button variant="link" onClick={() => setResult(null)}>Search again</Button>
          </div>
        ) : (
          <form onSubmit={handleSearch} className="space-y-3">
            <Input
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <Input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Input
              placeholder="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <Input
              placeholder="Driver’s License / ID Number"
              value={form.license}
              onChange={(e) => setForm({ ...form, license: e.target.value })}
            />
            <Button type="submit" className="w-full">
              {credits !== null ? `Search (Uses 1 Credit – ${credits} remaining)` : "Search Reports"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
