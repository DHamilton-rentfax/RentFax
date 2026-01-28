import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { adminDb } from '@/firebase/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  const adminDb = getAdminDb();
  if (!adminDb) {
    throw new Error("Admin DB not initialized");
  }

  try {
    // 1️⃣ Fetch billing insights using Firebase Admin SDK (CORRECT)
    const snapshot = await adminDb
      .collection('billing_insights')
      .orderBy('updatedAt', 'desc')
      .limit(10)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({
        summary: 'No insights available yet.',
      });
    }

    const insights = snapshot.docs
      .map((doc) => doc.data()?.insight)
      .filter(Boolean)
      .join('\n');

    // 2️⃣ AI summary if key exists
    if (process.env.OPENAI_API_KEY) {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: `Summarize these RentFAX billing insights into 3 concise sentences:\n${insights}`,
          },
        ],
      });

      return NextResponse.json({
        summary: completion.choices[0].message.content,
      });
    }

    // 3️⃣ Fallback summary (no OpenAI key)
    const upgrades = (insights.match(/upgrade/gi) || []).length;
    const downgrades = (insights.match(/downgrade/gi) || []).length;
    const overspend = (insights.match(/overpay|overspend/gi) || []).length;

    return NextResponse.json({
      summary: `${upgrades} upgrades and ${downgrades} downgrades detected. ${overspend} accounts show overpayment trends.`,
    });
  } catch (error) {
    console.error('AI Summary API Error:', error);
    return NextResponse.json({
      summary: 'Unable to generate AI summary.',
      error: true,
    });
  }
}
