'''use client';

import { useEffect, useState } from 'react';
import { auth } from '@/firebase/client';

export default function AuditExportSettings() {
  const [enabled, setEnabled] = useState(false);
  const [frequency, setFrequency] = useState('weekly');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [newRecipient, setNewRecipient] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [previewLogs, setPreviewLogs] = useState<any[]>([]);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [previewStats, setPreviewStats] = useState({ count: 0, size: 0 });
  const [hasPreviewed, setHasPreviewed] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch('/api/admin/audit-export-settings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.settings) {
        setEnabled(data.settings.enabled);
        setFrequency(data.settings.frequency);
        setRecipients(data.settings.recipients);
      }
    }
    loadSettings();
  }, []);

  useEffect(() => {
    if (previewLogs.length > 0) {
      const header = ['Time', 'Org', 'Type', 'Actor', 'Target', 'Role'];
      const rows = previewLogs.map((log) => [
        new Date(log.timestamp).toISOString(),
        log.orgId,
        log.type,
        log.actorUid,
        log.targetEmail || log.targetUid || '',
        log.role || '',
      ]);
      const csvContent = [header, ...rows].map((row) => row.join(',')).join('\n');
      const sizeInBytes = new Blob([csvContent]).size;
      const sizeInKB = sizeInBytes < 1024 ? 1 : Math.round(sizeInBytes / 1024);
      setPreviewStats({ count: previewLogs.length, size: sizeInKB });
    } else {
      setPreviewStats({ count: 0, size: 0 });
    }
  }, [previewLogs]);

  // Reset preview when dates change
  useEffect(() => {
    setHasPreviewed(false);
    setPreviewLogs([]);
  }, [startDate, endDate]);

  async function saveSettings() {
    const token = await auth.currentUser?.getIdToken();
    await fetch('/api/admin/audit-export-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ enabled, frequency, recipients }),
    });
    alert('✅ Settings saved');
  }

  async function loadPreview() {
    if (!startDate || !endDate) {
      setPreviewLogs([]);
      return;
    }
    setHasPreviewed(true);
    setLoadingPreview(true);
    const token = await auth.currentUser?.getIdToken();
    const params = new URLSearchParams();
    params.append('startDate', new Date(startDate).getTime().toString());
    params.append('endDate', new Date(endDate).getTime().toString());

    const res = await fetch(`/api/admin/audit-export-preview?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setPreviewLogs(data.logs || []);
    setLoadingPreview(false);
  }

  async function sendNow() {
    const token = await auth.currentUser?.getIdToken();
    const res = await fetch('/api/admin/audit-export-send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        startDate: startDate ? new Date(startDate).getTime() : undefined,
        endDate: endDate ? new Date(endDate).getTime() : undefined,
      }),
    });
    if (res.ok) {
      alert('📧 Export sent to recipients!');
    } else {
      alert('❌ Failed to send export');
    }
  }

  function downloadPreviewCSV() {
    const header = ['Time', 'Org', 'Type', 'Actor', 'Target', 'Role'];
    const rows = previewLogs.map((log) => [
      new Date(log.timestamp).toISOString(),
      log.orgId,
      log.type,
      log.actorUid,
      log.targetEmail || log.targetUid || '',
      log.role || '',
    ]);

    const csvContent = [header, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'audit-logs-preview.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Audit Export Settings</h1>

      {/* Auto export toggle */}
      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        Enable automatic audit exports
      </label>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">Frequency</label>
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="border rounded p-2"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Recipients list */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Recipients</label>
        <ul className="mb-2 list-disc ml-6">
          {recipients.map((r, i) => (
            <li key={i} className="flex justify-between">
              {r}
              <button
                onClick={() => setRecipients(recipients.filter((_, idx) => idx !== i))}
                className="text-red-600 text-sm"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <input
            type="email"
            value={newRecipient}
            onChange={(e) => setNewRecipient(e.target.value)}
            placeholder="Add email"
            className="border rounded p-2 flex-1"
          />
          <button
            onClick={() => {
              if (newRecipient) {
                setRecipients([...recipients, newRecipient]);
                setNewRecipient('');
              }
            }}
            className="px-3 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Add
          </button>
        </div>
      </div>

      {/* Custom Export Range */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold">Custom Export Range</label>
        <div className="flex gap-2 mb-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded p-2 flex-1"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded p-2 flex-1"
          />
          <button
            onClick={loadPreview}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            disabled={loadingPreview}
          >
            {loadingPreview ? 'Loading...' : 'Preview'}
          </button>
        </div>

        {/* Preview Section */}
        {loadingPreview ? (
          <p>Loading preview...</p>
        ) : hasPreviewed && previewLogs.length > 0 ? (
          <div className="overflow-x-auto mb-4">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-500">
                Showing {previewStats.count} logs (~{previewStats.size} KB)
              </p>
            </div>
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-3 py-2">Time</th>
                  <th className="border px-3 py-2">Org</th>
                  <th className="border px-3 py-2">Type</th>
                  <th className="border px-3 py-2">Actor</th>
                  <th className="border px-3 py-2">Target</th>
                  <th className="border px-3 py-2">Role</th>
                </tr>
              </thead>
              <tbody>
                {previewLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="border px-3 py-2">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="border px-3 py-2">{log.orgId}</td>
                    <td className="border px-3 py-2">{log.type}</td>
                    <td className="border px-3 py-2">{log.actorUid}</td>
                    <td className="border px-3 py-2">{log.targetEmail || log.targetUid}</td>
                    <td className="border px-3 py-2">{log.role || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex gap-4 mt-4">
              <button
                onClick={downloadPreviewCSV}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-900"
              >
                Download CSV
              </button>

              <button
                onClick={sendNow}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Send Now
              </button>
            </div>
          </div>
        ) : hasPreviewed ? (
          <p className="text-gray-500">No logs found for this range.</p>
        ) : null}
      </div>

      <button
        onClick={saveSettings}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Save Settings
      </button>
    </div>
  );
}
