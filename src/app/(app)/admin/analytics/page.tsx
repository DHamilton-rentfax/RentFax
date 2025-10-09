'use client'

import { useEffect, useState } from 'react'
import AnalyticsCard from '@/components/admin/AnalyticsCard'
import LineChartComp from '@/components/admin/Charts/LineChart'
import PieChartComp from '@/components/admin/Charts/PieChart'
import BarChartComp from '@/components/admin/Charts/BarChart'

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch('/api/admin/metrics').then(r => r.json()).then(setStats)
  }, [])

  const disputeTrend = [
    { date: 'Mon', count: 4 }, { date: 'Tue', count: 6 },
    { date: 'Wed', count: 3 }, { date: 'Thu', count: 8 }, { date: 'Fri', count: 5 },
  ]
  const userRoles = [
    { label: 'Renters', value: 120 },
    { label: 'Companies', value: 40 },
    { label: 'Admins', value: 8 },
    { label: 'Super Admins', value: 1 },
  ]
  const revenueData = [
    { label: 'Pro', revenue: 3200 },
    { label: 'Starter', revenue: 900 },
    { label: 'Free', revenue: 0 },
  ]

  if (!stats) return <p className="p-10 text-center text-gray-600">Loading metrics...</p>

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10 space-y-8">
      <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-4">
        <AnalyticsCard label="Total Disputes" value={stats.totalDisputes} />
        <AnalyticsCard label="Users" value={stats.totalUsers} />
        <AnalyticsCard label="Logs" value={stats.totalLogs} />
        <AnalyticsCard label="Fraud Alerts" value={stats.fraudAlerts} />
      </div>

      <section>
        <h2 className="text-lg font-medium mb-2">Disputes This Week</h2>
        <LineChartComp data={disputeTrend} dataKey="count" />
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-medium mb-2">User Roles Breakdown</h2>
          <PieChartComp data={userRoles} />
        </div>
        <div>
          <h2 className="text-lg font-medium mb-2">Revenue by Plan</h2>
          <BarChartComp data={revenueData} dataKey="revenue" />
        </div>
      </section>
    </div>
  )
}
