export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">
          Here's a quick overview of your applications, favorites, and recent
          activity.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: "Total Users", value: 0 },
          { label: "Total Properties", value: 0 },
          { label: "Total Applications", value: 0 },
          { label: "Open Support Tickets", value: 0 },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-lg border bg-white p-4 text-sm"
          >
            <div className="text-gray-500">{card.label}</div>
            <div className="text-2xl font-bold mt-1">{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
