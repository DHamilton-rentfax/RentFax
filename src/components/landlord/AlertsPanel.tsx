export default function AlertsPanel({ incidents, disputes }) {
  return (
    <div className="bg-white border rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Alerts</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">Outstanding Incidents</h3>
          {incidents.length > 0 ? (
            <ul className="list-disc ml-6 mt-2">
              {incidents.map((incident) => (
                <li key={incident.id}>{incident.title}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No outstanding incidents.</p>
          )}
        </div>
        <div>
          <h3 className="font-semibold">Outstanding Disputes</h3>
          {disputes.length > 0 ? (
            <ul className="list-disc ml-6 mt-2">
              {disputes.map((dispute) => (
                <li key={dispute.id}>{dispute.title}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No outstanding disputes.</p>
          )}
        </div>
      </div>
    </div>
  );
}
