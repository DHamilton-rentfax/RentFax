import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BillingStatusCardProps {
  status: {
    plan: string;
    credits: number;
    search: {
      creditsRemaining?: number;
    };
    report: {
      creditsRemaining?: number;
    };
  };
  onUpgrade: () => void;
}

export default function BillingStatusCard({ status, onUpgrade }: BillingStatusCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Billing Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">Current Plan</p>
          <p className="text-sm font-semibold uppercase">{status.plan}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">Credits</p>
          <p className="text-sm font-semibold">{status.credits}</p>
        </div>

        {/* Placeholder for usage stats */}
        <div className="pt-4">
            <p className="text-xs text-gray-500">Search Credits Remaining: {status.search.creditsRemaining ?? 'N/A'}</p>
            <p className="text-xs text-gray-500">Report Credits Remaining: {status.report.creditsRemaining ?? 'N/A'}</p>
        </div>

        <Button onClick={onUpgrade} className="w-full">
          Upgrade Plan
        </Button>
      </CardContent>
    </Card>
  );
}
