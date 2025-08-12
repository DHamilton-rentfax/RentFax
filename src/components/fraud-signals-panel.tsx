'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Zap, AlertTriangle, Link } from 'lucide-react';
import { detectFraudSignals } from '@/app/auth/actions';
import type { FraudSignal } from '@/ai/flows/fraud-detector';
import { Badge } from './ui/badge';

export default function FraudSignalsPanel({ renter }: { renter: any }) {
  const [signals, setSignals] = useState<FraudSignal[] | null>(null);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const run = async () => {
    setBusy(true);
    setSignals(null);
    try {
      const res = await detectFraudSignals({ renterId: renter.id });
      setSignals(res.signals);
       if (res.signals.length === 0) {
        toast({ title: 'No Fraud Signals Detected', description: 'This renter has no overlapping identifiers with others in the network.' });
      }
    } catch (e: any) {
      toast({ title: 'Error Detecting Fraud', description: e.message, variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Zap className="text-primary" />
            Fraud Signals
        </CardTitle>
         <CardDescription>
            Check for duplicate identifiers across the network.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={run} disabled={busy} size="sm" variant="outline" className="w-full">
          {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {busy ? 'Scanning Network…' : 'Scan for Duplicates'}
        </Button>

        {signals && signals.length > 0 && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="font-semibold text-lg">{signals.length} Signal(s) Found</h3>
            </div>
            {signals.map(signal => (
                <div key={signal.identifier} className="p-3 bg-secondary rounded-md">
                    <p className="font-semibold capitalize">{signal.identifier}: <Badge variant="destructive">{signal.value}</Badge></p>
                    <p className="text-sm text-muted-foreground mt-1">Shared by {signal.matches.length} other renter profile(s):</p>
                    <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                        {signal.matches.map(match => (
                            <li key={match.id}>
                                <a href={`/renters/${match.id}`} target="_blank" className="text-primary hover:underline flex items-center gap-1">
                                    {match.name} (Renter ID: ...{match.id.slice(-4)})
                                    <Link className="h-3 w-3" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
