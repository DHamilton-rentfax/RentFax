import fetch from "node-fetch";

export async function alertOps(message: string) {
  if (!process.env.OPERATIONS_WEBHOOK_URL) return;

  await fetch(process.env.OPERATIONS_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: message }),
  });
}
