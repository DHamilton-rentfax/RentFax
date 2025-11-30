"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Building, Trash2 } from "lucide-react";

// Define the structure for agency data
interface Agency {
  id: string;
  name: string;
  contact: string;
}

// Define the props for the modal
export interface AdminEditAgencyModalProps {
  agency: Agency;
  close: () => void;
}

export default function AdminEditAgencyModal({
  agency,
  close,
}: AdminEditAgencyModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fallback for safety, though `agency` should always be provided
  const safeAgency = agency ?? { id: "", name: "", contact: "" };
  const [form, setForm] = useState(safeAgency);

  // Role-gating
  if (!user || user.role !== "SUPER_ADMIN") {
    close();
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = form.name && form.contact;

  const update = async () => {
    if (!isFormValid) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/agencies/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update agency");
      close();
    } catch (err) {
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAgency = async () => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete ${agency.name}? This action cannot be undone.`
      )
    ) {
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/agencies/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: agency.id }),
      });
      if (!res.ok) throw new Error("Failed to delete agency");
      close();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6" role="dialog" aria-modal="true">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Building className="h-6 w-6 text-gray-700" />
          Edit Agency
        </h2>
        <p className="text-sm text-gray-500">Update agency details below.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="agency-name" className="text-sm font-medium">
            Agency Name
          </label>
          <Input
            id="agency-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="agency-contact" className="text-sm font-medium">
            Primary Contact Email
          </label>
          <Input
            id="agency-contact"
            name="contact"
            type="email"
            value={form.contact}
            onChange={handleChange}
            className="mt-1"
          />
        </div>
      </div>

      <div className="space-y-3 pt-4">
        <Button
          className="w-full"
          onClick={update}
          disabled={loading || deleting || !isFormValid}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Save Changes"
          )}
        </Button>
        <Button variant="outline" className="w-full" onClick={close}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          className="w-full flex gap-2 items-center"
          onClick={deleteAgency}
          disabled={loading || deleting}
        >
          {deleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          Delete Agency
        </Button>
      </div>
    </div>
  );
}
