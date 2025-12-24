
import { Timestamp } from "firebase/firestore";

export interface CreditWallet {
  id: string; // Corresponds to ownerId
  ownerType: "LANDLORD" | "COMPANY";
  balance: number;
  plan: "FREE" | "PRO" | "ENTERPRISE";

  monthlyAllowance?: number;
  overageEnabled: boolean;

  updatedAt: Timestamp;
}
