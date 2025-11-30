export function normalizePDLRecord(raw: any) {
  if (!raw) return null;

  return {
    fullName: raw.full_name || null,
    emails: raw.emails || [],
    phones: raw.phone_numbers || [],
    addresses: raw.street_addresses || [],
    dob: raw.birth_date || null,
    linkedin: raw.linkedin_url || null,
    confidence: raw.confidence || 0,
    dataFrom: "pdl",
  };
}
