'use client';

import { useState, useEffect } from 'react';

export default function PartnerBillingPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [selectedPartner, setSelectedPartner] = useState('');
  const [billingCycles, setBillingCycles] = useState<any[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    // Fetch partners
    fetch('/api/admin/partners')
      .then(res => res.json())
      .then(data => setPartners(data.partners));

    // Fetch billing cycles
    fetch('/api/admin/partners/billing/cycles')
      .then(res => res.json())
      .then(data => setBillingCycles(data.cycles));
  }, []);

  const handleGenerateBilling = async () => {
    if (!selectedPartner || !startDate || !endDate) {
      alert('Please select a partner and a date range.');
      return;
    }

    await fetch('/api/admin/partners/billing/cycles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        partnerOrgId: selectedPartner,
        start: startDate,
        end: endDate,
      }),
    });

    // Refresh billing cycles
    fetch('/api/admin/partners/billing/cycles')
      .then(res => res.json())
      .then(data => setBillingCycles(data.cycles));
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Partner Billing</h1>

      <div className="bg-white p-4 border mb-4">
        <h2 className="font-semibold mb-2">Generate New Billing Cycle</h2>
        <div className="flex items-center space-x-2">
          <select
            value={selectedPartner}
            onChange={e => setSelectedPartner(e.target.value)}
            className="border p-2"
          >
            <option value="">Select a partner</option>
            {partners.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="border p-2"
          />
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="border p-2"
          />
          <button onClick={handleGenerateBilling} className="bg-blue-500 text-white p-2">
            Generate
          </button>
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Generated Billing Cycles</h2>
        <div className="space-y-2">
          {billingCycles.map(cycle => (
            <div key={cycle.id} className="bg-white p-4 border flex justify-between">
              <div>
                <p className="font-medium">{cycle.partnerName}</p>
                <p className="text-sm text-gray-500">Period: {new Date(cycle.period.start.seconds * 1000).toLocaleDateString()} - {new Date(cycle.period.end.seconds * 1000).toLocaleDateString()}</p>
                <p className="text-sm">Total: ${cycle.totalAmount.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className={`font-medium ${cycle.status === 'review' ? 'text-yellow-500' : 'text-green-500'}`}>
                  {cycle.status}
                </p>
                <a href={`/admin/partners/billing/${cycle.id}`} className="text-sm text-blue-500 underline">View Details</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
