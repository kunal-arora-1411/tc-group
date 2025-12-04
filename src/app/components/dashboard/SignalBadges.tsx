'use client';

import {
    TrendingUp,
    Users,
    Code,
    UserCircle,
    Rocket,
    RefreshCw,
    Globe,
    MessageSquare,
    Star
} from 'lucide-react';
import { IntentSignal } from '@/lib/types';

interface SignalBadgesProps {
    signals: IntentSignal[];
}

const signalConfig = {
    funding: { icon: TrendingUp, label: 'Funding', color: 'signal-funding' },
    hiring: { icon: Users, label: 'Hiring', color: 'signal-hiring' },
    techChange: { icon: Code, label: 'Tech Change', color: 'signal-techChange' },
    leadership: { icon: UserCircle, label: 'Leadership', color: 'signal-leadership' },
    expansion: { icon: Rocket, label: 'Expansion', color: 'signal-expansion' },
    competitorChurn: { icon: RefreshCw, label: 'Competitor Churn', color: 'signal-competitorChurn' },
    websiteVisit: { icon: Globe, label: 'Website Visit', color: 'signal-websiteVisit' },
    g2Activity: { icon: Star, label: 'G2 Activity', color: 'signal-g2Activity' },
    socialMention: { icon: MessageSquare, label: 'Social Mention', color: 'signal-socialMention' }
};

const strengthColors = {
    high: 'ring-2 ring-green-500/50',
    medium: 'ring-2 ring-yellow-500/50',
    low: 'ring-2 ring-gray-500/50'
};

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
}

export default function SignalBadges({ signals }: SignalBadgesProps) {
    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Intent Signals</h3>
                <span className="px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-sm font-medium">
                    {signals.length} detected
                </span>
            </div>

            <div className="space-y-3">
                {signals.map((signal) => {
                    const config = signalConfig[signal.type];
                    const Icon = config.icon;

                    return (
                        <div
                            key={signal.id}
                            className={`flex items-start gap-4 p-4 rounded-xl bg-white/5 ${strengthColors[signal.strength]} transition-all hover:bg-white/10`}
                        >
                            <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center flex-shrink-0`}>
                                <Icon className="w-5 h-5 text-white" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-white">{config.label}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${signal.strength === 'high' ? 'bg-green-500/20 text-green-400' :
                                            signal.strength === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                                'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {signal.strength.toUpperCase()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-300 mb-2">{signal.description}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <span>{signal.source}</span>
                                    <span>•</span>
                                    <span>{formatDate(signal.detectedAt)}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {signals.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                    No intent signals detected
                </div>
            )}
        </div>
    );
}
