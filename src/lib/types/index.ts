// Core TypeScript interfaces for the AI-Powered Outreach Platform

export interface Company {
  name: string;
  domain: string;
  industry: string;
  size: 'startup' | 'smb' | 'midmarket' | 'enterprise';
  description: string;
  painPoints: string[];
  opportunities: string[];
  techStack: string[];
  founded?: string;
  employees?: string;
  revenue?: string;
  location?: string;
}

export interface IntentSignal {
  id: string;
  type: 'funding' | 'hiring' | 'techChange' | 'leadership' | 'expansion' | 'competitorChurn' | 'websiteVisit' | 'g2Activity' | 'socialMention';
  strength: 'high' | 'medium' | 'low';
  description: string;
  source: string;
  detectedAt: string;
  icon?: string;
}

export interface Contact {
  id: string;
  name: string;
  title: string;
  department: 'sales' | 'marketing' | 'engineering' | 'operations' | 'executive' | 'finance' | 'hr';
  linkedin?: string;
  email?: string;
  priority: 'primary' | 'secondary' | 'influencer';
  avatar?: string;
}

export interface ResearchResult {
  company: Company;
  signals: IntentSignal[];
  contacts: Contact[];
  summary: string;
  researchedAt: string;
  researchDuration: number; // in seconds
}

export interface ScoreBreakdown {
  icpFit: number;          // 0-25
  timingSignals: number;   // 0-25
  budgetIndicators: number; // 0-25
  engagementLikelihood: number; // 0-25
}

export interface ScoreResult {
  overall: number;           // 0-100
  breakdown: ScoreBreakdown;
  reasoning: string;
  recommendation: 'hot' | 'warm' | 'nurture' | 'disqualify';
  confidenceLevel: 'high' | 'medium' | 'low';
}

export interface EmailContent {
  subject: string;
  body: string;
  previewText?: string;
}

export interface LinkedInContent {
  connectionNote: string;
  followUpMessage: string;
}

export interface SequenceContent {
  day1: EmailContent;
  day3: EmailContent;
  day7: EmailContent;
}

export interface OutreachContent {
  email: EmailContent;
  linkedin: LinkedInContent;
  sequence: SequenceContent;
  personalizationPoints: string[];
  generatedAt: string;
}

export interface AgentStatus {
  name: 'research' | 'scoring' | 'contacts' | 'outreach';
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number; // 0-100
  message?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface PipelineState {
  status: 'idle' | 'running' | 'completed' | 'error';
  agents: AgentStatus[];
  research?: ResearchResult;
  score?: ScoreResult;
  outreach?: OutreachContent;
  error?: string;
}

// API Request/Response types
export interface ResearchRequest {
  companyName: string;
  domain?: string;
}

export interface ScoreRequest {
  research: ResearchResult;
}

export interface OutreachRequest {
  research: ResearchResult;
  score: ScoreResult;
  targetContact: Contact;
}
