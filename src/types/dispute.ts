export type Dispute = {
  id: string;
  renter: { id: string; name: string };
  explanation: string;
  evidence: string[];
  status: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';
  adminNote?: string;
  incident: {
    id: string;
    amount: number;
    description: string;
    date: string;
  };
};