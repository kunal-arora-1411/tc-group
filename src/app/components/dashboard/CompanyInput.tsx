'use client';

import { useState, FormEvent } from 'react';
import { Search, Sparkles, TrendingUp, Zap } from 'lucide-react';

interface CompanyInputProps {
    onSubmit: (companyName: string) => void;
    isLoading?: boolean;
}

const demoCompanies = [
    { name: 'Stripe', score: 87, tag: 'Hot Lead', tagColor: 'bg-red-500/20 text-red-400 border-red-500/30' },
    { name: 'Notion', score: 72, tag: 'Warm Lead', tagColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    { name: 'LocalBiz Software', score: 28, tag: 'Cold Lead', tagColor: 'bg-gray-500/20 text-gray-400 border-gray-500/30' }
];

export default function CompanyInput({ onSubmit, isLoading }: CompanyInputProps) {
    const [value, setValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (value.trim() && !isLoading) {
            onSubmit(value.trim());
        }
    };

    const handleDemoClick = (companyName: string) => {
        setValue(companyName);
        onSubmit(companyName);
    };

    return (
        <div className="w-full max-w-6xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
                {/* Input Container with Button on Right */}
                <div className="relative group flex items-center gap-4">
                    {/* Enhanced Glow effect when focused */}
                    {isFocused && (
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 rounded-[24px] opacity-20 blur-2xl animate-pulse pointer-events-none" />
                    )}

                    {/* Dialog Box - Input Field */}
                    <div className="relative flex-1 bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-2xl rounded-[22px] border border-orange-500/10 shadow-2xl transition-all duration-500 hover:border-orange-500/30">
                        {/* Input Field */}
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                            placeholder="Search any company... (e.g., Stripe, Notion, Salesforce)"
                            className="w-full px-8 py-8 bg-transparent border-0 text-white placeholder-gray-500 focus:outline-none text-xl font-medium tracking-wide"
                            disabled={isLoading}
                            style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
                        />
                    </div>

                    {/* Submit Button - Separated on Right */}
                    <button
                        type="submit"
                        disabled={isLoading || !value.trim()}
                        className="flex-shrink-0 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-bold py-8 px-12 rounded-[22px] transition-all duration-300 flex items-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl hover:shadow-orange-500/50 hover:scale-105 active:scale-95"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                <span className="text-base">Researching...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                <span className="text-base tracking-wide">Research</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
