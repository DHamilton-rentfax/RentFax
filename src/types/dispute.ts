
import { Incident } from './incident';

export interface Dispute {
  id: string;
  incidentId: string;
  message: string;
  files: string[];
  createdAt: Date;
  incident: Incident;
}
