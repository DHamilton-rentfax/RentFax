
import { Incident } from './incident';
import { User } from './user';

export interface Dispute {
  id: string;
  renterId: string;
  incidentId: string;
  message: string;
  files: string[];
  createdAt: Date;
  updatedAt: Date;
  status: 'open' | 'under_review' | 'resolved' | 'rejected';
  adminNote?: string;
  evidence?: {
    url: string;
    filename: string;
  }[];
  renter?: User;
  incident?: Incident;
}
