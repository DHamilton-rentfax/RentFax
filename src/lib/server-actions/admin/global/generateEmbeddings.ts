"use server";

import { VertexAI } from "@google-cloud/vertexai";
import { adminDB } from "@/firebase/server"; // your firebase-admin wrapper

// Initialize Vertex
const vertex = new VertexAI({
  project: process.env.GCLOUD_PROJECT_ID!,
  location: "us-central1",
});

const model = vertex.getGenerativeModel({
  model: "text-embedding-005",
});

export async function generateEmbeddings(text: string): Promise<number[]> {
  if (!text || text.trim().length === 0) return [];

  try {
    const response = await model.embedContent({
      content: { parts: [{ text }] },
    });

    return response.embedding?.values ?? [];
  } catch (err) {
    console.error("❌ Error generating embeddings:", err);
    return [];
  }
}
