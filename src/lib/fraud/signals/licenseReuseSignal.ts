export type LicenseReuseSignal = {
  type: "LICENSE_REUSE";
  severity: "LOW" | "MEDIUM" | "HIGH";
  reuseCount: number;
  description: string;
};

export function detectLicenseReuse(reuseCount: number): LicenseReuseSignal | null {
  if (reuseCount < 2) return null;

  return {
    type: "LICENSE_REUSE",
    severity: reuseCount >= 3 ? "HIGH" : "MEDIUM",
    reuseCount,
    description:
      reuseCount >= 3
        ? "Government ID has been used across multiple renter identities"
        : "Government ID appears on more than one renter record",
  };
}
