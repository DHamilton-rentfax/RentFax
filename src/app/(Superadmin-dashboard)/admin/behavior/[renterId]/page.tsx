'''use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

export default function BehaviorGraphPage({ params }: any) {
  const [graph, setGraph] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/behavior/${params.renterId}`)
      .then(r => r.json())
      .then(setGraph);
  }, []);

  if (!graph) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-10 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold">Behavior Graph</h1>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-3">Summary</h2>

        <pre className="text-xs text-muted-foreground">
          {JSON.stringify(graph, null, 2)}
        </pre>
      </Card>
    </div>
  );
}
