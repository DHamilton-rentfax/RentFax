export type NotificationType = 
  | "PROFILE_LOOKUP"
  | "IDENTITY_VERIFIED_BY_COMPANY"
  | "RENTAL_INTENT_REQUEST"
  | "RENTAL_INTENT_RESPONSE";

export interface NotificationRecord {
  renterId: string;

  type: NotificationType;

  companyId: string;
  companyName: string;

  metadata: Record<string, any>;

  read: boolean;

  createdAt: number;
}
