
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/hooks/use-auth.tsx";
import OnboardingProgress from "@/components/OnboardingProgress";

export default function Step4Page() {
  const router = useRouter();
  const { user, token } = useAuth();

  const [invites, setInvites] = useState<string[]>([""]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInviteChange = (index: number, value: string) => {
    const newInvites = [...invites];
    newInvites[index] = value;
    setInvites(newInvites);
  };

  const addInvite = () => setInvites([...invites, ""]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/onboarding/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ invites: invites.filter((email) => email) }), // Filter out empty strings
      });

      if (!res.ok) {
        throw new Error("Failed to send invites");
      }

      router.push("/onboarding/step5");
    } catch (err) {
      console.error(err);
      setError("Failed to send invites. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <div className="max-w-lg w-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 text-center">
        <OnboardingProgress step={4} totalSteps={5} />
        <h1 className="text-3xl font-bold mb-2">Invite Your Team</h1>
        <p className="text-gray-300 mb-6">Add your team members to get started.</p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {invites.map((invite, index) => (
            <div key={index}>
              <label className="block text-sm mb-1">Email</label>
              <input
                type="email"
                value={invite}
                onChange={(e) => handleInviteChange(index, e.target.value)}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500"
                placeholder="name@company.com"
              />
            </div>
          ))}
          <button type="button" onClick={addInvite} className="text-blue-400 hover:underline">
            + Add another
          </button>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 py-3 rounded-xl font-medium hover:opacity-90 flex justify-center items-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? "Sending..." : "Continue"}
          </button>
          <button type="button" onClick={() => router.push("/onboarding/step5")} className="w-full text-center mt-2 text-gray-400 hover:underline">
            Skip for now
          </button>
        </form>
      </div>
    </main>
  );
}
