export interface Notification {
  userId: string;
  tenantId?: string;
  type: 
    "incident" |
    "dispute" |
    "verification" |
    "fraud_alert" |
    "system" |
    "billing" |
    "message";

  title: string;
  message: string;
  link?: string;
  read: boolean;
  channels: ("email" | "sms" | "push")[];
  priority: "normal" | "high" | "critical";
  createdAt: number;
}
