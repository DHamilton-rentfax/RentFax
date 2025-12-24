import RecommendedHelp from "@/components/support/RecommendedHelp";

export default function LandlordDashboard() {
  return (
    <div className="p-10 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold">Landlord Dashboard</h1>
      <p>Welcome to your dashboard. Here you can manage your properties and tenants.</p>
      {/* Add landlord-specific components here */}
      <RecommendedHelp context="landlord_dashboard" />
    </div>
  );
}
