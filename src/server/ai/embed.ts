export async function embedText(text: string): Promise<number[]> {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "text-embedding-3-large",
      input: text,
    }),
  });

  if (!res.ok) {
    throw new Error("Embedding failed");
  }

  const data = await res.json();
  return data.data[0].embedding;
}
