
import { getDisputesForRenter } from '@/app/actions/get-disputes-for-renter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface RenterDisputesPageProps {
  params: {
    renterId: string;
  };
}

export default async function RenterDisputesPage({ params }: RenterDisputesPageProps) {
  const { disputes, error } = await getDisputesForRenter(params.renterId);

  if (error || !disputes) {
    return <div>Error: {error || 'Could not fetch disputes'}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Submitted Disputes</h1>
      <div className="space-y-4">
        {disputes.length === 0 && <p>You have not submitted any disputes.</p>}
        {disputes.map(dispute => (
          <Card key={dispute.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Dispute for Incident <Link href={`/incidents/${dispute.incidentId}`} className="text-blue-500 hover:underline">{dispute.incidentId.substring(0, 8)}...</Link></CardTitle>
              <Badge>{dispute.status}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-2">Submitted on: {dispute.createdAt.toLocaleDateString()}</p>
              <p><strong>Your reason:</strong> {dispute.reason}</p>
              {dispute.evidence && dispute.evidence.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold">Attached Evidence:</h4>
                  <ul className="list-disc list-inside mt-2">
                    {dispute.evidence.map((file, index) => (
                      <li key={index}><a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{file.name}</a></li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
