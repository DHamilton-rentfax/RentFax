import { adminDb } from "@/firebase/server";
import { Check, X } from "lucide-react";

async function getIdentityRequests() {
  const snapshot = await adminDb.collection("identityRequests").where('status', '==', 'pending').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function handleApprove(id: string) {
  'use server'
  await adminDb.collection("identityRequests").doc(id).update({ status: 'approved' });
  // In a real app, you would also update the user's identity status
}

async function handleDeny(id: string) {
  'use server'
  await adminDb.collection("identityRequests").doc(id).update({ status: 'denied' });
}

export default async function AdminIdentityReview() {
  const requests = await getIdentityRequests();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Identity Review</h1>
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="text-lg font-semibold mb-4">Pending Requests</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((req: any) => (
                <tr key={req.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{req.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{req.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <form action={async () => { await handleApprove(req.id) }}>
                      <button type="submit" className="text-green-600 hover:text-green-900">
                        <Check className="h-5 w-5" />
                      </button>
                    </form>
                    <form action={async () => { await handleDeny(req.id) }}>
                      <button type="submit" className="text-red-600 hover:text-red-900 ml-4">
                        <X className="h-5 w-5" />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
