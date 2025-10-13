interface Renter {
  email?: string;
  // ... other fields
}

interface Props {
  renter: Renter | null;
}

// Basic fraud detection logic. This can be expanded with more rules.
const detectFraudSignals = (renter: Renter | null): string[] => {
  const signals = [];
  if (renter?.email?.endsWith("@disposable.com")) {
    // Example for a disposable email
    signals.push("Uses a known disposable email provider.");
  }
  // Add more checks here
  return signals;
};

export function FraudSignals({ renter }: Props) {
  const signals = detectFraudSignals(renter);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        Fraud Signals
      </h3>
      {signals.length > 0 ? (
        <ul className="space-y-2">
          {signals.map((signal, i) => (
            <li key={i} className="flex items-start">
              <span className="text-yellow-500 mr-2">⚠️</span> {signal}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No significant fraud signals detected.</p>
      )}
    </div>
  );
}
