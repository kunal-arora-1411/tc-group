import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        const { companyName } = await request.json();

        if (!companyName) {
            return NextResponse.json({ error: 'Company name required' }, { status: 400 });
        }

        const prompt = `You are an elite B2B sales research analyst. Research the company "${companyName}" and provide comprehensive intelligence for sales outreach.

Return a JSON object with this EXACT structure (no markdown, just valid JSON):
{
  "company": {
    "name": "${companyName}",
    "domain": "company website domain",
    "industry": "their industry",
    "size": "startup|smb|midmarket|enterprise",
    "description": "2-3 sentence company description",
    "painPoints": ["3-5 likely pain points based on their industry and size"],
    "opportunities": ["3-5 opportunities where sales/marketing tools could help"],
    "techStack": ["likely technologies they use"],
    "employees": "estimated employee count",
    "location": "headquarters location"
  },
  "signals": [
    {
      "type": "hiring|funding|techChange|leadership|expansion|competitorChurn",
      "strength": "high|medium|low",
      "description": "what signal was detected",
      "source": "where this info came from"
    }
  ],
  "contacts": [
    {
      "name": "likely decision maker name or title placeholder",
      "title": "their job title",
      "department": "sales|marketing|engineering|operations|executive",
      "priority": "primary|secondary|influencer"
    }
  ],
  "summary": "Executive summary of why this account matters for sales outreach"
}

If you don't have specific information, make educated inferences based on company type and industry. Focus on actionable intelligence.`;

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 1500,
        });

        const responseText = completion.choices[0]?.message?.content || '';
        const cleanJson = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        try {
            const data = JSON.parse(cleanJson);
            return NextResponse.json(data);
        } catch {
            // Return basic structure if parsing fails
            return NextResponse.json({
                company: {
                    name: companyName,
                    domain: `${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
                    industry: 'Technology',
                    size: 'midmarket',
                    description: `${companyName} is a technology company.`,
                    painPoints: ['Scaling operations', 'Improving efficiency'],
                    opportunities: ['Automation', 'Process optimization'],
                    techStack: ['Modern stack']
                },
                signals: [{
                    type: 'websiteVisit',
                    strength: 'medium',
                    description: 'Company researched',
                    source: 'AI Analysis'
                }],
                contacts: [{
                    name: 'Decision Maker',
                    title: 'VP of Operations',
                    department: 'operations',
                    priority: 'primary'
                }],
                summary: `${companyName} identified as potential prospect.`
            });
        }

    } catch (error) {
        console.error('Research API Error:', error);
        return NextResponse.json({ error: 'Research failed' }, { status: 500 });
    }
}
