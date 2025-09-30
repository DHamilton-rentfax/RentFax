
import { getDisputeById } from '@/app/actions/get-dispute-by-id';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import DisputeStatusUpdater from './DisputeStatusUpdater';
import AuditHistory from './AuditHistory'; // Import the new component

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Review Dispute</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Main Dispute Details */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Dispute #{dispute.id.substring(0,8)}...</CardTitle>
                  <CardDescription>Submitted on {dispute.createdAt.toLocaleDateString()}</CardDescription>
                </div>
                <Badge>{dispute.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Renter's Reason</h3>
                <p className="bg-gray-50 p-4 rounded-md border">{dispute.reason}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Evidence Provided</h3>
                {dispute.evidence && dispute.evidence.length > 0 ? (
                  <ul className="list-disc list-inside space-y-2">
                    {dispute.evidence.map((file, index) => (
                      <li key={index}>
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {file.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No evidence was provided.</p>
                )}
              </div>

              {/* Add the status updater for pending disputes */}
              {dispute.status === 'pending' && <DisputeStatusUpdater disputeId={dispute.id} />}
              
            </CardContent>
          </Card>
        </div>

        {/* Contextual Info */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Renter Details</CardTitle>
            </CardHeader>
            <CardContent>
              {dispute.renter ? (
                <div className="text-sm">
                  <p><strong>Name:</strong> {dispute.renter.name}</p>
                  <p><strong>Email:</strong> {dispute.renter.email}</p>
                </div>
              ) : (
                <p>No renter data found.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Original Incident</CardTitle>
            </CardHeader>
            <CardContent>
              {dispute.incident ? (
                <div className="text-sm space-y-1">
                  <p><strong>Type:</strong> {dispute.incident.type}</p>
                  <p><strong>Description:</strong> {dispute.incident.description}</p>
                </div>
              ) : (
                <p>No incident data found.</p>
              )}
            </CardContent>
          </Card>
          
          {/* Dispute History / Audit Log */}
          <AuditHistory disputeId={params.id} />

        </div>
      </div>
    </div>
  );
}
