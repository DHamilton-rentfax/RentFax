"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Home } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function LandlordAddPropertyModal({ close }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    address: "",
    unit: "",
    city: "",
    state: "",
    zip: "",
  });

  if (!user || !["LANDLORD", "PROPERTY_MANAGER"].includes(user.role)) {
    close();
    return null;
  }

  const createProperty = async () => {
    setLoading(true);

    try {
      await fetch("/api/landlord/properties/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ landlordId: user.uid, ...form }),
      });

      close();
    } catch (err) {
      console.error("Create property error:", err);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Home className="h-6 w-6 text-indigo-600" />
        <h2 className="text-xl font-semibold">Add New Property</h2>
      </div>

      <Input
        placeholder="Street Address"
        value={form.address}
        onChange={(e) => setForm({ ...form, address: e.target.value })}
      />

      <Input
        placeholder="Unit (Optional)"
        value={form.unit}
        onChange={(e) => setForm({ ...form, unit: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
        />
        <Input
          placeholder="State"
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
        />
      </div>

      <Input
        placeholder="ZIP Code"
        value={form.zip}
        onChange={(e) => setForm({ ...form, zip: e.target.value })}
      />

      <Button className="w-full" onClick={createProperty} disabled={loading}>
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Add Property"}
      </Button>

      <Button variant="outline" className="w-full" onClick={close}>
        Cancel
      </Button>
    </div>
  );
}
