// src/lib/search/types.ts
export interface NormalizedSearchResult {
  source: "internal" | "provider" | "none";
  renterId?: string;

  fullName: string;
  email?: string;
  phone?: string;
  dob?: string;

  address?: string;
  confidence: number;
  fraudScore: number;

  providerRaw?: any;
  internalData?: any;
}
