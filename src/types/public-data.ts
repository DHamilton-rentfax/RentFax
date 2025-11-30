export interface PublicRecordMatch {
  source: string;
  confidence: number;
  fullName: string;
  dob?: string;
  address?: string;
  email?: string;
  phone?: string;
}

export interface PublicDataSummary {
  matches: PublicRecordMatch[];
  matchScore: number;
}