export interface BillingRecord {
  id: string;
  type: "IDENTITY_CHECK" | "REPORT_UNLOCK";
  companyId: string;
  renterId?: string;
  amount: number;              // stored in cents
  timestamp: number;
  stripePaymentIntent: string;
  stripeReceiptUrl: string;
}