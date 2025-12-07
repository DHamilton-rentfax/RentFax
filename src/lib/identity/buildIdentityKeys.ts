import {
  normalizeString,
  normalizeEmail,
  normalizePhone,
  hash
} from "./normalize";

export function buildIdentityKeys(payload: any) {
  const fullName = normalizeString(payload.fullName);
  const phone = normalizePhone(payload.phone);
  const email = normalizeEmail(payload.email);
  const address = normalizeString(payload.address);
  const license = normalizeString(payload.licenseNumber);

  const nameKey = hash(fullName);
  const phoneKey = phone ? hash(phone) : null;
  const emailKey = email ? hash(email) : null;
  const addressKey = address ? hash(address) : null;
  const licenseKey = license ? hash(license) : null;

  // Combined multi-factor identity fingerprint
  const combinedHash = hash(
    [
      nameKey,
      phoneKey ?? "",
      emailKey ?? "",
      addressKey ?? "",
      licenseKey ?? ""
    ].join("|")
  );

  return {
    nameKey,
    phoneKey,
    emailKey,
    addressKey,
    licenseKey,
    combinedHash
  };
}