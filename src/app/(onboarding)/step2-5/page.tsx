
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/hooks/use-auth.tsx";
import OnboardingProgress from "@/components/OnboardingProgress";

export default function Step25Page() {
  const router = useRouter();
  const { user, token } = useAuth();

  const [form, setForm] = useState({
    hasAuthority: false,
    acceptTerms: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/onboarding/compliance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Failed to save compliance");
      }

      router.push("/onboarding/step3");
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
        <OnboardingProgress step={2} totalSteps={5} />
        <h1 className="text-3xl font-bold mb-2">Compliance</h1>
        <p className="text-gray-300 mb-6">Please confirm the following.</p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasAuthority"
              checked={form.hasAuthority}
              onChange={(e) => setForm({ ...form, hasAuthority: e.target.checked })}
              className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="hasAuthority" className="ml-2 block text-sm text-gray-300">
              I have the authority to report on behalf of my company.
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="acceptTerms"
              checked={form.acceptTerms}
              onChange={(e) => setForm({ ...form, acceptTerms: e.target.checked })}
              className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-300">
              I accept the <a href="/terms" target="_blank" className="text-blue-400 hover:underline">Terms of Service</a>.
            </label>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading || !form.hasAuthority || !form.acceptTerms}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 py-3 rounded-xl font-medium hover:opacity-90 flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? "Saving..." : "Continue"}
          </button>
        </form>
      </div>
    </main>
  );
}
