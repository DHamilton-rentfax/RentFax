export function computeEvictionSeverity(eviction: any) {
  if (eviction.lockoutDate) return "SEVERE";
  if (eviction.courtFiled) return "HIGH";
  if (eviction.noticeSent) return "MEDIUM";
  return "LOW";
}
