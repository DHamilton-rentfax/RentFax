"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function LeadActivity({ leadId }: { leadId: string }) {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "activities"),
      where("leadId", "==", leadId),
      orderBy("timestamp", "desc")
    );

    return onSnapshot(q, (snap) =>
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
  }, [leadId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Activity</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 text-sm">
        {items.length === 0 && (
          <p className="text-muted-foreground">No activity yet.</p>
        )}

        {items.map((a) => (
          <div key={a.id} className="border-b pb-2">
            <div className="font-medium">{a.summary}</div>
            <div className="text-xs text-muted-foreground">
              {a.timestamp ? new Date(a.timestamp.seconds * 1000).toLocaleString() : ''}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
