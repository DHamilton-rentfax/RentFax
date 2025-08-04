'use server';

/**
 * @fileOverview An AI support assistant that directs users to relevant help documentation or FAQs.
 *
 * - getSupport - A function that handles the support request and directs the user to relevant resources.
 * - SupportInput - The input type for the getSupport function.
 * - SupportOutput - The return type for the getSupport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SupportInputSchema = z.object({
  query: z.string().describe('The user query or support request.'),
});
export type SupportInput = z.infer<typeof SupportInputSchema>;

const SupportOutputSchema = z.object({
  relevantResource: z.string().describe('The relevant help documentation or FAQ that addresses the user query.'),
});
export type SupportOutput = z.infer<typeof SupportOutputSchema>;

export async function getSupport(input: SupportInput): Promise<SupportOutput> {
  return getSupportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'supportPrompt',
  input: {schema: SupportInputSchema},
  output: {schema: SupportOutputSchema},
  prompt: `You are an AI support assistant. A user will provide a query or support request, and you will direct them to the most relevant help documentation or FAQ.

  Query: {{{query}}}

  Relevant Resource: `,
});

const getSupportFlow = ai.defineFlow(
  {
    name: 'getSupportFlow',
    inputSchema: SupportInputSchema,
    outputSchema: SupportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
