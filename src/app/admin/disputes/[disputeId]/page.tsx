
import { getDisputeById } from '@/app/actions/get-dispute-by-id';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DisputeStatusUpdater from './DisputeStatusUpdater';
import AuditHistory from './AuditHistory';

interface AdminDisputeReviewPageProps {
  params: {
    disputeId: string;
  };
}

export default async function AdminDisputeReviewPage({ params }: AdminDisputeReviewPageProps) {
  const { dispute, error } = await getDisputeById(params.disputeId);

  if (error || !dispute) {
    return <div className="p-4">Error: {error || 'Could not load dispute.'}</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Dispute Review</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dispute Details</CardTitle>
              <CardDescription>ID: {dispute.id}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p><strong>Status:</strong> <Badge variant={dispute.status === 'resolved' ? 'default' : 'secondary'}>{dispute.status}</Badge></p>
              <p><strong>Submitted by:</strong> {dispute.renter?.name} ({dispute.renter?.email})</p>
              <p><strong>Incident Type:</strong> {dispute.incident?.type}</p>
              <p><strong>Incident Description:</strong> {dispute.incident?.description}</p>
              <p className="mt-4"><strong>Renter's Message:</strong></p>
              <blockquote className="border-l-4 pl-4 italic">{dispute.message}</blockquote>
              {dispute.evidence && dispute.evidence.length > 0 && (
                <div className="mt-4">
                  <strong>Evidence:</strong>
                  <ul className="list-disc ml-5 mt-2">
                    {dispute.evidence.map((file, idx) => (
                      <li key={idx}>
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          {file.filename}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
          <DisputeStatusUpdater disputeId={dispute.id} />
        </div>
        <div className="md:col-span-1">
          <AuditHistory disputeId={dispute.id} />
        </div>
      </div>
    </div>
  );
}
