'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { riskExplain } from '@/app/auth/actions';
import { Loader2, Sparkles } from 'lucide-react';

export default function RiskExplainPanel({ renterId }: { renterId: string }) {
  const [text, setText] = useState<string>('');
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const run = async () => {
    setBusy(true);
    setText('');
    try {
      const res = await riskExplain({ renterId });
      setText(res.explanation);
    } catch (e: any) {
        toast({
            title: 'Error explaining risk',
            description: e.message,
            variant: 'destructive'
        })
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button onClick={run} disabled={busy} size="sm" variant="outline" className="w-full">
        {busy ? <Loader2 className="animate-spin" /> : <Sparkles />}
        {busy ? 'Thinking…' : 'Explain Score with AI'}
      </Button>
      {text && <div className="whitespace-pre-wrap text-sm text-muted-foreground bg-secondary p-3 rounded-md border">{text}</div>}
    </div>
  );
}
