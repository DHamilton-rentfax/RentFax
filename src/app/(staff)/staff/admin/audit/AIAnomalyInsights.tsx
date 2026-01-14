import React from 'react';

const AIAnomalyInsights = ({ insights }) => {
  if (!insights || insights.length === 0) {
    return null; // Or a message indicating no anomalies
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">AI Anomaly Insights</h2>
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="p-4 bg-yellow-100 rounded-lg">
            <p className="font-semibold text-yellow-800">{insight.type}</p>
            {insight.hour && (
              <p>Hour: {insight.hour}</p>
            )}
            {insight.count && (
              <p>Count: {insight.count}</p>
            )}
            {insight.employeeId && (
              <p>Employee ID: {insight.employeeId}</p>
            )}
            {insight.renterId && (
              <p>Renter ID: {insight.renterId}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIAnomalyInsights;
