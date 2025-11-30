
import { PublicDataResult } from "./providers/PublicDataProvider";

export function normalizePublicData(pipl: PublicDataResult) {
  return {
    fullName: pipl.fullName || null,
    email: pipl.email || null,
    phone: pipl.phone || null,
    address: pipl.address || null,
    aliases: pipl.aliases || [],
    dob: pipl.dob || null,
    age: pipl.age || null,
    associatedPeople: pipl.associatedPeople || [],
    addresses: pipl.addresses || [],
    matchScore: pipl.matchScore,
    raw: pipl.raw,
    updatedAt: Date.now(),
  };
}
