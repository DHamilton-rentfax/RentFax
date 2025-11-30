"use client";

export default function OverageRiskMeter({ projectedReports, planLimit }: any) {
  const pct = Math.min((projectedReports / planLimit) * 100, 100);

  return (
    <div className="p-4 bg-white rounded-xl shadow-sm">
      <p className="font-medium">Overage Risk</p>
      <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
        <div
          className="h-3 rounded-full bg-red-500"
          style={{ width: `${pct}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        {projectedReports} / {planLimit} projected reports
      </p>
    </div>
  );
}
