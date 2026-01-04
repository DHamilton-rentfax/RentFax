export function DisputeDetails({ dispute }: { dispute: any }) {
  return (
    <div className="p-4 border rounded">
      <h2 className="font-bold text-lg">Dispute Details</h2>
      <pre>{JSON.stringify(dispute, null, 2)}</pre>
    </div>
  );
}
