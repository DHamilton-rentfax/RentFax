"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function PublicSearch() {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    setResult(null); // Reset previous results
    try {
        const r = await fetch("/api/public/search", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
        });
        const data = await r.json();
        setResult(data);
    } catch (error) {
        console.error("Search failed:", error);
        setResult({ found: false, error: "An unexpected error occurred." });
    }
    setLoading(false);
  }

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6 bg-gray-50 min-h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Search Renter Report</h1>
        <p className="text-gray-600 mt-2">Instantly access verified renter reports.</p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md space-y-4">
        <div>
            <label className="text-sm font-medium text-gray-700">Full Name</label>
            <input className="border p-2 w-full rounded-md mt-1" placeholder="e.g., Jane Doe"
                onChange={e=>setForm({...form, fullName:e.target.value})} />
        </div>
        <div>
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input className="border p-2 w-full rounded-md mt-1" placeholder="e.g., jane.doe@example.com"
                onChange={e=>setForm({...form, email:e.target.value})} />
        </div>
        <div>
            <label className="text-sm font-medium text-gray-700">Phone Number</label>
            <input className="border p-2 w-full rounded-md mt-1" placeholder="e.g., (555) 123-4567"
                onChange={e=>setForm({...form, phone:e.target.value})} />
        </div>

        <Button className="w-full !mt-6" onClick={submit} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : "Search"}
        </Button>
      </div>

      {result && (
        <div className="p-6 border rounded-lg bg-white shadow-md text-center">
          {result.found ? (
            <div>
              <p className="font-semibold text-lg text-green-600">Report Found!</p>
              <p className="text-gray-700 mt-2">A verified report for {form.fullName} is available.</p>
              <p className="text-2xl font-bold my-4">$19.99</p>
              <Button onClick={() => window.location.href=result.checkoutUrl}>
                Purchase and Unlock Full Report
              </Button>
            </div>
          ) : (
            <p className="text-red-500">
              {result.error || "No matching renter found. They may not be in our system yet or the details provided are incorrect."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
