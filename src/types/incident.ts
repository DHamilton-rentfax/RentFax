
export interface Incident {
  id: string;
  renterId: string;
  description: string;
  amount: number;
  evidence: string[];
  status: string;
  createdAt: Date;
}
