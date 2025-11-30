export async function runCodeAudit(renterId: string, code: string) {
  try {
    const res = await fetch("https://codesage.web.app/api/rentfax", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ renterId, code })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Audit failed");
    return data.issues || [];
  } catch (err: any) {
    console.error("CodeSage Error:", err.message);
    return [];
  }
}