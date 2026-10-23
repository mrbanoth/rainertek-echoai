export type ProjectId = 'HRMS' | 'QMS' | 'LIMS' | 'GENERAL' | string;

export interface EnterpriseProject {
  id: ProjectId;
  name: string;
  code: string;
  description: string;
  agentCount: number;
  documentCount: number;
  connectedMinutesThisMonth: number;
  status: 'active' | 'maintenance' | 'draft';
  complianceLevel: string;
}

export type AgentStatus = 'active' | 'inactive' | 'training' | 'archived';

export interface PromptVersion {
  version: string;
  savedAt: string;
  savedBy: string;
  notes: string;
  systemPrompt: {
    identity: string;
    role: string;
    scope: string;
    tone: string;
    instructions: string;
    restrictions: string;
    escalation: string;
  };
}

export interface AIAgentConfig {
  id: string;
  name: string;
  description: string;
  projectId: ProjectId;
  status: AgentStatus;
  supportedLanguages: string[];
  voiceModel: string;
  speakingStyle: string;
  speakingRate: number;
  pitch: number;
  greeting: string;
  systemPrompt: {
    identity: string;
    role: string;
    scope: string;
    tone: string;
    instructions: string;
    restrictions: string;
    escalation: string;
  };
  promptVersions: PromptVersion[];
  approvedKnowledgeSources: string[];
  permittedActions: string[];
  identityVerificationRequired: boolean;
  fallbackResponse: string;
  humanEscalationRules: {
    enabled: boolean;
    triggerKeywords: string[];
    maxFailedAttempts: number;
    destinationNumber: string;
  };
  callBehavior: {
    maxDurationSeconds: number;
    silenceTimeoutSeconds: number;
    recordCall: boolean;
  };
  assignedPhoneNumber?: string;
  totalCalls: number;
  successRate: number;
  updatedAt: string;
}

export type DocumentStatus = 'uploaded' | 'processing' | 'indexed' | 'failed' | 'archived';
export type DocumentFormat = 'pdf' | 'markdown' | 'txt' | 'docx';

export interface KnowledgeDoc {
  id: string;
  title: string;
  fileName: string;
  projectId: ProjectId;
  category: 'policy' | 'sop' | 'specifications' | 'directory' | 'faq';
  version: string;
  format: DocumentFormat;
  sizeBytes: number;
  chunkCount: number;
  indexingStatus: DocumentStatus;
  lastUpdated: string;
  uploader: string;
  contentSnippet: string;
  rawText?: string;
  errorMessage?: string;
}

export type CallDirection = 'inbound' | 'outbound';
export type CallOutcome = 'completed' | 'escalated' | 'failed' | 'missed' | 'dropped';

export interface CallTurn {
  id: string;
  speaker: 'agent' | 'caller' | 'human_supervisor';
  text: string;
  timestamp: string;
  sentiment?: 'positive' | 'neutral' | 'frustrated';
}

export interface CallEvent {
  time: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  label: string;
  detail?: string;
}

export interface CallSessionRecord {
  id: string;
  startTime: string;
  direction: CallDirection;
  projectId: ProjectId;
  agentId: string;
  agentName: string;
  callerNumber: string; // Masked e.g. +91 7965***286
  durationSeconds: number;
  status: 'connected' | 'completed' | 'failed' | 'missed';
  outcome: CallOutcome;
  escalationStatus: 'none' | 'escalated_to_supervisor' | 'ticket_created';
  estimatedCost: number;
  actualProviderCost?: number;
  intent: string;
  transcript: CallTurn[];
  citedKnowledgeSources: string[];
  lifecycleEvents: CallEvent[];
  failureReason?: string;
  costBreakdown: {
    stt: number;
    llm: number;
    tts: number;
    telephony: number;
  };
}

export interface CampaignRecord {
  id: string;
  name: string;
  projectId: ProjectId;
  agentId: string;
  status: 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'cancelled';
  scheduledDate: string;
  totalContacts: number;
  dialedCount: number;
  answeredCount: number;
  successfulCount: number;
  failedCount: number;
  consentVerified: boolean;
  quietHoursEnforced: boolean;
  retryLimit: number;
  approvedScript: string;
  createdAt: string;
}

export interface IntegrationCard {
  id: string;
  name: string;
  category: 'voice' | 'hrms' | 'qms' | 'lims' | 'telephony' | 'database';
  status: 'connected' | 'degraded' | 'disconnected';
  capabilities: string[];
  lastSuccessfulOperation: string;
  safeStatusMessage: string;
  actionableError?: string;
  endpointPreview: string;
}

export type UserRole = 'Administrator' | 'Operator' | 'Read-only viewer';

export interface EnterpriseTeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  projectScopes: string[];
  mfaEnabled: boolean;
  lastActive: string;
}

export interface AuditLogRecord {
  id: string;
  actor: string;
  role: string;
  action: string;
  timestamp: string;
  projectId: ProjectId;
  targetResource: string;
  result: 'SUCCESS' | 'WARNING' | 'FAILED';
  details: string;
}

export interface DashboardSummaryMetrics {
  totalCalls: number;
  inboundCalls: number;
  outboundCalls: number;
  totalConnectedMinutes: number;
  completedCalls: number;
  failedCalls: number;
  missedCalls: number;
  escalationRate: number; // percentage
  avgCallDurationSeconds: number;
  estimatedAiCost: number;
  estimatedTelephonyCost: number;
  actualProviderCostMonthToDate: number;
}
