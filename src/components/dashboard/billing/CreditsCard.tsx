"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CreditsCard({ credits, onBuy }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Credits</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">{credits}</p>
        <p className="text-gray-600 mt-1 text-sm">
          Credits can be used for identity checks and full reports.
        </p>

        <Button
          className="mt-4 bg-[#1A2540] text-white"
          onClick={onBuy}
        >
          Buy Credits
        </Button>
      </CardContent>
    </Card>
  );
}
