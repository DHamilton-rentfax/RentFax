"use client";
import { useState } from "react";

export default function RenterInfoPage() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    dob: "",
  });

  return (
    <div className="p-10 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Information</h1>

      <div className="space-y-4">
        <input
          placeholder="Full Name"
          className="border p-3 w-full rounded-lg"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <input
          placeholder="Phone Number"
          className="border p-3 w-full rounded-lg"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          placeholder="Date of Birth"
          className="border p-3 w-full rounded-lg"
          value={form.dob}
          onChange={(e) => setForm({ ...form, dob: e.target.value })}
        />
      </div>

      <a
        href="/renter/verify/success"
        className="block bg-blue-600 text-white p-4 text-center rounded-lg mt-6"
      >
        Continue
      </a>
    </div>
  );
}
