"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Users } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function CompanyAssignStaffModal({
  companyId,
  assetId,
  close,
}) {
  const { user } = useAuth();
  const [staff, setStaff] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== "COMPANY_ADMIN") {
    close();
    return null;
  }

  useEffect(() => {
    fetch(`/api/company/team/list?companyId=${companyId}`)
      .then((r) => r.json())
      .then(setStaff);
  }, [companyId]);

  const assign = async () => {
    setLoading(true);

    await fetch("/api/company/assets/assignStaff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ staffId: selected, assetId }),
    });

    setLoading(false);
    close();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Users className="h-5 w-5 text-blue-600" />
        Assign Staff Member
      </h2>

      <select
        className="w-full border p-2 rounded-lg"
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
      >
        <option value="">Select staff</option>
        {staff.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} – {s.role}
          </option>
        ))}
      </select>

      <Button className="w-full" onClick={assign} disabled={!selected || loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Assign"}
      </Button>

      <Button variant="outline" className="w-full" onClick={close}>
        Cancel
      </Button>
    </div>
  );
}
