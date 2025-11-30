"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/firebase/client";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function EnterpriseApplyPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    companyName: "",
    fullName: "",
    email: "",
    phone: "",
    industry: "",
    locations: "",
    ein: "",
    duns: "",
    website: "",
  });

  const [loading, setLoading] = useState(false);

  const update = (k: string, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await setDoc(doc(db, "enterprise_requests", `${Date.now()}-${form.email}`), {
        ...form,
        createdAt: serverTimestamp(),
        status: "PENDING",
      });

      router.push("/enterprise/thank-you");
    } catch (err) {
      alert("Error submitting request");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white px-6 py-24 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-900">
        Enterprise Application
      </h1>

      <form onSubmit={submit} className="space-y-6 mt-10">
        
        <Field label="Company Name" val={form.companyName} set={(v) => update("companyName", v)} />
        <Field label="Full Name" val={form.fullName} set={(v) => update("fullName", v)} />
        <Field label="Email" val={form.email} set={(v) => update("email", v)} type="email" />
        <Field label="Phone" val={form.phone} set={(v) => update("phone", v)} />
        <Field label="Industry" val={form.industry} set={(v) => update("industry", v)} />
        <Field label="Estimated Locations" val={form.locations} set={(v) => update("locations", v)} />
        <Field label="EIN (Employer Identification Number)" value={form.ein} set={(v) => update("ein", v)} />
        <Field label="DUNS Number" value={form.duns} set={(v) => update("duns", v)} />
        <Field label="Company Website" placeholder="https://" value={form.website} set={(v) => update("website", v)} />

        <button
          type="submit"
          className="w-full py-4 bg-black text-white rounded-lg font-semibold text-lg"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}

function Field({ label, val, set, type = "text" }: any) {
  return (
    <div className="space-y-2">
      <label className="text-gray-700 font-medium">{label}</label>
      <input
        type={type}
        value={val}
        onChange={(e) => set(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-3"
        required
      />
    </div>
  );
}
