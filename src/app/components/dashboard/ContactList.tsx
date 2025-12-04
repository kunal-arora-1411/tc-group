'use client';

import { User, Mail, Linkedin, ExternalLink } from 'lucide-react';
import { Contact } from '@/lib/types';

interface ContactListProps {
    contacts: Contact[];
    selectedContact: Contact | null;
    onSelectContact: (contact: Contact) => void;
}

const departmentColors: Record<string, string> = {
    executive: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    sales: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    marketing: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    engineering: 'bg-green-500/20 text-green-400 border-green-500/30',
    operations: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    finance: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    hr: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
};

const priorityLabels: Record<string, { label: string; color: string }> = {
    primary: { label: 'Primary', color: 'text-green-400' },
    secondary: { label: 'Secondary', color: 'text-yellow-400' },
    influencer: { label: 'Influencer', color: 'text-blue-400' }
};

export default function ContactList({ contacts, selectedContact, onSelectContact }: ContactListProps) {
    return (
        <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Decision Makers</h3>

            <div className="space-y-3">
                {contacts.map((contact) => {
                    const isSelected = selectedContact?.id === contact.id;
                    const priority = priorityLabels[contact.priority];

                    return (
                        <button
                            key={contact.id}
                            onClick={() => onSelectContact(contact)}
                            className={`w-full p-4 rounded-xl text-left transition-all ${isSelected
                                    ? 'bg-indigo-500/20 ring-2 ring-indigo-500/50'
                                    : 'bg-white/5 hover:bg-white/10'
                                }`}
                        >
                            <div className="flex items-start gap-4">
                                {/* Avatar */}
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                                    {contact.name.split(' ').map(n => n[0]).join('')}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-white truncate">{contact.name}</span>
                                        <span className={`text-xs ${priority.color}`}>
                                            • {priority.label}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-2">{contact.title}</p>

                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 rounded text-xs capitalize border ${departmentColors[contact.department] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                            }`}>
                                            {contact.department}
                                        </span>

                                        {contact.linkedin && (
                                            <a
                                                href={`https://${contact.linkedin}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1 rounded hover:bg-white/10 transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Linkedin className="w-4 h-4 text-blue-400" />
                                            </a>
                                        )}

                                        {contact.email && (
                                            <a
                                                href={`mailto:${contact.email}`}
                                                className="p-1 rounded hover:bg-white/10 transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <Mail className="w-4 h-4 text-gray-400" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {contacts.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                    No contacts found
                </div>
            )}
        </div>
    );
}
