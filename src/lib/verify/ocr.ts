
"use server";

import OpenAI from "openai";
import { z } from "zod";
import { ai } from "@/ai/genkit";

// Re-using the initialized Genkit AI client is more efficient
// than creating a new OpenAI client.

export async function extractTextFromId(imageUrl: string): Promise<any> {
    if (!imageUrl) {
        throw new Error("Image URL for OCR is required.");
    }
  
    const OcrSchema = z.object({
        name: z.string().optional(),
        dob: z.string().optional(),
        address: z.string().optional(),
        idNumber: z.string().optional(),
        expiryDate: z.string().optional(),
        issuedDate: z.string().optional(),
    });

    const prompt = ai.definePrompt({
        name: "idOcrPrompt",
        input: { schema: z.object({ imageUrl: z.string() }) },
        output: { schema: OcrSchema },
        prompt: `
            You are an expert OCR system for identity documents.
            Extract the following fields from the image provided: name, dob, address, idNumber, expiryDate, issuedDate.
            Return the data as a JSON object.
            
            Image: {{media url=imageUrl}}
        `,
    });

    const { output } = await prompt({ imageUrl });
    return output || {};
}
