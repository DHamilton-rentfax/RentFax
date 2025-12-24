'use client';

import { useEffect, useState } from "react";

const StatCard = ({ label, value }: { label: string; value: string }) => (
    <div className="border p-4 rounded-lg bg-white shadow">
        <h3 className="font-semibold text-gray-500">{label}</h3>
        <p className="text-3xl font-bold">{value}</p>
    </div>
);

const ChartPlaceholder = ({ title }: { title: string }) => (
    <div className="border p-4 rounded-lg bg-white shadow">
        <h3 className="font-semibold mb-2">{title}</h3>
        <div className="bg-gray-100 h-64 flex items-center justify-center">
            <p className="text-gray-400">Chart data would be here</p>
        </div>
    </div>
);

// Mock data - in a real app, this would be fetched from your backend analytics API
const mockData = {
    kpis: {
        avgFirstResponse: "42 min",
        avgResolution: "6.1 hrs",
        slaCompliance: "96.4%",
        escalations: "12",
    },
};

export default function SupportAnalyticsPage() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        // Fetch data from API
        setData(mockData);
    }, []);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto py-10 space-y-8">
            <h1 className="text-3xl font-semibold">Support Performance</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="Avg First Response" value={data.kpis.avgFirstResponse} />
                <StatCard label="Avg Resolution" value={data.kpis.avgResolution} />
                <StatCard label="SLA Compliance" value={data.kpis.slaCompliance} />
                <StatCard label="Escalations" value={data.kpis.escalations} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ChartPlaceholder title="SLA Breach Trend" />
                <ChartPlaceholder title="Breaches by Category" />
                <ChartPlaceholder title="Notification Delivery Mix" />
                <ChartPlaceholder title="AI Correction Rate" />
            </div>
        </div>
    );
}
