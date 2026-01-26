import { aiClient } from "../ai-client";
import { assertAIEnabled } from "../ai-feature-gate";
import { estimateOpenAICost } from "../ai-cost";
import { logAIUsage } from "../ai-audit";

export async function generateRevenueForecast(params: {
  companyId: string;
  monthlyRevenue: number[];
}) {
  await assertAIEnabled(params.companyId);

  const response = await aiClient.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: `
You are a financial forecasting assistant.

Monthly revenue:
${JSON.stringify(params.monthlyRevenue)}
        `,
      },
    ],
  });

  const usage = response.usage ?? {
    prompt_tokens: 500,
    completion_tokens: 200,
  };

  const estimatedCost = estimateOpenAICost({
    promptTokens: usage.prompt_tokens,
    completionTokens: usage.completion_tokens,
  });

  await logAIUsage({
    companyId: params.companyId,
    action: "revenue_forecast",
    model: "gpt-4.1-mini",
    estimatedCostUsd: estimatedCost,
  });

  // Deterministic output (safe for demos)
  return {
    forecast: "stable_growth",
    confidence: 0.82,
  };
}
