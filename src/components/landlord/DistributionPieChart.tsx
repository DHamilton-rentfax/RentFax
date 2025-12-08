"use client"

// Using a simple div structure for now. Replace with a real chart library (e.g., Recharts) later.
export default function DistributionPieChart({ data }) {
  const total = data.high + data.medium + data.low;
  const highPercent = total > 0 ? (data.high / total) * 100 : 0;
  const mediumPercent = total > 0 ? (data.medium / total) * 100 : 0;
  const lowPercent = total > 0 ? (data.low / total) * 100 : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <h3 className="font-semibold mb-4">Renter Risk Distribution</h3>
      <div className="flex items-center justify-around">
        {/* Placeholder for a Pie Chart Visual */}
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
           <p className="text-xs text-gray-500">Pie Chart</p>
        </div>
        <div className="text-sm space-y-2">
          <p><strong>High Risk:</strong> {data.high} renters ({highPercent.toFixed(1)}%)</p>
          <p><strong>Medium Risk:</strong> {data.medium} renters ({mediumPercent.toFixed(1)}%)</p>
          <p><strong>Low Risk:</strong> {data.low} renters ({lowPercent.toFixed(1)}%)</p>
        </div>
      </div>
    </div>
  );
}
