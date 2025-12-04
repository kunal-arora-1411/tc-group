'use client';

import { Mail, Linkedin, ExternalLink, Users } from 'lucide-react';
import { Contact } from '@/lib/types';

interface ContactListProps {
    contacts: Contact[];
    selectedContact: Contact | null;
    onSelectContact: (contact: Contact) => void;
}

const departmentColors: Record<string, string> = {
    executive: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    sales: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    marketing: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    engineering: 'bg-green-500/20 text-green-400 border-green-500/30',
    operations: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    finance: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    hr: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
};

const priorityConfig: Record<string, { label: string; color: string; bg: string }> = {
    primary: { label: 'Primary', color: 'text-green-400', bg: 'bg-green-500' },
    secondary: { label: 'Secondary', color: 'text-orange-400', bg: 'bg-orange-500' },
    influencer: { label: 'Influencer', color: 'text-blue-400', bg: 'bg-blue-500' }
};

export default function ContactList({ contacts, selectedContact, onSelectContact }: ContactListProps) {
    return (
        <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-400" />
                Decision Makers
            </h3>

            <div className="space-y-3">
                {contacts.map((contact, index) => {
                    const isSelected = selectedContact?.id === contact.id;
                    const priority = priorityConfig[contact.priority];

                    return (
                        <button
                            key={contact.id}
                            onClick={() => onSelectContact(contact)}
                            className={`contact-card w-full p-4 rounded-xl text-left transition-all border ${isSelected
                                    ? 'bg-orange-500/10 border-orange-500/50 shadow-lg shadow-orange-500/10'
                                    : 'bg-white/5 border-transparent hover:border-orange-500/30'
                                }`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex items-start gap-4">
                                {/* Avatar */}
                                <div className="relative">
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-black font-bold text-lg flex-shrink-0 shadow-lg ${isSelected ? 'ring-2 ring-orange-400' : ''}`}>
                                        {contact.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${priority.bg} border-2 border-black`}></div>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`font-semibold truncate transition-colors ${isSelected ? 'text-orange-300' : 'text-white'}`}>
                                            {contact.name}
                                        </span>
                                        <span className={`text-xs ${priority.color}`}>
                                            • {priority.label}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-2.5">{contact.title}</p>

                                    <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs capitalize border ${departmentColors[contact.department] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                            }`}>
                                            {contact.department}
                                        </span>

                                        {contact.linkedin && (
                                            <a
                                                href={`https://${contact.linkedin}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 rounded-lg hover:bg-blue-500/20 transition-colors group"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Linkedin className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                                            </a>
                                        )}

                                        {contact.email && (
                                            <a
                                                href={`mailto:${contact.email}`}
                                                className="p-1.5 rounded-lg hover:bg-orange-500/20 transition-colors group"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Mail className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Selection indicator */}
                                {isSelected && (
                                    <div className="flex-shrink-0">
                                        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                                            <svg className="w-3.5 h-3.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {contacts.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    No contacts found
                </div>
            )}
        </div>
    );
}
