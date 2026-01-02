'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import UploadDocuments from '@/components/reports/UploadDocuments';
import PaymentReviewTable from '@/components/reports/PaymentReviewTable';
import IncidentForm from '@/components/reports/IncidentForm';

export default function ReviewReportPage() {
  const router = useRouter();
  const params = useParams();
  const reportId = params.reportId as string;

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reportId) {
      // Fetch report data here
      // For now, using mock data
      setReport({
        id: reportId,
        status: 'draft',
        category: 'vehicle',
        renter: { name: 'John Doe' },
        extracted: null,
        confirmed: null,
        incidents: [],
      });
      setLoading(false);
    }
  }, [reportId]);

  async function handleUpload(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('reportId', reportId);

    const res = await fetch('/api/reports/extract', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setReport((prev: any) => ({ ...prev, extracted: data.extracted }));
  }

  async function confirmPayments() {
    const res = await fetch('/api/reports/confirm-payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportId, extracted: report.extracted }),
    });
    const data = await res.json();
    setReport((prev: any) => ({ ...prev, confirmed: data.confirmed }));
  }

  async function addIncident(incident: any) {
    const res = await fetch('/api/reports/add-incident', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportId, incident }),
    });
    const data = await res.json();
    setReport((prev: any) => ({ ...prev, incidents: data.incidents }));
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold">Review Report for {report.renter.name}</h1>

      <UploadDocuments onUpload={handleUpload} />

      {report.extracted && (
        <PaymentReviewTable
          payments={report.extracted.payments}
          onConfirm={confirmPayments}
        />
      )}

      {report.confirmed && (
        <div>
          <h2 className="text-xl font-semibold">Confirmed Payments</h2>
          <p>Payment history has been confirmed.</p>
        </div>
      )}

      <IncidentForm onAdd={addIncident} />

      <div className="mt-8">
        <button 
          onClick={() => router.push(`/reports/${reportId}/finalize`)}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Proceed to Finalize
        </button>
      </div>
    </div>
  );
}
