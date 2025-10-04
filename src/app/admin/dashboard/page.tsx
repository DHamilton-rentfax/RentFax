import DisputeList from "@/components/DisputeList";
import FraudList from "@/components/FraudList";

export default function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">⚡ Admin Dashboard</h1>
      <p className="text-gray-600">Manage operations, renters, and disputes.</p>

      <h2 className="text-xl font-semibold mt-6">Disputes</h2>
      <DisputeList />

      <h2 className="text-xl font-semibold mt-6">Fraud Alerts</h2>
      <FraudList />
    </div>
  );
}
