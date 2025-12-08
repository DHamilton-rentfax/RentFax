import { adminDb } from "@/firebase/server";
import RenterTimeline from "@/components/renter/RenterTimeline";
import type { RenterTimelineEvent } from "@/types/timeline";

export const dynamic = "force-dynamic";

export default async function RenterTimelinePage({
  params,
}: {
  params: { id: string };
}) {
  const renterDoc = await adminDb.collection("renters").doc(params.id).get();
  const renter = renterDoc.data();

  const timelineSnap = await adminDb
    .collection("renterTimeline")
    .where("renterId", "==", params.id)
    .orderBy("createdAt", "desc")
    .limit(200)
    .get();

  const events: RenterTimelineEvent[] = timelineSnap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as any),
  }));

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">
          Renter Timeline
        </h1>
        {renter && (
          <p className="text-sm text-muted-foreground">
            {renter.fullName || renter.name} — {renter.email}
          </p>
        )}
      </div>

      <RenterTimeline events={events} />
    </div>
  );
}
