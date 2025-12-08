interface Props {
  incidents: any[];
  behavioralFlags: string[];
}

export function BehavioralInsights({ incidents, behavioralFlags }: Props) {
  const positiveBehaviors =
    incidents.length === 0 ? ["No incidents reported"] : [];
  const riskSignals = incidents.map((i) => i.type);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Positive Behaviors */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-green-700 mb-3">
          Positive Behaviors
        </h3>
        <ul className="space-y-2">
          {positiveBehaviors.map((item, i) => (
            <li key={i} className="flex items-center">
              <span className="text-green-500 mr-2">✓</span> {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Risk Signals */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-red-700 mb-3">
          Risk Signals
        </h3>
        <ul className="space-y-2">
          {riskSignals.length > 0 ? (
            riskSignals.map((item, i) => (
              <li key={i} className="flex items-center">
                <span className="text-red-500 mr-2">✗</span> {item}
              </li>
            ))
          ) : (
            <li>No specific risk signals identified.</li>
          )}
        </ul>
      </div>

      {/* Behavioral Flags */}
      <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
        <h3 className="text-lg font-semibold text-blue-700 mb-3">
          Behavioral Flags
        </h3>
        <ul className="space-y-2">
          {behavioralFlags.length > 0 ? (
            behavioralFlags.map((item, i) => (
              <li key={i} className="flex items-center">
                <span className="text-blue-500 mr-2">⚑</span> {item}
              </li>
            ))
          ) : (
            <li>No behavioral flags identified.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
