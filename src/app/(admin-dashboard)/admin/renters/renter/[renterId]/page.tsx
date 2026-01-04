import RenterTimeline from "@/components/timeline/RenterTimeline";
import { RenterOversightTools } from "@/components/admin/RenterOversightTools";
import { RenterAIInsights } from "@/components/admin/RenterAIInsights";

export default async function Page({ params }: { params: { renterId: string } }) {
  const renterId = params.renterId;

  const timelineRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/superadmin/renters/${params.renterId}/timeline`,
    { cache: "no-store" }
  );

  const { timeline } = await timelineRes.json();

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold">Renter Profile Oversight</h1>

      <RenterOversightTools renterId={renterId} />

      <div className="border rounded-xl p-6 bg-white shadow">
        <h2 className="text-2xl font-semibold mb-4">Renter Timeline</h2>
        <RenterTimeline timeline={timeline} />
      </div>

      {/* ⭐ NEW AI SECTION */}
      <RenterAIInsights renterId={renterId} />
    </div>
  );
}
