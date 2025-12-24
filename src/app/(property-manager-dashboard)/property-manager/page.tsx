export default function PropertyManagerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Property Manager Dashboard</h1>
        <p className="text-gray-600">
          Here's a quick overview of your properties, renters, and recent
          activity.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: "Properties Under Management", value: 0 },
          { label: "Total Renters", value: 0 },
          { label: "Unread Notifications", value: 0 },
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