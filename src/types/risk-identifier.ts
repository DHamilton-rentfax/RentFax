
import { Timestamp } from "firebase/firestore";

export interface RiskIdentifier {
  type:
    | "ADDRESS"
    | "PHONE"
    | "EMAIL"
    | "DEVICE"
    | "PAYMENT_ACCOUNT";

  hash: string;

  linkedRenters: string[];
  linkedIncidents: string[];
  linkedReports: string[];

  firstSeenAt: Timestamp;
  lastSeenAt: Timestamp;
}
