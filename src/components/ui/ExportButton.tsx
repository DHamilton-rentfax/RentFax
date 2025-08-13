'use client';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';

export default function ExportButton({ type }: { type: 'renters' | 'incidents' }) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleExport = async () => {
    setLoading(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      if (!token) {
        throw new Error('Authentication required.');
      }

      const res = await fetch(`/api/admin/export?type=${type}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Export failed');
      }

      const blob = await res.blob();
       if (blob.size === 0) {
        toast({ title: "Nothing to Export", description: "There is no data available for this export type."});
        return;
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (err: any) {
      toast({ title: 'Export Error', description: err.message, variant: 'destructive'});
    }
    setLoading(false);
  };

  return (
    <Button onClick={handleExport} disabled={loading} variant="outline" size="sm" className="h-8 gap-1">
      <Download className="h-3.5 w-3.5" />
      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
        {loading ? 'Exporting…' : 'Export CSV'}
      </span>
    </Button>
  );
}
