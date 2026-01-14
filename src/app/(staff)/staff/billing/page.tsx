import { requireSupportSession } from "@/lib/auth/requireSupportSession";
import { adminDb } from "@/firebase/server";

export default async function StaffBillingPage() {
  await requireSupportSession();

  const snapshot = await adminDb
    .collection("ledger")
    .orderBy("createdAt", "desc")
    .limit(50)
    .get();

  const entries = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Billing & Ledger</h1>

      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Org</th>
            <th className="p-2">Action</th>
            <th className="p-2">Amount</th>
            <th className="p-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e: any) => (
            <tr key={e.id} className="border-t">
              <td className="p-2">{e.orgId || "-"}</td>
              <td className="p-2">{e.action}</td>
              <td className="p-2">{e.amount}</td>
              <td className="p-2">
                {e.createdAt?.toDate?.().toLocaleString?.() ?? "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
