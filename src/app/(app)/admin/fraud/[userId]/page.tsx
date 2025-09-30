'use client';

import { useEffect, useState } from 'react';
import { detectFraudSignals } from '@/app/auth/actions';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/client';
import { FraudSignal } from '@/ai/flows/fraud-detector';

type Signal = FraudSignal & {
  confidence?: number;
  explanation?: string;
};

export default function FraudReportPage({ params }: { params: { userId: string } }) {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReport() {
      if (!params.userId) {
        setError('No user ID provided.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch user data from 'renters' collection
        const userDoc = await getDoc(doc(db, 'renters', params.userId));
        if (userDoc.exists()) {
          setUser({ id: userDoc.id, ...userDoc.data() });
        } else {
          setError('Renter not found.');
          setLoading(false);
          return;
        }

        // Fetch fraud signals
        const report = await detectFraudSignals({renterId: params.userId});
        setSignals(report.signals as Signal[]);

      } catch (e: any) {
        setError(e.message || 'An unknown error occurred.');
      } finally {
        setLoading(false);
      }
    }

    fetchReport();
  }, [params.userId]);

  const getConfidenceColor = (confidence: number = 0) => {
    if (confidence >= 0.9) return 'text-red-500';
    if (confidence >= 0.75) return 'text-yellow-500';
    return 'text-gray-500';
  };
  
  const getConfidencePill = (confidence: number = 0) => {
    let colorClass = 'bg-gray-200 text-gray-800';
    if (confidence >= 0.9) {
        colorClass = 'bg-red-100 text-red-800';
    } else if (confidence >= 0.75) {
        colorClass = 'bg-yellow-100 text-yellow-800';
    }
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
        {Math.round(confidence * 100)}%
      </span>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold">Fraud & Risk Report</h1>

      {loading && <p>Loading report...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && !error && user && (
         <div className="bg-white p-4 border rounded-lg shadow-sm">
             <h2 className="text-lg font-semibold mb-2">Renter Profile</h2>
             <p><strong>Email:</strong> {user.email}</p>
             <p><strong>Name:</strong> {user.name || 'N/A'}</p>
             <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
             <p><strong>UserID:</strong> {user.id}</p>
         </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold">Detected Signals</h2>
          {signals.length > 0 ? (
            signals.map((signal, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-bold text-md capitalize">{signal.code.replace(/([A-Z])/g, ' $1').trim()}</h3>
                        <p className="text-sm text-gray-600 mt-1">{signal.details || signal.explanation}</p>
                        {signal.matches && (
                            <p className="text-xs text-gray-500 mt-2">
                                Related Users: {signal.matches.map(m => m.id).join(', ')}
                            </p>
                        )}
                    </div>
                    <div className="text-right">
                        {getConfidencePill(signal.confidence)}
                        <p className={`text-sm font-medium mt-1 ${getConfidenceColor(signal.confidence)}`}>
                            Risk Level
                        </p>
                    </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center p-8 border-dashed border-2 rounded-lg">
                <h3 className="text-lg font-medium text-gray-700">No Fraud Signals Detected</h3>
                <p className="text-sm text-gray-500">This user profile appears to be clean.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
