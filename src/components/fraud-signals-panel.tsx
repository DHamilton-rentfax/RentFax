'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Zap, AlertTriangle, Link as LinkIcon, Repeat } from 'lucide-react';
import { detectFraudSignals } from '@/app/auth/actions';
import type { FraudSignal } from '@/ai/flows/fraud-detector';
import { Badge } from './ui/badge';
import Link from 'next/link';

function SignalCard({ signal }: { signal: FraudSignal }) {
    const getIcon = () => {
        switch(signal.code) {
            case 'duplicateIdentity': return <AlertTriangle className="h-5 w-5 text-destructive" />;
            case 'repeatOffender': return <Repeat className="h-5 w-5 text-amber-600" />;
            default: return <Zap className="h-5 w-5" />;
        }
    }

    return (
        <div className="p-3 bg-secondary rounded-md">
            <div className="flex items-center gap-2 mb-2">
                {getIcon()}
                <h4 className="font-semibold capitalize">
                    {signal.code.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
            </div>

            {signal.code === 'duplicateIdentity' && (
                <>
                    <p className="text-sm text-muted-foreground">
                        The <Badge variant="secondary">{signal.identifier}</Badge> <Badge variant="destructive">{signal.value}</Badge> is shared by {signal.matches?.length || 0} other profile(s):
                    </p>
                     <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
                        {signal.matches?.map(match => (
                            <li key={match.id}>
                                <Link href={`/renters/${match.id}`} target="_blank" className="text-primary hover:underline flex items-center gap-1">
                                    {match.name} (Renter ID: ...{match.id.slice(-4)})
                                    <LinkIcon className="h-3 w-3" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </>
            )}

             {signal.code === 'repeatOffender' && (
                <p className="text-sm text-muted-foreground">
                    {signal.details}
                </p>
            )}
        </div>
    )
}


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
        toast({ title: 'No Fraud Signals Detected', description: 'This renter has no overlapping identifiers or other risk signals in the network.' });
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
            Risk & Fraud Signals
        </CardTitle>
         <CardDescription>
            Scan for duplicate identifiers and other risk patterns.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={run} disabled={busy} size="sm" variant="outline" className="w-full">
          {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {busy ? 'Scanning Network…' : 'Scan for Signals'}
        </Button>

        {signals && signals.length > 0 && (
          <div className="space-y-4 pt-4 border-t">
            {signals.map((signal, index) => <SignalCard key={index} signal={signal} />)}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
