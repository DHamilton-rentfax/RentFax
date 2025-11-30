import { Timestamp } from "firebase/firestore";

export type InviteStatus = "PENDING" | "ACCEPTED" | "EXPIRED" | "CANCELED";

export interface Invite {
  id: string;
  email: string;
  role: "ADMIN" | "EDITOR" | "SUPPORT" | "ANALYST";
  status: InviteStatus;
  createdAt: Timestamp;
  acceptedAt?: Timestamp;
  inviterId: string;
  companyId: string;
  companyName: string;
  token: string;
}
