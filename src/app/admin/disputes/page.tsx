'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAllDisputes } from '@/app/actions/get-all-disputes';
import { exportDisputesToCsv } from '@/app/actions/export-disputes-to-csv';
import { Dispute } from '@/types/dispute';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AdminDisputesDashboard() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [filteredDisputes, setFilteredDisputes] = useState<Dispute[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    getAllDisputes().then(data => {
      setDisputes(data);
      setFilteredDisputes(data);
    });
  }, []);

  useEffect(() => {
    if (statusFilter === 'ALL') {
      setFilteredDisputes(disputes);
    } else {
      setFilteredDisputes(disputes.filter(d => d.status === statusFilter));
    }
  }, [statusFilter, disputes]);

  const handleExport = async () => {
    const csvData = await exportDisputesToCsv();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'disputes.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Disputes Dashboard</h1>
        <div className="flex items-center gap-4">
          <div>
            <label className="mr-2">Filter by Status:</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="RESOLVED">Resolved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <Button onClick={handleExport}>Export to CSV</Button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renter</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Incident Amount</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDisputes.map(dispute => (
              <tr key={dispute.id}>
                <td className="px-6 py-4 whitespace-nowrap">{dispute.renter.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={dispute.status === 'PENDING' ? 'default' : 'outline'}>{dispute.status}</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">${dispute.incident.amount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Link href={`/admin/disputes/${dispute.id}`}>
                    <a className="text-blue-600 hover:underline">View</a>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
