"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type AuthUser = {
  uid?: string;
  role?: string;
  email?: string | null;
};

interface RenterUpdateProfileModalProps {
  close: () => void;
}

interface ProfileForm {
  name: string;
  phone: string;
  email: string;
}

export default function RenterUpdateProfileModal({
  close,
}: RenterUpdateProfileModalProps) {
  const { user } = useAuth() as { user: AuthUser | null };
  const uid = user?.uid;
  const email = user?.email ?? "";

  const [form, setForm] = useState<ProfileForm>({
    name: "",
    phone: "",
    email,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!uid) {
    // no logged-in renter – just close
    close();
    return null;
  }

  const updateField =
    (field: keyof ProfileForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/renter/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid,
          name: form.name.trim(),
          phone: form.phone.trim() || null,
          email: form.email.trim(),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to update profile");
      }

      close();
    } catch (err: any) {
      console.error("Update profile error", err);
      setError(err.message || "Could not update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <User className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Update Your Profile</h2>
      </div>

      <p className="text-sm text-gray-600">
        Keep your contact information up to date so landlords and agencies can
        reach you about applications and disputes.
      </p>

      <div className="space-y-2">
        <Input
          placeholder="Full name"
          value={form.name}
          onChange={updateField("name")}
        />
        <Input
          placeholder="Phone"
          value={form.phone}
          onChange={updateField("phone")}
        />
        <Input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={updateField("email")}
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex gap-2 pt-2">
        <Button className="flex-1" onClick={handleSave} disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Save Changes"
          )}
        </Button>
        <Button variant="outline" className="flex-1" onClick={close}>
          Cancel
        </Button>
      </div>
    </div>
  );
}