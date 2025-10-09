'use server';
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import OpenAI from 'openai';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const SummarizerInputSchema = z.object({
  dispute: z.any(),
});
export type SummarizerInput = z.infer<typeof SummarizerInputSchema>;

const SummarizerOutputSchema = z.object({
  text: z.string(),
  file: z.string(),
});
export type SummarizerOutput = z.infer<typeof SummarizerOutputSchema>;


export const aiReportSummarizer = ai.defineFlow(
  {
    name: 'aiReportSummarizer',
    inputSchema: SummarizerInputSchema,
    outputSchema: SummarizerOutputSchema,
  },
  async (input) => {
  const { dispute } = input;
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Summarize renter disputes concisely for legal/admin review.' },
      { role: 'user', content: JSON.stringify(dispute) },
    ],
  });

  const text = summary.choices[0].message.content || 'No summary generated.';
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const { width, height } = page.getSize();
  page.drawText('RentFAX AI Dispute Summary', { x: 50, y: height - 50, size: 16, font, color: rgb(0, 0, 0.7) });
  page.drawText(text.slice(0, 3000), { x: 50, y: height - 100, size: 12, font, color: rgb(0, 0, 0) });
  const pdfBytes = await pdfDoc.save();

  const file = `/tmp/summary-${Date.now()}.pdf`;
  fs.writeFileSync(file, pdfBytes);
  return { text, file };
});
