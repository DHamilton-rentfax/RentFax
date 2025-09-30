
import { getAllIncidents } from '@/app/actions/get-all-incidents';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Define the expected shape of an incident for type safety
interface Incident {
  id: string;
  renterId: string | null;
  type: string;
  status: string;
  createdAt: string;
}

export default async function AdminIncidentsPage() {
  // Fetch all incidents using the server action
  const incidents: Incident[] = await getAllIncidents();

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Incidents Dashboard</h1>
        <Link href="/admin/incidents/create" passHref>
          <Button>Add New Incident</Button>
        </Link>
      </div>

      {
        incidents.length === 0 ? (
            <div className="text-center py-20 bg-white shadow-md rounded-lg">
                <h2 className="text-xl font-semibold text-gray-700">No Incidents Found</h2>
                <p className="text-gray-500 mt-2">There are currently no incidents to display.</p>
            </div>
        ) : (
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Renter ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Reported</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">View</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {incidents.map((incident) => (
                                <tr key={incident.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{incident.renterId ?? 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{incident.type}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${incident.status === 'Open' ? 'bg-red-100 text-red-800' : incident.status === 'under_review' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                            {incident.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(incident.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link href={`/admin/incidents/${incident.id}?renterId=${incident.renterId}`} passHref>
                                            <span className="text-indigo-600 hover:text-indigo-900 cursor-pointer">View</span>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
      }
    </div>
  );
}
