export type ChatContext = {
  page: string;
  role: "guest" | "renter" | "company" | "admin";
  plan?: string | null;
};

export async function askRentfaxAI(
  question: string,
  context: ChatContext
): Promise<string> {
  const res = await fetch("/api/ai/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, context }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("AI request failed:", errorBody);
    throw new Error(`AI request failed with status ${res.status}`);
  }

  const data = await res.json();
  if (!data.answer) {
    throw new Error("AI response did not contain an answer.");
  }

  return data.answer;
}
