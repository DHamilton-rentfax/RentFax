"use client";
export default function AnalyticsCard({
  label,
  value,
  trend,
}: {
  label: string;
  value: any;
  trend?: string;
}) {
  return (
    <div className="p-4 bg-white rounded-xl shadow text-center">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-semibold">{value}</p>
      {trend && <p className="text-xs text-green-600">{trend}</p>}
    </div>
  );
}
