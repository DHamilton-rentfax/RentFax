import RenterScorePanel from "@/components/renter/RenterScorePanel";

export default function RenterDashboard() {
  const renter = {
    identityScore: 85,
    behaviorScore: 92,
    confidenceScore: 78,
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Renter Dashboard</h1>
      <RenterScorePanel
        identityScore={renter.identityScore ?? 0}
        behaviorScore={renter.behaviorScore ?? 0}
        confidenceScore={renter.confidenceScore ?? 0}
      />
    </div>
  );
}
