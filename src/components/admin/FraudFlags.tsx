export function FraudFlags({ fraudScore, signals }) {
  return (
    <div className="bg-gray-50 border-l-4 border-red-500 p-4 rounded-lg">
      <h3 className="font-bold text-red-700 mb-2">Fraud Intelligence</h3>

      <p>Fraud Score: {fraudScore}</p>

      <ul className="mt-2 list-disc pl-6 text-sm text-gray-700">
        {signals.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
