import { NextResponse } from 'next/server'
import { getSupport } from '@/ai/flows/ai-support-assistant'

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const reply = await getSupport({ query: message });
    
    return NextResponse.json({
      reply: reply.relevantResource,
    });

  } catch (error: any) {
    console.error('[API analyze-dispute] Error:', error);
    return NextResponse.json({ error: error.message || 'An internal error occurred' }, { status: 500 });
  }
}
