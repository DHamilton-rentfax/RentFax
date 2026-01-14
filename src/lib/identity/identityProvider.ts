export type IdentityResult = {
  verified: boolean;
  confidence: number; // 0–100
  signals: string[];
  provider: "PDPL" | "KYC_VENDOR";
  referenceId?: string;
};

export interface IdentityProvider {
  verify(input: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
  }): Promise<IdentityResult>;
}
