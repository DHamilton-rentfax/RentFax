'use client';

import { useEffect, useState } from "react";

// Mock data - in a real app, this would be fetched from your backend
const mockData = {
    breachedThreads: [
        { id: "T001", category: "Billing", breached: "Resolution", assignee: "Alice" },
        { id: "T004", category: "General", breached: "Response", assignee: "Bob" },
    ],
    atRiskThreads: [
        { id: "T002", category: "Identity", timeLeft: "12m", assignee: "Charlie" },
    ],
    stats: {
        avgResolutionTime: "4h 15m",
        slaCompliance: "98.5%",
    }
};

export default function SupervisorDashboard() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        // Fetch data from API
        setData(mockData);
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto py-10 space-y-8">
            <h1 className="text-3xl font-semibold">Support Supervisor Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border p-4 rounded-lg bg-white shadow">
                    <h3 className="font-semibold text-lg">Avg. Resolution Time</h3>
                    <p className="text-2xl">{data.stats.avgResolutionTime}</p>
                </div>
                <div className="border p-4 rounded-lg bg-white shadow">
                    <h3 className="font-semibold text-lg">SLA Compliance</h3>
                    <p className="text-2xl text-green-600">{data.stats.slaCompliance}</p>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4">Threads Breaching SLA</h2>
                <div className="border rounded-lg divide-y bg-white shadow">
                    {data.breachedThreads.map((t: any) => (
                        <div key={t.id} className="p-4 flex justify-between items-center">
                            <div>
                                <span className="font-semibold">{t.id}</span> ({t.category})
                                <span className="ml-2 text-sm text-red-600 font-bold">{t.breached} Breached</span>
                            </div>
                            <div className="text-sm">Assignee: {t.assignee}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4">Threads At Risk (within 15 mins of breach)</h2>
                <div className="border rounded-lg divide-y bg-white shadow">
                    {data.atRiskThreads.map((t: any) => (
                        <div key={t.id} className="p-4 flex justify-between items-center">
                            <div>
                                <span className="font-semibold">{t.id}</span> ({t.category})
                                <span className="ml-2 text-sm text-yellow-600 font-bold">{t.timeLeft} remaining</span>
                            </div>
                            <div className="text-sm">Assignee: {t.assignee}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}