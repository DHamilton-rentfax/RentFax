"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function SalesStatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <Card className="shadow-sm border">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xl md:text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}