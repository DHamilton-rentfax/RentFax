
"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, getDocs, addDoc, serverTimestamp, query, where } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { Shield, Plus } from "lucide-react";

export default function DisputesPage() {
  const { user } = useAuth();
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDisputes() {
      const snap = await getDocs(collection(db, "disputes"));
      const data: any[] = [];
      snap.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
      setDisputes(data);
      setLoading(false);
    }
    fetchDisputes();
  }, []);

  // This is a sample function to demonstrate creating a notification for multiple admins.
  async function createNewDispute(companyName: string) {
    if (!user) return;

    // 1. Create the dispute
    const disputeRef = await addDoc(collection(db, "disputes"), {
        companyName,
        status: "NEW",
        createdAt: new Date().toISOString(),
        history: [{ status: "NEW", date: new Date().toISOString(), changedBy: user.uid }]
    });

    // 2. Find all SUPER_ADMINs and ADMINs
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("role", "in", ["SUPER_ADMIN", "ADMIN"]));
    const adminsSnap = await getDocs(q);

    if (adminsSnap.empty) {
        console.error("No admins found to notify!");
        return;
    }

    // 3. Create a notification for each admin
    const notificationPromises = adminsSnap.docs.map(adminDoc => {
        return addDoc(collection(db, "notifications"), {
            message: `New dispute filed by ${companyName}`,
            type: "DISPUTE_CREATED",
            link: `/admin/super-dashboard/disputes/${disputeRef.id}`,
            read: false,
            createdAt: new Date().toISOString(),
            userId: adminDoc.id, // Assign to the specific admin
            sendEmail: true, 
            emailSent: false,
            priority: "high", // Add priority
        });
    });

    await Promise.all(notificationPromises);

    alert(`Dispute created and notifications sent to all relevant admins.`);
    // Refresh list
    const newDispute = { id: disputeRef.id, companyName, status: "NEW" };
    setDisputes([newDispute, ...disputes]);
  }

  if (loading) {
    return <p className="p-6 text-gray-500">Loading disputes...</p>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dispute Management</h1>
      
      <div className="mb-6">
        <button onClick={() => createNewDispute('Sample Company Inc.')} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
          <Plus className="w-5 h-5 mr-2"/> (DEMO) Create New Dispute
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <h2 className="text-xl font-semibold p-4 border-b">All Disputes</h2>
        {disputes.length > 0 ? (
            disputes.map(d => (
                <div key={d.id} className="flex items-center p-4 border-b">
                    <Shield className="w-6 h-6 text-gray-500" />
                    <div className="ml-4 flex-grow">
                        <p className="font-semibold">{d.companyName}</p>
                        <p className="text-sm text-gray-500">Status: <span className="font-medium text-red-600">{d.status}</span></p>
                    </div>
                    <button className="text-sm text-blue-500 hover:underline">View Details</button>
                </div>
            ))
        ) : (
            <p className="p-6 text-center text-gray-500">No disputes found.</p>
        )}
      </div>
    </div>
  );
}
