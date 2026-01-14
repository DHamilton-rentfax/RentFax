import { requireSupportSession } from "@/lib/auth/requireSupportSession";
import { adminDb } from "@/firebase/server";

export default async function LedgerDetailPage() {
  await requireSupportSession();

  const snapshot = await adminDb
    .collection("ledger")
    .orderBy("createdAt", "desc")
    .get();

  return (
    <pre className="text-xs bg-gray-900 text-white p-4 rounded">
      {JSON.stringify(
        snapshot.docs.map((d) => ({ id: d.id, ...d.data() })),
        null,
        2
      )}
    </pre>
  );
}
