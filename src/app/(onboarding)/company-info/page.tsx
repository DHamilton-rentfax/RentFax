"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/context/OnboardingContext";

export default function CompanyInfoPage() {
  const router = useRouter();
  const { data, update } = useOnboarding();

  const [form, setForm] = useState({
    name: data.company?.name || "",
    type: data.company?.type || "",
    size: data.company?.size || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    if (!form.name.trim()) {
      setError("Company name is required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to save company.");

      update("company", form);
      router.push("/onboarding/owner-info");

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold">Company Information</h1>
      <p className="text-gray-600">
        Tell us about your business so we can customize your RentFAX experience.
      </p>

      {/* COMPANY NAME */}
      <div>
        <label className="text-sm font-medium">Company Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mt-1"
          placeholder="Example: Miami Luxury Rentals LLC"
        />
      </div>

      {/* COMPANY TYPE */}
      <div>
        <label className="text-sm font-medium">Company Type</label>
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mt-1"
        >
          <option value="">Select Type</option>
          <option value="car-rental">Car Rental</option>
          <option value="housing-rental">Housing Rental</option>
          <option value="property-management">Property Management</option>
          <option value="equipment-rental">Equipment Rental</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* COMPANY SIZE */}
      <div>
        <label className="text-sm font-medium">Company Size</label>
        <select
          name="size"
          value={form.size}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mt-1"
        >
          <option value="">Select Size</option>
          <option value="solo">Just Me</option>
          <option value="2-5">2–5 Employees</option>
          <option value="6-20">6–20 Employees</option>
          <option value="20+">20+ Employees</option>
        </select>
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

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
        onClick={() => router.push("/onboarding/start")}
        className="w-full text-sm text-gray-600 underline"
      >
        Back
      </button>
    </div>
  );
}
