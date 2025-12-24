
import { RenterTimelineEvent } from "@/types/renter-timeline";

export function RenterTimeline({ items }: { items: RenterTimelineEvent[] }) {
  return (
    <div className="space-y-4">
      {items.map(i => (
        <div key={i.id} className="border-l pl-4">
          <div className="text-xs text-gray-500">
            {new Date(i.createdAt.toMillis()).toLocaleDateString()} {/* Assuming createdAt is a Firestore Timestamp */}
          </div>
          <div className="font-medium">{i.label}</div>
          <div className="text-sm text-gray-600">{i.description}</div>
        </div>
      ))}
    </div>
  );
}
