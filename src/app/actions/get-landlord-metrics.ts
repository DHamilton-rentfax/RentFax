'use server';

// Mock data generation for the landlord dashboard.
// In a real application, this would fetch data from Firestore.

export async function getLandlordDashboardMetrics() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const metrics = {
    reportsPulled: 128,
    incidentsUploaded: 34,
    highRiskCount: 5,
    performanceTrend: 12.5,
    aiSummary: "Your rental activity shows a 15% increase in on-time payments over the last 30 days. However, there has been a slight uptick in maintenance requests in the downtown area. Focus on preventative maintenance for properties in the 90210 zip code to mitigate future costs.",
    fraudAlerts: [
      "Duplicate phone number detected for applicant 'John Doe'.",
      "High-risk email address used for application at '123 Main St'.",
    ],
    reportsOverTime: [
      { name: 'Jan', value: 30 },
      { name: 'Feb', value: 45 },
      { name: 'Mar', value: 60 },
      { name: 'Apr', value: 55 },
      { name: 'May', value: 70 },
      { name: 'Jun', value: 80 },
    ],
    industryBreakdown: [
        { name: 'Housing', value: 80 },
        { name: 'Automotive', value: 25 },
        { name: 'Equipment', value: 15 },
        { name: 'Vacation', value: 8 },
    ],
  };

  const recentReports = [
    { name: 'Jane Smith', industry: 'Housing', score: 820, date: '2024-07-20' },
    { name: 'Michael Johnson', industry: 'Housing', score: 650, date: '2024-07-19' },
    { name: 'Emily Davis', industry: 'Automotive', score: 780, date: '2024-07-19' },
    { name: 'Chris Wilson', industry: 'Housing', score: 510, date: '2024-07-18' },
  ];

  return { metrics, recentReports };
}
