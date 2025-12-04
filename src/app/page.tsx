'use client';

import { useState, useCallback } from 'react';
import { Zap, TrendingUp, Users, Target, Mail, BarChart3, RefreshCw } from 'lucide-react';
import CompanyInput from './components/dashboard/CompanyInput';
import CompanyCard from './components/dashboard/CompanyCard';
import SignalBadges from './components/dashboard/SignalBadges';
import ScoreGauge from './components/dashboard/ScoreGauge';
import AgentWorkflow from './components/agents/AgentWorkflow';
import ContactList from './components/dashboard/ContactList';
import OutreachTabs from './components/outreach/OutreachTabs';
import { PipelineState, AgentStatus, Contact } from '@/lib/types';
import { runFullPipeline } from '@/lib/agents/orchestrator';

export default function Dashboard() {
  const [pipelineState, setPipelineState] = useState<PipelineState>({
    status: 'idle',
    agents: [
      { name: 'research', status: 'pending', progress: 0 },
      { name: 'scoring', status: 'pending', progress: 0 },
      { name: 'contacts', status: 'pending', progress: 0 },
      { name: 'outreach', status: 'pending', progress: 0 }
    ]
  });
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchedCompany, setSearchedCompany] = useState<string>('');

  const handleResearch = useCallback(async (companyName: string) => {
    setSearchedCompany(companyName);
    setSelectedContact(null);

    // Reset pipeline state
    setPipelineState({
      status: 'running',
      agents: [
        { name: 'research', status: 'pending', progress: 0 },
        { name: 'scoring', status: 'pending', progress: 0 },
        { name: 'contacts', status: 'pending', progress: 0 },
        { name: 'outreach', status: 'pending', progress: 0 }
      ]
    });

    // Run the pipeline with progress updates
    const result = await runFullPipeline(companyName, (agents) => {
      setPipelineState(prev => ({
        ...prev,
        agents
      }));
    });

    setPipelineState(result);

    // Auto-select first contact
    if (result.research?.contacts.length) {
      setSelectedContact(result.research.contacts[0]);
    }
  }, []);

  const handleReset = () => {
    setPipelineState({
      status: 'idle',
      agents: [
        { name: 'research', status: 'pending', progress: 0 },
        { name: 'scoring', status: 'pending', progress: 0 },
        { name: 'contacts', status: 'pending', progress: 0 },
        { name: 'outreach', status: 'pending', progress: 0 }
      ]
    });
    setSelectedContact(null);
    setSearchedCompany('');
  };

  const isRunning = pipelineState.status === 'running';
  const isComplete = pipelineState.status === 'completed';
  const { research, score, outreach } = pipelineState;

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">IntentFlow</h1>
                <p className="text-xs text-gray-400">AI-Powered Outreach Intelligence</p>
              </div>
            </div>

            {isComplete && (
              <button
                onClick={handleReset}
                className="btn-secondary flex items-center gap-2 py-2 px-4 text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                New Research
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section - Only show when idle */}
      {pipelineState.status === 'idle' && (
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text">Live Intent Signals</span>
              <br />
              <span className="text-white">to Warm Outreach in 20 Seconds</span>
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
              Enter any company name. Our AI agents will research the account, detect buying signals,
              score intent, and generate personalized outreach — automatically.
            </p>

            <CompanyInput onSubmit={handleResearch} isLoading={isRunning} />

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-10">
              {[
                { icon: TrendingUp, label: '70+ Intent Signals' },
                { icon: Users, label: 'Decision Maker ID' },
                { icon: Target, label: 'AI Scoring' },
                { icon: Mail, label: 'Personalized Outreach' },
                { icon: BarChart3, label: 'CRM Sync Ready' }
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300"
                >
                  <feature.icon className="w-4 h-4 text-indigo-400" />
                  {feature.label}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      {(isRunning || isComplete) && (
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Search bar when running or complete */}
          <div className="mb-8">
            <CompanyInput onSubmit={handleResearch} isLoading={isRunning} />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Agent Workflow - Always visible when running */}
              {isRunning && (
                <AgentWorkflow agents={pipelineState.agents} isRunning={isRunning} />
              )}

              {/* Company Card */}
              {research && (
                <CompanyCard company={research.company} />
              )}

              {/* Intent Signals */}
              {research && research.signals.length > 0 && (
                <SignalBadges signals={research.signals} />
              )}

              {/* Contacts */}
              {research && research.contacts.length > 0 && (
                <ContactList
                  contacts={research.contacts}
                  selectedContact={selectedContact}
                  onSelectContact={setSelectedContact}
                />
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Score Gauge */}
              {score && (
                <ScoreGauge score={score} />
              )}

              {/* Research Summary */}
              {research && (
                <div className="glass-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Research Summary</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {research.summary}
                  </p>
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
                    <span>Research completed in {research.researchDuration}s</span>
                    <span>{new Date(research.researchedAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              )}

              {/* Loading placeholders */}
              {isRunning && !score && (
                <>
                  <div className="glass-card p-6">
                    <div className="skeleton h-40 w-full mb-4" />
                    <div className="skeleton h-4 w-3/4 mb-2" />
                    <div className="skeleton h-4 w-1/2" />
                  </div>
                  <div className="glass-card p-6">
                    <div className="skeleton h-4 w-1/3 mb-4" />
                    <div className="skeleton h-20 w-full" />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Outreach Section - Full Width */}
          {outreach && selectedContact && (
            <div className="mt-6">
              <OutreachTabs outreach={outreach} contact={selectedContact} />
            </div>
          )}
        </main>
      )}

      {/* Stats bar at bottom */}
      {pipelineState.status === 'idle' && (
        <section className="fixed bottom-0 left-0 right-0 border-t border-white/10 bg-[#0a0a0f]/80 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="text-center">
                <p className="text-2xl font-bold gradient-text">100+</p>
                <p className="text-gray-500">Data Sources</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-bold gradient-text">70+</p>
                <p className="text-gray-500">Intent Signals</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-bold gradient-text">20s</p>
                <p className="text-gray-500">Research Time</p>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <p className="text-2xl font-bold gradient-text">4x</p>
                <p className="text-gray-500">Reply Rate Lift</p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
