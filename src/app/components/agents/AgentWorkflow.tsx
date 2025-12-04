'use client';

import { Search, Target, Users, Mail, Check, Loader2 } from 'lucide-react';
import { AgentStatus } from '@/lib/types';

interface AgentWorkflowProps {
    agents: AgentStatus[];
    isRunning: boolean;
}

const agentConfig = {
    research: { icon: Search, label: 'Research Agent', description: 'Analyzing company data' },
    scoring: { icon: Target, label: 'Scoring Agent', description: 'Calculating intent score' },
    contacts: { icon: Users, label: 'Contact Finder', description: 'Identifying decision makers' },
    outreach: { icon: Mail, label: 'Outreach Agent', description: 'Generating personalized content' }
};

export default function AgentWorkflow({ agents, isRunning }: AgentWorkflowProps) {
    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">AI Agent Pipeline</h3>
                {isRunning && (
                    <span className="flex items-center gap-2 text-sm text-indigo-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing...
                    </span>
                )}
            </div>

            <div className="relative">
                {/* Connection lines */}
                <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-gray-700" />

                <div className="space-y-4 relative">
                    {agents.map((agent, index) => {
                        const config = agentConfig[agent.name];
                        const Icon = config.icon;
                        const isLast = index === agents.length - 1;

                        return (
                            <div key={agent.name} className="flex items-start gap-4">
                                {/* Status indicator */}
                                <div className={`relative z-10 w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${agent.status === 'completed'
                                        ? 'bg-green-500/20 ring-2 ring-green-500/50'
                                        : agent.status === 'running'
                                            ? 'bg-indigo-500/20 ring-2 ring-indigo-500/50 agent-running'
                                            : agent.status === 'error'
                                                ? 'bg-red-500/20 ring-2 ring-red-500/50'
                                                : 'bg-gray-700/50'
                                    }`}>
                                    {agent.status === 'completed' ? (
                                        <Check className="w-5 h-5 text-green-400" />
                                    ) : agent.status === 'running' ? (
                                        <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                                    ) : (
                                        <Icon className={`w-5 h-5 ${agent.status === 'error' ? 'text-red-400' : 'text-gray-500'}`} />
                                    )}
                                </div>

                                {/* Agent info */}
                                <div className="flex-1 pt-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`font-medium ${agent.status === 'completed' ? 'text-white' :
                                                agent.status === 'running' ? 'text-indigo-400' :
                                                    'text-gray-400'
                                            }`}>
                                            {config.label}
                                        </span>
                                        {agent.status === 'running' && (
                                            <span className="text-xs text-gray-500">{agent.progress}%</span>
                                        )}
                                    </div>

                                    <p className="text-sm text-gray-500">
                                        {agent.message || config.description}
                                    </p>

                                    {/* Progress bar for running agent */}
                                    {agent.status === 'running' && (
                                        <div className="mt-2 progress-bar">
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
