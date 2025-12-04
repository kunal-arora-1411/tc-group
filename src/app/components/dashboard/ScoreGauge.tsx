'use client';

import { ScoreResult } from '@/lib/types';

interface ScoreGaugeProps {
    score: ScoreResult;
}

export default function ScoreGauge({ score }: ScoreGaugeProps) {
    const recommendationConfig = {
        hot: { color: 'text-red-400', bg: 'bg-red-500/20 border-red-500/30', label: '🔥 Hot Lead' },
        warm: { color: 'text-yellow-400', bg: 'bg-yellow-500/20 border-yellow-500/30', label: '☀️ Warm Lead' },
        nurture: { color: 'text-blue-400', bg: 'bg-blue-500/20 border-blue-500/30', label: '💧 Nurture' },
        disqualify: { color: 'text-gray-400', bg: 'bg-gray-500/20 border-gray-500/30', label: '❄️ Cold Lead' }
    };

    const config = recommendationConfig[score.recommendation];

    // Calculate circumference and offset for SVG circle
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score.overall / 100) * circumference;

    // Determine color based on score
    const getScoreColor = () => {
        if (score.overall >= 70) return '#ef4444'; // red
        if (score.overall >= 50) return '#f59e0b'; // yellow
        if (score.overall >= 30) return '#3b82f6'; // blue
        return '#6b7280'; // gray
    };

    return (
        <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Intent Score</h3>

            <div className="flex flex-col items-center">
                {/* Circular Gauge */}
                <div className="relative w-40 h-40 mb-4">
                    <svg className="w-full h-full transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx="80"
                            cy="80"
                            r={radius}
                            fill="transparent"
                            stroke="rgba(255,255,255,0.1)"
                            strokeWidth="12"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="80"
                            cy="80"
                            r={radius}
                            fill="transparent"
                            stroke={getScoreColor()}
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>

                    {/* Score number */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-white">{score.overall}</span>
                        <span className="text-sm text-gray-400">/ 100</span>
                    </div>
                </div>

                {/* Recommendation Badge */}
                <div className={`px-4 py-2 rounded-full border ${config.bg} mb-6`}>
                    <span className={`font-semibold ${config.color}`}>{config.label}</span>
                </div>

                {/* Score Breakdown */}
                <div className="w-full space-y-3">
                    <ScoreBar label="ICP Fit" value={score.breakdown.icpFit} max={25} />
                    <ScoreBar label="Timing Signals" value={score.breakdown.timingSignals} max={25} />
                    <ScoreBar label="Budget Indicators" value={score.breakdown.budgetIndicators} max={25} />
                    <ScoreBar label="Engagement Likelihood" value={score.breakdown.engagementLikelihood} max={25} />
                </div>

                {/* Reasoning */}
                <div className="mt-6 p-4 rounded-xl bg-white/5 w-full">
                    <p className="text-sm text-gray-400 mb-2">Analysis</p>
                    <p className="text-sm text-gray-300">{score.reasoning}</p>
                </div>

                {/* Confidence */}
                <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs text-gray-500">Confidence:</span>
                    <span className={`text-xs font-medium ${score.confidenceLevel === 'high' ? 'text-green-400' :
                            score.confidenceLevel === 'medium' ? 'text-yellow-400' :
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
        <div>
            <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">{label}</span>
                <span className="text-white font-medium">{value}/{max}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}
