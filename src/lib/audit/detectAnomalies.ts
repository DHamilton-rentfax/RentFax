export function detectAnomalies(logs) {
  const anomalies = [];

  // Spike detection
  const byHour = {};
  logs.forEach((log) => {
    const hour = new Date(log.timestamp).getHours();
    byHour[hour] = (byHour[hour] || 0) + 1;
  });

  const avg = logs.length / 24;
  for (const hour in byHour) {
    if (byHour[hour] > avg * 3) {
      anomalies.push({
        type: "SPIKE_ACTIVITY",
        hour,
        count: byHour[hour],
      });
    }
  }

  // Employee performing searches outside their company
  logs.forEach((l) => {
    if (l.crossCompanySearch) {
      anomalies.push({
        type: "UNAUTHORIZED_LOOKUP",
        employeeId: l.userId,
        renterId: l.targetId,
      });
    }
  });

  return anomalies;
}
