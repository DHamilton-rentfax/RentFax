'use client';

import { DashboardSidebar } from "@/components/DashboardSidebar";

// Mock data for the analytics card
const plan = 'pro';
const creditsLeft = 15;
const totalSearches = 1234;
const reportsGenerated = 56;
const incidentsReported = 3;

// A simple card component for demonstration
const AnalyticsCard = ({ title, value, subtitle }: any) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
    <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
    <p className="text-gray-400 text-xs mt-2">{subtitle}</p>
  </div>
);

// Mock data for recent activity
const recentActivity = [
  { id: 1, date: '2023-10-27', activity: 'New Search', details: 'Searched for "John Doe"' },
  { id: 2, date: '2023-10-26', activity: 'Report Generated', details: 'Generated a report for "Jane Smith"' },
  { id: 3, date: '2023-10-25', activity: 'Incident Reported', details: 'Reported an incident for "Peter Jones"' },
];

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8">Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnalyticsCard
                title="Identity Credits"
                value={
                    plan === 'enterprise'
                    ? 'Unlimited'
                    : `${creditsLeft} remaining`
                }
                subtitle="Used for identity checks & verification."
            />
            <AnalyticsCard
                title="Total Searches"
                value={totalSearches}
                subtitle="Past 30 days"
            />
            <AnalyticsCard
                title="Reports Generated"
                value={reportsGenerated}
                subtitle="Past 30 days"
            />
            <AnalyticsCard
                title="Incidents Reported"
                value={incidentsReported}
                subtitle="Past 30 days"
            />
        </div>

        <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
            <div className="bg-white p-6 rounded-lg shadow">
                <table className="w-full">
                    <thead>
                        <tr className="text-left text-gray-500">
                            <th className="pb-4">Date</th>
                            <th className="pb-4">Activity</th>
                            <th className="pb-4">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentActivity.map(activity => (
                            <tr key={activity.id} className="border-t">
                                <td className="py-4">{activity.date}</td>
                                <td className="py-4">{activity.activity}</td>
                                <td className="py-4">{activity.details}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </main>
    </div>
  );
}
