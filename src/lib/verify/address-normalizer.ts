export function normalizeGlobalAddress(address: string) {
  const normalized = address
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

  return {
    raw: address,
    normalized,
    country: inferCountry(normalized),
  };
}

function inferCountry(addr: string) {
  if (addr.includes("USA") || addr.includes("UNITED STATES")) return "US";
  if (addr.includes("CANADA")) return "CA";
  if (addr.includes("MEXICO")) return "MX";
  if (addr.includes("UK") || addr.includes("UNITED KINGDOM")) return "UK";
  return "UNKNOWN";
}
