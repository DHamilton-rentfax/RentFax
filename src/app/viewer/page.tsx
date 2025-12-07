import DisputeList from "@/components/DisputeList";
import FraudList from "@/components/FraudList";

export default function ViewerDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">📊 Viewer Dashboard</h1>
      <p className="text-gray-600">Read-only access for analysis & auditing.</p>

      <h2 className="text-xl font-semibold mt-6">Disputes (Read-Only)</h2>
      <DisputeList readOnly />

      <h2 className="text-xl font-semibold mt-6">Fraud Alerts (Read-Only)</h2>
      <FraudList readOnly />
    </div>
  );
}
