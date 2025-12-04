// Mock company data for reliable demos

import { ResearchResult, ScoreResult, OutreachContent } from '../types';

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

export const mockCompanies: Record<string, {
    research: ResearchResult;
    score: ScoreResult;
    outreach: OutreachContent;
}> = {
    stripe: {
        research: {
            company: {
                name: 'Stripe',
                domain: 'stripe.com',
                industry: 'Financial Technology',
                size: 'enterprise',
                description: 'Stripe is a financial infrastructure platform for businesses. Millions of companies use Stripe to accept payments, grow their revenue, and accelerate new business opportunities.',
                painPoints: [
                    'Scaling sales operations globally while maintaining quality',
                    'Managing complex enterprise sales cycles with multiple stakeholders',
                    'Integrating with diverse customer tech stacks and legacy systems',
                    'Competing with emerging fintech players in specific verticals',
                    'Reducing churn in SMB segment'
                ],
                opportunities: [
                    'Recently expanded enterprise sales team - need better prospecting tools',
                    'New product launches requiring coordinated outreach',
                    'International expansion creating need for localized sales intelligence',
                    'Focus on developer experience - would appreciate technical sales approach'
                ],
                techStack: ['React', 'Ruby', 'Go', 'AWS', 'Kubernetes', 'PostgreSQL', 'Redis', 'Kafka'],
                founded: '2010',
                employees: '8,000+',
                revenue: '$14B+ ARR',
                location: 'San Francisco, CA'
            },
            signals: [
                {
                    id: generateId(),
                    type: 'hiring',
                    strength: 'high',
                    description: 'Posted 47 new sales and GTM roles in the last 30 days',
                    source: 'LinkedIn Jobs',
                    detectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: generateId(),
                    type: 'expansion',
                    strength: 'high',
                    description: 'Announced expansion into 15 new countries in APAC region',
                    source: 'Press Release',
                    detectedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: generateId(),
                    type: 'techChange',
                    strength: 'medium',
                    description: 'Migrating CRM from legacy system to Salesforce',
                    source: 'Job Posting Analysis',
                    detectedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: generateId(),
                    type: 'g2Activity',
                    strength: 'medium',
                    description: 'Researching sales engagement platforms on G2',
                    source: 'G2 Buyer Intent',
                    detectedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
                }
            ],
            contacts: [
                {
                    id: generateId(),
                    name: 'Sarah Chen',
                    title: 'VP of Sales Operations',
                    department: 'sales',
                    linkedin: 'linkedin.com/in/sarahchen',
                    email: 's.chen@stripe.com',
                    priority: 'primary'
                },
                {
                    id: generateId(),
                    name: 'Michael Torres',
                    title: 'Director of Revenue Operations',
                    department: 'operations',
                    linkedin: 'linkedin.com/in/michaeltorres',
                    email: 'm.torres@stripe.com',
                    priority: 'primary'
                },
                {
                    id: generateId(),
                    name: 'Emily Watson',
                    title: 'Head of Sales Enablement',
                    department: 'sales',
                    linkedin: 'linkedin.com/in/emilywatson',
                    email: 'e.watson@stripe.com',
                    priority: 'secondary'
                }
            ],
            summary: 'Stripe is a high-priority enterprise target showing strong buying signals. Their aggressive hiring in GTM roles combined with international expansion suggests they are scaling their sales infrastructure. The CRM migration indicates openness to new tools, and G2 research activity shows active evaluation of solutions.',
            researchedAt: new Date().toISOString(),
            researchDuration: 18
        },
        score: {
            overall: 87,
            breakdown: {
                icpFit: 24,
                timingSignals: 23,
                budgetIndicators: 22,
                engagementLikelihood: 18
            },
            reasoning: 'Stripe is an ideal ICP fit as a high-growth fintech with enterprise resources. Multiple timing signals indicate active buying intent - the GTM hiring surge and G2 research are particularly strong indicators. Budget is clearly available given their scale and recent funding. Engagement likelihood is high due to the expansion-driven urgency.',
            recommendation: 'hot',
            confidenceLevel: 'high'
        },
        outreach: {
            email: {
                subject: 'Re: Stripe\'s APAC expansion + sales scaling',
                body: `Hi Sarah,

Noticed Stripe just announced expansion into 15 new APAC markets — congrats! That's a massive undertaking.

I imagine scaling your sales team globally while maintaining the quality bar Stripe is known for isn't trivial. Especially when you're also migrating CRM systems (spotted those Salesforce admin roles).

We've helped companies like Notion and Figma solve this exact challenge — turning 8-hour prospect research into 20-second AI-powered briefings. Their SDRs are now spending time actually selling instead of tab-switching between LinkedIn, Crunchbase, and G2.

Would it be worth a 15-min call to see if there's a fit? No pitch deck, just a quick demo of how our research agents work.

Best,`
            },
            linkedin: {
                connectionNote: "Hi Sarah — saw Stripe's massive APAC expansion news. Would love to connect and share how other hypergrowth sales teams are scaling research without scaling headcount.",
                followUpMessage: `Thanks for connecting, Sarah!

I know you're probably drowning in vendor outreach, so I'll keep this short:

We built an AI that does what your SDRs spend 3+ hours on daily — researching accounts, finding intent signals, and crafting personalized outreach.

Given the 47 new GTM roles Stripe just posted, figured timing might be relevant.

Happy to show you a 5-min demo, or just share how Figma's RevOps team is using us. Whatever's helpful.`
            },
            sequence: {
                day1: {
                    subject: 'Re: Stripe\'s APAC expansion + sales scaling',
                    body: `Hi Sarah,

Noticed Stripe just announced expansion into 15 new APAC markets — congrats! That's a massive undertaking.

I imagine scaling your sales team globally while maintaining the quality bar Stripe is known for isn't trivial. Especially when you're also migrating CRM systems.

We've helped companies like Notion and Figma solve this exact challenge. Would a 15-min call be worth it to see if there's a fit?

Best,`
                },
                day3: {
                    subject: 'Quick question about SDR efficiency',
                    body: `Hi Sarah,

Quick follow-up — I came across something interesting.

We analyzed 50+ sales orgs going through similar scaling challenges, and the #1 bottleneck wasn't headcount — it was research time. SDRs spend 40% of their day just figuring out WHO to reach out to and WHY.

Curious if that resonates with what you're seeing at Stripe?

If you're open to it, I'd love to share the playbook Figma used to cut that number to under 10%.

Best,`
                },
                day7: {
                    subject: 'Last note + a resource',
                    body: `Hi Sarah,

I'll keep this short since I know you're busy.

Wanted to share this case study on how Notion's RevOps team automated their account research: [link]

Even if we're not a fit, figured it might spark some ideas for your team as you scale.

If the timing ever makes sense, I'm here. Either way, wishing you all the best with the APAC launch!

Cheers,`
                }
            },
            personalizationPoints: [
                'APAC expansion into 15 new countries',
                '47 new GTM roles posted recently',
                'CRM migration to Salesforce in progress',
                'G2 research activity on sales engagement platforms'
            ],
            generatedAt: new Date().toISOString()
        }
    },

    notion: {
        research: {
            company: {
                name: 'Notion',
                domain: 'notion.so',
                industry: 'Productivity Software',
                size: 'midmarket',
                description: 'Notion is an all-in-one workspace combining notes, docs, wikis, and project management. Used by teams to collaborate and organize work.',
                painPoints: [
                    'Transitioning from product-led to sales-led growth for enterprise',
                    'Building out enterprise sales motion from scratch',
                    'Competing with established players like Confluence and Asana',
                    'Managing rapid team growth while maintaining culture'
                ],
                opportunities: [
                    'New enterprise sales team needs modern tooling',
                    'Product-led growth data could enhance sales intelligence',
                    'Strong brand allows for warmer outreach'
                ],
                techStack: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Kotlin'],
                founded: '2016',
                employees: '500+',
                revenue: '$250M+ ARR',
                location: 'San Francisco, CA'
            },
            signals: [
                {
                    id: generateId(),
                    type: 'hiring',
                    strength: 'medium',
                    description: 'Hiring first dedicated Sales Operations Manager',
                    source: 'LinkedIn Jobs',
                    detectedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: generateId(),
                    type: 'leadership',
                    strength: 'high',
                    description: 'New CRO joined from Figma last month',
                    source: 'LinkedIn Updates',
                    detectedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: generateId(),
                    type: 'funding',
                    strength: 'medium',
                    description: 'Series C extension of $50M announced',
                    source: 'TechCrunch',
                    detectedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
                }
            ],
            contacts: [
                {
                    id: generateId(),
                    name: 'James Liu',
                    title: 'Chief Revenue Officer',
                    department: 'executive',
                    linkedin: 'linkedin.com/in/jamesliu',
                    email: 'james@notion.so',
                    priority: 'primary'
                },
                {
                    id: generateId(),
                    name: 'Amanda Price',
                    title: 'Sales Operations Manager',
                    department: 'operations',
                    linkedin: 'linkedin.com/in/amandaprice',
                    email: 'amanda@notion.so',
                    priority: 'secondary'
                }
            ],
            summary: 'Notion is building out their enterprise sales motion with a new CRO from Figma. Fresh leadership and first Sales Ops hire indicate they are investing in sales infrastructure — strong timing for outreach.',
            researchedAt: new Date().toISOString(),
            researchDuration: 15
        },
        score: {
            overall: 72,
            breakdown: {
                icpFit: 20,
                timingSignals: 19,
                budgetIndicators: 18,
                engagementLikelihood: 15
            },
            reasoning: 'Notion fits our ICP as a high-growth SaaS company investing in sales infrastructure. The new CRO hire is a strong timing signal — new leaders typically bring in new tools. Budget exists from recent funding, though they are still in midmarket stage.',
            recommendation: 'warm',
            confidenceLevel: 'medium'
        },
        outreach: {
            email: {
                subject: 'Congrats on the new CRO + building sales ops',
                body: `Hi James,

Congrats on the move to Notion! Building out an enterprise sales motion at a PLG company is one of the more interesting challenges in SaaS right now.

I've been following Notion's growth, and with Amanda joining as your first Sales Ops hire, it looks like you're laying the foundation for something big.

We work with PLG-to-Enterprise companies to help their sales teams identify which product users are ready for sales conversations — without the manual data crunching.

Worth a quick chat to see if it's relevant? No pressure either way.

Best,`
            },
            linkedin: {
                connectionNote: "Congrats on the Notion move, James! Would love to connect — we've helped other PLG-to-Enterprise teams (like Figma) build their sales intelligence stack.",
                followUpMessage: `Thanks for connecting!

Building enterprise sales at a PLG company is such an interesting challenge — knowing which product users are ready to buy and when.

We've helped a few companies in similar situations. Would love to share what's worked if you're ever curious.

No rush at all — just wanted to plant the seed.`
            },
            sequence: {
                day1: {
                    subject: 'Congrats on the new CRO + building sales ops',
                    body: `Hi James,

Congrats on the move to Notion! Building out an enterprise sales motion at a PLG company is one of the more interesting challenges in SaaS.

We work with PLG-to-Enterprise companies to help identify which product users are ready for sales conversations.

Worth a quick chat? No pressure either way.

Best,`
                },
                day3: {
                    subject: 'PLG → Enterprise sales playbook',
                    body: `Hi James,

Following up with something that might be useful.

We put together a playbook on how PLG companies like Figma and Loom built their outbound engines on top of product signals.

Happy to share if interesting — might spark some ideas for Notion.

Best,`
                },
                day7: {
                    subject: 'One last thing',
                    body: `Hi James,

Last note — I know you're busy building.

If sales intelligence ever becomes a priority as you scale the enterprise motion, we'd love to help. Until then, wishing you the best with Notion's next chapter!

Cheers,`
                }
            },
            personalizationPoints: [
                'New CRO joined from Figma',
                'First Sales Operations hire',
                'Series C extension for growth',
                'PLG to Enterprise transition'
            ],
            generatedAt: new Date().toISOString()
        }
    },

    smallcompany: {
        research: {
            company: {
                name: 'LocalBiz Software',
                domain: 'localbizsoftware.com',
                industry: 'Small Business Software',
                size: 'startup',
                description: 'LocalBiz Software provides simple invoicing and scheduling tools for local service businesses like plumbers, electricians, and landscapers.',
                painPoints: [
                    'Limited engineering resources',
                    'Competing with free tools',
                    'Long sales cycles with SMB customers',
                    'High churn in target market'
                ],
                opportunities: [
                    'Could benefit from better customer targeting',
                    'May need help with outbound sales'
                ],
                techStack: ['WordPress', 'PHP', 'MySQL'],
                founded: '2021',
                employees: '12',
                revenue: 'Seed stage',
                location: 'Austin, TX'
            },
            signals: [
                {
                    id: generateId(),
                    type: 'funding',
                    strength: 'low',
                    description: 'Raised $500K pre-seed round',
                    source: 'Crunchbase',
                    detectedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
                }
            ],
            contacts: [
                {
                    id: generateId(),
                    name: 'Tom Builder',
                    title: 'CEO & Founder',
                    department: 'executive',
                    linkedin: 'linkedin.com/in/tombuilder',
                    email: 'tom@localbizsoftware.com',
                    priority: 'primary'
                }
            ],
            summary: 'LocalBiz Software is an early-stage startup with limited resources and no clear buying signals. They may not be ready for enterprise sales tools given their current scale and focus.',
            researchedAt: new Date().toISOString(),
            researchDuration: 12
        },
        score: {
            overall: 28,
            breakdown: {
                icpFit: 8,
                timingSignals: 5,
                budgetIndicators: 7,
                engagementLikelihood: 8
            },
            reasoning: 'LocalBiz Software does not fit our ICP — they are too early stage with limited budget and no sales team. No active buying signals detected. Would recommend nurturing with content until they reach growth stage.',
            recommendation: 'disqualify',
            confidenceLevel: 'high'
        },
        outreach: {
            email: {
                subject: 'Resources for scaling sales at early-stage startups',
                body: `Hi Tom,

Congrats on the pre-seed raise and building LocalBiz Software!

I know enterprise sales tools probably aren't on your radar yet — and that's totally fine. Most early-stage founders are focused on product and finding PMF.

But if you're ever curious about how other founders think about building sales processes, we put together a free guide that might be helpful: [link]

No sales pitch — just wanted to share something potentially useful.

Best of luck with the build!`
            },
            linkedin: {
                connectionNote: "Hey Tom! Fellow startup person here. Love what you're building with LocalBiz Software. Would be great to connect.",
                followUpMessage: `Thanks for connecting, Tom!

Not trying to sell you anything — just wanted to share a resource on outbound sales that other early-stage founders have found helpful.

Best of luck with the build!`
            },
            sequence: {
                day1: {
                    subject: 'Resources for scaling sales at early-stage startups',
                    body: `Hi Tom,

Congrats on the pre-seed raise! I know you're probably heads down building.

Sharing a free resource on sales processes for early-stage companies: [link]

No pitch — just something that might help down the road.

Best,`
                },
                day3: {
                    subject: 'Following up',
                    body: `Hi Tom,

Just wanted to make sure the resource landed. Let me know if you have any questions!

Best,`
                },
                day7: {
                    subject: 'Checking in',
                    body: `Hi Tom,

Last follow-up — hope the build is going well!

If you ever want to chat about sales processes as you grow, door's always open.

Cheers,`
                }
            },
            personalizationPoints: [
                '$500K pre-seed funding',
                'Early-stage startup',
                'Focus on SMB market'
            ],
            generatedAt: new Date().toISOString()
        }
    }
};

// Helper to get mock data by company name
export function getMockCompanyData(companyName: string): {
    research: ResearchResult;
    score: ScoreResult;
    outreach: OutreachContent;
} | null {
    const normalizedName = companyName.toLowerCase().trim();

    // Direct match
    if (mockCompanies[normalizedName]) {
        return mockCompanies[normalizedName];
    }

    // Partial match
    for (const key of Object.keys(mockCompanies)) {
        if (normalizedName.includes(key) || key.includes(normalizedName)) {
            return mockCompanies[key];
        }
    }

    return null;
}

// List of demo companies for quick selection
export const demoCompanies = [
    { name: 'Stripe', description: 'Hot lead - 87/100 score', tag: 'hot' },
    { name: 'Notion', description: 'Warm lead - 72/100 score', tag: 'warm' },
    { name: 'LocalBiz Software', description: 'Cold lead - 28/100 score', tag: 'cold' },
];
