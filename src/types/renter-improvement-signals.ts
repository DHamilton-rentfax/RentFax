
import { Timestamp } from "firebase/firestore";

export interface RenterImprovementSignal {
  type:
    | "NO_INCIDENTS_12_MONTHS"
    | "DISPUTE_SUCCESS"
    | "ON_TIME_PAYMENTS_REPORTED"
    | "POSITIVE_RENTAL_COMPLETION";

  message: string;
  earnedAt: Timestamp;
}

export interface RenterImprovementSignals {
  renterId: string;
  signals: RenterImproveMentsignal[];
}
