
import { getAllIncidentsForRenter } from '@/app/actions/get-all-incidents-for-renter';
import DisputePanel from '@/components/dispute-panel';
import Link from 'next/link';

interface RenterIncidentsPageProps {
  params: {
    renterId: string;
  };
}

export default async function RenterIncidentsPage({ params }: RenterIncidentsPageProps) {
  const { incidents, error } = await getAllIncidentsForRenter(params.renterId);

  if (error || !incidents) {
    return <div>Error: {error || 'Could not fetch incidents'}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Incidents</h1>
        <Link href={`/renters/${params.renterId}`}>
          <a className="text-blue-500 hover:underline">Back to Profile</a>
        </Link>
      </div>
      <div className="space-y-4">
        {incidents.map(incident => (
          <DisputePanel key={incident.id} incident={incident} />
        ))}
      </div>
    </div>
  );
}
