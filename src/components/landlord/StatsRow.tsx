export default function StatsRow({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white border rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700">Total Renters</h3>
        <p className="text-3xl font-bold">{stats.totalRenters}</p>
      </div>
      <div className="bg-white border rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700">Open Incidents</h3>
        <p className="text-3xl font-bold">{stats.openIncidents}</p>
      </div>
      <div className="bg-white border rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700">Disputes</h3>
        <p className="text-3xl font-bold">{stats.openDisputes}</p>
      </div>
    </div>
  );
}
