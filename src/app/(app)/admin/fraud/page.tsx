'use client';

import { useEffect, useState } from 'react';
import { collection, query, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';

type Signal = {
  type: string;
  confidence: number;
  explanation: string;
};

type FraudReport = {
  id: string;
  renterId: string;
  evaluatedAt: any; // Firestore Timestamp
  riskScore: number;
  signals: Signal[];
  renter?: { name: string; email: string }; // Enriched data
};

export default function FraudDashboardPage() {
  const [reports, setReports] = useState<FraudReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sort, setSort] = useState('evaluatedAt_desc');

  useEffect(() => {
    async function fetchFraudReports() {
      try {
        setLoading(true);
        const [sortBy, sortOrder] = sort.split('_');
        const reportsQuery = query(
          collection(db, 'fraud_signals'),
          orderBy(sortBy, sortOrder as 'asc' | 'desc')
        );
        const snapshot = await getDocs(reportsQuery);
        const reportsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FraudReport));

        // Enrich with renter info
        const enrichedReports = await Promise.all(reportsData.map(async (report) => {
            const userDoc = await getDoc(doc(db, 'users', report.renterId));
            if(userDoc.exists()) {
                report.renter = userDoc.data() as { name: string, email: string };
            }
            return report;
        }));

        setReports(enrichedReports);
      } catch (e: any) {
        setError(e.message || 'Failed to fetch reports.');
      } finally {
        setLoading(false);
      }
    }

    fetchFraudReports();
  }, [sort]);

  const getRiskColor = (score: number) => {
    if (score >= 0.9) return 'bg-red-500 text-white';
    if (score >= 0.75) return 'bg-yellow-500 text-white';
    return 'bg-green-500 text-white';
  };
  
  const filteredReports = reports
    .filter(report => {
        const searchLower = search.toLowerCase();
        const matchesSearch = search ? 
            report.renter?.name.toLowerCase().includes(searchLower) ||
            report.renter?.email.toLowerCase().includes(searchLower) :
            true;
        const matchesFilter = filterType !== 'all' ? report.signals.some(s => s.type === filterType) : true;
        return matchesSearch && matchesFilter;
    });

  const allSignalTypes = Array.from(new Set(reports.flatMap(r => r.signals.map(s => s.type))));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Fraud Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Search by renter name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:col-span-2"
        />
        <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger><SelectValue placeholder="Filter by Signal" /></SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Signals</SelectItem>
                {allSignalTypes.map(type => (
                    <SelectItem key={type} value={type}>{type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>
                ))}
            </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
            <SelectTrigger><SelectValue placeholder="Sort By" /></SelectTrigger>
            <SelectContent>
                <SelectItem value="evaluatedAt_desc">Most Recent</SelectItem>
                <SelectItem value="evaluatedAt_asc">Oldest</SelectItem>
                <SelectItem value="riskScore_desc">Highest Risk</SelectItem>
                <SelectItem value="riskScore_asc">Lowest Risk</SelectItem>
            </SelectContent>
        </Select>
      </div>
      
      <div className="bg-white rounded shadow-sm border">
        {loading && <div className="p-4 text-center">Loading reports...</div>}
        {error && <div className="p-4 text-center text-red-500">{error}</div>}
        {!loading && filteredReports.length === 0 && <div className="p-4 text-center text-muted-foreground">No matching reports found.</div>}
        
        {!loading && filteredReports.length > 0 && (
            <div className="divide-y">
                {filteredReports.map(report => (
                    <details key={report.id} className="p-4 hover:bg-gray-50">
                        <summary className="grid grid-cols-12 gap-4 items-center cursor-pointer">
                            <div className="col-span-4">
                                <p className="font-medium">{report.renter?.name || 'Unknown Renter'}</p>
                                <p className="text-sm text-gray-500">{report.renter?.email}</p>
                            </div>
                            <div className="col-span-2">
                                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getRiskColor(report.riskScore)}`}>
                                    {Math.round(report.riskScore * 100)}%
                                </span>
                            </div>
                            <div className="col-span-3">
                                <p>{report.signals.length} signal(s) detected</p>
                            </div>
                            <div className="col-span-2 text-sm text-gray-500">
                                {report.evaluatedAt?.toDate().toLocaleDateString()}
                            </div>
                             <div className="col-span-1 text-right">
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/admin/fraud/${report.renterId}`}>View</Link>
                                </Button>
                            </div>
                        </summary>
                        <div className="mt-4 ml-4 pl-4 border-l-2 space-y-2">
                            {report.signals.map((signal, i) => (
                                <div key={i}>
                                    <p className="font-semibold text-sm">{signal.type.replace(/_/g, ' ')} - <span className="font-normal">{Math.round(signal.confidence*100)}% Confidence</span></p>
                                    <p className="text-xs text-gray-600">{signal.explanation}</p>
                                </div>
                            ))}
                        </div>
                    </details>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
