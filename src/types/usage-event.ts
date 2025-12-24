
import { Timestamp } from "firebase/firestore";

export interface UsageEvent {
  id: string;
  actorId: string;
  actorRole: "LANDLORD" | "COMPANY_ADMIN";
  companyId?: string;

  action:
    | "SEARCH_RENTER"
    | "VIEW_FULL_REPORT"
    | "CREATE_INCIDENT"
    | "BULK_UPLOAD"
    | "AI_RISK_ANALYSIS";

  creditsUsed: number;

  relatedId?: string;
  createdAt: Timestamp;
}
