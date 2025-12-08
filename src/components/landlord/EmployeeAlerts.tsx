export default function EmployeeAlerts({ alerts }) {
  if (!alerts || alerts.length === 0) {
    return null; // Don't render if there are no alerts
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <h3 className="font-bold text-yellow-800">Employee Activity Alerts</h3>
      <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside">
        {alerts.map((alert, index) => (
          <li key={index}>{alert.message}</li>
        ))}
      </ul>
    </div>
  );
}
