"use server";

/**
 * @fileOverview An AI support assistant that directs users to relevant help documentation or FAQs.
 *
 * - getSupport - A function that handles the support request and directs the user to relevant resources.
 * - SupportInput - The input type for the getSupport function.
 * - SupportOutput - The return type for the getSupport function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const SupportInputSchema = z.object({
  query: z.string().describe("The user query or support request."),
});
export type SupportInput = z.infer<typeof SupportInputSchema>;

const SupportOutputSchema = z.object({
  relevantResource: z
    .string()
    .describe(
      "The relevant help documentation or FAQ that addresses the user query.",
    ),
});
export type SupportOutput = z.infer<typeof SupportOutputSchema>;

export async function getSupport(input: SupportInput): Promise<SupportOutput> {
  return getSupportFlow(input);
}

const prompt = ai.definePrompt({
  name: "supportPrompt",
  input: { schema: SupportInputSchema },
  output: { schema: SupportOutputSchema },
  prompt: `You are an AI support assistant for RentFAX, a global renter risk and history network. A user will provide a query or support request, and you will direct them to the most relevant help documentation or FAQ. Be concise and helpful.

  Here are some example questions and answers:

  Q: How do I dispute an incident on my report?
  A: You can dispute any incident directly from your renter portal. Navigate to your history, select the incident, and click "Start Dispute." You will be prompted to provide evidence to support your claim.

  Q: What is a Risk Score?
  A: Your Risk Score is a number from 0-100 that helps rental companies assess risk. It's calculated based on your rental history, including factors like payment timeliness, property damage, and rule violations.

  Q: How can I improve my Risk Score?
  A: The best way to improve your score is to maintain a positive rental history, including timely payments and adhering to all rental agreements. Over time, the impact of past negative incidents will lessen.

  Q: Is my data secure?
  A: Yes, we take data security very seriously. All your personal information is encrypted, and we only share your rental history with your explicit consent when you apply for a new rental.

  Now, answer the following user query.

  Query: {{{query}}}

  Suggested Resource: `,
});

const getSupportFlow = ai.defineFlow(
  {
    name: "getSupportFlow",
    inputSchema: SupportInputSchema,
    outputSchema: SupportOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  },
);
