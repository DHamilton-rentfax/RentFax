'use server';

import { getSupport as getSupportFlow, type SupportInput, type SupportOutput } from '@/ai/flows/ai-support-assistant';

export async function getSupport(input: SupportInput): Promise<SupportOutput> {
  // Here you could add authentication, logging, or other server-side logic
  console.log(`Processing support query: ${input.query}`);

  try {
    const result = await getSupportFlow(input);
    return result;
  } catch (error) {
    console.error('Error getting support from AI flow:', error);
    // You can customize the error response as needed
    throw new Error('Failed to get a response from the support assistant.');
  }
}
