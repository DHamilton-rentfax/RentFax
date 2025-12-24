
import { Timestamp } from "firebase/firestore";

export interface RenterTimelineEvent {
  id: string;
  renterId: string;
  type: "INCIDENT" | "DISPUTE" | "DECISION";
  relatedId: string;

  label: string;
  description: string;

  visibleToRenter: boolean;
  createdAt: Timestamp;
}
