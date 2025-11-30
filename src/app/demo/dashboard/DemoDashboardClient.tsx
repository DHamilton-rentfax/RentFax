
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { 
  AlertTriangle, 
  BarChart3, 
  Bell, 
  BrainCircuit, 
  CheckCircle, 
  ChevronRight, 
  Clock, 
  DollarSign, 
  FileText, 
  LayoutGrid,
  ShieldCheck, 
  Users,
  PieChart,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { db } from '@/firebase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/dashboard/ui/Card';
import AISummaryCard from "@/components/demo/AISummaryCard";


// --- Helper Types ---
type Renter = {
  reportId: string;
  renterName: string;
  status: 'Good' | 'Moderate' | 'High Risk' | 'Banned';
  score: number;
  createdAt: { toDate: () => Date };
};
type Analytics = {
  avgFraudScore: number;
  fraudCount: number;
  reportsGenerated: number;
  newRentersScreened: number;
  trend: { month: string; risk: number }[];
};
type TeamMember = {
  name: string;
  role: string;
  id: string;
};

// --- Main Dashboard Component ---
export default function DemoDashboardClient() {
  const [loading, setLoading] = useState(true);
  const [renters, setRenters] = useState<Renter[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all data in parallel
        const [rentersSnap, analyticsSnap, teamSnap] = await Promise.all([
          getDocs(collection(db, 'demo_renters')),
          getDoc(doc(db, 'demo_analytics', 'summary')),
          getDocs(collection(db, 'demo_team')),
        ]);

        // Process Renters
        const rentersData = rentersSnap.docs.map(d => d.data() as Renter);
        setRenters(rentersData);
        
        // Process Analytics
        if (analyticsSnap.exists()) {
          setAnalytics(analyticsSnap.data() as Analytics);
        }

        // Process Team
        const teamData = teamSnap.docs.map(d => d.data() as TeamMember);
        setTeam(teamData);

      } catch (error) {
        console.error("Failed to fetch demo data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <LayoutGrid className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }
  
  const highRiskRenters = renters.filter(r => r.status === 'High Risk' || r.status === 'Banned').length;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="p-8 space-y-8">
        <Header />
        <AISummaryCard />
        <Alerts highRiskCount={highRiskRenters} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <PortfolioOverview renters={renters} analytics={analytics} />
            <RiskTrends analytics={analytics} renters={renters} />
            <RecentActivity renters={renters} />
          </div>
          <div className="space-y-8">
            <TeamOperations team={team} />
            <BillingSummary />
            <AIAssistant />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

const Header = () => (
  <div>
    <p className="text-sm text-gray-500">
      {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
    </p>
    <h1 className="text-3xl font-bold text-gray-800">
      Good morning, Dominique — here's your portfolio snapshot.
    </h1>
    <Card className="mt-4 p-4 bg-blue-50 border-blue-200">
      <div className="flex items-center gap-4">
        <BrainCircuit className="w-8 h-8 text-blue-600" />
        <div>
          <h3 className="font-semibold text-blue-900">AI Daily Briefing</h3>
          <p className="text-sm text-blue-800">
            Yesterday, 12 renters were screened. Risk ratio rose by 6%. No disputes escalated.
          </p>
        </div>
      </div>
    </Card>
  </div>
);

const Alerts = ({ highRiskCount }: { highRiskCount: number }) => (
  <section>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <AlertCard 
        icon={<AlertTriangle className="text-red-500" />} 
        title={`${highRiskCount} High-Risk Alert${highRiskCount !== 1 ? 's' : ''}`} 
        description="Renters flagged as 'High Fraud Risk'." 
        action="View Reports"
      />
      <AlertCard 
        icon={<Bell className="text-yellow-500" />} 
        title="2 New Disputes" 
        description="Disputes require admin review." 
        action="Review"
      />
      <AlertCard 
        icon={<CheckCircle className="text-green-500" />} 
        title="5 Pending Verifications" 
        description="Renters pending identity checks." 
        action="Approve"
      />
    </div>
  </section>
);

const AlertCard = ({ icon, title, description, action }: any) => (
  <Card className="p-4 flex items-center justify-between hover:shadow-lg transition-shadow">
    <div className="flex items-center gap-3">
      {icon}
      <div>
        <p className="font-semibold text-gray-800">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
    <Button variant="outline" size="sm">{action}</Button>
  </Card>
);

const PortfolioOverview = ({ renters, analytics }: { renters: Renter[], analytics: Analytics | null }) => (
  <section>
    <h2 className="text-xl font-semibold text-gray-700 mb-4">Portfolio Overview</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      <MetricCard icon={<Users />} title="Total Renters" value={renters.length} />
      <MetricCard icon={<FileText />} title="Active Reports" value={analytics?.reportsGenerated || 0} />
      <MetricCard icon={<AlertTriangle />} title="Open Disputes" value="4" />
      <MetricCard icon={<ShieldCheck />} title="Fraud Risk Avg." value={`${analytics?.avgFraudScore || 0}%`} />
      <MetricCard icon={<CheckCircle />} title="Identity Verified" value="98%" />
      <MetricCard icon={<DollarSign />} title="Monthly Income" value="$62,500" />
    </div>
  </section>
);

const MetricCard = ({ icon, title, value }: any) => (
  <Card className="p-4">
    <div className="flex items-center gap-3 mb-1">
      <div className="bg-gray-100 p-2 rounded-lg">{icon}</div>
      <p className="text-sm text-gray-600">{title}</p>
    </div>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
  </Card>
);

const RiskTrends = ({ analytics, renters }: { analytics: Analytics | null, renters: Renter[] }) => {
    const riskData = STATUSES.map(status => ({
        name: status,
        value: renters.filter(r => r.status === status).length,
    }));
  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Fraud & Risk Trends</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="md:col-span-3 p-4">
          <h3 className="font-semibold text-sm mb-4">Fraud Trend (Last 6 Months)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analytics?.trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis domain={[60, 90]} fontSize={12} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={2} name="Risk %" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card className="md:col-span-2 p-4">
           <h3 className="font-semibold text-sm mb-4">AI Risk Categorization</h3>
           <ResponsiveContainer width="100%" height={250}>
             <PieChart>
               <Pie data={riskData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label/>
               <Tooltip/>
             </PieChart>
           </ResponsiveContainer>
        </Card>
      </div>
    </section>
  )
};

const STATUSES = ["Good", "Moderate", "High Risk", "Banned"];

const RecentActivity = ({ renters }: { renters: Renter[] }) => {
  const recentActivities = renters.slice(0, 3).map(r => ({
    text: `Renter ${r.reportId} flagged as "${r.status}" (score ${r.score}).`,
    time: r.createdAt.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  }));
  
  recentActivities.push({
      text: `Dispute resolved: Renter #RFX-005 – balance cleared.`,
      time: "10:30 AM"
  });

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Recent Activity</h2>
        <Button variant="link" size="sm" className="text-blue-600">
            View Audit Log <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
      <Card className="p-4 space-y-3">
        {recentActivities.map((activity, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <p className="text-gray-700">{activity.text}</p>
            <p className="text-gray-400">{activity.time}</p>
          </div>
        ))}
      </Card>
    </section>
  );
};

const TeamOperations = ({ team }: { team: TeamMember[] }) => (
  <section>
    <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Team Operations</h2>
        <Button variant="outline" size="sm">Manage Team</Button>
    </div>
    <Card className="p-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left font-semibold py-2">Name</th>
            <th className="text-left font-semibold py-2">Role</th>
            <th className="text-left font-semibold py-2">Screenings</th>
          </tr>
        </thead>
        <tbody>
          {team.map(member => (
            <tr key={member.id}>
              <td className="py-2 text-gray-800">{member.name}</td>
              <td className="py-2 text-gray-600">{member.role}</td>
              <td className="py-2 text-gray-800 font-medium">{Math.floor(Math.random() * 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  </section>
);

const BillingSummary = () => (
    <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Revenue & Billing</h2>
        <Card className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
            <p className="text-sm opacity-80">Current Plan</p>
            <p className="text-2xl font-bold mb-2">RentFAX Pro</p>
            <p className="font-mono text-lg mb-4">$149.00 / month</p>
             <div className="bg-white/20 p-3 rounded-lg text-center mb-4">
                <p className="text-sm opacity-80">Reports Remaining</p>
                <p className="text-2xl font-bold">25</p>
            </div>
            <div className="flex gap-2">
                <Button variant="secondary" className="w-full bg-white text-blue-600 hover:bg-gray-100">Manage Add-ons</Button>
                <Button variant="outline" className="w-full border-white text-white hover:bg-white/10">Upgrade</Button>
            </div>
        </Card>
    </section>
);


const AIAssistant = () => (
    <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">AI Renter Analyst</h2>
        <Card className="p-4">
            <div className="space-y-2">
                <p className="font-semibold">Quick Prompts:</p>
                <AIPrompt text="Summarize today’s risk changes." />
                <AIPrompt text="Which renters are at highest fraud probability?" />
                <AIPrompt text="Predict next month’s dispute rate." />
            </div>
            <div className="mt-4 pt-4 border-t">
                <p className="font-semibold text-sm text-gray-600">Auto-Summary:</p>
                <p className="text-sm text-gray-800 mt-1">Based on recent activity, there is a 75% probability of at least one new high-risk renter in the next 24 hours.</p>
            </div>
        </Card>
    </section>
);

const AIPrompt = ({ text }: { text: string }) => (
  <button className="w-full text-left p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 flex items-center justify-between">
    <span>{text}</span>
    <ChevronRight className="w-4 h-4" />
  </button>
);
