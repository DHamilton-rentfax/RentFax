
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/hooks/use-auth.tsx";
import OnboardingProgress from "@/components/OnboardingProgress";

export default function Step2Page() {
  const router = useRouter();
  const { user, token } = useAuth();

  const [form, setForm] = useState({
    companyType: "",
    ein: "",
    address: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/onboarding/details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to save details");
      }

      router.push("/onboarding/step2-5");
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
        <OnboardingProgress step={1} totalSteps={5} />
        <h1 className="text-3xl font-bold mb-2">Business Details</h1>
        <p className="text-gray-300 mb-6">Tell us about your business.</p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm mb-1">Company Type</label>
            <input
              type="text"
              value={form.companyType}
              onChange={(e) => setForm({ ...form, companyType: e.target.value })}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">EIN</label>
            <input
              type="text"
              value={form.ein}
              onChange={(e) => setForm({ ...form, ein: e.target.value })}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
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
