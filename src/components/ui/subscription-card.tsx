import { Button } from '@/components/ui/button';

export function SubscriptionCard({
  subscription,
  onUpgrade,
}: {
  subscription: any;
  onUpgrade: () => void;
}) {
  return (
    <div className="border rounded-xl p-4 space-y-2 bg-white shadow-sm">
      <h2 className="font-bold">{subscription.companyName}</h2>
      <p className="text-sm">Plan: {subscription.planName}</p>
      <p className="text-sm">Status: {subscription.status}</p>
      <p className="text-sm text-muted-foreground">Email: {subscription.email}</p>
      <Button onClick={onUpgrade} variant="outline" className="mt-2">
        Upgrade Plan
      </Button>
    </div>
  );
}
