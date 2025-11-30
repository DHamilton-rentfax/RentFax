'use client';

import { BarChart3, TrendingUp, TrendingDown, Users, ShieldCheck } from 'lucide-react';

import DemoChart from '@/components/demo/DemoChart'; // Reusing the chart component
import DemoCard from '@/components/demo/DemoCard'; // Reusing the card component

export default function DemoAnalyticsClient() {
  return (
    <>
      <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-3">
        <BarChart3 size={36} className="text-emerald-600" /> Analytics Dashboard
      </h1>
      <p className="text-lg text-gray-600 mb-8 max-w-3xl">
        Visualize trends, track key performance indicators, and gain insights from your data.
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DemoCard
            title="Reports Generated (30d)"
            value="1,204"
            subtitle={<span className="text-green-500 flex items-center gap-1"><TrendingUp size={14}/> +12%</span>}
            icon={<BarChart3 />}
          />
          <DemoCard
            title="Avg. Fraud Score"
            value="64%"
            subtitle={<span className="text-red-500 flex items-center gap-1"><TrendingDown size={14}/> -3%</span>}
            icon={<ShieldCheck />}
            color="red"
          />
          <DemoCard
            title="New Renters Screened"
            value="312"
             subtitle={<span className="text-green-500 flex items-center gap-1"><TrendingUp size={14}/> +5%</span>}
            icon={<Users />}
          />
          <DemoCard
            title="Dispute Rate"
            value="2.1%"
             subtitle={<span className="text-green-500 flex items-center gap-1"><TrendingUp size={14}/> -0.5%</span>}
            icon={<TrendingDown />}
          />
        </div>

      {/* Main Chart */}
      <div className="bg-white border border-gray-100 shadow-sm rounded-xl p-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Reports vs. Fraud Score Trend</h2>
        <div style={{ height: '400px' }}>
            <DemoChart />
        </div>
      </div>
    </>
  );
}
