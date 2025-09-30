import { Incident } from './incident';

export type Dispute = {
  id: string;
  renterId: string;
  incidentId: string;
  explanation: string;
  evidence: string[];
  createdAt: string;
  updatedAt: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED';
  adminNote?: string;
  renter: {
    id: string;
    name: string;
    email: string;
  };
  incident: Partial<Incident>;
};
