export async function logEvent(
  message: string,
  level: "info" | "warn" | "error" = "info",
  meta: any = {}
) {
  try {
    // Construct an absolute URL to be safe on both client and server
    const absoluteUrl = new URL(
      "/api",
      process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
    );

    await fetch(absoluteUrl.href, {
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
