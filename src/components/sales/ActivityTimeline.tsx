"use client";

export function ActivityTimeline({ items }: { items: any[] }) {
  if (!items.length) {
    return <p className="text-muted-foreground">No activity yet.</p>;
  }

  return (
    <div className="space-y-4">
      {items.map((a) => (
        <div key={a.id} className="border-l pl-4 ml-2 relative">
          <div className="absolute -left-2 top-2 h-3 w-3 bg-primary rounded-full" />

          <div className="font-medium">{a.summary}</div>

          <div className="text-xs text-muted-foreground">
            {a.timestamp
              ? new Date(a.timestamp.seconds * 1000).toLocaleString()
              : "No date"}
          </div>

          {a.type && (
            <div className="text-[10px] uppercase text-muted-foreground">
              {a.type}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
