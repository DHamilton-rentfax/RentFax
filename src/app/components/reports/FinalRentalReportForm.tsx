'use client';

import { useState } from 'react';
import { FinalRentalReportSchema, FinalRentalReportData } from '@/lib/reports/schema';
import { submitFinalReport } from '@/lib/reports/submitFinalReport';

import RentalOverview from '@/components/reports/sections/RentalOverview';
import PaymentHistory from '@/components/reports/sections/PaymentHistory';
import Condition from '@/components/reports/sections/Condition';
import RuleCompliance from '@/components/reports/sections/RuleCompliance';
import IncidentSummary from '@/components/reports/sections/IncidentSummary';
import EvidenceUpload from '@/components/reports/sections/EvidenceUpload';
import Acknowledgement from '@/components/reports/sections/Acknowledgement';

type Props = {
  renterId: string;
  companyId: string;
  createdBy: string; // uid
  source?: 'RENTFAX_NATIVE' | 'LEGACY';
};

export default function FinalRentalReportForm({
  renterId,
  companyId,
  createdBy,
  source = 'RENTFAX_NATIVE',
}: Props) {
  const [data, setData] = useState<FinalRentalReportData>({
    renterId,
    companyId,
    source,
    overview: null,
    payment: null,
    condition: null,
    rules: null,
    incidents: null,
    evidenceRefs: [],
    certification: false,
  });

  const update = <K extends keyof FinalRentalReportData>(key: K, value: FinalRentalReportData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  async function handleSubmit() {
    const parsed = FinalRentalReportSchema.safeParse(data);

    if (!parsed.success) {
      console.error(parsed.error.flatten());
      alert('Please complete all required sections.');
      return;
    }

    await submitFinalReport({
      ...parsed.data,
      createdBy,
    });

    alert('Final rental report submitted and locked.');
  }

  return (
    <div className="space-y-8">
      <RentalOverview value={data.overview} onChange={(v) => update('overview', v)} />
      <PaymentHistory value={data.payment} onChange={(v) => update('payment', v)} />
      <Condition value={data.condition} onChange={(v) => update('condition', v)} />
      <RuleCompliance value={data.rules} onChange={(v) => update('rules', v)} />
      <IncidentSummary value={data.incidents} onChange={(v) => update('incidents', v)} />
      <EvidenceUpload onUpload={(refs) => update('evidenceRefs', refs)} />
      <Acknowledgement onAccept={() => update('certification', true)} />

      <button
        onClick={handleSubmit}
        disabled={!data.certification}
        className="w-full rounded-full bg-black text-white py-3 font-semibold disabled:opacity-50"
      >
        Submit Final Report
      </button>
    </div>
  );
}
