import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type FraudScoreSummaryProps = {
  score: number;
  signals: number;
  status: string;
  lastUpdated: string;
  onMarkAsReviewed: () => void;
  onFlagAsFraud: () => void;
};

export const FraudScoreSummaryCard = ({ score, signals, status, lastUpdated, onMarkAsReviewed, onFlagAsFraud }: FraudScoreSummaryProps) => {
  const getScoreColor = (score: number) => {
    if (score > 75) return "bg-red-500";
    if (score > 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fraud Score Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Risk Score</span>
            <Badge variant={score > 75 ? "destructive" : score > 50 ? "secondary" : "default"}>{score}</Badge>
          </div>
          <Progress value={score} className={getScoreColor(score)} />
        </div>
        <div className="text-sm">
          <p><strong>{signals}</strong> fraud signals detected.</p>
          <p>Status: <strong>{status}</strong></p>
          <p className="text-xs text-gray-500">Last updated: {lastUpdated}</p>
        </div>
        <div className="flex gap-2">
            <Button onClick={onMarkAsReviewed} variant="outline" size="sm">Mark as Reviewed</Button>
            <Button onClick={onFlagAsFraud} variant="destructive" size="sm">Flag as Fraud</Button>
        </div>
      </CardContent>
    </Card>
  );
};
