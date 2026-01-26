export function estimateOpenAICost(params: {
  promptTokens: number;
  completionTokens: number;
}) {
  // GPT-4.1-mini (example pricing)
  const costPer1kPrompt = 0.0003;
  const costPer1kCompletion = 0.0006;

  return (
    (params.promptTokens / 1000) * costPer1kPrompt +
    (params.completionTokens / 1000) * costPer1kCompletion
  );
}
