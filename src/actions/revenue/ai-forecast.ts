"use server";

import { generateRevenueForecast } from "@/lib/ai/services/revenue-forecast";

export async function getAIRevenueForecast(companyId: string) {
  return generateRevenueForecast({
    companyId,
    monthlyRevenue: [12000, 14500, 16200],
  });
}
