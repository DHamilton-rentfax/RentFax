export const IncidentCard = ({ incident }: { incident: any }) => {
  return (
    <div className="border p-4 rounded-lg">
      <h3 className="font-bold">Incident Details</h3>
      <p>Amount: ${incident.amount}</p>
      <p>Description: {incident.description}</p>
      <p>Date: {incident.date}</p>
    </div>
  );
};