"use client";

export default function BillingInsights({ insights }: any) {
  return (
    <div className="p-6 border rounded-xl shadow-sm bg-white">
      <h2 className="text-xl font-semibold mb-3">Billing Insights</h2>
      <p><strong>Projected Reports:</strong> {insights.projectedReports}</p>
      <p><strong>Recommendation:</strong> {insights.recommendation}</p>
      <p><strong>Estimated Overage:</strong> ${insights.estimatedOverage}</p>
      <p><strong>Credit Burn Rate:</strong> {insights.creditBurnRate} / day</p>
    </div>
  );
}
