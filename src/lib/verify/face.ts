
"use server";

import OpenAI from "openai";
import { z } from "zod";
import { ai } from "@/ai/genkit";

export async function matchFace(selfieUrl: string, idPhotoUrl: string): Promise<number> {
    if (!selfieUrl || !idPhotoUrl) {
        throw new Error("Both selfie and ID photo URLs are required for face matching.");
    }

    const FaceMatchSchema = z.object({
        score: z.number().min(0).max(1).describe("The similarity score from 0.0 to 1.0"),
    });

    const prompt = ai.definePrompt({
        name: "faceMatchPrompt",
        input: { schema: z.object({ selfieUrl: z.string(), idPhotoUrl: z.string() }) },
        output: { schema: FaceMatchSchema },
        prompt: `
            Compare the face in the selfie to the face in the ID photo.
            Return a similarity score from 0.0 to 1.0.

            Selfie: {{media url=selfieUrl}}
            ID Photo: {{media url=idPhotoUrl}}
        `,
    });

    const { output } = await prompt({ selfieUrl, idPhotoUrl });
    return output?.score ?? 0;
}
