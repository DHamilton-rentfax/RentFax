import { Timestamp } from "firebase/firestore";

export type Renter = {
  memberId: string;
  memberIdStatus: "ACTIVE" | "REVOKED";
  verified: boolean;
  verifiedAt: Timestamp;
  contact: {
    email?: string;
    phone?: string;
  };
  createdAt: Timestamp;
};