"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type AuthUser = {
  uid?: string;
  role?: string;
  email?: string | null;
};

interface CompanyAddRenterModalProps {
  companyId: string;
  close: () => void;
}

interface RenterForm {
  name: string;
  email: string;
  phone: string;
  license: string;
}

export default function CompanyAddRenterModal({
  companyId,
  close,
}: CompanyAddRenterModalProps) {
  const { user } = useAuth() as { user: AuthUser | null };

  const role = user?.role ?? "";
  const isAllowed =
    role === "COMPANY_ADMIN" || role === "COMPANY_USER" || role === "SUPER_ADMIN";

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<RenterForm>({
    name: "",
    email: "",
    phone: "",
    license: "",
  });
  const [error, setError] = useState<string | null>(null);

  if (!isAllowed) {
    close();
    return null;
  }

  const createRenter = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/company/renters/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          ...form,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to create renter");
      }

      close();
    } catch (err: any) {
      console.error("Create renter error:", err);
      setError(err.message || "Could not create renter.");
    } finally {
      setLoading(false);
    }
  };

  const updateField =
    (field: keyof RenterForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <UserPlus className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Add Renter</h2>
      </div>

      <p className="text-sm text-gray-600">
        Create a renter profile for this company. You can later attach incidents,
        disputes, and verification results.
      </p>

      <div className="space-y-2">
        <Input
          placeholder="Full name"
          value={form.name}
          onChange={updateField("name")}
        />
        <Input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={updateField("email")}
        />
        <Input
          placeholder="Phone"
          value={form.phone}
          onChange={updateField("phone")}
        />
        <Input
          placeholder="Driver's License / ID"
          value={form.license}
          onChange={updateField("license")}
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex gap-2 pt-2">
        <Button className="flex-1" onClick={createRenter} disabled={loading}>
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Create Renter"
          )}
        </Button>

        <Button variant="outline" className="flex-1" onClick={close}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
