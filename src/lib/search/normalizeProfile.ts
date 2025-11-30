// src/lib/search/normalizeProfile.ts

// ----------------------------
// Utility helpers
// ----------------------------
function cleanString(v?: string | null): string | null {
  if (!v) return null;
  const s = v.trim();
  if (!s || s === "N/A" || s === "null" || s === "undefined") return null;
  return s;
}

function normalizeEmail(v?: string | null): string | null {
  const cleaned = cleanString(v);
  if (!cleaned) return null;
  return cleaned.toLowerCase();
}

function normalizePhone(v?: string | null): string | null {
  const cleaned = cleanString(v);
  if (!cleaned) return null;
  const digits = cleaned.replace(/\D/g, "");
  if (digits.length < 7) return null;
  return digits.slice(-10);
}

function normalizeDOB(v?: string | null): string | null {
  const cleaned = cleanString(v);
  if (!cleaned) return null;

  // YYYY-MM-DD expected
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) return cleaned;

  // Convert formats like MM/DD/YYYY
  const parts = cleaned.split(/[/-]/);
  if (parts.length === 3) {
    let [a, b, c] = parts;
    if (c.length === 4) {
      // mm/dd/yyyy
      return `${c}-${a.padStart(2, "0")}-${b.padStart(2, "0")}`;
    }
  }

  return null;
}

function normalizeAddress(addr?: string | null) {
  const cleaned = cleanString(addr);
  if (!cleaned) return { raw: null, street: null, city: null, state: null, zip: null };

  // extremely simple parsing (Mapbox already gives structured data)
  const parts = cleaned.split(",").map((x) => x.trim());

  const street = parts[0] || null;
  const city = parts[1] || null;

  // part: "CA 90210" or "CA"
  let state: string | null = null;
  let zip: string | null = null;

  if (parts[2]) {
    const p = parts[2].split(" ");
    if (p[0] && p[0].length <= 3) state = p[0].toUpperCase();
    if (p[1]) zip = p[1];
  }

  return {
    raw: cleaned,
    street,
    city,
    state,
    zip,
  };
}

function normalizeLicense(v?: string | null): string | null {
  const cleaned = cleanString(v);
  if (!cleaned) return null;
  return cleaned.replace(/\s+/g, "").toUpperCase();
}

// ----------------------------
// MAIN NORMALIZER
// ----------------------------
export function normalizeProfile(input: {
  fullName: string;
  email?: string;
  phone?: string;
  dob?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  licenseNumber?: string;
  licenseType?: string;
}) {
  // 1) Name parsing
  const nameParts = input.fullName.trim().split(/\s+/);
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ") || null;

  // 2) Email
  const email = normalizeEmail(input.email);

  // 3) Phone
  const phone = normalizePhone(input.phone);

  // 4) DOB
  const dob = normalizeDOB(input.dob);

  // 5) Address (from modal or Mapbox)
  const address = normalizeAddress(input.address);

  // If city/state provided manually → override
  const city = cleanString(input.city) ?? address.city;
  const state = cleanString(input.state) ?? address.state;
  const zip = cleanString(input.zip) ?? address.zip;

  // 6) License
  const licenseNumber = normalizeLicense(input.licenseNumber);

  // 7) Return clean object
  return {
    raw: input,
    parsed: {
      firstName: firstName || null,
      lastName,
      fullName: cleanString(input.fullName),
      email,
      phone,
      dob,
      address: {
        street: address.street,
        city,
        state,
        zip,
        raw: address.raw,
      },
      license: {
        number: licenseNumber,
        type: cleanString(input.licenseType) ?? null,
      },
    },
  };
}
