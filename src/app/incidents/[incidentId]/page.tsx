
import { getIncidentById } from '@/app/actions/get-incident-by-id';
import DisputePanel from '@/components/dispute-panel';

interface IncidentPageProps {
  params: {
    incidentId: string;
  };
}

export default async function IncidentPage({ params }: IncidentPageProps) {
  const { incident, error } = await getIncidentById(params.incidentId);

  if (error || !incident) {
    return <div>Error: {error || 'Incident not found'}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Incident Details</h1>
      <DisputePanel incident={incident} />
    </div>
  );
}
