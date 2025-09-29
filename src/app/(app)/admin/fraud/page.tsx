'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Filter } from 'lucide-react';
import { exportToCSV } from '@/lib/utils/exportToCSV';

type FraudSignal = {
  renterId: string;
  signalType: string;
  detail: string;
  severity: number;
  timestamp: string;
};

const FraudDashboard = ({ signals }: { signals: FraudSignal[] }) => {
  const [sortBy, setSortBy] = useState<'timestamp' | 'severity' | 'signalType'>('timestamp');

  const sortedSignals = useMemo(() => {
    return [...signals].sort((a, b) => {
      if (sortBy === 'timestamp') return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      if (sortBy === 'severity') return b.severity - a.severity;
      if (sortBy === 'signalType') return a.signalType.localeCompare(b.signalType);
      return 0;
    });
  }, [signals, sortBy]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 items-center">
          <Filter className="w-4 h-4" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="timestamp">Newest</option>
            <option value="severity">Severity</option>
            <option value="signalType">Signal Type</option>
          </select>
        </div>

        <Button onClick={() => exportToCSV(sortedSignals, 'fraud_signals.csv')} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedSignals.map((s, i) => (
          <div key={i} className="border p-4 rounded shadow-sm">
            <p><strong>Renter:</strong> {s.renterId}</p>
            <p><strong>Signal:</strong> {s.signalType}</p>
            <p><strong>Detail:</strong> {s.detail}</p>
            <p><strong>Severity:</strong> {s.severity}</p>
            <p className="text-xs text-gray-500">{new Date(s.timestamp).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FraudDashboard;
