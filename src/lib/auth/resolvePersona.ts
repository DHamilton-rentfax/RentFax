// src/lib/auth/resolvePersona.ts
import { ROLES } from "@/types/roles";
import { PERSONAS, Persona } from "@/types/persona";

export function resolvePersona(role: string): Persona {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return PERSONAS.SUPERADMIN;

    case ROLES.SUPPORT_ADMIN:
    case ROLES.SUPPORT_AGENT:
    case ROLES.COMPLIANCE_AGENT:
    case ROLES.CONTENT_MODERATOR:
      return PERSONAS.STAFF;

    case ROLES.ORG_OWNER:
    case ROLES.ORG_STAFF:
    case ROLES.COMPANY_ADMIN:
    case ROLES.LANDLORD:
      return PERSONAS.COMPANY;

    case ROLES.RENTER:
      return PERSONAS.RENTER;

    case ROLES.SALES_AGENT:
      return PERSONAS.AGENCY;

    default:
      throw new Error(`Unknown role: ${role}`);
  }
}
