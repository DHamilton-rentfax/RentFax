import { NextResponse } from 'next/server';
import { aiReportSummarizer } from '@/ai/flows/ai-report-summarizer';

export async function POST(req: Request) {
    try {
        const { dispute } = await req.json();
        if (!dispute) {
            return NextResponse.json({ error: 'Dispute data is required.' }, { status: 400 });
        }
        const result = await aiReportSummarizer({ dispute });
        return NextResponse.json(result);
    } catch (e: any) {
        console.error('[API Summarize Error]', e);
        return NextResponse.json({ error: e.message || 'Failed to generate summary.' }, { status: 500 });
    }
}
