"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { toast } from "sonner";
import { getAuth } from "firebase/auth";

import { db } from "@/firebase/client";

export default function NonCompliantPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "users"));
      const all = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUsers(all);
      setLoading(false);
    };
    load();
  }, []);

  const handleResend = async (user: any) => {
    if (!user.email) return toast.error("No email on file.");
    setSending(user.id);
    try {
      const auth = getAuth();
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/admin/compliance/remind-user", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ user }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(`Reminder sent to ${user.email}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to send reminder.");
    } finally {
      setSending(null);
    }
  };

  if (loading) return <p className="p-6 text-gray-600">Loading non-compliance data...</p>;

  const nonCompliant = users.filter((u) => u.complianceStatus === "non_compliant");

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-[#1A2540] mb-4">Non-Compliance Analytics</h1>

      <div className="bg-white rounded-xl shadow-md border p-6">
        <h2 className="text-xl font-semibold text-[#1A2540] mb-4">
          Users Marked as Non-Compliant
        </h2>

        {nonCompliant.length === 0 ? (
          <p className="text-gray-600">All users are compliant 🎉</p>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-gray-100 border-b text-[#1A2540]">
                <tr>
                  <th className="p-2 text-left">User</th>
                  <th className="p-2">Role</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2">Missing Policies</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {nonCompliant.map((u) => (
                  <tr key={u.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{u.id}</td>
                    <td className="p-2 text-center">{u.role}</td>
                    <td className="p-2">{u.email || "—"}</td>
                    <td className="p-2 text-center">{u.missingAcknowledgments?.length || 0}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleResend(u)}
                        disabled={sending === u.id}
                        className="bg-[#1A2540] text-white px-3 py-1 rounded-md hover:bg-[#2d3c66] disabled:opacity-50"
                      >
                        {sending === u.id ? "Sending..." : "Resend Reminder"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
