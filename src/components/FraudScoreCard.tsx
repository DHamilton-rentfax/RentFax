'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface FraudSummary {
  score: number;
  status: 'unreviewed' | 'reviewed' | 'confirmed';
  signals: string[];
  updatedAt?: string;
  reviewedBy?: string;
}

export default function FraudScoreCard({ renterId, userId }: { renterId: string; userId: string }) {
  const [summary, setSummary] = useState<FraudSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = doc(db, 'renters', renterId, 'fraud', 'summary');
    const unsub = onSnapshot(ref, (snap) => {
      setSummary(snap.exists() ? (snap.data() as FraudSummary) : null);
      setLoading(false);
    });
    return () => unsub();
  }, [renterId]);

  const handleUpdate = async (newStatus: 'reviewed' | 'confirmed') => {
    const ref = doc(db, 'renters', renterId, 'fraud', 'summary');
    await updateDoc(ref, {
      status: newStatus,
      reviewedBy: userId,
      reviewedAt: serverTimestamp(),
    });
  };

  if (loading || !summary) return <div className="p-4">Loading fraud data...</div>;

  const color =
    summary.score > 80 ? 'bg-red-500' : summary.score > 50 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <div className="border rounded-lg p-4 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Fraud Risk Score</h3>
        <Badge className={cn('text-white', color)}>{summary.score}/100</Badge>
      </div>

      <Progress value={summary.score} className={cn('h-2', color)} />

      <p className="text-sm text-muted-foreground">
        {summary.signals?.length || 0} signals flagged — status: {summary.status}
      </p>

      {summary.reviewedBy && (
        <p className="text-xs text-gray-400">Reviewed by: {summary.reviewedBy}</p>
      )}

      <div className="flex gap-2">
        <Button size="sm" onClick={() => handleUpdate('reviewed')}>
          Mark as Reviewed
        </Button>
        <Button size="sm" variant="destructive" onClick={() => handleUpdate('confirmed')}>
          Flag as Fraud
        </Button>
      </div>
    </div>
  );
}
