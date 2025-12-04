import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/db';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { research, score, targetContact, companyId } = await request.json();

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

            // Save outreach to database if companyId is provided
            if (companyId) {
                try {
                    // Check if company exists in database
                    const company = await prisma.company.findUnique({
                        where: { id: companyId }
                    });

                    if (company) {
                        // Save outreach to database
                        await prisma.outreach.upsert({
                            where: { companyId: companyId },
                            update: {
                                emailSubject: outreach.email?.subject || '',
                                emailBody: outreach.email?.body || '',
                                linkedinNote: outreach.linkedin?.connectionNote || '',
                                linkedinFollowUp: outreach.linkedin?.followUpMessage || '',
                                seqDay1Subject: outreach.sequence?.day1?.subject || '',
                                seqDay1Body: outreach.sequence?.day1?.body || '',
                                seqDay3Subject: outreach.sequence?.day3?.subject || '',
                                seqDay3Body: outreach.sequence?.day3?.body || '',
                                seqDay7Subject: outreach.sequence?.day7?.subject || '',
                                seqDay7Body: outreach.sequence?.day7?.body || '',
                                personalizationPoints: outreach.personalizationPoints || []
                            },
                            create: {
                                companyId: companyId,
                                emailSubject: outreach.email?.subject || '',
                                emailBody: outreach.email?.body || '',
                                linkedinNote: outreach.linkedin?.connectionNote || '',
                                linkedinFollowUp: outreach.linkedin?.followUpMessage || '',
                                seqDay1Subject: outreach.sequence?.day1?.subject || '',
                                seqDay1Body: outreach.sequence?.day1?.body || '',
                                seqDay3Subject: outreach.sequence?.day3?.subject || '',
                                seqDay3Body: outreach.sequence?.day3?.body || '',
                                seqDay7Subject: outreach.sequence?.day7?.subject || '',
                                seqDay7Body: outreach.sequence?.day7?.body || '',
                                personalizationPoints: outreach.personalizationPoints || []
                            }
                        });
                        console.log(`Saved outreach for company ${companyId}`);
                    }
                } catch (dbError) {
                    console.error('Database save error:', dbError);
                    // Continue even if DB save fails
                }
            }

            return NextResponse.json(outreach);
        } catch (parseError) {
            console.error('JSON parse error:', parseError);
            // Fallback outreach
            const fallbackOutreach = {
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
            };

            // Try to save fallback to database
            if (companyId) {
                try {
                    await prisma.outreach.upsert({
                        where: { companyId: companyId },
                        update: {
                            emailSubject: fallbackOutreach.email.subject,
                            emailBody: fallbackOutreach.email.body,
                            linkedinNote: fallbackOutreach.linkedin.connectionNote,
                            linkedinFollowUp: fallbackOutreach.linkedin.followUpMessage,
                            seqDay1Subject: fallbackOutreach.sequence.day1.subject,
                            seqDay1Body: fallbackOutreach.sequence.day1.body,
                            seqDay3Subject: fallbackOutreach.sequence.day3.subject,
                            seqDay3Body: fallbackOutreach.sequence.day3.body,
                            seqDay7Subject: fallbackOutreach.sequence.day7.subject,
                            seqDay7Body: fallbackOutreach.sequence.day7.body,
                            personalizationPoints: fallbackOutreach.personalizationPoints
                        },
                        create: {
                            companyId: companyId,
                            emailSubject: fallbackOutreach.email.subject,
                            emailBody: fallbackOutreach.email.body,
                            linkedinNote: fallbackOutreach.linkedin.connectionNote,
                            linkedinFollowUp: fallbackOutreach.linkedin.followUpMessage,
                            seqDay1Subject: fallbackOutreach.sequence.day1.subject,
                            seqDay1Body: fallbackOutreach.sequence.day1.body,
                            seqDay3Subject: fallbackOutreach.sequence.day3.subject,
                            seqDay3Body: fallbackOutreach.sequence.day3.body,
                            seqDay7Subject: fallbackOutreach.sequence.day7.subject,
                            seqDay7Body: fallbackOutreach.sequence.day7.body,
                            personalizationPoints: fallbackOutreach.personalizationPoints
                        }
                    });
                } catch (dbError) {
                    console.error('Fallback database save error:', dbError);
                }
            }

            return NextResponse.json(fallbackOutreach);
        }

    } catch (error) {
        console.error('Outreach API Error:', error);
        return NextResponse.json({ error: 'Outreach generation failed' }, { status: 500 });
    }
}
