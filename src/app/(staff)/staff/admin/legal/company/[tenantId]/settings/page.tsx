'use client';

import { useParams } from "next/navigation";
import { useTenantTheme } from "@/hooks/use-tenant-theme";
import { useState } from "react";
import Image from "next/image";
import { updateBranding } from "@/server-actions/tenant/updateBranding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LogoUploader from "@/components/tenant/LogoUploader";

export default function TenantSettingsPage() {
  const { tenantId } = useParams();
  const { tenant, theme, loading, error } = useTenantTheme(tenantId as string);

  const [name, setName] = useState(tenant?.name || "");
  const [primary, setPrimary] = useState(theme.primary);
  const [secondary, setSecondary] = useState(theme.secondary);
  const [background, setBackground] = useState(theme.background);
  const [text, setText] = useState(theme.text);
  const [saving, setSaving] = useState(false);

  if (loading) return <p className="p-6">Loading...</p>;
  if (error || !tenant) return <p className="p-6 text-red-500">{error}</p>;

  async function handleSave() {
    setSaving(true);

    await updateTenantBranding({
      tenantId: tenant.id,
      name,
      theme: {
        primary,
        secondary,
        background,
        text,
      },
    });

    setSaving(false);
    window.location.reload();
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="text-3xl font-bold">Company Branding</h1>

      {/* LOGO */}
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Logo</h2>

        {tenant.logoUrl ? (
          <Image
            src={tenant.logoUrl}
            width={80}
            height={80}
            alt="Company Logo"
            className="rounded-md object-contain"
          />
        ) : (
          <p className="text-sm text-gray-500">No logo uploaded</p>
        )}

        <LogoUploader
          tenantId={tenant.id}
          onUploaded={(url) => {
            alert("Logo updated!");
            window.location.reload();
          }}
        />
      </div>

      {/* NAME */}
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Company Name</h2>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      {/* COLORS */}
      <div className="border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Theme Colors</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Primary</label>
            <Input
              type="color"
              value={primary}
              onChange={(e) => setPrimary(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Secondary</label>
            <Input
              type="color"
              value={secondary}
              onChange={(e) => setSecondary(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Background</label>
            <Input
              type="color"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Text</label>
            <Input
              type="color"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Button
        disabled={saving}
        onClick={handleSave}
        className="bg-black text-white"
      >
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
