
import { RenterImprovementSignal } from "@/types/renter-improvement-signals";

export function ImprovementSignals({ signals }: { signals: RenterImprovementSignal[] }) {
  if (!signals?.length) return null;

  return (
    <div className="border rounded-xl p-5 bg-green-50">
      <h3 className="font-semibold">Positive Activity</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {signals.map((s, i) => (
          <li key={i}>✔ {s.message}</li>
        ))}
      </ul>
    </div>
  );
}
