"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";

export default function EndRentalPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    renterId: "",
    timeliness: 5,
    cleanliness: 5,
    communication: 5,
    damageReported: false,
    comments: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | string>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/rentals/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          renterId: form.renterId,
          userId: user?.uid,
          scores: {
            timeliness: form.timeliness,
            cleanliness: form.cleanliness,
            communication: form.communication,
            damageReported: form.damageReported,
          },
          comments: form.comments,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setResult("Rental review submitted successfully.");
      } else {
        setResult(data.error);
      }
    } catch (err) {
      console.error("Submit error:", err);
      setResult("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">End of Rental Review</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="renterId">Renter ID</Label>
          <Input
            id="renterId"
            placeholder="renter_abc123"
            value={form.renterId}
            onChange={(e) => setForm({ ...form, renterId: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Timeliness (1–5)</Label>
            <Input
              type="number"
              value={form.timeliness}
              min={1}
              max={5}
              onChange={(e) => setForm({ ...form, timeliness: +e.target.value })}
            />
          </div>
          <div>
            <Label>Cleanliness (1–5)</Label>
            <Input
              type="number"
              value={form.cleanliness}
              min={1}
              max={5}
              onChange={(e) => setForm({ ...form, cleanliness: +e.target.value })}
            />
          </div>
        </div>
        <div>
          <Label>Communication (1–5)</Label>
          <Input
            type="number"
            value={form.communication}
            min={1}
            max={5}
            onChange={(e) => setForm({ ...form, communication: +e.target.value })}
          />
        </div>
        <div>
          <Label>Damage Reported</Label>
          <input
            type="checkbox"
            checked={form.damageReported}
            onChange={(e) => setForm({ ...form, damageReported: e.target.checked })}
          />
        </div>
        <div>
          <Label>Comments</Label>
          <textarea
            className="w-full border p-2 rounded"
            value={form.comments}
            onChange={(e) => setForm({ ...form, comments: e.target.value })}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
      {result && <p className="mt-3 text-sm text-gray-600">{result}</p>}
    </div>
  );
}
