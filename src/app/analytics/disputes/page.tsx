
import { getAllDisputes } from '@/app/actions/get-all-disputes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function DisputeAnalyticsPage() {
  const { disputes, error } = await getAllDisputes();

  if (error || !disputes) {
    return <div>Error: {error || 'Could not fetch disputes'}</div>;
  }

  const totalDisputes = disputes.length;
  const disputesByStatus = disputes.reduce((acc, dispute) => {
    const status = dispute.incident.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dispute Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Disputes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalDisputes}</p>
          </CardContent>
        </Card>
        {Object.entries(disputesByStatus).map(([status, count]) => (
          <Card key={status}>
            <CardHeader>
              <CardTitle>Disputes: {status}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{count}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Disputes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {disputes.slice(0, 10).map(dispute => (
              <li key={dispute.id} className="border-b py-2">
                <p><strong>Incident:</strong> {dispute.incident.description}</p>
                <p><strong>Status:</strong> {dispute.incident.status}</p>
                <p><strong>Disputed on:</strong> {dispute.createdAt.toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
