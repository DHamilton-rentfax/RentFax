import DisputeList from "@/components/DisputeList";

export default function SupportDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">💬 Support Dashboard</h1>
      <p className="text-gray-600">Handle disputes and customer interactions.</p>

      <h2 className="text-xl font-semibold mt-6">Assigned Disputes</h2>
      <DisputeList />

      <h2 className="text-xl font-semibold mt-6">Live Chat</h2>
      <p>Chat panel goes here.</p>
    </div>
  );
}
