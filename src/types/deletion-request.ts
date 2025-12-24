
import { Timestamp } from "firebase/firestore";

export interface DeletionRequest {
  id: string;
  requestedByUserId: string;
  requestType: "ACCOUNT_DELETE" | "DATA_DELETE";
  status: "SUBMITTED" | "IN_REVIEW" | "APPROVED" | "DENIED" | "EXECUTED";

  targets: {
    userProfile: boolean;
    notifications: boolean;
    messageDeliveries: boolean;
    supportMessages: boolean;
    evidenceUploads: boolean;
  };

  reviewerId?: string | null; // SUPER_ADMIN
  decisionReason?: string | null;

  createdAt: Timestamp;
  executedAt?: Timestamp | null;
}
