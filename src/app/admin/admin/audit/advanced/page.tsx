'use client';

import { useEffect, useState } from 'react';

interface AuditLog {
  id: string;
  eventType: string;
  severity: string;
  timestamp: string;
  actorId: string;
  actorRole: string;
  targetCollection: string;
  targetId: string;
  metadata: any;
}

export default function AdvancedAuditViewer() {
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);

  async function search() {
    setLoading(true);
    const params = new URLSearchParams(filters as any).toString();
    const res = await fetch(`/api/audit/search?${params}`);
    const data = await res.json();
    setLogs(data.logs);
    setLoading(false);
  }

  return (
    <div className='max-w-7xl mx-auto py-10 space-y-6'>
      <h1 className='text-3xl font-semibold'>Advanced Audit Logs</h1>

      {/* Filters */}
      <div className='grid grid-cols-4 gap-4'>
        <input
          placeholder='Actor ID'
          onChange={e =>
            setFilters(f => ({ ...f, actorId: e.target.value }))
          }
        />
        <input
          placeholder='Target ID'
          onChange={e =>
            setFilters(f => ({ ...f, targetId: e.target.value }))
          }
        />
        <select
          onChange={e => setFilters(f => ({ ...f, severity: e.target.value }))}
        >
          <option value=''>Severity</option>
          <option value='info'>Info</option>
          <option value='warning'>Warning</option>
          <option value='critical'>Critical</option>
        </select>
        <select
          onChange={e => setFilters(f => ({ ...f, actorRole: e.target.value }))}
        >
          <option value=''>Role</option>
          <option value='RENTER'>Renter</option>
          <option value='LANDLORD'>Landlord</option>
          <option value='COMPANY_ADMIN'>Company</option>
          <option value='SUPER_ADMIN'>Super Admin</option>
        </select>
      </div>

      <button
        onClick={search}
        className='bg-blue-600 text-white px-4 py-2 rounded-lg'
      >
        Search Logs
      </button>

      {loading && <div>Loading…</div>}

      {/* Results */}
      <div className='border rounded-xl divide-y'>
        {logs.map(log => (
          <div key={log.id} className='p-4'>
            <div className='font-semibold'>{log.eventType}</div>
            <div className='text-sm text-gray-600'>
              {new Date(log.timestamp).toLocaleString()}
            </div>
            <div className='text-xs text-gray-500'>
              Actor: {log.actorId} ({log.actorRole})
            </div>
            <pre className='bg-gray-100 p-2 rounded text-xs mt-2'>
              {JSON.stringify(log.metadata, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
