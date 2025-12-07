
"use server";

import OpenAI from "openai";
import { z } from "zod";
import { ai } from "@/ai/genkit";

export async function checkLiveness(selfieUrl: string): Promise<boolean> {
    if (!selfieUrl) {
        throw new Error("Selfie URL is required for liveness check.");
    }

    const LivenessSchema = z.object({
        isLive: z.boolean().describe("True if the image appears to be a live person, false if it is a photo of a screen or another photo."),
    });

    const prompt = ai.definePrompt({
        name: "livenessCheckPrompt",
        input: { schema: z.object({ selfieUrl: z.string() }) },
        output: { schema: LivenessSchema },
        prompt: `
            You are a sophisticated liveness detection AI.
            Analyze the provided image to determine if it is a live person or a photo of a screen, paper, or another photo.
            Look for artifacts like screen glare, moiré patterns, or unnatural edges.

            Image: {{media url=selfieUrl}}
        `,
    });

    const { output } = await prompt({ selfieUrl });
    return output?.isLive ?? false;
}
