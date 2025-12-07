import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function analyzeBehaviorTrends(history: any[]) {
  // Mock implementation
  // In a real scenario, you would use an AI model to analyze trends.
  // For now, we'll use a simple heuristic.

  if (!history || history.length < 2) {
    return 0; // STABLE
  }

  const sortedHistory = history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const recentEvents = sortedHistory.slice(-3);

  let improvingCount = 0;
  let decliningCount = 0;

  recentEvents.forEach(event => {
    if (event.type === 'PAYMENT' && event.status === 'ON_TIME') {
      improvingCount++;
    } else if (event.type === 'INCIDENT') {
      decliningCount++;
    }
  });

  if (improvingCount > decliningCount) {
    return 40; // IMPROVING
  }

  if (decliningCount > improvingCount) {
    return -40; // DECLINING
  }

  return 0; // STABLE
}
