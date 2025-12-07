import Link from "next/link";
import { Button } from "@/components/ui/button";

export function UpgradeWall({ feature }: { feature: string }) {
  return (
    <div className="border rounded-lg p-6 text-center bg-muted">
      <h2 className="text-xl font-semibold">Feature Locked</h2>
      <p className="text-muted-foreground mt-2">
        Your current plan does not include <strong>{feature}</strong>.
      </p>
      <Link href="/billing/upgrade">
        <Button className="mt-4">Upgrade Plan</Button>
      </Link>
    </div>
  );
}
