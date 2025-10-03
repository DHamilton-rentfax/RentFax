import { useState, useEffect } from "react";
import { firestore } from "~/services/firebase";
import Link from "next/link";

export default function AlertsHistory() {
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = firestore
      .collection("alerts")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        setAlerts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });

    return () => unsubscribe();
  }, []);

  const acknowledge = async (id: string) => {
    const currentUser = "Super Admin"; // In a real app, you'd get this dynamically
    await firestore.collection("alerts").doc(id).update({
      status: "acknowledged",
      ackBy: currentUser,
      ackAt: new Date(),
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-700";
      case "acknowledged":
        return "bg-yellow-100 text-yellow-700";
      case "resolved":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Live Incident Dashboard</h1>
      <ul>
        {alerts.map((a) => (
          <li key={a.id} className="py-3 flex justify-between items-center border-b">
            <div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusBadge(a.status)}`}
                >
                  {a.status}
                </span>
                <p className="font-semibold">{a.type.replace("_", " ")}</p>
              </div>
              <p className="text-sm text-gray-600 mt-2">{a.message}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(a.createdAt.toDate()).toLocaleString()}
              </p>
              {a.targetLink && (
                <Link href={a.targetLink} className="text-blue-600 text-xs underline">
                  View Related Record
                </Link>
              )}
            </div>
            <div className="text-right">
              {a.status === "open" && (
                <button
                  onClick={() => acknowledge(a.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  Acknowledge
                </button>
              )}
              {a.status === "acknowledged" && a.ackAt && (
                <span className="text-xs text-yellow-700">
                  Acknowledged by {a.ackBy} at {new Date(a.ackAt.toDate()).toLocaleString()}
                </span>
              )}
              {a.status === "resolved" && a.resolvedAt && (
                <span className="text-xs text-green-700">
                  ✅ Auto-Resolved at {new Date(a.resolvedAt.toDate()).toLocaleString()}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
