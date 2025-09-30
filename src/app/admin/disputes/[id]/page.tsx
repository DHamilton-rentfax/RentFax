
import { getDisputeById } from '@/app/actions/get-dispute-by-id';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DisputeStatusUpdater from './DisputeStatusUpdater';

interface AdminDisputeReviewPageProps {
  params: {
    id: string;
  };
}

export default async function AdminDisputeReviewPage({ params }: AdminDisputeReviewPageProps) {
  const { dispute, error } = await getDisputeById(params.id);

  if (error || !dispute) {
    return <div className="p-4">Error: {error || 'Could not load dispute.'}</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Dispute Detail</h1>
        <Card>
            <CardHeader>
                <CardTitle>Dispute ID: {dispute.id}</CardTitle>
                <CardDescription>
                    Incident ID: {dispute.incident.id}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p><strong>Submitted by:</strong> {dispute.renter.email}</p>
                <p><strong>Message:</strong> {dispute.message}</p>
                <div className="flex items-center gap-2">
                    <strong>Evidence:</strong>
                    {dispute.evidence?.map((url: string, idx: number) => (
                        <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 underline"
                        >
                        View Evidence #{idx + 1}
                        </a>
                    ))}
                    {!dispute.evidence?.length && <p>No evidence provided.</p>}
                </div>
                <div className="pt-4">
                    <p><strong>Status:</strong> <Badge>{dispute.status}</Badge></p>
                </div>
                <DisputeStatusUpdater dispute={dispute} />
            </CardContent>
        </Card>
    </div>
  );
}
