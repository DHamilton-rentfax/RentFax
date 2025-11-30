export function normalizeProfile(payload: any) {
  return {
    fullName: payload.fullName?.trim().toLowerCase() || "",
    email: payload.email?.trim().toLowerCase() || "",
    phone: payload.phone?.replace(/\D/g, "") || "",
    address: payload.address || "",
    city: payload.city || "",
    state: payload.state || "",
    zip: payload.zip || "",
    country: payload.country || "",
    licenseNumber: payload.licenseNumber || "",
  };
}
