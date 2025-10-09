'use server';
import vision from '@google-cloud/vision';
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const client = new vision.ImageAnnotatorClient();

const DocumentExtractorInputSchema = z.object({
    fileUrl: z.string().url(),
});

const DocumentExtractorOutputSchema = z.object({
    name: z.string(),
    address: z.string(),
    date: z.string(),
    rawText: z.string(),
});

export const extractDocumentData = ai.defineFlow(
    {
        name: 'extractDocumentData',
        inputSchema: DocumentExtractorInputSchema,
        outputSchema: DocumentExtractorOutputSchema,
    },
    async (input) => {
        const { fileUrl } = input;
        const [result] = await client.textDetection(fileUrl);
        const text = result.fullTextAnnotation?.text || '';

        const name = /Name:\s*(.+)/i.exec(text)?.[1] || '';
        const address = /Address:\s*(.+)/i.exec(text)?.[1] || '';
        const date = /Date:\s*(.+)/i.exec(text)?.[1] || '';

        return { name, address, date, rawText: text };
    }
);
