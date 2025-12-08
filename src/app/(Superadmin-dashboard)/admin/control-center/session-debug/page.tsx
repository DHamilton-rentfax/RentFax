import { verifySessionServer } from "@/lib/verifySessionServer";

export default async function SessionDebugPage() {
  const session = await verifySessionServer();

  if (!session) {
    return <p className="p-6 text-red-600">No active session found</p>;
  }

  return (
    <pre className="p-6 bg-gray-900 text-green-400 rounded-xl overflow-auto">
      {JSON.stringify(session, null, 2)}
    </pre>
  );
}
