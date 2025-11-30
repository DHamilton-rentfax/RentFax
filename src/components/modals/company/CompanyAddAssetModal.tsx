"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Truck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function CompanyAddAssetModal({ companyId, close }) {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    type: "",
    serial: "",
  });

  const [loading, setLoading] = useState(false);

  if (!user || user.role !== "COMPANY_ADMIN") {
    close();
    return null;
  }

  const createAsset = async () => {
    setLoading(true);

    try {
      await fetch("/api/company/assets/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, ...form }),
      });

      close();
    } catch (err) {
      console.error("Asset creation failed:", err);
    }

    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Truck className="h-6 w-6 text-green-600" />
        <h2 className="text-xl font-semibold">Add Asset</h2>
      </div>

      <Input
        placeholder="Asset Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <Input
        placeholder="Type (Car, Trailer, Excavator...)"
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      />

      <Input
        placeholder="Serial / VIN"
        value={form.serial}
        onChange={(e) => setForm({ ...form, serial: e.target.value })}
      />

      <Button className="w-full" onClick={createAsset} disabled={loading}>
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Asset"}
      </Button>

      <Button variant="outline" className="w-full" onClick={close}>
        Cancel
      </Button>
    </div>
  );
}
