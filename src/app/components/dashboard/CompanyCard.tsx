'use client';

import { Building2, Globe, Users, MapPin, Calendar, DollarSign } from 'lucide-react';
import { Company } from '@/lib/types';

interface CompanyCardProps {
    company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
    const sizeLabels = {
        startup: 'Startup',
        smb: 'SMB',
        midmarket: 'Mid-Market',
        enterprise: 'Enterprise'
    };

    return (
        <div className="glass-card p-6 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                        {company.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{company.name}</h2>
                        <div className="flex items-center gap-2 text-gray-400 mt-1">
                            <Globe className="w-4 h-4" />
                            <a
                                href={`https://${company.domain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-indigo-400 transition-colors"
                            >
                                {company.domain}
                            </a>
                        </div>
                    </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm font-medium border border-indigo-500/20">
                    {company.industry}
                </span>
            </div>

            {/* Description */}
            <p className="text-gray-300 leading-relaxed">
                {company.description}
            </p>

            {/* Meta Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <div>
                        <p className="text-xs text-gray-500">Company Size</p>
                        <p className="text-sm font-medium text-white">{sizeLabels[company.size]}</p>
                    </div>
                </div>

                {company.employees && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                        <Users className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Employees</p>
                            <p className="text-sm font-medium text-white">{company.employees}</p>
                        </div>
                    </div>
                )}

                {company.location && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Location</p>
                            <p className="text-sm font-medium text-white">{company.location}</p>
                        </div>
                    </div>
                )}

                {company.revenue && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                        <DollarSign className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-xs text-gray-500">Revenue</p>
                            <p className="text-sm font-medium text-white">{company.revenue}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Tech Stack */}
            {company.techStack.length > 0 && (
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Tech Stack</p>
                    <div className="flex flex-wrap gap-2">
                        {company.techStack.map((tech, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Pain Points & Opportunities */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                    <p className="text-sm font-medium text-red-400 mb-3">Pain Points</p>
                    <ul className="space-y-2">
                        {company.painPoints.slice(0, 3).map((point, index) => (
                            <li key={index} className="flex gap-2 text-sm text-gray-300">
                                <span className="text-red-400 mt-0.5">•</span>
                                {point}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                    <p className="text-sm font-medium text-green-400 mb-3">Opportunities</p>
                    <ul className="space-y-2">
                        {company.opportunities.slice(0, 3).map((opp, index) => (
                            <li key={index} className="flex gap-2 text-sm text-gray-300">
                                <span className="text-green-400 mt-0.5">•</span>
                                {opp}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
