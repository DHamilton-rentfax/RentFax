'use client';

import { useEffect, useState } from 'react';
import { collection, query, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Link from 'next/link';

type Signal = {
  type: string;
  confidence: number;
  explanation: string;
  related?: string[];
};

type EnrichedSignal = Signal & { 
    renterId: string; 
    evaluatedAt: any;
    renterName?: string;
    renterEmail?: string;
};

export default function FraudDashboard() {
  const [allSignals, setAllSignals] = useState<EnrichedSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');

  useEffect(() => {
    const fetchSignals = async () => {
        setLoading(true);
        try {
            // Fetch all fraud reports from the central collection
            const reportsQuery = query(collection(db, 'fraud_signals'), orderBy('evaluatedAt', 'desc'));
            const reportsSnapshot = await getDocs(reportsQuery);
            const reports = reportsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            let signals: EnrichedSignal[] = [];

            // Enrich signals with renter info
            for (const report of reports) {
                if (!report.signals) continue; // Skip if there are no signals
                const renterDoc = await getDoc(doc(db, 'renters', report.renterId));
                const renterData = renterDoc.exists() ? renterDoc.data() : null;

                report.signals.forEach((signal: Signal) => {
                    signals.push({
                        ...signal,
                        renterId: report.renterId,
                        evaluatedAt: report.evaluatedAt,
                        renterName: renterData?.name,
                        renterEmail: renterData?.email,
                    });
                });
            }
            setAllSignals(signals);
        } catch (error) {
            console.error("Failed to fetch fraud signals:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchSignals();
  }, []);

  const filtered = filter === 'ALL' ? allSignals : allSignals.filter((s) => s.type === filter);
  const signalTypes = ['ALL', ...Array.from(new Set(allSignals.map(s => s.type)))];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Fraud Detection Dashboard</h1>
      <Tabs value={filter} onValueChange={setFilter} className="w-full">
        <TabsList>
            {signalTypes.map(type => (
                <TabsTrigger key={type} value={type}>
                    {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </TabsTrigger>
            ))}
        </TabsList>

        {loading && <div className="text-center p-8">Loading signals...</div>}

        {!loading && signalTypes.map(type => (
            <TabsContent key={type} value={type}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {filtered.filter(s => filter === 'ALL' || s.type === type).map((s, i) => (
                    <Card key={i} className="border-l-4 border-red-500">
                        <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <Link href={`/admin/fraud/${s.renterId}`} className="hover:underline">
                                    <h2 className="font-semibold text-md">{s.renterName || 'Unknown Renter'}</h2>
                                </Link>
                                <p className="text-sm text-gray-500">{s.renterEmail}</p>
                                <Badge variant="secondary" className="mt-2">{s.type.replace(/_/g, ' ')}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground whitespace-nowrap">
                                {s.evaluatedAt?.toDate().toLocaleDateString()}
                            </p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-3">
                            {s.explanation}
                        </p>
                        </CardContent>
                    </Card>
                    ))}
                </div>
                {filtered.filter(s => filter === 'ALL' || s.type === type).length === 0 && (
                    <div className="text-center p-8 text-gray-500">No signals of this type found.</div>
                )}
            </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
