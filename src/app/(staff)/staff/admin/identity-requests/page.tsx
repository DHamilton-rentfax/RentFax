"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

type IdentityRow = {
  id: string;
  renterName: string;
  renterEmail?: string | null;
  renterPhone?: string | null;
  status: string;
  createdAt?: number | null;
  completedAt?: number | null;
};

export default function IdentityRequestsAdminPage() {
  const [rows, setRows] = useState<IdentityRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/identity-requests");
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Failed to load");
        setRows(json.requests || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <main className="p-4 sm:p-6 max-w-5xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Identity Verifications</h1>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-2">Renter</th>
                <th className="px-3 py-2">Contact</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Created</th>
                <th className="px-3 py-2">Completed</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-center text-xs text-slate-500">
                    No identity verifications yet.
                  </td>
                </tr>
              )}

              {rows.map((row) => (
                <tr key={row.id} className="border-t">
                  <td className="px-3 py-2 text-xs">
                    <div className="font-medium">{row.renterName}</div>
                  </td>
                  <td className="px-3 py-2 text-xs text-slate-600">
                    {row.renterEmail && <div>{row.renterEmail}</div>}
                    {row.renterPhone && <div>{row.renterPhone}</div>}
                  </td>
                  <td className="px-3 py-2 text-xs">
                    <span className="inline-flex rounded-full px-2 py-1 bg-slate-50 border text-[10px]">
                      {row.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-[10px] text-slate-500">
                    {row.createdAt ? new Date(row.createdAt).toLocaleString() : "—"}
                  </td>
                  <td className="px-3 py-2 text-[10px] text-slate-500">
                    {row.completedAt ? new Date(row.completedAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
