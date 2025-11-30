"use client";

import { useState, useEffect } from "react";

interface Log {
  id: string;
  message: string;
  level: string;
  source: string;
  timestamp: { toDate: () => Date };
  meta: object;
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      let url = "/api/admin/logs?";
      if (levelFilter) url += `level=${levelFilter}&`;
      if (sourceFilter) url += `source=${sourceFilter}`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setLogs(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      }
      setLoading(false);
    };

    fetchLogs();
  }, [levelFilter, sourceFilter]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">System Logs</h1>
      <div className="flex space-x-4 mb-4">
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700">Filter by Level</label>
          <select
            id="level"
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All</option>
            <option value="info">Info</option>
            <option value="warn">Warn</option>
            <option value="error">Error</option>
          </select>
        </div>
        <div>
          <label htmlFor="source" className="block text-sm font-medium text-gray-700">Filter by Source</label>
          <input
            type="text"
            id="source"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            placeholder="e.g., web, api"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meta</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp.toDate()).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.level}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.source}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.message}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{JSON.stringify(log.meta)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
