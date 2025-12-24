"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/context/OnboardingContext";

export default function OwnerInfoPage() {
  const router = useRouter();
  const { data, update } = useOnboarding();

  const [form, setForm] = useState({
    fullName: data.owner?.fullName || "",
    email: data.owner?.email || "",
    phone: data.owner?.phone || "",
    role: data.owner?.role || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit() {
    if (!form.fullName.trim()) return setError("Full name is required.");
    if (!form.email.trim() || !form.email.includes("@"))
      return setError("Valid email is required.");
    if (!form.phone.trim())
      return setError("Phone number is required.");

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/onboarding/owner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      update("owner", form);
      router.push("/onboarding/preferences");

    } catch (err: any) {
      setError(err.message || "Failed to save owner info.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold">Owner Information</h1>
      <p className="text-gray-600">
        Tell us about the primary owner or administrator for your RentFAX account.
      </p>

      {/* FULL NAME */}
      <div>
        <label className="text-sm font-medium">Full Name</label>
        <input
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mt-1"
          placeholder="Your full legal name"
        />
      </div>

      {/* EMAIL */}
      <div>
        <label className="text-sm font-medium">Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mt-1"
          placeholder="your@email.com"
        />
      </div>

      {/* PHONE */}
      <div>
        <label className="text-sm font-medium">Phone Number</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mt-1"
          placeholder="555-555-5555"
        />
      </div>

      {/* ROLE */}
      <div>
        <label className="text-sm font-medium">Your Role</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 mt-1"
        >
          <option value="">Select Role</option>
          <option value="owner">Owner</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
      </div>

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
        onClick={() => router.push("/onboarding/company-info")}
        className="w-full text-sm text-gray-600 underline"
      >
        Back
      </button>
    </div>
  );
}
