"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type AuthUser = {
  uid?: string;
  role?: string;
  email?: string | null;
};

interface AdminBroadcastModalProps {
  close: () => void;
}

export default function AdminBroadcastModal({ close }: AdminBroadcastModalProps) {
  const { user } = useAuth() as { user: AuthUser | null };
  const role = user?.role ?? "";
  const isAllowed = role === "SUPER_ADMIN" || role === "ADMIN";

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState<"all" | "landlords" | "companies" | "renters">("all");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAllowed) {
    close();
    return null;
  }

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      setError("Subject and message are required.");
      return;
    }

    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/admin/broadcast/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.trim(),
          message: message.trim(),
          audience,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to send broadcast");
      }

      close();
    } catch (err: any) {
      console.error("Broadcast error", err);
      setError(err.message || "Could not send broadcast.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Send className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Send Broadcast</h2>
      </div>

      <p className="text-sm text-gray-600">
        Send an announcement to selected RentFAX customers. This can power
        product launches, maintenance alerts, or compliance updates.
      </p>

      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">Audience</label>
        <select
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          value={audience}
          onChange={(e) =>
            setAudience(e.target.value as "all" | "landlords" | "companies" | "renters")
          }
        >
          <option value="all">All customers</option>
          <option value="landlords">Landlords only</option>
          <option value="companies">Companies only</option>
          <option value="renters">Renters only</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">Subject</label>
        <Input
          placeholder="Scheduled maintenance on Saturday"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">Message</label>
        <textarea
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          rows={5}
          placeholder="Hi there – we’ll be performing scheduled maintenance..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex gap-2 pt-2">
        <Button
          className="flex-1"
          onClick={handleSend}
          disabled={sending || !subject.trim() || !message.trim()}
        >
          {sending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Send Broadcast"
          )}
        </Button>
        <Button variant="outline" className="flex-1" onClick={close}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
