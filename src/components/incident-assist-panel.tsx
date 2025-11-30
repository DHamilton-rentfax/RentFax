"use client";
import { useState } from "react";
import {
  Loader2,
  Sparkles,
  CheckSquare,
  MessageSquareText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
// import { incidentAssist } from '@/app/auth/actions';
import type { IncidentAssistOutput } from "@/ai/flows/ai-assistant";

// Temporary fallback until implemented
const incidentAssist = async () => {
  console.warn("incidentAssist not implemented yet");
  return null;
};

export default function IncidentAssistPanel({
  incidentId,
}: {
  incidentId: string;
}) {
  const [notes, setNotes] = useState("");
  const [out, setOut] = useState<IncidentAssistOutput | null>(null);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const run = async () => {
    setBusy(true);
    setOut(null);
    try {
      const res = await incidentAssist({ incidentId, freeformNotes: notes });
      setOut(res);
    } catch (e: any) {
      toast({
        title: "AI Assistant Error",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-primary" />
          AI Incident Assistant
        </CardTitle>
        <CardDescription>
          Use AI to draft a summary, suggest next steps, and generate a
          customer-facing note based on the incident details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Add any extra context or freeform notes here for the AI to consider..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
        <Button onClick={run} disabled={busy || !incidentId}>
          {busy ? <Loader2 className="animate-spin" /> : <Sparkles />}
          {busy ? "Thinking…" : "Generate Summary"}
        </Button>

        {out && (
          <div className="mt-4 space-y-6 pt-4 border-t">
            {out.summary && (
              <div>
                <h3 className="font-semibold text-lg mb-2">Summary</h3>
                <p className="text-sm text-muted-foreground bg-secondary p-3 rounded-md">
                  {out.summary}
                </p>
              </div>
            )}
            {Array.isArray(out.checklist) && out.checklist.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <CheckSquare /> Next Steps Checklist
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  {out.checklist.map((c: string, i: number) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}
            {out.customerNote && (
              <div>
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <MessageSquareText /> Suggested Customer Note
                </h3>
                <p className="text-sm text-muted-foreground border-l-4 border-primary pl-4 py-2 bg-secondary">
                  {out.customerNote}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
