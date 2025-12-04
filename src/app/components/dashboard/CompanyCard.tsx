'use client';

import { Building2, Globe, MapPin, Users, DollarSign, Briefcase, AlertTriangle, Lightbulb, Code, ExternalLink, Share2, Star, Bookmark } from 'lucide-react';
import { Company } from '@/lib/types';

interface CompanyCardProps {
    company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
    return (
        <div className="glass-card p-6 group">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4 flex-1">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-black font-bold text-2xl shadow-lg company-logo">
                        {company.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-bold text-white group-hover:text-orange-300 transition-colors">{company.name}</h2>
                            <span className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-sm font-medium border border-orange-500/20">
                                {company.industry}
                            </span>
                        </div>
                        <a
                            href={`https://${company.domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-gray-400 hover:text-orange-400 text-sm transition-colors w-fit group/link"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            {company.domain}
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </a>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-orange-400 transition-colors" title="Bookmark">
                        <Bookmark className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-orange-400 transition-colors" title="Rate">
                        <Star className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-orange-400 transition-colors" title="Share">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 mb-6 leading-relaxed">{company.description}</p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard icon={Briefcase} label="Company Size" value={company.size} />
                <StatCard icon={Users} label="Employees" value={company.employees || 'Unknown'} />
                <StatCard icon={MapPin} label="Location" value={company.location || 'Global'} />
                {company.revenue && <StatCard icon={DollarSign} label="Revenue" value={company.revenue} />}
            </div>

            {/* Tech Stack */}
            {company.techStack && company.techStack.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <Code className="w-4 h-4 text-orange-400" />
                        <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Tech Stack</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {company.techStack.map((tech, index) => (
                            <span
                                key={index}
                                className="tech-badge px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-sm"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Pain Points & Opportunities */}
            <div className="grid md:grid-cols-2 gap-4">
                {/* Pain Points */}
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                    <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wider">Pain Points</h4>
                    </div>
                    <ul className="space-y-2">
                        {company.painPoints.map((point, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                                <span className="text-red-400 mt-1">•</span>
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Opportunities */}
                <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                    <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-4 h-4 text-green-400" />
                        <h4 className="text-sm font-semibold text-green-400 uppercase tracking-wider">Opportunities</h4>
                    </div>
                    <ul className="space-y-2">
                        {company.opportunities.map((opp, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                                <span className="text-green-400 mt-1">•</span>
                                {opp}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
    return (
        <div className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-orange-500/20 transition-all group/stat cursor-default">
            <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4 text-orange-400 group-hover/stat:scale-110 transition-transform" />
                <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-white font-medium capitalize">{value}</p>
        </div>
    );
}
