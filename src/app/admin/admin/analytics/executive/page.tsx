'use client';

import { useEffect, useState } from "react";

const StatCard = ({ label, value, health }: { label: string; value: string; health: 'good' | 'warning' | 'bad' }) => {
    const healthColors = {
        good: 'text-green-600',
        warning: 'text-yellow-600',
        bad: 'text-red-600',
    }
    return (
        <div className="border p-4 rounded-lg bg-white shadow">
            <h3 className="font-semibold text-gray-500">{label}</h3>
            <p className={`text-3xl font-bold ${healthColors[health]}`}>{value}</p>
        </div>
    )
};


// Mock data
const mockData = {
    supportHealth: { score: "92%", health: 'good' as const },
    slaCompliance: { score: "96.4%", health: 'good' as const },
    aiEffectiveness: { score: "85%", health: 'warning' as const },
    notificationLoad: { score: "Low", health: 'good' as const },
    riskIndicators: { score: "3 Active", health: 'bad' as const },
};

export default function ExecutiveAnalyticsPage() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        setData(mockData);
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto py-10 space-y-8">
            <h1 className="text-3xl font-semibold">Executive Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                <StatCard label="Support Health" value={data.supportHealth.score} health={data.supportHealth.health} />
                <StatCard label="SLA Compliance" value={data.slaCompliance.score} health={data.slaCompliance.health} />
                <StatCard label="AI Effectiveness" value={data.aiEffectiveness.score} health={data.aiEffectiveness.health} />
                <StatCard label="Notification Load" value={data.notificationLoad.score} health={data.notificationLoad.health} />
                <StatCard label="Risk Indicators" value={data.riskIndicators.score} health={data.riskIndicators.health} />
            </div>

            {/* Additional charts and summaries would go here */}
        </div>
    );
}
