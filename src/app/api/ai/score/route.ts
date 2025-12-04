import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { research } = await request.json();

        if (!research) {
            return NextResponse.json({ error: 'Research data required' }, { status: 400 });
        }

        const prompt = `You are an expert B2B lead scoring analyst. Based on this research, score the account's buying intent.

Company: ${research.company.name}
Industry: ${research.company.industry}
Size: ${research.company.size}
Description: ${research.company.description}
Signals Detected: ${research.signals?.map((s: { type: string; description: string }) => `${s.type}: ${s.description}`).join(', ') || 'None'}
Pain Points: ${research.company.painPoints?.join(', ') || 'Unknown'}

Score on these dimensions (each 0-25 points):
1. ICP Fit: How well does this match a B2B SaaS buyer?
2. Timing Signals: Are there signals they're buying NOW?
3. Budget Indicators: Do they have budget?
4. Engagement Likelihood: Will they respond to outreach?

Return ONLY valid JSON (no markdown):
{
  "overall": <sum of scores, 0-100>,
  "breakdown": {
    "icpFit": <0-25>,
    "timingSignals": <0-25>,
    "budgetIndicators": <0-25>,
    "engagementLikelihood": <0-25>
  },
  "reasoning": "2-3 sentences explaining the score",
  "recommendation": "hot|warm|nurture|disqualify",
  "confidenceLevel": "high|medium|low"
}`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.5,
            max_tokens: 500,
        });

        const responseText = completion.choices[0]?.message?.content || '';
        const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        try {
            const score = JSON.parse(cleanJson);
            return NextResponse.json(score);
        } catch {
            // Calculate fallback score
            const signalCount = research.signals?.length || 0;
            const overall = 40 + (signalCount * 10);

            return NextResponse.json({
                overall: Math.min(100, overall),
                breakdown: {
                    icpFit: 15,
                    timingSignals: signalCount * 5,
                    budgetIndicators: 12,
                    engagementLikelihood: 13
                },
                reasoning: `${research.company.name} shows ${signalCount} buying signals.`,
                recommendation: overall > 70 ? 'hot' : overall > 50 ? 'warm' : 'nurture',
                confidenceLevel: 'medium'
            });
        }

    } catch (error) {
        console.error('Scoring API Error:', error);
        return NextResponse.json({ error: 'Scoring failed' }, { status: 500 });
    }
}
