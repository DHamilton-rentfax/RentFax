
interface Incident {
    id: string;
    type: string;
    status: string;
    createdAt: any; // Firestore timestamp
}

interface Props {
    incidents: Incident[];
}

export function IncidentTimeline({ incidents }: Props) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Incident Timeline</h3>
            {incidents.length > 0 ? (
                <div className="space-y-4">
                    {incidents.map(incident => (
                        <div key={incident.id} className="flex space-x-4 items-start">
                            <div className="flex-shrink-0">
                                <p className="text-sm text-gray-500">{new Date(incident.createdAt?.toDate()).toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="font-semibold">{incident.type}</p>
                                <p className={`text-sm ${incident.status === 'Resolved' ? 'text-green-600' : 'text-gray-600'}`}>{incident.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">No incident history.</p>
            )}
        </div>
    );
}
