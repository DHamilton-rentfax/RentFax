export type SearchConfidence = {
  score: number; // 0–100
  level: "low" | "medium" | "high";
  reasons?: string[];
};

export type SearchResult = {
  found: boolean;
  verified: boolean;
  hasReport: boolean;

  memberId?: string;

  confidence: SearchConfidence;

  // 👇 THIS FIXES THE ERROR
  publicProfile?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    licenseNumber?: string;
  };
};

export type SearchPayload = {
  memberId?: string | null; // 👈 NEW (fast path)
  fullName?: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  licenseNumber?: string | null;
};
