'use client';

import { useState } from 'react';
import { Mail, Linkedin, Calendar, Copy, Check, ChevronRight, Sparkles } from 'lucide-react';
import { OutreachContent, Contact } from '@/lib/types';

interface OutreachTabsProps {
    outreach: OutreachContent;
    contact: Contact;
}

type TabType = 'email' | 'linkedin' | 'sequence';

export default function OutreachTabs({ outreach, contact }: OutreachTabsProps) {
    const [activeTab, setActiveTab] = useState<TabType>('email');
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const copyToClipboard = async (text: string, fieldId: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(fieldId);
            setTimeout(() => setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const tabs = [
        { id: 'email' as TabType, label: 'Email', icon: Mail },
        { id: 'linkedin' as TabType, label: 'LinkedIn', icon: Linkedin },
        { id: 'sequence' as TabType, label: 'Sequence', icon: Calendar }
    ];

    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-400" />
                    AI-Generated Outreach
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>For:</span>
                    <span className="text-orange-400 font-medium flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-orange-500 flex items-center justify-center text-black text-xs font-bold">
                            {contact.name.charAt(0)}
                        </span>
                        {contact.name}
                    </span>
                </div>
            </div>

            {/* Tab buttons */}
            <div className="tab-list mb-6">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`tab-button flex items-center justify-center gap-2 ${activeTab === tab.id ? 'active' : ''
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Tab content */}
            <div className="space-y-4">
                {activeTab === 'email' && (
                    <EmailContent
                        email={outreach.email}
                        onCopy={copyToClipboard}
                        copiedField={copiedField}
                    />
                )}

                {activeTab === 'linkedin' && (
                    <LinkedInContent
                        linkedin={outreach.linkedin}
                        onCopy={copyToClipboard}
                        copiedField={copiedField}
                    />
                )}

                {activeTab === 'sequence' && (
                    <SequenceContent
                        sequence={outreach.sequence}
                        onCopy={copyToClipboard}
                        copiedField={copiedField}
                    />
                )}
            </div>

            {/* Personalization points */}
            <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                    Personalization Points Used
                </p>
                <div className="flex flex-wrap gap-2">
                    {outreach.personalizationPoints.map((point, index) => (
                        <span
                            key={index}
                            className="px-3 py-1.5 rounded-lg bg-orange-500/10 text-orange-300 text-sm border border-orange-500/20 hover:bg-orange-500/20 transition-colors cursor-default"
                        >
                            {point}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

interface CopyButtonProps {
    onClick: () => void;
    copied: boolean;
}

function CopyButton({ onClick, copied }: CopyButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`copy-button ${copied ? 'copied' : ''}`}
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4" />
                    Copied!
                </>
            ) : (
                <>
                    <Copy className="w-4 h-4" />
                    Copy
                </>
            )}
        </button>
    );
}

function EmailContent({
    email,
    onCopy,
    copiedField
}: {
    email: OutreachContent['email'];
    onCopy: (text: string, id: string) => void;
    copiedField: string | null;
}) {
    return (
        <div className="space-y-4">
            {/* Subject line */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-orange-500/20 transition-colors">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-orange-400 font-medium">Subject Line</span>
                    <CopyButton
                        onClick={() => onCopy(email.subject, 'email-subject')}
                        copied={copiedField === 'email-subject'}
                    />
                </div>
                <p className="text-white font-medium text-lg">{email.subject}</p>
            </div>

            {/* Email body */}
            <div className="outreach-content pl-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-orange-500/20 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-orange-400 font-medium">Email Body</span>
                        <CopyButton
                            onClick={() => onCopy(email.body, 'email-body')}
                            copied={copiedField === 'email-body'}
                        />
                    </div>
                    <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {email.body}
                    </pre>
                </div>
            </div>
        </div>
    );
}

function LinkedInContent({
    linkedin,
    onCopy,
    copiedField
}: {
    linkedin: OutreachContent['linkedin'];
    onCopy: (text: string, id: string) => void;
    copiedField: string | null;
}) {
    return (
        <div className="space-y-4">
            {/* Connection note */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-orange-500/20 transition-colors">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-orange-400 font-medium">Connection Note</span>
                        <span className="text-xs text-gray-500">(300 char limit)</span>
                    </div>
                    <CopyButton
                        onClick={() => onCopy(linkedin.connectionNote, 'linkedin-note')}
                        copied={copiedField === 'linkedin-note'}
                    />
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{linkedin.connectionNote}</p>
                <div className="mt-3 flex items-center justify-between">
                    <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden mr-4">
                        <div
                            className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all"
                            style={{ width: `${(linkedin.connectionNote.length / 300) * 100}%` }}
                        />
                    </div>
                    <span className={`text-xs font-mono ${linkedin.connectionNote.length > 280 ? 'text-red-400' : 'text-gray-500'}`}>
                        {linkedin.connectionNote.length}/300
                    </span>
                </div>
            </div>

            {/* Follow-up message */}
            <div className="outreach-content pl-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-orange-500/20 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-orange-400 font-medium">Follow-up Message</span>
                        <CopyButton
                            onClick={() => onCopy(linkedin.followUpMessage, 'linkedin-followup')}
                            copied={copiedField === 'linkedin-followup'}
                        />
                    </div>
                    <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {linkedin.followUpMessage}
                    </pre>
                </div>
            </div>
        </div>
    );
}

function SequenceContent({
    sequence,
    onCopy,
    copiedField
}: {
    sequence: OutreachContent['sequence'];
    onCopy: (text: string, id: string) => void;
    copiedField: string | null;
}) {
    const [expandedDay, setExpandedDay] = useState<string | null>('day1');

    const days = [
        { id: 'day1', label: 'Day 1', subtitle: 'Initial Outreach', email: sequence.day1 },
        { id: 'day3', label: 'Day 3', subtitle: 'Follow-up', email: sequence.day3 },
        { id: 'day7', label: 'Day 7', subtitle: 'Breakup Email', email: sequence.day7 }
    ];

    return (
        <div className="space-y-3">
            {days.map((day, index) => (
                <div
                    key={day.id}
                    className={`sequence-day rounded-xl border overflow-hidden transition-all ${expandedDay === day.id
                            ? 'bg-orange-500/10 border-orange-500/30'
                            : 'bg-white/5 border-white/5 hover:border-orange-500/20'
                        }`}
                >
                    <button
                        onClick={() => setExpandedDay(expandedDay === day.id ? null : day.id)}
                        className="w-full flex items-center justify-between p-4 transition-colors"
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg ${expandedDay === day.id
                                    ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-black'
                                    : 'bg-white/10 text-gray-400'
                                }`}>
                                {index + 1}
                            </div>
                            <div className="text-left">
                                <p className={`font-semibold ${expandedDay === day.id ? 'text-orange-300' : 'text-white'}`}>
                                    {day.label}
                                </p>
                                <p className="text-sm text-gray-500">{day.subtitle}</p>
                            </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${expandedDay === day.id ? 'rotate-90 text-orange-400' : ''
                            }`} />
                    </button>

                    {expandedDay === day.id && (
                        <div className="px-4 pb-4 space-y-3 animate-in">
                            <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-orange-400 font-medium uppercase tracking-wider">Subject</span>
                                    <CopyButton
                                        onClick={() => onCopy(day.email.subject, `${day.id}-subject`)}
                                        copied={copiedField === `${day.id}-subject`}
                                    />
                                </div>
                                <p className="text-sm text-white font-medium">{day.email.subject}</p>
                            </div>
                            <div className="outreach-content pl-3">
                                <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs text-orange-400 font-medium uppercase tracking-wider">Body</span>
                                        <CopyButton
                                            onClick={() => onCopy(day.email.body, `${day.id}-body`)}
                                            copied={copiedField === `${day.id}-body`}
                                        />
                                    </div>
                                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                                        {day.email.body}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
