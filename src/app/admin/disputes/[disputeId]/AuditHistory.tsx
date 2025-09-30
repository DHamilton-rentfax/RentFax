
import { getDisputeHistory, AuditLog } from '@/app/actions/get-dispute-history';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AuditHistoryProps {
  disputeId: string;
}

export default async function AuditHistory({ disputeId }: AuditHistoryProps) {
  const { history, error } = await getDisputeHistory(disputeId);

  if (error) {
    return <p className="text-sm text-red-500">Could not load audit history.</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dispute History</CardTitle>
      </CardHeader>
      <CardContent>
        {history && history.length > 0 ? (
          <ul className="space-y-4">
            {history.map((log) => (
              <li key={log.id} className="text-sm">
                <p className="font-semibold">{log.action.replace(/_/g, ' ').toUpperCase()}</p>
                <p className="text-xs text-gray-500">On {log.timestamp.toLocaleString()}</p>
                <p><strong>Admin:</strong> {log.adminUserId.substring(0,8)}...</p>
                <p><strong>Notes:</strong> {log.notes}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No history found for this dispute.</p>
        )}
      </CardContent>
    </Card>
  );
}
