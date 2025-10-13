"use client";
export async function getInvoices() {
  const res = await fetch("/api/stripe/invoices");
  if (!res.ok) return [];
  return res.json();
}
