export default function LineChartMinimal({
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

      <svg className="w-full h-40">
        {values.map((v, i) => {
          const x = (i / (values.length - 1)) * 100;
          const y = 100 - (v / max) * 100;
          return (
            <circle
              key={i}
              cx={`${x}%`}
              cy={`${y}%`}
              r="3"
              className="fill-blue-600"
            />
          );
        })}
      </svg>

      <div className="flex justify-between text-[10px] text-gray-500 mt-1">
        {labels.map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </div>
    </div>
  );
}
