import { google } from "@ai-sdk/google";

export async function aiSearchFallback(query: string) {
  const gemini = google("gemini-2.0-pro");

  const prompt = `
  The user searched for: "${query}".
  Provide a concise, accurate answer suitable for a Help Center article.
  Keep it under 120 words.
  `;

  const response = await gemini.generateText({
    prompt,
  });

  return response.text;
}
