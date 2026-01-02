export async function getFeatureFlags() {
  const snap = await fetch("/api/config/features").then(r => r.json());
  return snap;
}
