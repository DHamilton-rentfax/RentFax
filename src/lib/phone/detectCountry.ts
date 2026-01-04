export async function detectCountryFallback(): Promise<string> {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    return data?.country_code || "US";
  } catch {
    return "US";
  }
}
