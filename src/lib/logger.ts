export async function logEvent(
  message: string,
  level: "info" | "warn" | "error" = "info",
  meta: any = {}
) {
  try {
    await fetch("/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, level, meta, source: "web" }),
    });
  } catch (err) {
    console.warn("Cloud log skipped:", (err as any).message);
  }
}
