'use client';

import { useState } from 'react';
import { Search, Loader2, Sparkles } from 'lucide-react';
import { demoCompanies } from '@/lib/mock-data/companies';

interface CompanyInputProps {
    onSubmit: (companyName: string) => void;
    isLoading: boolean;
}

export default function CompanyInput({ onSubmit, isLoading }: CompanyInputProps) {
    const [companyName, setCompanyName] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (companyName.trim() && !isLoading) {
            onSubmit(companyName.trim());
            setShowSuggestions(false);
        }
    };

    const handleDemoSelect = (name: string) => {
        setCompanyName(name);
        setShowSuggestions(false);
        onSubmit(name);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder="Enter company name (e.g., Stripe, Notion, Salesforce)"
                        className="input-field pl-12 pr-32"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!companyName.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary py-2 px-4 text-sm flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Analyzing...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4" />
                                <span>Research</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Demo company suggestions */}
                {showSuggestions && !isLoading && (
                    <div className="absolute top-full left-0 right-0 mt-2 glass-card p-2 z-50">
                        <p className="text-xs text-gray-400 px-3 py-2 uppercase tracking-wider">
                            Try these demo companies
                        </p>
                        <div className="space-y-1">
                            {demoCompanies.map((company) => (
                                <button
                                    key={company.name}
                                    type="button"
                                    onClick={() => handleDemoSelect(company.name)}
                                    className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-white/5 transition-colors text-left"
                                >
                                    <div>
                                        <span className="font-medium text-white">{company.name}</span>
                                        <span className="text-gray-400 text-sm ml-2">{company.description}</span>
                                    </div>
                                    <span className={`badge-${company.tag} px-2 py-1 rounded-full text-xs font-medium`}>
                                        {company.tag.toUpperCase()}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </form>

            {/* Click outside to close */}
            {showSuggestions && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSuggestions(false)}
                />
            )}
        </div>
    );
}
