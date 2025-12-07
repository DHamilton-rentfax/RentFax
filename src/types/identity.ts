export type IdentitySession = {
  id: string;
  userId: string;
  renter: {
    fullName: string;
    email?: string;
    phone?: string;
  };
  searchSessionId?: string | null;
  status: "pending" | "paid" | "submitted" | "approved" | "rejected";
  createdAt: number;
  updatedAt: number;
  purchaseId?: string | null; // Stripe payment Intent ID
  files?: {
    frontId?: string;
    backId?: string;
    selfie?: string;
  };
};
