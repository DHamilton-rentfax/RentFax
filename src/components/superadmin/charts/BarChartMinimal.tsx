export default function BarChartMinimal({
  title,
  labels,
  values,
}: {
  title: string;
  labels: string[];
  values: number[];
}) {
  const max = Math.max(...values, 1);

  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">
      <p className="font-semibold mb-4">{title}</p>

      <div className="flex items-end gap-3 h-40">
        {values.map((v, i) => (
          <div key={i} className="flex flex-col items-center flex-1">
            <div
              className="w-full bg-blue-500 rounded-t"
              style={{ height: `${(v / max) * 100}%` }}
            ></div>
            <p className="text-[10px] text-gray-500 mt-1">{labels[i]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
