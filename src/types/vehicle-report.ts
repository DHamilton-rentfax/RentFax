export interface VehicleReportDraft {
    paymentAndFinancial: {
      latePayments: boolean | null;
      chargebacks: boolean | null;
      unpaidFees: boolean | null;
      evidence: File[];
    };
    theftAndTampering: {
      stolen: boolean | null;
      recovered: boolean | null;
      tampering: boolean;
      evidence: File[];
    };
    drivingAndLegal: {
      accidents: boolean | null;
      violations: boolean | null;
      criminalUse: boolean | null;
      evidence: File[];
    };
    conditionAndCare: {
      cleanReturn: boolean | null;
      smokedIn: boolean | null;
      excessWear: boolean | null;
      evidence: File[];
    };
    useAndControl: {
      unauthorizedDrivers: boolean | null;
      drivers: any[]; // define better later
      evidence: File[];
    };
    communication: {
      responsiveness: "responsive" | "intermittent" | "cutoff" | null;
      evidence: File[];
    };
  }
  