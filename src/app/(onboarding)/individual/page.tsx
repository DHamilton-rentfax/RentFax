"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Loader2 } from "lucide-react";

import { db , auth } from "@/firebase/client";
import OnboardingProgress from "@/components/OnboardingProgress";

export default function IndividualOnboardingPage() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    await updateDoc(doc(db, "users", user.uid), {
      onboardingCompleted: true,
      ...form,
    });

    router.push("/onboarding/success");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <div className="max-w-lg w-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 text-center">
        <OnboardingProgress step={2} />
        <h1 className="text-3xl font-bold mb-2">Welcome to RentFAX</h1>
        <p className="text-gray-300 mb-6">Let’s personalize your experience</p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <input
              type="text"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
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
            <label className="block text-sm mb-1">City</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 py-3 rounded-xl font-medium hover:opacity-90 flex justify-center items-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? "Saving..." : "Complete Setup"}
          </button>
        </form>
      </div>
    </main>
  );
}
