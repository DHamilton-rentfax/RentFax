"use client";

import { useState, useEffect } from "react";
import { getAIRevenueForecast } from "@/actions/revenue/ai-forecast";
import { AIConfidenceCard } from "@/components/admin/revenue/forecast/AIConfidenceCard";
import { DealRiskTable } from "@/components/admin/revenue/forecast/DealRiskTable";
import { AISummaryBlock } from "@/components/admin/revenue/forecast/AISummaryBlock";
import { WhatIfSimulator } from "@/components/admin/revenue/forecast/WhatIfSimulator";

export default function AIRevenuePage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    getAIRevenueForecast().then(setData);
  }, []);

  if (!data) return <div>Loading AI forecast…</div>;
  if (data.error) return <pre>{data.raw}</pre>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">AI Revenue Forecast</h1>

      <AIConfidenceCard
        aiMRR={data.aiMRRForecast}
        confidence={data.confidenceScore}
      />

      <DealRiskTable risks={data.dealRisks} />

      <AISummaryBlock summary={data.summary} />

      <WhatIfSimulator aiMRR={data.aiMRRForecast} />
    </div>
  );
}
