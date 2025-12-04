// AI Agent Orchestrator - Client-side with API calls for AI

import {
    ResearchResult,
    ScoreResult,
    OutreachContent,
    Contact,
    AgentStatus,
    PipelineState,
    IntentSignal
} from '../types';
import { getMockCompanyData } from '../mock-data/companies';

// Simulate delay for realistic demo experience
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 9);

// ============================================
// RESEARCH AGENT - Calls server API for AI
// ============================================
export async function runResearchAgent(
    companyName: string,
    onProgress?: (status: AgentStatus) => void
): Promise<ResearchResult> {
    onProgress?.({
        name: 'research',
        status: 'running',
        progress: 0,
        message: 'Initializing research agent...'
    });

    await delay(300);

    // Check if we have mock data first (for demo reliability)
    const mockData = getMockCompanyData(companyName);
    if (mockData) {
        onProgress?.({
            name: 'research',
            status: 'running',
            progress: 30,
            message: 'Found in database, loading...'
        });
        await delay(400);
        onProgress?.({
            name: 'research',
            status: 'running',
            progress: 60,
            message: 'Analyzing company data...'
        });
        await delay(400);
        onProgress?.({
            name: 'research',
            status: 'running',
            progress: 90,
            message: 'Detecting intent signals...'
        });
        await delay(200);
        onProgress?.({
            name: 'research',
            status: 'completed',
            progress: 100,
            message: 'Research complete!'
        });
        return mockData.research;
    }

    // Use AI API for unknown companies
    try {
        onProgress?.({
            name: 'research',
            status: 'running',
            progress: 20,
            message: 'Connecting to AI model...'
        });

        const response = await fetch('/api/ai/research', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ companyName })
        });

        onProgress?.({
            name: 'research',
            status: 'running',
            progress: 50,
            message: 'AI analyzing company...'
        });

        if (!response.ok) {
            throw new Error('AI research failed');
        }

        const data = await response.json();

        onProgress?.({
            name: 'research',
            status: 'running',
            progress: 80,
            message: 'Processing research data...'
        });

        await delay(300);

        // Build the research result with proper IDs
        const research: ResearchResult = {
            company: {
                id: data.company?.id,
                name: data.company?.name || companyName,
                domain: data.company?.domain || `${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
                industry: data.company?.industry || 'Technology',
                size: data.company?.size || 'midmarket',
                description: data.company?.description || `${companyName} is a technology company.`,
                painPoints: data.company?.painPoints || ['Scaling operations', 'Improving efficiency'],
                opportunities: data.company?.opportunities || ['Sales automation', 'Process optimization'],
                techStack: data.company?.techStack || ['Modern stack'],
                employees: data.company?.employees,
                location: data.company?.location
            },
            signals: (data.signals || []).map((s: Partial<IntentSignal>) => ({
                id: s.id || generateId(),
                type: s.type || 'websiteVisit',
                strength: s.strength || 'medium',
                description: s.description || 'Signal detected',
                source: s.source || 'AI Analysis',
                detectedAt: s.detectedAt || new Date().toISOString()
            })),
            contacts: (data.contacts || []).map((c: Partial<Contact>) => ({
                id: c.id || generateId(),
                name: c.name || 'Decision Maker',
                title: c.title || 'Executive',
                department: c.department || 'executive',
                priority: c.priority || 'primary',
                email: c.email,
                linkedin: c.linkedin
            })),
            summary: data.summary || `Research completed for ${companyName}.`,
            researchedAt: new Date().toISOString(),
            researchDuration: 15
        };

        onProgress?.({
            name: 'research',
            status: 'completed',
            progress: 100,
            message: 'Research complete!'
        });

        return research;

    } catch (error) {
        console.error('Research Error:', error);

        // Fallback to basic data
        onProgress?.({
            name: 'research',
            status: 'completed',
            progress: 100,
            message: 'Research complete!'
        });

        return createFallbackResearch(companyName);
    }
}

// ============================================
// SCORING AGENT - Calls server API for AI
// ============================================
export async function runScoringAgent(
    research: ResearchResult,
    onProgress?: (status: AgentStatus) => void
): Promise<ScoreResult> {
    onProgress?.({
        name: 'scoring',
        status: 'running',
        progress: 0,
        message: 'Analyzing ICP fit...'
    });

    await delay(300);

    // Check for pre-scored mock data
    const mockData = getMockCompanyData(research.company.name);
    if (mockData) {
        onProgress?.({
            name: 'scoring',
            status: 'running',
            progress: 50,
            message: 'Calculating intent score...'
        });
        await delay(400);
        onProgress?.({
            name: 'scoring',
            status: 'completed',
            progress: 100,
            message: 'Scoring complete!'
        });
        return mockData.score;
    }

    // Use AI API for scoring
    try {
        onProgress?.({
            name: 'scoring',
            status: 'running',
            progress: 30,
            message: 'AI analyzing buying signals...'
        });

        const response = await fetch('/api/ai/score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ research })
        });

        onProgress?.({
            name: 'scoring',
            status: 'running',
            progress: 70,
            message: 'Processing score...'
        });

        if (!response.ok) {
            throw new Error('AI scoring failed');
        }

        const score = await response.json();

        await delay(200);

        onProgress?.({
            name: 'scoring',
            status: 'completed',
            progress: 100,
            message: 'Scoring complete!'
        });

        return score;

    } catch (error) {
        console.error('Scoring Error:', error);
        return createFallbackScore(research);
    }
}

// ============================================
// OUTREACH AGENT - Calls server API for AI
// ============================================
export async function runOutreachAgent(
    research: ResearchResult,
    score: ScoreResult,
    targetContact: Contact,
    onProgress?: (status: AgentStatus) => void
): Promise<OutreachContent> {
    onProgress?.({
        name: 'outreach',
        status: 'running',
        progress: 0,
        message: 'Analyzing personalization opportunities...'
    });

    await delay(300);

    // Check for pre-built outreach
    const mockData = getMockCompanyData(research.company.name);
    if (mockData) {
        onProgress?.({
            name: 'outreach',
            status: 'running',
            progress: 50,
            message: 'Generating personalized content...'
        });
        await delay(500);
        onProgress?.({
            name: 'outreach',
            status: 'completed',
            progress: 100,
            message: 'Outreach content ready!'
        });
        return mockData.outreach;
    }

    // Use AI API for outreach
    try {
        onProgress?.({
            name: 'outreach',
            status: 'running',
            progress: 25,
            message: 'AI crafting personalized messages...'
        });

        const response = await fetch('/api/ai/outreach', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                research,
                score,
                targetContact,
                companyId: research.company.id // Pass companyId for database saving
            })
        });

        onProgress?.({
            name: 'outreach',
            status: 'running',
            progress: 70,
            message: 'Polishing content...'
        });

        if (!response.ok) {
            throw new Error('AI outreach failed');
        }

        const outreach = await response.json();

        await delay(200);

        onProgress?.({
            name: 'outreach',
            status: 'completed',
            progress: 100,
            message: 'Outreach content ready!'
        });

        return {
            ...outreach,
            generatedAt: new Date().toISOString()
        };

    } catch (error) {
        console.error('Outreach Error:', error);
        return createFallbackOutreach(research, targetContact);
    }
}

// ============================================
// FALLBACK GENERATORS
// ============================================
function createFallbackResearch(companyName: string): ResearchResult {
    return {
        company: {
            name: companyName,
            domain: `${companyName.toLowerCase().replace(/\s+/g, '')}.com`,
            industry: 'Technology',
            size: 'midmarket',
            description: `${companyName} is a technology company focused on innovative solutions.`,
            painPoints: ['Scaling operations efficiently', 'Improving team productivity', 'Growing revenue'],
            opportunities: ['Sales automation', 'Lead generation', 'Process optimization'],
            techStack: ['Modern stack']
        },
        signals: [
            {
                id: generateId(),
                type: 'websiteVisit',
                strength: 'medium',
                description: 'Company is being actively researched',
                source: 'Manual Research',
                detectedAt: new Date().toISOString()
            }
        ],
        contacts: [
            {
                id: generateId(),
                name: 'Decision Maker',
                title: 'VP of Operations',
                department: 'operations',
                priority: 'primary'
            }
        ],
        summary: `${companyName} has been identified as a potential prospect. Further research recommended.`,
        researchedAt: new Date().toISOString(),
        researchDuration: 8
    };
}

function createFallbackScore(research: ResearchResult): ScoreResult {
    const signalPoints = research.signals.length * 8;
    const sizeBonus = research.company.size === 'enterprise' ? 15 : research.company.size === 'midmarket' ? 10 : 5;
    const overall = Math.min(100, 40 + signalPoints + sizeBonus);

    return {
        overall,
        breakdown: {
            icpFit: Math.min(25, 15 + sizeBonus / 2),
            timingSignals: Math.min(25, signalPoints),
            budgetIndicators: Math.min(25, 12 + sizeBonus / 2),
            engagementLikelihood: Math.min(25, 13)
        },
        reasoning: `${research.company.name} shows ${research.signals.length} buying signals. Company size (${research.company.size}) indicates potential.`,
        recommendation: overall > 70 ? 'hot' : overall > 50 ? 'warm' : overall > 30 ? 'nurture' : 'disqualify',
        confidenceLevel: research.signals.length >= 3 ? 'high' : 'medium'
    };
}

function createFallbackOutreach(research: ResearchResult, targetContact: Contact): OutreachContent {
    const firstName = targetContact.name.split(' ')[0];
    const signal = research.signals[0]?.description || 'your company caught my attention';

    return {
        email: {
            subject: `Quick question about ${research.company.name}`,
            body: `Hi ${firstName},

I came across ${research.company.name} and noticed ${signal.toLowerCase()}.

We help companies like yours with sales intelligence and prospecting efficiency. Would a quick 15-minute call be worth it to see if there's a fit?

Best,`
        },
        linkedin: {
            connectionNote: `Hi ${firstName} — noticed some interesting things happening at ${research.company.name}. Would love to connect!`,
            followUpMessage: `Thanks for connecting! Would love to share how we help ${research.company.industry} companies with their sales process. Worth a quick chat?`
        },
        sequence: {
            day1: {
                subject: `Quick question about ${research.company.name}`,
                body: `Hi ${firstName},\n\nNoticed ${research.company.name} and wanted to reach out about something relevant.\n\nWorth a quick chat?\n\nBest,`
            },
            day3: {
                subject: 'Following up',
                body: `Hi ${firstName},\n\nQuick follow-up on my last note. Would love to connect.\n\nBest,`
            },
            day7: {
                subject: 'Last note + a resource',
                body: `Hi ${firstName},\n\nLast follow-up — if the timing ever makes sense, I'm here.\n\nWishing you the best!\n\nCheers,`
            }
        },
        personalizationPoints: research.signals.map(s => s.description),
        generatedAt: new Date().toISOString()
    };
}

// ============================================
// FULL PIPELINE ORCHESTRATOR
// ============================================
export async function runFullPipeline(
    companyName: string,
    onAgentUpdate?: (agents: AgentStatus[]) => void
): Promise<PipelineState> {
    const agents: AgentStatus[] = [
        { name: 'research', status: 'pending', progress: 0 },
        { name: 'scoring', status: 'pending', progress: 0 },
        { name: 'contacts', status: 'pending', progress: 0 },
        { name: 'outreach', status: 'pending', progress: 0 }
    ];

    const updateAgent = (name: AgentStatus['name'], update: Partial<AgentStatus>) => {
        const index = agents.findIndex(a => a.name === name);
        if (index !== -1) {
            agents[index] = { ...agents[index], ...update };
            onAgentUpdate?.([...agents]);
        }
    };

    try {
        // Run Research Agent
        const research = await runResearchAgent(companyName, (status) => {
            updateAgent('research', status);
        });

        // Run Scoring Agent
        updateAgent('contacts', { status: 'running', progress: 50, message: 'Extracting contacts from research...' });
        const score = await runScoringAgent(research, (status) => {
            updateAgent('scoring', status);
        });
        updateAgent('contacts', { status: 'completed', progress: 100, message: 'Contacts identified!' });

        // Run Outreach Agent
        const targetContact = research.contacts[0] || {
            id: 'default',
            name: 'Decision Maker',
            title: 'Executive',
            department: 'executive' as const,
            priority: 'primary' as const
        };

        const outreach = await runOutreachAgent(research, score, targetContact, (status) => {
            updateAgent('outreach', status);
        });

        return {
            status: 'completed',
            agents,
            research,
            score,
            outreach
        };
    } catch (error) {
        return {
            status: 'error',
            agents,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}
