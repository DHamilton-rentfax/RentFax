'use client';

import { useEffect, useState } from "react";
import { Card } from '@/components/ui/card';

export default function RenterDashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Loading renter dashboard…
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <Card className="p-6">
        <h1 className="text-xl font-semibold">Renter Dashboard</h1>
        <p className="text-sm text-gray-600 mt-1">
          This dashboard will display your rental history and disputes.
        </p>
      </Card>
    </div>
  );
}