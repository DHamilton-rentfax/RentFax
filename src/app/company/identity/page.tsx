'use client';

import { useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle, AlertTriangle, UserSearch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


// Mock of a user session hook
const useUser = () => ({
  user: { companyId: 'some-company-id' }, // In a real app, this would come from auth state
});

const STATUS_FILTERS = ["ALL", "SUBMITTED", "APPROVED", "DENIED", "MANUAL_REVIEW"];

export default function CompanyIdentityDashboard() {
  const [loading, setLoading] = useState(true);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const { user } = useUser();

  useEffect(() => {
    if (!user?.companyId) return;

    const load = async () => {
      setLoading(true);
      const res = await fetch("/api/company/identity/list");
      const data = await res.json();
      setVerifications(data.items || []);
      setLoading(false);
    };
    load();
  }, [user]);

  const filteredVerifications = verifications.filter(v => 
    statusFilter === "ALL" || v.status === statusFilter
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10 bg-slate-50 min-h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 min-h-screen">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Identity Verification Dashboard</h1>
        <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Filter by status:</span>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                    {STATUS_FILTERS.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
      </div>

      {verifications.length === 0 ? (
         <div className="text-center py-16 bg-white border-2 border-dashed rounded-lg">
            <UserSearch className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No verifications yet</h3>
            <p className="mt-1 text-sm text-gray-500">When renters submit identity documents, they will appear here.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul role="list" className="divide-y divide-gray-200">
            {filteredVerifications.map((v) => (
                <li key={v.id}>
                    <div className="px-4 py-4 sm:px-6 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between">
                            <p className="text-md font-medium text-blue-600 truncate">{v.fullName}</p>
                            <div className="ml-2 flex-shrink-0 flex">
                                <StatusBadge status={v.status} />
                            </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500">
                                    Match Score: <strong className="ml-1">{v.extracted?.faceMatchScore ? `${Math.round(v.extracted.faceMatchScore)}%` : 'N/A'}</strong>
                                </p>
                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                    Submitted: {v.submittedAt?._seconds ? new Date(v.submittedAt._seconds * 1000).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <FraudSignals signals={v.fraudSignals} />
                            </div>
                        </div>
                    </div>
                </li>
            ))}
            </ul>
        </div>
      )}
    </div>
  );
}


function StatusBadge({ status }: { status: string }) {
    const statusMap: { [key: string]: string } = {
        SUBMITTED: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        APPROVED: 'bg-green-100 text-green-800 hover:bg-green-200',
        DENIED: 'bg-red-100 text-red-800 hover:bg-red-200',
        MANUAL_REVIEW: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    }
    return <Badge className={`capitalize ${statusMap[status] ?? 'bg-gray-100 text-gray-800'}`}>{status.replace('_', ' ')}</Badge>
}

function FraudSignals({ signals }: { signals: any }) {
    if (!signals) return <span className="text-gray-500">No signal data</span>;
    const activeSignals = Object.entries(signals).filter(([key, value]) => value === true);

    if (activeSignals.length === 0) {
        return <span className="text-green-600 flex items-center"><CheckCircle className="h-4 w-4 mr-1"/>No Fraud Signals Detected</span>;
    }

    const signalNames = activeSignals.map(([key]) => key.replace(/([A-Z])/g, ' $1').trim()).join(', ');

    return (
        <div className="text-amber-600 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-1" />
            <span className="font-semibold">{activeSignals.length} Fraud Signal(s):</span>
            <span className="ml-1 hidden md:inline">{signalNames}</span>
        </div>
    );
}
