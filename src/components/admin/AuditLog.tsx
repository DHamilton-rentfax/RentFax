
"use client";
import { useEffect, useState } from "react";
import { db } from "@/firebase/client";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function AuditLog() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      const q = query(collection(db, "auditLogs"), orderBy("timestamp", "desc"));
      const snap = await getDocs(q);
      const logData: any[] = [];
      snap.forEach((doc) => logData.push({ id: doc.id, ...doc.data() }));
      setLogs(logData);
      setLoading(false);
    }
    fetchLogs();
  }, []);

  if (loading) return <p>Loading audit logs...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role Change Audit Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2">Changed By</th>
                <th className="p-2">Target User</th>
                <th className="p-2">New Role</th>
                <th className="p-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b">
                  <td className="p-2">{log.changedBy}</td>
                  <td className="p-2">{log.targetUser}</td>
                  <td className="p-2 font-semibold">{log.newRole}</td>
                  <td className="p-2">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default AuditLog;
