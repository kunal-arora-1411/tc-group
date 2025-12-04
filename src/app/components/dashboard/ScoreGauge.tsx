'use client';

import { ScoreResult } from '@/lib/types';

interface ScoreGaugeProps {
    score: ScoreResult;
}

export default function ScoreGauge({ score }: ScoreGaugeProps) {
    const recommendationConfig = {
        hot: { color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/30', label: '🔥 Hot Lead', glow: 'shadow-red-500/20' },
        warm: { color: 'text-orange-400', bg: 'bg-orange-500/20 border-orange-500/30', label: '☀️ Warm Lead', glow: 'shadow-orange-500/20' },
        nurture: { color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/30', label: '💧 Nurture', glow: 'shadow-blue-500/20' },
        disqualify: { color: 'text-gray-400', bg: 'bg-gray-500/20 border-gray-500/30', label: '❄️ Cold Lead', glow: 'shadow-gray-500/20' }
    };

    const config = recommendationConfig[score.recommendation];

    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score.overall / 100) * circumference;

    const getScoreColor = () => {
        if (score.overall >= 70) return '#ef4444';
        if (score.overall >= 50) return '#f97316';
        if (score.overall >= 30) return '#3b82f6';
        return '#6b7280';
    };

    return (
        <div className="glass-card p-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-3xl" />

            <h3 className="text-lg font-semibold text-white mb-6 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                    Intent Score
                </div>
                <span className="text-xs text-gray-500 font-normal">Real-time</span>
            </h3>

            <div className="flex flex-col items-center relative z-10">
                {/* Circular Gauge */}
                <div className="relative w-44 h-44 mb-6">
                    {/* Outer glow */}
                    <div className={`absolute inset-0 rounded-full blur-xl ${config.glow} opacity-50`}></div>

                    <svg className="w-full h-full transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx="88"
                            cy="88"
                            r={radius}
                            fill="transparent"
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth="10"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="88"
                            cy="88"
                            r={radius}
                            fill="transparent"
                            stroke="url(#scoreGradient)"
                            strokeWidth="10"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            className="score-ring"
                        />
                        <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#f97316" />
                                <stop offset="100%" stopColor="#ea580c" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Score number */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center score-text">
                        <span className="text-5xl font-bold text-white">{score.overall}</span>
                        <span className="text-sm text-gray-500">/ 100</span>
                    </div>
                </div>

                {/* Recommendation Badge */}
                <div className={`px-5 py-2.5 rounded-full border ${config.bg} mb-6 shadow-lg`}>
                    <span className={`font-semibold text-lg ${config.color}`}>{config.label}</span>
                </div>

                {/* Score Breakdown */}
                <div className="w-full space-y-4">
                    <ScoreBar label="ICP Fit" value={score.breakdown.icpFit} max={25} />
                    <ScoreBar label="Timing Signals" value={score.breakdown.timingSignals} max={25} />
                    <ScoreBar label="Budget Indicators" value={score.breakdown.budgetIndicators} max={25} />
                    <ScoreBar label="Engagement Likelihood" value={score.breakdown.engagementLikelihood} max={25} />
                </div>

                {/* Reasoning */}
                <div className="mt-6 p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 w-full">
                    <p className="text-xs text-orange-400 mb-2 uppercase tracking-wider font-medium">AI Analysis</p>
                    <p className="text-sm text-gray-300 leading-relaxed">{score.reasoning}</p>
                </div>

                {/* Confidence */}
                <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs text-gray-500">Confidence:</span>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-colors ${(score.confidenceLevel === 'high' && i <= 3) ||
                                        (score.confidenceLevel === 'medium' && i <= 2) ||
                                        (score.confidenceLevel === 'low' && i <= 1)
                                        ? 'bg-orange-500'
                                        : 'bg-gray-700'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className={`text-xs font-medium ${score.confidenceLevel === 'high' ? 'text-green-400' :
                            score.confidenceLevel === 'medium' ? 'text-orange-400' :
                                'text-gray-400'
                        }`}>
                        {score.confidenceLevel.toUpperCase()}
                    </span>
                </div>
            </div>
        </div>
    );
}

function ScoreBar({ label, value, max }: { label: string; value: number; max: number }) {
    const percentage = (value / max) * 100;

    return (
        <div className="group">
            <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">{label}</span>
                <span className="text-white font-medium">{value}/{max}</span>
            </div>
            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-1000 relative"
                    style={{ width: `${percentage}%` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                </div>
            </div>
        </div>
    );
}
