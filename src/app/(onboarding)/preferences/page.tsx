"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/context/OnboardingContext";

const RENTAL_TYPES = [
  { id: "vehicles", label: "Vehicles (cars, trucks, motorcycles)" },
  { id: "properties", label: "Rental Properties (rooms, apartments, homes)" },
  { id: "equipment", label: "Equipment (tools, machinery, electronics)" },
  { id: "furniture", label: "Furniture Rentals" },
  { id: "other", label: "Other / Custom" },
];

export default function PreferencesPage() {
  const router = useRouter();
  const { data, update } = useOnboarding();

  const [rentalType, setRentalType] = useState(data.preferences?.rentalType || "");
  const [monthlyVolume, setMonthlyVolume] = useState(data.preferences?.monthlyVolume || "");
  const [notes, setNotes] = useState(data.preferences?.notes || "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!rentalType) return setError("Select at least one rental category.");
    if (!monthlyVolume) return setError("Select your approximate monthly rental volume.");

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rentalType,
          monthlyVolume,
          notes,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      update("preferences", { rentalType, monthlyVolume, notes });

      router.push("/onboarding/complete");
    } catch (err: any) {
      setError(err.message || "Failed to save preferences.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold">Rental Preferences</h1>
      <p className="text-gray-600">
        We personalize your dashboard and risk engine based on the type of rentals you manage.
      </p>

      {/* RENTAL TYPE */}
      <div>
        <label className="text-sm font-medium">What do you rent?</label>
        <div className="mt-2 space-y-2">
          {RENTAL_TYPES.map((t) => (
            <label
              key={t.id}
              className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
            >
              <input
                type="radio"
                name="rentalType"
                value={t.id}
                checked={rentalType === t.id}
                onChange={() => setRentalType(t.id)}
              />
              <span>{t.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* MONTHLY VOLUME */}
      <div>
        <label className="text-sm font-medium">Approx. Monthly Rentals</label>
        <select
          value={monthlyVolume}
          onChange={(e) => setMonthlyVolume(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mt-1"
        >
          <option value="">Select volume range</option>
          <option value="1-10">1–10 rentals per month</option>
          <option value="10-25">10–25 rentals per month</option>
          <option value="25-50">25–50 rentals per month</option>
          <option value="50-100">50–100 rentals per month</option>
          <option value="100+">100+ rentals per month</option>
        </select>
      </div>

      {/* NOTES / CUSTOM */}
      <div>
        <label className="text-sm font-medium">Anything special about your operation?</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mt-1"
          rows={4}
          placeholder="Optional: Tell us about your use-case or risk challenges."
        />
      </div>

      {/* ERROR */}
      {error && <div className="text-red-600 text-sm">{error}</div>}

      {/* CONTINUE */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 disabled:opacity-50"
      >
        {loading ? "Saving…" : "Continue"}
      </button>

      {/* BACK */}
      <button
        onClick={() => router.push("/onboarding/owner-info")}
        className="w-full text-sm text-gray-600 underline"
      >
        Back
      </button>
    </div>
  );
}
