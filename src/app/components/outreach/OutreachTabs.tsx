'use client';

import { useState } from 'react';
import { Mail, Linkedin, Calendar, Copy, Check, ChevronRight } from 'lucide-react';
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
                <h3 className="text-lg font-semibold text-white">Generated Outreach</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>For:</span>
                    <span className="text-indigo-400 font-medium">{contact.name}</span>
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
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">
                    Personalization Points Used
                </p>
                <div className="flex flex-wrap gap-2">
                    {outreach.personalizationPoints.map((point, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm border border-indigo-500/20"
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
            <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Subject Line</span>
                    <CopyButton
                        onClick={() => onCopy(email.subject, 'email-subject')}
                        copied={copiedField === 'email-subject'}
                    />
                </div>
                <p className="text-white font-medium">{email.subject}</p>
            </div>

            {/* Email body */}
            <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Email Body</span>
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
            <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Connection Note (300 char limit)</span>
                    <CopyButton
                        onClick={() => onCopy(linkedin.connectionNote, 'linkedin-note')}
                        copied={copiedField === 'linkedin-note'}
                    />
                </div>
                <p className="text-gray-300 text-sm">{linkedin.connectionNote}</p>
                <p className="text-xs text-gray-500 mt-2">{linkedin.connectionNote.length}/300 characters</p>
            </div>

            {/* Follow-up message */}
            <div className="p-4 rounded-xl bg-white/5">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Follow-up Message</span>
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
            {days.map((day) => (
                <div key={day.id} className="rounded-xl bg-white/5 overflow-hidden">
                    <button
                        onClick={() => setExpandedDay(expandedDay === day.id ? null : day.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                {day.label.replace('Day ', '')}
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-white">{day.label}</p>
                                <p className="text-sm text-gray-400">{day.subtitle}</p>
                            </div>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${expandedDay === day.id ? 'rotate-90' : ''
                            }`} />
                    </button>

                    {expandedDay === day.id && (
                        <div className="px-4 pb-4 space-y-3">
                            <div className="p-3 rounded-lg bg-white/5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-gray-500">Subject</span>
                                    <CopyButton
                                        onClick={() => onCopy(day.email.subject, `${day.id}-subject`)}
                                        copied={copiedField === `${day.id}-subject`}
                                    />
                                </div>
                                <p className="text-sm text-white">{day.email.subject}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-white/5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-gray-500">Body</span>
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
                    )}
                </div>
            ))}
        </div>
    );
}
