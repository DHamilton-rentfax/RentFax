import "server-only";

export function toCSV(rows: Record<string, any>[]) {
  if (!rows || rows.length === 0) return "";

  const headers = Object.keys(rows[0]);

  const escape = (v: any) => {
    const s = String(v ?? "");
    // Escape double quotes by doubling them, and wrap the whole field in double quotes.
    return `"${s.replace(/"/g, '""')}"`;
  };

  const lines = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ];

  return lines.join("\n");
}
