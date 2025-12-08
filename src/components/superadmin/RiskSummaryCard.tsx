export default function RiskSummaryCard({ label, value, trend }) {
  const trendColor =
    trend > 0 ? "text-red-600" : trend < 0 ? "text-green-600" : "text-gray-500";

  return (
    <div className="p-5 border rounded-xl bg-white shadow-sm">
      <p className="text-gray-600 text-sm">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
      <p className={`text-xs mt-1 ${trendColor}`}>
        {trend > 0 ? `▲ ${trend}%` : trend < 0 ? `▼ ${Math.abs(trend)}%` : "—"}
      </p>
    </div>
  );
}
