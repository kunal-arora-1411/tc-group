import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/db';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { companyName } = await request.json();

    if (!companyName) {
      return NextResponse.json({ error: 'Company name required' }, { status: 400 });
    }

    // Check DB first
    const existingCompany = await prisma.company.findFirst({
      where: { name: { contains: companyName, mode: 'insensitive' } },
      include: { signals: true, contacts: true }
    });

    if (existingCompany) {
      return NextResponse.json({
        company: existingCompany,
        signals: existingCompany.signals,
        contacts: existingCompany.contacts,
        summary: existingCompany.description,
        researchedAt: existingCompany.updatedAt,
        researchDuration: 0
      });
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
      "name": "likely decision maker name (real name if known, otherwise use title like 'Head of Sales')",
      "title": "their job title",
      "department": "sales|marketing|engineering|operations|executive",
      "priority": "primary|secondary|influencer",
      "email": "their work email if known (format: firstname.lastname@domain.com or use common patterns)",
      "linkedin": "their LinkedIn profile URL if known (format: linkedin.com/in/firstname-lastname)"
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

      // Save to DB
      const savedCompany = await prisma.company.create({
        data: {
          name: data.company.name,
          domain: data.company.domain,
          industry: data.company.industry,
          size: data.company.size,
          description: data.company.description,
          painPoints: data.company.painPoints,
          opportunities: data.company.opportunities,
          techStack: data.company.techStack,
          employees: data.company.employees,
          location: data.company.location,
          signals: {
            create: data.signals.map((s: any) => ({
              type: s.type,
              strength: s.strength,
              description: s.description,
              source: s.source,
              detectedAt: new Date()
            }))
          },
          contacts: {
            create: data.contacts.map((c: any) => ({
              name: c.name,
              title: c.title,
              department: c.department,
              priority: c.priority,
              email: c.email || null,
              linkedin: c.linkedin || null
            }))
          }
        },
        include: {
          signals: true,
          contacts: true
        }
      });

      return NextResponse.json({
        company: savedCompany,
        signals: savedCompany.signals,
        contacts: savedCompany.contacts,
        summary: data.summary,
        researchedAt: new Date(),
        researchDuration: 15
      });

      // Generate Embedding & Save to Pinecone (Fire & Forget)
      (async () => {
        try {
          const { pinecone, INDEX_NAME, ensureIndex } = await import('@/lib/vector');

          // Generate embedding
          const embeddingResponse = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: `${data.company.name}: ${data.company.description} Industry: ${data.company.industry}. Tech: ${data.company.techStack.join(', ')}`,
          });

          const embedding = embeddingResponse.data[0].embedding;

          // Ensure index exists
          await ensureIndex();

          // Upsert to Pinecone
          const index = pinecone.index(INDEX_NAME);
          await index.upsert([{
            id: savedCompany.id,
            values: embedding,
            metadata: {
              name: savedCompany.name,
              industry: savedCompany.industry,
              domain: savedCompany.domain
            }
          }]);
          console.log(`Saved vector for ${savedCompany.name}`);
        } catch (err) {
          console.error('Vector DB Error:', err);
        }
      })();

    } catch (error) {
      console.error('Parsing/Saving Error:', error);
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
