// src/types/persona.ts
export const PERSONAS = {
  SUPERADMIN: "SUPERADMIN",
  STAFF: "STAFF",
  COMPANY: "COMPANY",
  AGENCY: "AGENCY",
  RENTER: "RENTER",
} as const;

export type Persona = typeof PERSONAS[keyof typeof PERSONAS];