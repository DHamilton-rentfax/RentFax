interface Props {
  incidents: any[];
  disputes: any[];
}

// A more sophisticated scoring logic will be developed later.
const calculateRiskScore = (incidents: any[], disputes: any[]): number => {
  let score = 100;
  score -= incidents.length * 10; // Each incident deducts 10 points
  score -= disputes.length * 5; // Each dispute deducts 5 points
  return Math.max(0, score); // Ensure score doesn't go below 0
};

export function RiskScore({ incidents, disputes }: Props) {
  const score = calculateRiskScore(incidents, disputes);

  const getScoreColor = (s: number) => {
    if (s >= 75) return "text-green-500";
    if (s >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        AI-Powered Risk Score
      </h3>
      <p className={`text-6xl font-bold ${getScoreColor(score)}`}>{score}</p>
      <p className="text-gray-500 mt-2">out of 100</p>
    </div>
  );
}
