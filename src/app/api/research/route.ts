import { NextRequest, NextResponse } from 'next/server';
import { runFullPipeline } from '@/lib/agents/orchestrator';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { companyName } = body;

        if (!companyName || typeof companyName !== 'string') {
            return NextResponse.json(
                { error: 'Company name is required' },
                { status: 400 }
            );
        }

        const result = await runFullPipeline(companyName);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Pipeline error:', error);
        return NextResponse.json(
            { error: 'Failed to run research pipeline' },
            { status: 500 }
        );
    }
}
