"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";

export function ActivityList({ activities }: { activities: any[] }) {
  if (!activities.length) {
    return (
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">No recent activity.</p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Recent Activity
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {activities.map((item) => (
          <div
            key={item.id}
            className="border-b pb-3 last:border-b-0 last:pb-0 text-sm"
          >
            <div className="font-medium">{item.summary}</div>
            <div className="text-xs text-muted-foreground">
              {new Date(item.timestamp?.seconds * 1000).toLocaleString()}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}