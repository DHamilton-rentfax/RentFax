import { ShieldAlert } from "lucide-react";

const FraudSignals = ({ signals }: { signals: any }) => {
  const signalEntries = Object.entries(signals).filter(([, value]) => value);

  if (signalEntries.length === 0) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center">
        <ShieldAlert className="h-6 w-6 text-red-600" />
        <h2 className="ml-3 text-lg font-medium text-gray-900">Fraud Signals</h2>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-gray-700">
        {signalEntries.map(([key, value]) => (
          <li key={key} className="flex items-start">
            <span className="font-semibold mr-2">{key}:</span>
            <span>{String(value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FraudSignals;
