// src/lib/rentfax/schema.ts

export type UnauthorizedDriver = {
  fullName: string;
  dob?: string;
  licenseHash?: string;
  licenseState?: string;
  relationship?: string;
  notes?: string;
  evidence?: string[]; // URLs
  linkedRenterId?: string;
};

export type EventTimeline = {
  eventId: string;
  type: string;
  description: string;
  evidence: string[];
  internalOnly: boolean;
  createdAt: number;
  staffId: string;
};

export type EvidenceItem = {
  id: string;
  url: string;
  type: "photo" | "video" | "pdf" | "audio" | "other";
  uploadedAt: number;
  uploadedBy: string;
};

export type CostItem = {
  label: string;
  qty: number;
  unitCost: number;
  total: number;
};

export interface Incident {
  id?: string;
  companyId: string;
  renterId: string;
  occurredAt: number;
  location: string;
  vehicle: {
    vin: string;
    make: string;
    model: string;
    year: number;
    plate: string;
    mileageOut?: number;
    mileageIn?: number;
    fuelOut?: number;
    fuelIn?: number;
  };
  incidentType: string[];
  unauthorizedDrivers: UnauthorizedDriver[];
  evidence: EvidenceItem[];
  timeline: EventTimeline[];
  costBreakdown: CostItem[];
  totalCost: number;
  riskSignals: string[];
  status: "open" | "closed" | "in-dispute";
  createdAt: number;
  updatedAt: number;
}
