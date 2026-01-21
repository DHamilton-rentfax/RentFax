export type RentalIntentResponse = 
  | "pending"
  | "yes"
  | "no"
  | "fraud";

export interface RentalIntentRecord {
  renterId: string;
  companyId: string;
  companyName: string;

  response: RentalIntentResponse;

  createdAt: number;
  respondedAt?: number;
}
