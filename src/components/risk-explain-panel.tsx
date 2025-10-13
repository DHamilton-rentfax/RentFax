"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { riskExplain } from "@/app/auth/actions";
import {
  Loader2,
  Sparkles,
  Shield,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
} from "lucide-react";
import { type RiskExplainOutput } from "@/ai/flows/ai-assistant";
import { Badge } from "./ui/badge";

const ConfidenceBadge = ({
  confidence,
}: {
  confidence: "Low" | "Medium" | "High";
}) => {
  const variant =
    confidence === "High"
      ? "default"
      : confidence === "Medium"
        ? "secondary"
        : "destructive";
  const Icon =
    confidence === "High"
      ? CheckCircle
      : confidence === "Medium"
        ? Shield
        : AlertTriangle;
  return (
    <Badge variant={variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {confidence} Confidence
    </Badge>
  );
};

export default function RiskExplainPanel({ renterId }: { renterId: string }) {
  const [output, setOutput] = useState<RiskExplainOutput | null>(null);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const run = async () => {
    setBusy(true);
    setOutput(null);
    try {
      const res = await riskExplain({ renterId });
      setOutput(res);
    } catch (e: any) {
      toast({
        title: "Error explaining risk",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={run}
        disabled={busy}
        size="sm"
        variant="outline"
        className="w-full"
      >
        {busy ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        {busy ? "Thinking…" : "Explain Score with AI"}
      </Button>

      {output && (
        <div className="space-y-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">AI Analysis</h4>
            <ConfidenceBadge confidence={output.confidence} />
          </div>

          <div>
            <p className="text-sm font-medium mb-1">Summary</p>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground bg-secondary p-3 rounded-md border">
              {output.explanation}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium mb-1 flex items-center gap-2">
              <Lightbulb className="text-primary" /> Recommendation
            </p>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground bg-secondary p-3 rounded-md border">
              {output.recommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
