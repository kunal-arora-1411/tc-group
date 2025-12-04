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
    Star,
    Zap
} from 'lucide-react';
import { IntentSignal } from '@/lib/types';

interface SignalBadgesProps {
    signals: IntentSignal[];
}

const signalConfig = {
    funding: { icon: TrendingUp, label: 'Funding', color: 'from-emerald-500 to-green-600' },
    hiring: { icon: Users, label: 'Hiring', color: 'from-orange-500 to-orange-600' },
    techChange: { icon: Code, label: 'Tech Change', color: 'from-amber-500 to-orange-500' },
    leadership: { icon: UserCircle, label: 'Leadership', color: 'from-yellow-500 to-amber-500' },
    expansion: { icon: Rocket, label: 'Expansion', color: 'from-red-500 to-rose-600' },
    competitorChurn: { icon: RefreshCw, label: 'Competitor Churn', color: 'from-pink-500 to-rose-500' },
    websiteVisit: { icon: Globe, label: 'Website Visit', color: 'from-orange-600 to-red-600' },
    g2Activity: { icon: Star, label: 'G2 Activity', color: 'from-orange-400 to-orange-500' },
    socialMention: { icon: MessageSquare, label: 'Social Mention', color: 'from-cyan-500 to-blue-500' }
};

const strengthColors = {
    high: 'ring-2 ring-green-500/50 bg-green-500/5',
    medium: 'ring-2 ring-orange-500/50 bg-orange-500/5',
    low: 'ring-2 ring-gray-500/50 bg-gray-500/5'
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
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-400" />
                    Intent Signals
                </h3>
                <span className="px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-400 text-sm font-medium border border-orange-500/20">
                    {signals.length} detected
                </span>
            </div>

            <div className="space-y-3">
                {signals.map((signal, index) => {
                    const config = signalConfig[signal.type];
                    const Icon = config.icon;

                    return (
                        <div
                            key={signal.id}
                            className={`signal-card flex items-start gap-4 p-4 rounded-xl ${strengthColors[signal.strength]} transition-all`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className={`signal-icon w-11 h-11 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                <Icon className="w-5 h-5 text-white" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="font-semibold text-white">{config.label}</span>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${signal.strength === 'high' ? 'bg-green-500/20 text-green-400' :
                                            signal.strength === 'medium' ? 'bg-orange-500/20 text-orange-400' :
                                                'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {signal.strength}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-300 mb-2 leading-relaxed">{signal.description}</p>
                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                        {signal.source}
                                    </span>
                                    <span>•</span>
                                    <span>{formatDate(signal.detectedAt)}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {signals.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    <Zap className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    No intent signals detected
                </div>
            )}
        </div>
    );
}
