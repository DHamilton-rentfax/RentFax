import React from 'react';

const EmployeeStats = ({ activity }) => {
  if (!activity || activity.length === 0) {
    return <div>Loading stats...</div>;
  }

  const stats = activity.reduce((acc, log) => {
    const userId = log.userId;
    if (!acc[userId]) {
      acc[userId] = { ...log, searchCount: 0 };
    }
    if (log.action === 'SEARCH_RENTER') {
      acc[userId].searchCount++;
    }
    return acc;
  }, {});

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Employee Stats</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Employee</th>
              <th className="px-4 py-2 text-left">Total Searches</th>
              <th className="px-4 py-2 text-left">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(stats).map((stat: any) => (
              <tr key={stat.id} className="border-b">
                <td className="px-4 py-2">{stat.userName || stat.userId}</td>
                <td className="px-4 py-2">{stat.searchCount}</td>
                <td className="px-4 py-2">{new Date(stat.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeStats;
