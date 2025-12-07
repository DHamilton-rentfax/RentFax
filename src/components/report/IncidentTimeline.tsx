import { MapPin } from "lucide-react";

const IncidentTimeline = ({ incidents }: { incidents: any[] }) => {
  if (!incidents || incidents.length === 0) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900">Incident Timeline</h2>
      <div className="mt-6 flow-root">
        <ul className="-mb-8">
          {incidents.map((incident, incidentIdx) => (
            <li key={incident.id}>
              <div className="relative pb-8">
                {incidentIdx !== incidents.length - 1 ? (
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white">
                      <MapPin className="h-5 w-5 text-white" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500">{incident.date}</p>
                      <p className="font-medium text-gray-900">{incident.type}</p>
                      <p className="text-sm text-gray-600">{incident.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default IncidentTimeline;
