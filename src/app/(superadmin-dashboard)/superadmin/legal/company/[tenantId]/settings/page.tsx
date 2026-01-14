'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LogoUploader from '@/components/tenant/LogoUploader';
import { useTenantTheme } from '@/hooks/use-tenant-theme';

export default function TenantSettingsPage() {
  const { tenantId } = useParams<{ tenantId: string }>();
  const { theme } = useTenantTheme();

  const [name, setName] = useState('');
  const [primary, setPrimary] = useState(theme?.primary ?? '#000000');
  const [secondary, setSecondary] = useState(theme?.secondary ?? '#ffffff');
  const [background, setBackground] = useState(theme?.background ?? '#ffffff');
  const [text, setText] = useState(theme?.text ?? '#000000');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!tenantId) return;

    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/tenant/branding/update', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenantId,
          branding: {
            name,
            theme: {
              primary,
              secondary,
              background,
              text,
            },
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Failed to update branding');
      }

      // Optional: toast.success('Branding updated')
    } catch (err: any) {
      console.error('Branding update failed:', err);
      setError(err.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Company name"
      />

      <LogoUploader tenantId={tenantId} />

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving…' : 'Save Branding'}
      </Button>
    </div>
  );
}
