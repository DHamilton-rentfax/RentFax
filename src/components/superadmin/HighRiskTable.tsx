export default function HighRiskTable({ renters }) {
  return (
    <div className="border rounded-xl bg-white shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Top High-Risk Renters</h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Name</th>
            <th>Risk Score</th>
            <th>Flags</th>
            <th>Last Incident</th>
          </tr>
        </thead>
        <tbody>
          {renters.map((r) => (
            <tr key={r.id} className="border-b">
              <td className="py-2">{r.name}</td>
              <td>{r.score}</td>
              <td className="text-red-600">
                {r.flags?.length ?? 0}
              </td>
              <td>{r.lastIncident ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
