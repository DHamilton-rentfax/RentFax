export default function FraudClusterMap({ clusters }) {
  if (!clusters || clusters.length === 0) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm border">
        <p className="text-sm text-gray-600">No active fraud clusters detected.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-xl bg-white shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Fraud Clusters</h2>

      {clusters.map((c) => (
        <div key={c.group} className="mb-4">
          <p className="font-semibold">
            Group: <span className="text-red-600">{c.group}</span>
          </p>
          <ul className="text-sm text-gray-700 ml-4 list-disc">
            {c.renters.map((r) => (
              <li key={r.renterId}>{r.renterId}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
