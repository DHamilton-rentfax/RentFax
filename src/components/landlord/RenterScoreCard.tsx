import ReputationBar from "@/components/renter/ReputationBar";

export default function RenterScoreCard({ data }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white border rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Top Renters by Score</h2>

      <div className="space-y-6">
        {data.map((renter) => (
          <div key={renter.id} className="border-b pb-4 last:border-none">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">{renter.name}</span>
              <span>{renter.score}/100</span>
            </div>

            <ReputationBar score={renter.score} level={renter.level} xp={renter.xp} />
          </div>
        ))}
      </div>
    </div>
  );
}
