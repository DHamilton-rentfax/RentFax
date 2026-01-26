'use client';

import { useEffect, useState } from 'react';
import { db } from '@/firebase/client';
import { collection, getDocs, query, where, updateDoc, doc, orderBy } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';
import { Card } from '@/components/dashboard/ui/Card';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, Gavel, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function LegalDashboardPage() {
  const { user } = useAuth();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCases = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "cases"), 
        where("assignedLegalId", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setCases(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error fetching cases:", error);
      toast.error("Failed to load cases.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCases();
    } else {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }
  }, [user]);

  async function updateCaseStatus(caseId: string, status: string) {
    try {
      await updateDoc(doc(db, "cases", caseId), { status, updatedAt: new Date() });
      toast.success(`Case marked as ${status}.`);
      fetchCases(); // Refresh list
    } catch (err) {
      toast.error("Error updating case status.");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
        <div className="text-center py-20">
            <h2 className="text-xl font-semibold">Access Denied</h2>
            <p className="text-gray-500">Please log in to view your dashboard.</p>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-[#1A2540] flex items-center gap-2"><Gavel /> Legal Case Dashboard</h1>
      <p className="text-sm text-gray-600 -mt-4">
        Manage active legal disputes and report outcomes back to RentFAX.
      </p>

      {cases.length === 0 ? (
        <Card className="p-8 text-center">
            <h3 className="font-semibold">No Active Legal Cases</h3>
            <p className="text-gray-500 text-sm mt-1">Cases assigned for legal review will appear here.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <Card key={c.id} className="p-4 border shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[#1A2540]">
                  Case: {c.renterName}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  Filed by: {c.companyName}
                </p>
                <p className="text-xs text-gray-500">
                    Case ID: {c.id}
                </p>
              </div>
              <div className="mt-4">
                <p className="text-sm mb-3">
                  Status:{" "}
                  <span
                    className={`font-medium capitalize ${
                      c.status === "resolved" || c.status === "closed"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {c.status.replace("_", " ")}
                  </span>
                </p>
                <div className="flex gap-2 flex-wrap">
                  {c.status !== "resolved" && c.status !== "closed" && (
                    <Button
                      size="sm"
                      onClick={() => updateCaseStatus(c.id, 'closed')}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" /> Close Case
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => alert('Adding notes feature coming soon!')}
                  >
                    <FileText className="h-4 w-4 mr-1" /> Add Note
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
