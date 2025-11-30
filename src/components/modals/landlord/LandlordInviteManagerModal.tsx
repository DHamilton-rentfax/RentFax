"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, UserPlus } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function LandlordInviteManagerModal({ close }) {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== "LANDLORD") {
    close();
    return null;
  }

  const sendInvite = async () => {
    setLoading(true);

    await fetch("/api/landlord/invite-manager", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, landlordId: user.uid }),
    });

    setLoading(false);
    close();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <UserPlus className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Invite Property Manager</h2>
      </div>

      <Input
        placeholder="Manager Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Button className="w-full" onClick={sendInvite} disabled={loading}>
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send Invitation"}
      </Button>

      <Button variant="outline" className="w-full" onClick={close}>
        Cancel
      </Button>
    </div>
  );
}
