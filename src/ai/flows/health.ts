"use server";
/**
 * @fileOverview A Genkit flow for checking the health of the application.
 */
import { ai } from "@/ai/genkit";
import { z } from "genkit";

const HealthOutputSchema = z.object({
  ok: z.boolean(),
  version: z.string(),
  timestamp: z.string(),
  env: z.record(z.boolean()),
});
export type HealthOutput = z.infer<typeof HealthOutputSchema>;

export async function health(): Promise<HealthOutput> {
  return healthFlow();
}

const healthFlow = ai.defineFlow(
  {
    name: "healthFlow",
    inputSchema: z.void(),
    outputSchema: HealthOutputSchema,
  },
  async () => {
    const VERSION = process.env.APP_VERSION || "v1.0.0";

    const env = {
      STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
      STRIPE_API_KEY: !!process.env.STRIPE_API_KEY,
      TASKS_LOCATION: !!process.env.TASKS_LOCATION,
      TASKS_QUEUE_ID: !!process.env.TASKS_QUEUE_ID,
      DISPUTE_REMINDER_URL: !!process.env.DISPUTE_REMINDER_URL,
      COMPANY_NOTIF_EMAIL: !!process.env.COMPANY_NOTIF_EMAIL,
      RENTER_NOTIF_FALLBACK: !!process.env.RENTER_NOTIF_FALLBACK,
    };

    return {
      ok: true,
      version: VERSION,
      timestamp: new Date().toISOString(),
      env,
    };
  },
);
