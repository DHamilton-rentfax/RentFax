"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Megaphone } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

type AuthUser = {
  uid?: string;
  role?: string;
  email?: string | null;
};

interface AdminBannerEditorModalProps {
  initialTitle?: string;
  initialMessage?: string;
  initialCtaLabel?: string;
  initialCtaHref?: string;
  close: () => void;
}

export default function AdminBannerEditorModal({
  initialTitle,
  initialMessage,
  initialCtaLabel,
  initialCtaHref,
  close,
}: AdminBannerEditorModalProps) {
  const { user } = useAuth() as { user: AuthUser | null };
  const role = user?.role ?? "";
  const isAllowed = role === "SUPER_ADMIN" || role === "ADMIN";

  const [title, setTitle] = useState(initialTitle ?? "");
  const [message, setMessage] = useState(initialMessage ?? "");
  const [ctaLabel, setCtaLabel] = useState(initialCtaLabel ?? "");
  const [ctaHref, setCtaHref] = useState(initialCtaHref ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAllowed) {
    close();
    return null;
  }

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/banners/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          message: message.trim(),
          ctaLabel: ctaLabel.trim() || null,
          ctaHref: ctaHref.trim() || null,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to save banner");
      }

      close();
    } catch (err: any) {
      console.error("Banner save failed", err);
      setError(err.message || "Could not save banner.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Megaphone className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold">Edit Global Banner</h2>
      </div>

      <p className="text-sm text-gray-600">
        This banner appears across dashboards to highlight important updates,
        launches, or compliance notices.
      </p>

      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">Title</label>
        <Input
          placeholder="New feature live: Fraud Heatmap"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-700">Message</label>
        <textarea
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          rows={4}
          placeholder="Explain what changed or what you want users to do."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">CTA label</label>
          <Input
            placeholder="View updates"
            value={ctaLabel}
            onChange={(e) => setCtaLabel(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-700">CTA link</label>
          <Input
            placeholder="/dashboard/analytics"
            value={ctaHref}
            onChange={(e) => setCtaHref(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <div className="flex gap-2 pt-2">
        <Button
          className="flex-1"
          onClick={handleSave}
          disabled={saving || !title.trim() || !message.trim()}
        >
          {saving ? "Saving…" : "Save Banner"}
        </Button>
        <Button variant="outline" className="flex-1" onClick={close}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
