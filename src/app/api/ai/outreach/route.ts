import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { research, score, targetContact } = await request.json();

        if (!research || !targetContact) {
            return NextResponse.json({ error: 'Research and contact required' }, { status: 400 });
        }

        const signalsList = research.signals?.map((s: { description: string }) => s.description).join('; ') || 'No specific signals';
        const firstName = targetContact.name?.split(' ')[0] || 'there';

        const prompt = `You are an elite SDR who writes highly personalized outreach that gets responses. Write outreach for:

Company: ${research.company.name}
Industry: ${research.company.industry}
Contact: ${targetContact.name}, ${targetContact.title}
Intent Signals: ${signalsList}
Pain Points: ${research.company.painPoints?.slice(0, 2).join(', ') || 'Unknown'}
Score: ${score?.overall || 50}/100 (${score?.recommendation || 'warm'})

Rules:
1. Open with something specific about THEM (not about us)
2. Reference a real signal or pain point they have
3. Be conversational, not salesy
4. Soft CTA (not "book a demo")
5. Sound human - no corporate jargon

Return ONLY valid JSON (no markdown):
{
  "email": {
    "subject": "short, curiosity-driven subject line",
    "body": "3-4 short paragraphs, conversational tone, ends with soft CTA"
  },
  "linkedin": {
    "connectionNote": "under 280 chars, personal and relevant",
    "followUpMessage": "sent after they accept, provides value"
  },
  "sequence": {
    "day1": { "subject": "initial subject", "body": "initial email" },
    "day3": { "subject": "follow up subject", "body": "new angle follow-up" },
    "day7": { "subject": "breakup subject", "body": "value leave-behind, graceful close" }
  },
  "personalizationPoints": ["list of specific things referenced"]
}`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.8,
            max_tokens: 1500,
        });

        const responseText = completion.choices[0]?.message?.content || '';
        const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        try {
            const outreach = JSON.parse(cleanJson);
            return NextResponse.json(outreach);
        } catch {
            // Fallback outreach
            return NextResponse.json({
                email: {
                    subject: `Quick question for ${firstName}`,
                    body: `Hi ${firstName},\n\nI came across ${research.company.name} and noticed some interesting developments.\n\nWe help companies like yours with sales intelligence. Would a quick 15-minute call be worth it?\n\nBest,`
                },
                linkedin: {
                    connectionNote: `Hi ${firstName} — noticed ${research.company.name} is doing interesting things. Would love to connect!`,
                    followUpMessage: 'Thanks for connecting! Happy to share how we help similar companies.'
                },
                sequence: {
                    day1: { subject: `For ${firstName}`, body: `Hi ${firstName},\n\nQuick note about something relevant to ${research.company.name}.\n\nBest,` },
                    day3: { subject: 'Following up', body: `Hi ${firstName},\n\nQuick follow-up.\n\nBest,` },
                    day7: { subject: 'Last note', body: `Hi ${firstName},\n\nFinal follow-up. Door's always open!\n\nCheers,` }
                },
                personalizationPoints: [research.company.name]
            });
        }

    } catch (error) {
        console.error('Outreach API Error:', error);
        return NextResponse.json({ error: 'Outreach generation failed' }, { status: 500 });
    }
}
