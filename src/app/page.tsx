'use client';

import { useState, useCallback } from 'react';
import { Zap, TrendingUp, Users, Target, Mail, BarChart3, RefreshCw, Sparkles, ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleResearch = useCallback(async (companyName: string) => {
    setSearchedCompany(companyName);
    setSelectedContact(null);

    setPipelineState({
      status: 'running',
      agents: [
        { name: 'research', status: 'pending', progress: 0 },
        { name: 'scoring', status: 'pending', progress: 0 },
        { name: 'contacts', status: 'pending', progress: 0 },
        { name: 'outreach', status: 'pending', progress: 0 }
      ]
    });

    const result = await runFullPipeline(companyName, (agents) => {
      setPipelineState(prev => ({
        ...prev,
        agents
      }));
    });

    setPipelineState(result);

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
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-black/90 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            {/* Left: Logo & Nav */}
            <div className="flex items-center gap-12">
              {/* Logo */}
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-xl">
                  <span className="text-black font-black text-2xl">TC</span>
                  <div className="absolute inset-0 rounded-xl bg-orange-500 blur-xl opacity-40"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white tracking-tight">IntentFlow</span>
                  <span className="text-xs text-orange-400 font-bold tracking-wider uppercase">AI Sales Intelligence</span>
                </div>
              </div>

              {/* Navigation */}
              {(isRunning || isComplete) && (
                <nav className="hidden lg:flex items-center gap-2">
                  <a href="#" className="px-5 py-2.5 text-base font-semibold text-white bg-orange-500/10 rounded-xl transition-colors">
                    Dashboard
                  </a>
                  <a href="#" className="px-5 py-2.5 text-base font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                    Contacts
                  </a>
                  <a href="#" className="px-5 py-2.5 text-base font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                    Outreach
                  </a>
                  <a href="#" className="px-5 py-2.5 text-base font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                    Analytics
                  </a>
                </nav>
              )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
              {isComplete && (
                <button
                  onClick={handleReset}
                  className="hidden md:flex items-center gap-2.5 px-5 py-3 text-base font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
                >
                  <RefreshCw className="w-5 h-5" />
                  New Search
                </button>
              )}

              <button className="hidden md:flex relative p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse"></span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>

              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-lg">
                <span className="text-black font-bold text-base">JD</span>
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-white/[0.08] py-4 space-y-2 animate-in">
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-white bg-orange-500/10 rounded-xl">
                <BarChart3 className="w-4 h-4" />
                Dashboard
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                <Users className="w-4 h-4" />
                Contacts
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
                <Mail className="w-4 h-4" />
                Outreach
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section - Only show when idle */}
      {pipelineState.status === 'idle' && (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8">
          {/* Enhanced Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-black"></div>

          {/* Multiple Gradient Orbs for Depth */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[15%] left-[10%] w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-[150px] animate-pulse"></div>
            <div className="absolute bottom-[15%] right-[10%] w-[600px] h-[600px] bg-orange-600/15 rounded-full blur-[180px] animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[120px]"></div>
          </div>

          <div className="relative container mx-auto max-w-6xl">
            {/* Main Glass Dialog Box */}
            <div className="relative backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl animate-in">
              {/* Subtle inner glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-orange-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>

              <div className="relative space-y-10 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.05] border border-white/[0.1] backdrop-blur-md">
                  <Sparkles className="w-4 h-4 text-orange-400 animate-pulse" />
                  <span className="text-sm text-orange-300 font-semibold tracking-wide">AI-Powered Sales Intelligence</span>
                </div>

                {/* Headline */}
                <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.1] tracking-tight">
                  <span className="gradient-text-animated inline-block mb-3">Live Intent Signals</span>
                  <br />
                  <span className="text-white inline-block mb-3">to Warm Outreach</span>
                  <br />
                  <span className="text-orange-400 inline-block">in 20 Seconds</span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  Enter any company name. Our AI agents research the account, detect buying signals,
                  score intent, and generate personalized outreach — <span className="text-orange-300 font-semibold">automatically</span>.
                </p>

                {/* Search Bar */}
                <div className="pt-4">
                  <CompanyInput onSubmit={handleResearch} isLoading={isRunning} />
                </div>

                {/* Stats Bar in Glass Boxes */}
                <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <div className="backdrop-blur-md bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-2 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all">
                    <div className="text-4xl font-black bg-gradient-to-r from-orange-400 to-orange-600 text-transparent bg-clip-text">10M+</div>
                    <div className="text-sm text-gray-400 font-medium">Companies Tracked</div>
                  </div>
                  <div className="backdrop-blur-md bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-2 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all">
                    <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-blue-600 text-transparent bg-clip-text">98%</div>
                    <div className="text-sm text-gray-400 font-medium">Intent Accuracy</div>
                  </div>
                  <div className="backdrop-blur-md bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-2 hover:bg-white/[0.05] hover:border-white/[0.12] transition-all">
                    <div className="text-4xl font-black bg-gradient-to-r from-green-400 to-green-600 text-transparent bg-clip-text">2.5x</div>
                    <div className="text-sm text-gray-400 font-medium">Higher Response Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      {(isRunning || isComplete) && (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Search Bar */}
          <div className="mb-10 animate-in">
            <CompanyInput onSubmit={handleResearch} isLoading={isRunning} />
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Main Content - Left */}
            <div className="lg:col-span-8 space-y-6">
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

            {/* Sidebar - Right */}
            <div className="lg:col-span-4 space-y-6">
              {/* Score Gauge */}
              {score && (
                <div className="animate-in-right">
                  <ScoreGauge score={score} />
                </div>
              )}

              {/* Research Summary */}
              {research && (
                <div className="glass-card p-6 animate-in-right" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                      Research Summary
                    </h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {research.summary}
                  </p>
                  <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                      {research.researchDuration}s
                    </span>
                    <span className="text-gray-600">{new Date(research.researchedAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              )}

              {/* Loading placeholders */}
              {isRunning && !score && (
                <>
                  <div className="glass-card p-6 animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                      <div className="skeleton h-6 w-32" />
                    </div>
                    <div className="w-44 h-44 mx-auto mb-6">
                      <div className="skeleton w-full h-full rounded-full" />
                    </div>
                    <div className="skeleton h-10 w-48 mx-auto mb-6 rounded-full" />
                    <div className="space-y-4">
                      <div className="skeleton h-3 w-full rounded-full" />
                      <div className="skeleton h-3 w-full rounded-full" />
                      <div className="skeleton h-3 w-full rounded-full" />
                      <div className="skeleton h-3 w-full rounded-full" />
                    </div>
                  </div>
                  <div className="glass-card p-6 animate-pulse">
                    <div className="skeleton h-6 w-40 mb-4" />
                    <div className="skeleton h-24 w-full rounded-xl" />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Insights & Analytics Section - Enhanced Glass Design */}
          {isComplete && research && (
            <div className="mt-8 lg:mt-10">
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-black text-white mb-2 flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-black" />
                  </div>
                  Analytics & Insights
                </h2>
                <p className="text-gray-400 text-sm">Real-time intelligence and actionable metrics</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Intent Trend - Enhanced Glass Card */}
                <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 shadow-2xl hover:bg-white/[0.05] hover:border-white/[0.12] transition-all group">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  <h3 className="relative text-base font-bold text-white mb-5 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-orange-400" />
                    </div>
                    Intent Trend
                  </h3>
                  <div className="relative space-y-4">
                    {[
                      { label: 'Last 7 days', value: 85, change: '+12%' },
                      { label: 'Last 30 days', value: 72, change: '+8%' },
                      { label: 'Last 90 days', value: 58, change: '+24%' }
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400 font-medium">{item.label}</span>
                          <span className="text-green-400 text-xs font-bold backdrop-blur-sm bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">{item.change}</span>
                        </div>
                        <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden backdrop-blur-sm">
                          <div
                            className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-1000"
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity - Enhanced Glass Card */}
                <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 shadow-2xl hover:bg-white/[0.05] hover:border-white/[0.12] transition-all group">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  <h3 className="relative text-base font-bold text-white mb-5 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-blue-400" />
                    </div>
                    Recent Activity
                  </h3>
                  <div className="relative space-y-3">
                    {[
                      { event: 'Website visit', time: '2 hours ago', icon: '🌐', color: 'from-blue-500/10 to-blue-600/10' },
                      { event: 'Job posting', time: '1 day ago', icon: '💼', color: 'from-orange-500/10 to-orange-600/10' },
                      { event: 'Tech stack update', time: '3 days ago', icon: '⚙️', color: 'from-green-500/10 to-green-600/10' },
                      { event: 'Funding news', time: '1 week ago', icon: '💰', color: 'from-yellow-500/10 to-yellow-600/10' }
                    ].map((activity, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl backdrop-blur-sm bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all cursor-pointer">
                        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${activity.color} flex items-center justify-center text-base flex-shrink-0`}>
                          {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white font-medium truncate">{activity.event}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Actions - Enhanced Glass Card */}
                <div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 shadow-2xl hover:bg-white/[0.05] hover:border-white/[0.12] transition-all group">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  <h3 className="relative text-base font-bold text-white mb-5 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <Target className="w-4 h-4 text-green-400" />
                    </div>
                    Next Steps
                  </h3>
                  <div className="relative space-y-2.5">
                    {[
                      { action: 'Send personalized email', priority: 'High' },
                      { action: 'Connect on LinkedIn', priority: 'High' },
                      { action: 'Schedule discovery call', priority: 'Medium' },
                      { action: 'Add to nurture sequence', priority: 'Low' }
                    ].map((step, i) => (
                      <label key={i} className="flex items-center gap-3 p-3 rounded-xl backdrop-blur-sm bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all cursor-pointer group/item">
                        <input type="checkbox" className="w-4 h-4 rounded border-gray-600 text-orange-500 focus:ring-orange-500/50 focus:ring-2" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-300 group-hover/item:text-white transition-colors truncate">{step.action}</p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold flex-shrink-0 backdrop-blur-sm ${
                          step.priority === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                          step.priority === 'Medium' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                          'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}>
                          {step.priority}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Outreach Section - Full Width */}
          {outreach && selectedContact && (
            <div className="mt-6 animate-in" style={{ animationDelay: '0.3s' }}>
              <OutreachTabs outreach={outreach} contact={selectedContact} />
            </div>
          )}
        </main>
      )}

      {/* Stats Bar - Enhanced Glassmorphism */}
      {pipelineState.status === 'idle' && (
        <section className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.08] backdrop-blur-2xl bg-black/80">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '100+', label: 'Data Sources', gradient: 'from-orange-400 to-orange-600' },
                { value: '70+', label: 'Intent Signals', gradient: 'from-blue-400 to-blue-600' },
                { value: '20s', label: 'Avg. Research Time', gradient: 'from-green-400 to-green-600' },
                { value: '4x', label: 'Reply Rate Lift', gradient: 'from-purple-400 to-purple-600' }
              ].map((stat, i) => (
                <div key={i} className="group cursor-default text-center backdrop-blur-sm bg-white/[0.02] rounded-2xl p-4 border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all">
                  <p className={`text-3xl md:text-4xl font-black bg-gradient-to-r ${stat.gradient} text-transparent bg-clip-text group-hover:scale-105 transition-transform mb-2`}>{stat.value}</p>
                  <p className="text-gray-400 text-xs md:text-sm font-semibold tracking-wide uppercase">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
