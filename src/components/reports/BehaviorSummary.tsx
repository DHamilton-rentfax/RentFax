export default function BehaviorSummary({ summary }: any) {
  return (
    <div className="bg-gray-50 p-4 rounded">
      <h3 className="font-semibold">Behavior Summary</h3>
      <ul className="text-sm">
        <li>Payment Reliability: {summary.paymentReliability}</li>
        <li>Avg Days Late: {summary.avgDaysLate}</li>
        <li>Outstanding Balance: ${summary.outstandingBalance}</li>
        <li>Asset Compliance: {summary.assetReturnCompliance}</li>
      </ul>
    </div>
  );
}