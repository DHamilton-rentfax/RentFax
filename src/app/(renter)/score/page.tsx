"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

export default function RentfaxScorePage() {
  const [score, setScore] = useState<any>(null);

  useEffect(() => {
    fetch('/api/renter/score')
      .then(r => r.json())
      .then(d => setScore(d));
  }, []);

  if (!score) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-10 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Your RentFAX Score</h1>

      <Card className="p-8 text-center">
        <p className="text-6xl font-extrabold">{score.total}</p>
        <p className="text-sm text-muted-foreground mt-3">
          Range: 300 – 900
        </p>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold">Score Breakdown</h2>

        <ul className="mt-3 space-y-2 text-sm">
          <li>Payment Behavior: {score.payment}</li>
          <li>Incident Impact: {score.incidents}</li>
          <li>Identity Integrity: {score.identity}</li>
          <li>Behavior Trends: {score.trends}</li>
        </ul>
      </Card>
    </div>
  );
}