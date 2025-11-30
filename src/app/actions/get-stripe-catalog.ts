"use server";
import { stripe } from "@/lib/stripe/server";

export async function getStripeCatalog() {
  const products = await stripe.products.list({
    expand: ["data.default_price"],
  });
  return products.data.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    priceId: typeof p.default_price === "object" ? p.default_price.id : null,
    unitAmount:
      typeof p.default_price === "object" ? p.default_price.unit_amount : null,
    currency:
      typeof p.default_price === "object" ? p.default_price.currency : "usd",
    interval:
      typeof p.default_price === "object"
        ? p.default_price.recurring?.interval
        : null,
    metadata: p.metadata,
  }));
}
