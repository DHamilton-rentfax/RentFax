
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  vertical?: string; // housing, car rental, equipment, etc.
  status: "new" | "contacted" | "qualified" | "demo" | "proposal" | "negotiation" | "won" | "lost";
  assignedTo: string;
  createdAt: number;
  updatedAt: number;
}

export interface Deal {
  id: string;
  leadId: string;
  companyName: string;
  repId: string;
  stage: "new" | "qualified" | "demo" | "proposal" | "negotiation" | "won" | "lost";
  amountMonthly: number;
  amountAnnual: number;
  probability: number;
  lastActivityAt: number;
  createdAt: number;
  updatedAt: number;
}
