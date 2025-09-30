
import { Incident } from './incident';
import { User } from './user';

export type Dispute = {
  id: string;
  renterId: string;
  incidentId?: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  status: 'open' | 'under_review' | 'resolved' | 'rejected';
  adminNote?: string;
  evidence?: {
    url: string;
    filename: string;
  }[];
  renter?: User;
  incident?: Incident;
};
