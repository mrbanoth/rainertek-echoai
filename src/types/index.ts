export type ProjectId = 'HRMS' | 'QMS' | 'LIMS' | string;

export interface Project {
  id: ProjectId;
  name: string;
  code: string;
  description: string;
  agentCount: number;
  documentCount: number;
  callMinutesThisMonth: number;
  budgetLimitMonthly: number;
  status: 'active' | 'maintenance' | 'draft';
  lastActivity: string;
  complianceClassification: string;
}

export type AgentStatus = 'active' | 'inactive' | 'training' | 'error';
export type CallDirection = 'inbound' | 'outbound' | 'bidirectional';

export interface AIAgent {
  id: string;
  name: string;
  projectId: ProjectId;
  status: AgentStatus;
  direction: CallDirection;
  voiceModel: string;
  voiceGender: 'neutral' | 'female' | 'male';
  speakingRate: number; // 0.8 - 1.2
  pitch: number; // 0.9 - 1.1
  languages: string[];
  greeting: string;
  systemPrompt: string;
  approvedKnowledgeSources: string[];
  escalationSettings: {
    enabled: boolean;
    escalateOnSentimentDrop: boolean;
    escalateOnKeyword: string[];
    repeatErrorThreshold: number;
    destinationNumber: string;
  };
  phoneRoutingNumber?: string;
  totalCallsHandled: number;
  successRate: number;
  updatedAt: string;
}

export type DocumentFormat = 'pdf' | 'markdown' | 'txt' | 'docx';
export type IndexingStatus = 'indexed' | 'indexing' | 'failed' | 'pending';

export interface KnowledgeDocument {
  id: string;
  title: string;
  fileName: string;
  projectId: ProjectId;
  category: 'policy' | 'sop' | 'specifications' | 'directory' | 'faq';
  version: string;
  format: DocumentFormat;
  sizeBytes: number;
  chunkCount: number;
  indexingStatus: IndexingStatus;
  lastUpdated: string;
  uploader: string;
  errorDetails?: string;
  summarySnippet: string;
}

export type CallOutcome = 'completed' | 'escalated' | 'failed' | 'dropped';

export interface CallTurn {
  id: string;
  speaker: 'agent' | 'caller' | 'supervisor';
  text: string;
  timestamp: string;
  sentiment?: 'positive' | 'neutral' | 'frustrated';
}

export interface CallTimelineEvent {
  time: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  label: string;
  detail?: string;
}

export interface CallRecord {
  id: string;
  projectId: ProjectId;
  agentId: string;
  agentName: string;
  direction: 'inbound' | 'outbound';
  startTime: string;
  durationSeconds: number;
  outcome: CallOutcome;
  estimatedCost: number;
  customerIdentifier: string; // Masked e.g. +1 (***) ***-4829
  callerIntent: string;
  transcript: CallTurn[];
  citedDocuments: string[];
  events: CallTimelineEvent[];
  errorReason?: string;
  providerCostEstimate: {
    stt: number;
    llm: number;
    tts: number;
    telephony: number;
  };
}

export interface Campaign {
  id: string;
  name: string;
  projectId: ProjectId;
  agentId: string;
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'paused';
  scheduledDate: string;
  totalContacts: number;
  dialedCount: number;
  answeredCount: number;
  successfulCount: number;
  failedCount: number;
  consentVerified: boolean;
  retryLimit: number;
  suppressionListActive: boolean;
  complianceNotice: string;
  createdAt: string;
}

export interface IntegrationConnector {
  id: string;
  name: string;
  category: 'hrms' | 'qms' | 'lims' | 'voice' | 'telephony' | 'database';
  status: 'connected' | 'configured' | 'disconnected' | 'error';
  lastSync: string;
  description: string;
  version: string;
  authType: 'oauth2' | 'apiKey' | 'mtls' | 'webhook';
  latencyMs: number;
}

export type UserRole = 'Admin' | 'Operator' | 'Read-Only';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  projectAccess: string[];
  mfaEnabled: boolean;
  lastActive: string;
  avatar?: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  projectId: ProjectId;
  resource: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
  ipAddress: string;
  diffSummary: string;
}

export interface DashboardMetrics {
  totalCalls: number;
  totalCallsChange: number; // percentage
  inboundCalls: number;
  outboundCalls: number;
  totalMinutes: number;
  successfulCalls: number;
  failedCalls: number;
  escalationRate: number; // e.g. 4.8%
  estimatedUsageCost: number;
  actualInvoicedCostMonthToDate: number;
}
