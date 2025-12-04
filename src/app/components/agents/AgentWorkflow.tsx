'use client';

import { Search, Target, Users, Mail, Check, Loader2, Sparkles } from 'lucide-react';
import { AgentStatus } from '@/lib/types';

interface AgentWorkflowProps {
    agents: AgentStatus[];
    isRunning: boolean;
}

const agentConfig = {
    research: { icon: Search, label: 'Research Agent', description: 'Analyzing company data & signals' },
    scoring: { icon: Target, label: 'Scoring Agent', description: 'Calculating intent score' },
    contacts: { icon: Users, label: 'Contact Finder', description: 'Identifying decision makers' },
    outreach: { icon: Mail, label: 'Outreach Agent', description: 'Generating personalized content' }
};

export default function AgentWorkflow({ agents, isRunning }: AgentWorkflowProps) {
    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-400" />
                    AI Agent Pipeline
                </h3>
                {isRunning && (
                    <span className="flex items-center gap-2 text-sm text-orange-400 px-3 py-1.5 bg-orange-500/10 rounded-full border border-orange-500/20">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                    </span>
                )}
            </div>

            <div className="relative">
                {/* Connection line */}
                <div className="absolute left-[24px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-orange-500/50 via-orange-500/20 to-transparent" />

                <div className="space-y-4 relative">
                    {agents.map((agent, index) => {
                        const config = agentConfig[agent.name];
                        const Icon = config.icon;

                        return (
                            <div
                                key={agent.name}
                                className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 ${agent.status === 'running' ? 'bg-orange-500/10' :
                                        agent.status === 'completed' ? 'bg-green-500/5' : ''
                                    }`}
                            >
                                {/* Status indicator */}
                                <div className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${agent.status === 'completed'
                                        ? 'bg-green-500/20 ring-2 ring-green-500/50 agent-completed'
                                        : agent.status === 'running'
                                            ? 'bg-orange-500/20 ring-2 ring-orange-500/50 agent-running'
                                            : agent.status === 'error'
                                                ? 'bg-red-500/20 ring-2 ring-red-500/50'
                                                : 'bg-gray-800/80'
                                    }`}>
                                    {agent.status === 'completed' ? (
                                        <Check className="w-5 h-5 text-green-400" />
                                    ) : agent.status === 'running' ? (
                                        <Loader2 className="w-5 h-5 text-orange-400 animate-spin" />
                                    ) : (
                                        <Icon className={`w-5 h-5 ${agent.status === 'error' ? 'text-red-400' : 'text-gray-600'}`} />
                                    )}
                                </div>

                                {/* Agent info */}
                                <div className="flex-1 pt-0.5">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`font-medium transition-colors ${agent.status === 'completed' ? 'text-white' :
                                                agent.status === 'running' ? 'text-orange-400' :
                                                    'text-gray-500'
                                            }`}>
                                            {config.label}
                                        </span>
                                        {agent.status === 'running' && (
                                            <span className="text-xs text-orange-400 font-mono bg-orange-500/10 px-2 py-0.5 rounded">
                                                {agent.progress}%
                                            </span>
                                        )}
                                        {agent.status === 'completed' && (
                                            <span className="text-xs text-green-400">✓ Done</span>
                                        )}
                                    </div>

                                    <p className={`text-sm transition-colors ${agent.status === 'running' ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                        {agent.message || config.description}
                                    </p>

                                    {/* Progress bar for running agent */}
                                    {agent.status === 'running' && (
                                        <div className="mt-3 progress-bar">
                                            <div
                                                className="progress-bar-fill"
                                                style={{ width: `${agent.progress}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
