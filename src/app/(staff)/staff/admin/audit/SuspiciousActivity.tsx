import React from 'react';

const SuspiciousActivity = ({ logs }) => {
  if (!logs || logs.length === 0) {
    return null; 
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-red-600">Suspicious Activity</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">User</th>
              <th className="px-4 py-2 text-left">Suspicion Score</th>
              <th className="px-4 py-2 text-left">Action</th>
              <th className="px-4 py-2 text-left">Timestamp</th>
              <th className="px-4 py-2 text-left">Reason</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id} className="border-b">
                <td className="px-4 py-2">{log.userName || log.userId}</td>
                <td className="px-4 py-2 font-bold text-red-500">{log.suspicionScore}</td>
                <td className="px-4 py-2">{log.action}</td>
                <td className="px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                <td className="px-4 py-2">{/* A summary of why it's suspicious */}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuspiciousActivity;
