import { Timestamp } from "firebase/firestore";

export type MemberIdRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "DENIED"
  | "EXPIRED";

export type MemberIdRequest = {
  memberId: string;
  renterId: string;

  orgId: string;
  orgName: string;

  status: MemberIdRequestStatus;

  requestedAt: Timestamp;
  expiresAt: Timestamp;

  channel: "SMS" | "EMAIL";
  deliveryTarget: string;

  audit: {
    ip: string;
    userAgent: string;
  };
};