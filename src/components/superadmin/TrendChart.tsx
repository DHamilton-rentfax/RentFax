export default function TrendChart({ data }) {
  return (
    <div className="border rounded-xl bg-white shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Risk Trend (Past Week)</h2>

      <div className="text-sm text-gray-500">
        {/* In the future: Replace with Recharts.js */}
        <pre className="bg-gray-50 p-4 rounded-lg text-xs">
{JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
