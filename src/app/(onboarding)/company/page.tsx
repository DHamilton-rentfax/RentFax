"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Loader2 } from "lucide-react";

import { db , auth } from "@/firebase/client";
import OnboardingProgress from "@/components/OnboardingProgress";

export default function CompanyOnboardingPage() {
  const router = useRouter();
  const [user] = useAuthState(auth);

  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    phone: "",
    website: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      await updateDoc(doc(db, "users", user.uid), {
        ...form,
      });
      router.push("/onboarding/call");
    } catch (err) {
      console.error(err);
      setError("Failed to save. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <div className="max-w-lg w-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 text-center">
        <OnboardingProgress step={2} totalSteps={4} />
        <h1 className="text-3xl font-bold mb-2">Company Setup</h1>
        <p className="text-gray-300 mb-6">Let’s get your RentFAX company profile ready</p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm mb-1">Company Name</label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Contact Name</label>
            <input
              type="text"
              value={form.contactName}
              onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Website</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl"
              placeholder="https://yourcompany.com"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Address</label>
            <textarea
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl"
              rows={3}
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 py-3 rounded-xl font-medium hover:opacity-90 flex justify-center items-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    </main>
  );
}
