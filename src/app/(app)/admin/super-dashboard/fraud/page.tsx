
"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, query, where, getDocs, addDoc, serverTimestamp, getDoc, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { AlertTriangle, User, ShieldCheck } from "lucide-react";

export default function FraudMonitorPage() {
  const { user } = useAuth();
  const [fraudAlerts, setFraudAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFraudAlerts() {
      const q = query(collection(db, "renters"), where("alert", "==", true));
      const snap = await getDocs(q);
      const alerts: any[] = [];
      snap.forEach(doc => alerts.push({ id: doc.id, ...doc.data() }));
      setFraudAlerts(alerts);
      setLoading(false);
    }
    fetchFraudAlerts();
  }, []);

  // This is a sample function to demonstrate creating a notification.
  // In a real app, you would get the super admin's ID dynamically.
  async function flagRenterAsFraud(renterId: string, renterName: string) {
    if (!user) return;

    // 1. Update the renter document
    const renterRef = doc(db, "renters", renterId);
    await updateDoc(renterRef, { alert: true, updatedAt: new Date().toISOString() });
    
    // 2. Find a super admin to notify
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("role", "==", "SUPER_ADMIN"), limit(1));
    const superAdminSnap = await getDocs(q);

    if (superAdminSnap.empty) {
        console.error("No super admin found to notify!");
        return;
    }
    const superAdminId = superAdminSnap.docs[0].id;

    // 3. Create a notification for the super admin
    await addDoc(collection(db, "notifications"), {
      message: `High-Risk: Renter '${renterName}' has been flagged for review.`,
      type: "FRAUD_ALERT",
      link: `/admin/super-dashboard/fraud`,
      read: false,
      createdAt: new Date().toISOString(),
      userId: superAdminId, // Assign to the super admin
      sendEmail: true, // Trigger an email notification
      emailSent: false,
    });
    
    // Refresh the list
    const updatedAlerts = [...fraudAlerts, { id: renterId, name: renterName, alert: true }];
    setFraudAlerts(updatedAlerts);

    alert(`Renter ${renterName} flagged and notification sent.`);
  }

  if (loading) {
    return <p className="p-6 text-gray-500">Loading fraud alerts...</p>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Fraud Monitoring</h1>
      
      <div className="mb-6">
        <button onClick={() => flagRenterAsFraud('sampleRenter123', 'John Doe')} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
          (DEMO) Flag Renter as Fraud
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <h2 className="text-xl font-semibold p-4 border-b">Active Fraud Alerts</h2>
        {fraudAlerts.length > 0 ? (
            fraudAlerts.map(alert => (
                <div key={alert.id} className="flex items-center p-4 border-b">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                    <div className="ml-4 flex-grow">
                        <p className="font-semibold">{alert.name || `Renter ${alert.id}`}</p>
                        <p className="text-sm text-gray-500">High-risk activity detected.</p>
                    </div>
                    <button className="text-sm text-blue-500 hover:underline">Review Case</button>
                </div>
            ))
        ) : (
            <p className="p-6 text-center text-gray-500">No active fraud alerts.</p>
        )}
      </div>
    </div>
  );
}
