
import { RenterReputation } from "@/types/renter-reputation";

export function ReputationSummary({ rep }: { rep: RenterReputation }) {
  return (
    <div className="border rounded-xl p-6 bg-white">
      <h2 className="text-xl font-semibold">Your Rental History Summary</h2>

      <p className="mt-3 text-gray-700">
        This summary reflects reported rental incidents and their outcomes.
      </p>

      <ul className="mt-4 space-y-1 text-sm">
        <li>Total reported incidents: {rep.totalIncidents}</li>
        <li>Disputes filed: {rep.disputedIncidents}</li>
        <li>Resolved in your favor: {rep.resolvedInFavor}</li>
        <li>Currently unresolved: {rep.unresolved}</li>
      </ul>

      <div className="mt-4 text-sm">
        Status: <strong>{rep.summaryTone}</strong>
      </div>
    </div>
  );
}
