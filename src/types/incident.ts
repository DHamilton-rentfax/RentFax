export interface Incident {
  id: string;
  renterId: string;
  description: string;
  amount: number;
  evidence: string[];
  status: "reported" | "resolved" | "disputed";
  createdAt: string;
  type: string;
}
