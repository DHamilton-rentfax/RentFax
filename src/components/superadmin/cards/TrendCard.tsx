export default function TrendCard({
  label,
  value,
  change,
}: {
  label: string;
  value: number | string;
  change: number;
}) {
  const positive = change >= 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-5">
      <p className="text-sm text-gray-600">{label}</p>

      <div className="flex items-end justify-between mt-3">
        <p className="text-3xl font-semibold">{value}</p>

        <span
          className={`text-sm font-semibold ${
            positive ? "text-green-600" : "text-red-600"
          }`}
        >
          {positive ? "+" : "-"}
          {Math.abs(change)}%
        </span>
      </div>
    </div>
  );
}
