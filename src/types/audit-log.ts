export type AuditLog = {
  id: string;
  action: string;
  targetId: string;
  targetType: "dispute" | "renter" | "incident";
  timestamp: number;
  before: any;
  after: any;
};
