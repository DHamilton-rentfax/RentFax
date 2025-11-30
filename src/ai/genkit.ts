import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/googleai";

export const ai = genkit({
  plugins: [
    googleAI({
      // Specify a model that's likely to be available in all regions.
      // See a list of models available in each region:
      // https://ai.google.dev/gemini-api/docs/models/gemini
      apiVersion: "v1beta",
    }),
  ],
  // Specify a model that's likely to be available in all regions.
  // See a list of models available in each region:
  // https://ai.google.dev/gemini-api/docs/models/gemini
  model: "googleai/gemini-1.5-flash-latest",
  // Use a lower temperature to make the model more predictable.
  temperature: 0.2,
});
