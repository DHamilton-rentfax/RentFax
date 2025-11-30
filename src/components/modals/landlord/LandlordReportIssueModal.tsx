"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function LandlordReportIssueModal({ renterId, close }) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("damage");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  if (!user || !["LANDLORD", "PROPERTY_MANAGER"].includes(user.role)) {
    close();
    return null;
  }

  const submit = async () => {
    setLoading(true);

    await fetch("/api/landlord/incident/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ renterId, category, description, filedBy: user.uid }),
    });

    setLoading(false);
    close();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-6 w-6 text-red-600" />
        <h2 className="text-xl font-semibold">Create Incident Report</h2>
      </div>

      <select
        className="border p-2 rounded-lg w-full"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="damage">Property Damage</option>
        <option value="late-payment">Late Payment</option>
        <option value="eviction">Eviction</option>
        <option value="fraud">Fraudulent Activity</option>
        <option value="other">Other Issue</option>
      </select>

      <Textarea
        placeholder="Describe the issue..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full h-32"
      />

      <Button className="w-full" onClick={submit} disabled={loading}>
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Submit Report"}
      </Button>

      <Button variant="outline" className="w-full" onClick={close}>
        Cancel
      </Button>
    </div>
  );
}
