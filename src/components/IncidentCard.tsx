export const IncidentCard = ({ incident }: { incident: any }) => {
  if (!incident) return null;
  return (
    <div className="border p-4 rounded-lg bg-secondary mt-2">
      <h3 className="font-bold text-lg">
        {incident.type || "Incident"} Details
      </h3>
      <p>
        <strong>Amount:</strong> ${incident.amount || 0}
      </p>
      <p>
        <strong>Description:</strong>{" "}
        {incident.description || "No description."}
      </p>
      <p className="text-xs text-muted-foreground mt-2">ID: {incident.id}</p>
    </div>
  );
};
