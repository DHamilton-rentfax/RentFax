
'use client';

import { useState, useEffect } from 'react';
import { adminDB } from '@/lib/firebase-admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Loader2 } from 'lucide-react';

// Mock data fetching functions
const getRiskScores = async () => {
  // In a real app, you would fetch this from your Firestore 'renters' collection
  return [
    { name: 'Low Risk', value: 75, trustScore: 90 },
    { name: 'Medium Risk', value: 20, trustScore: 65 },
    { name: 'High Risk', value: 5, trustScore: 40 },
    { name: 'Critical Risk', value: 2, trustScore: 15 },
  ];
};

const getFraudSignals = async () => {
  // Fetch aggregated signals
  return [
    { signal: 'Late Payments', count: 45 },
    { signal: 'Disputes', count: 25 },
    { signal: 'Incidents', count: 15 },
    { signal: 'Unauthorized Drivers', count: 10 },
  ];
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function RiskDashboard() {
  const [riskScores, setRiskScores] = useState<any[]>([]);
  const [fraudSignals, setFraudSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [scores, signals] = await Promise.all([getRiskScores(), getFraudSignals()]);
      setRiskScores(scores);
      setFraudSignals(signals);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">AI Risk & Fraud Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {riskScores.map((item, index) => (
          <Card key={item.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
              <span className="text-2xl font-bold">{item.value}%</span>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">Avg. Trust Score: {item.trustScore}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Percentage of renters in each risk category.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={riskScores} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {riskScores.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Fraud Signals</CardTitle>
            <CardDescription>Common signals driving risk scores down.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fraudSignals} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" />
                <YAxis dataKey="signal" type="category" width={120} />
                <Tooltip wrapperStyle={{ zIndex: 1000 }}/>
                <Legend />
                <Bar dataKey="count" fill="#8884d8" name="Signal Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
