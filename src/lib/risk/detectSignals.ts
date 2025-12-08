// lib/risk/detectSignals.ts

export type Signal = {
  type: "BEHAVIORAL" | "IDENTITY" | "ADDRESS_MATCH" | "PHONE_MATCH";
  message: string;
  weight: number; // contributes to risk score
};

export function detectSignals(input: {
  renter: any;
  incidents: any[];
  disputes: any[];
}): Signal[] {
  const out: Signal[] = [];

  // Behavior patterns (formerly "fraud")
  if (input.incidents.some(i => i.status === "UNPAID")) {
    out.push({
      type: "BEHAVIORAL",
      message: "Outstanding unpaid balances",
      weight: 18
    });
  }

  if (input.disputes.some(d => d.status === "ESCALATED")) {
    out.push({
      type: "BEHAVIORAL",
      message: "Escalated dispute history",
      weight: 14
    });
  }

  // Identity mismatch signals
  if (!input.renter.emailVerified) {
    out.push({
      type: "IDENTITY",
      message: "Email not verified",
      weight: 8
    });
  }

  // Add more later as needed...

  return out;
}
