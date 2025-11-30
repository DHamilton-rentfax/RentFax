export function IncidentCard({ incident }) {
  return (
    <div className="border p-6 rounded-lg shadow bg-white">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold">{incident.renterName}</h2>

        <span
          className={
            incident.riskLevel === "high"
              ? "text-red-600 font-bold"
              : incident.riskLevel === "medium"
              ? "text-yellow-600 font-bold"
              : "text-green-600 font-bold"
          }
        >
          {incident.riskLevel.toUpperCase()}
        </span>
      </div>

      <p className="mt-1 text-gray-600">Incident ID: {incident.incidentId}</p>

      <p className="mt-2">
        <strong>Amount Claimed:</strong> ${incident.amountClaimed}<br />
        <strong>Amount Paid:</strong> ${incident.amountPaid}
      </p>

      <p className="mt-2">
        <strong>Status:</strong> {incident.status}<br />
        <strong>Evidence:</strong> {incident.evidenceCount}<br />
        <strong>Disputes:</strong> {incident.disputeCount}
      </p>

      <a
        href={`/admin/incidents/${incident.incidentId}`}
        className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded"
      >
        View Details →
      </a>
    </div>
  );
}
