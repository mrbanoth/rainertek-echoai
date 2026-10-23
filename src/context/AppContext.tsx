'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  EnterpriseProject,
  AIAgentConfig,
  KnowledgeDoc,
  CallSessionRecord,
  CampaignRecord,
  IntegrationCard,
  EnterpriseTeamMember,
  AuditLogRecord,
  DashboardSummaryMetrics,
  UserRole,
  ProjectId,
  PromptVersion,
} from '@/types';
import { AssistantVisualState } from '@/components/live/ThreeAssistant';

interface AppContextType {
  // Global Navigation & Filters
  selectedProject: ProjectId;
  setSelectedProject: (p: ProjectId) => void;
  selectedAgentId: string;
  setSelectedAgentId: (a: string) => void;
  userRole: UserRole;
  setUserRole: (r: UserRole) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;

  // Domain Entities
  projects: EnterpriseProject[];
  agents: AIAgentConfig[];
  updateAgent: (id: string, updates: Partial<AIAgentConfig>) => void;
  createAgent: (agent: Partial<AIAgentConfig>) => AIAgentConfig;
  restorePromptVersion: (agentId: string, version: PromptVersion) => void;

  documents: KnowledgeDoc[];
  addDocument: (doc: Omit<KnowledgeDoc, 'id' | 'lastUpdated' | 'chunkCount' | 'indexingStatus'>) => void;
  updateDocument: (id: string, updates: Partial<KnowledgeDoc>) => void;
  reindexDocument: (id: string) => void;
  deleteDocument: (id: string) => void;

  calls: CallSessionRecord[];
  addCallRecord: (call: CallSessionRecord) => void;

  campaigns: CampaignRecord[];
  createCampaign: (camp: Omit<CampaignRecord, 'id' | 'dialedCount' | 'answeredCount' | 'successfulCount' | 'failedCount' | 'createdAt'>) => void;
  toggleCampaignStatus: (id: string, newStatus: CampaignRecord['status']) => void;

  integrations: IntegrationCard[];
  team: EnterpriseTeamMember[];
  auditLogs: AuditLogRecord[];
  metrics: DashboardSummaryMetrics;

  // Live Voice Workspace State
  liveCallState: {
    status: 'idle' | 'connecting' | 'connected' | 'completed' | 'failed';
    visual3DState: AssistantVisualState;
    agentId: string;
    projectId: ProjectId;
    callerNumber: string;
    durationSeconds: number;
    isMuted: boolean;
    transcript: Array<{ speaker: 'agent' | 'caller' | 'human_supervisor'; text: string; timestamp: string }>;
    events: Array<{ time: string; type: 'info' | 'success' | 'warning' | 'alert'; label: string }>;
    activeSources: string[];
    isEscalated: boolean;
  };
  startLiveCall: (agentId?: string) => void;
  endLiveCall: () => void;
  toggleLiveMute: () => void;
  escalateToHuman: () => void;
  sendLiveUserMessage: (msg: string) => void;
}

const INITIAL_PROJECTS: EnterpriseProject[] = [
  {
    id: 'HRMS',
    name: 'Human Resources Management System',
    code: 'HRMS',
    description: 'Internal voice concierge for employee leave balances, health benefits, onboarding, and payroll policies.',
    agentCount: 2,
    documentCount: 6,
    connectedMinutesThisMonth: 1240,
    status: 'active',
    complianceLevel: 'Confidential Internal (PII)',
  },
  {
    id: 'QMS',
    name: 'Quality Management System',
    code: 'QMS',
    description: 'ISO 9001 / ISO 13485 cleanroom deviation triage, CAPA corrective actions, and quality audits hotline.',
    agentCount: 1,
    documentCount: 8,
    connectedMinutesThisMonth: 940,
    status: 'active',
    complianceLevel: 'Regulatory Restricted (GxP)',
  },
  {
    id: 'LIMS',
    name: 'Laboratory Information Management System',
    code: 'LIMS',
    description: 'Chain of custody verification, specimen freezer temperature logs, and analytical assay status inquiries.',
    agentCount: 1,
    documentCount: 5,
    connectedMinutesThisMonth: 780,
    status: 'active',
    complianceLevel: 'Laboratory Sensitive (HIPAA Adjacent)',
  },
];

const INITIAL_AGENTS: AIAgentConfig[] = [
  {
    id: 'agent-hrms-concierge',
    name: 'Echo HR Concierge',
    description: 'Handles PTO inquiries, parental leave benefits, and internal handbook questions.',
    projectId: 'HRMS',
    status: 'active',
    supportedLanguages: ['English (India)', 'Hindi (IN)'],
    voiceModel: 'Sarvam Bulbul Core (en-IN)',
    speakingStyle: 'Warm, professional, conversational',
    speakingRate: 1.0,
    pitch: 1.0,
    greeting: 'Hello, thank you for calling RainerTek HR Services. How may I assist you with company policies today?',
    systemPrompt: {
      identity: 'You are RainerTek EchoAI HR Concierge, an internal voice assistant for employees.',
      role: 'Answer questions regarding paid time off, health benefits, leave policies, and remote work stipends.',
      scope: 'Restricted strictly to approved RainerTek HR policy documents and handbooks.',
      tone: 'Empathetic, clear, professional, and discreet.',
      instructions: 'Always verify employee ID badge before disclosing individual PTO balances. Be concise.',
      restrictions: 'Never disclose personal salary details or confidential disciplinary records over voice.',
      escalation: 'If caller mentions workplace grievances or harassment, transfer immediately to HR Business Partner.',
    },
    promptVersions: [
      {
        version: 'v1.2 (Active)',
        savedAt: '2026-10-22 14:30',
        savedBy: 'sandeepnaikb0@gmail.com',
        notes: 'Added parental leave clarification and PTO carryover cap.',
        systemPrompt: {
          identity: 'You are RainerTek EchoAI HR Concierge, an internal voice assistant for employees.',
          role: 'Answer questions regarding paid time off, health benefits, leave policies, and remote work stipends.',
          scope: 'Restricted strictly to approved RainerTek HR policy documents and handbooks.',
          tone: 'Empathetic, clear, professional, and discreet.',
          instructions: 'Always verify employee ID badge before disclosing individual PTO balances. Be concise.',
          restrictions: 'Never disclose personal salary details or confidential disciplinary records over voice.',
          escalation: 'If caller mentions workplace grievances or harassment, transfer immediately to HR Business Partner.',
        },
      },
      {
        version: 'v1.1',
        savedAt: '2026-10-15 09:15',
        savedBy: 'sandeepnaikb0@gmail.com',
        notes: 'Initial production prompt baseline.',
        systemPrompt: {
          identity: 'You are RainerTek EchoAI HR assistant.',
          role: 'Answer standard HR policy questions.',
          scope: 'HR handbooks only.',
          tone: 'Formal.',
          instructions: 'Answer employee queries based on approved documents.',
          restrictions: 'No performance reviews.',
          escalation: 'Transfer to HR manager if confused.',
        },
      },
    ],
    approvedKnowledgeSources: ['doc-hrms-01', 'doc-hrms-02'],
    permittedActions: ['Lookup PTO Balance', 'Verify Health Coverage Tier', 'Send Enrollment Email'],
    identityVerificationRequired: true,
    fallbackResponse: 'I cannot verify that in our approved HR documents. I will connect you to our HR representative.',
    humanEscalationRules: {
      enabled: true,
      triggerKeywords: ['harassment', 'grievance', 'speak to representative', 'lawyer', 'human'],
      maxFailedAttempts: 2,
      destinationNumber: '+91 80 4718 9010',
    },
    callBehavior: {
      maxDurationSeconds: 600,
      silenceTimeoutSeconds: 8,
      recordCall: true,
    },
    assignedPhoneNumber: '+917965481286',
    totalCalls: 1420,
    successRate: 95.2,
    updatedAt: '2026-10-22T14:30:00Z',
  },
  {
    id: 'agent-qms-auditor',
    name: 'Echo Quality Auditor',
    description: 'Assists cleanroom and manufacturing teams with deviation reporting and ISO standards.',
    projectId: 'QMS',
    status: 'active',
    supportedLanguages: ['English (US)'],
    voiceModel: 'Sarvam Turbo Fast (en-IN)',
    speakingStyle: 'Precise, factual, procedural',
    speakingRate: 1.05,
    pitch: 0.98,
    greeting: 'RainerTek Quality Management Automated Hotline. State your deviation ID or standard operating procedure.',
    systemPrompt: {
      identity: 'You are RainerTek EchoAI Quality Auditor.',
      role: 'Assist operators with SOP-802 deviation triage and ISO 13485 audit readiness checkpoints.',
      scope: 'Standard Operating Procedures, CAPA guidelines, and equipment calibration manuals.',
      tone: 'Crisp, disciplined, strictly procedural.',
      instructions: 'Categorize excursions immediately. Cite specific SOP section numbers in every answer.',
      restrictions: 'Do not authorize batch release; release authority is reserved for QA Manager.',
      escalation: 'Critical temperature excursions over 24C in Grade B cleanroom require instant supervisor escalation.',
    },
    promptVersions: [],
    approvedKnowledgeSources: ['doc-qms-01', 'doc-qms-02'],
    permittedActions: ['File Preliminary Deviation Notice', 'Check SOP Number', 'Lookup Calibration Date'],
    identityVerificationRequired: true,
    fallbackResponse: 'This quality procedure is not indexed in approved QMS documents. Handoff to QA on-call officer.',
    humanEscalationRules: {
      enabled: true,
      triggerKeywords: ['critical deviation', 'temperature spike', 'contamination', 'supervisor'],
      maxFailedAttempts: 2,
      destinationNumber: '+91 80 4718 9020',
    },
    callBehavior: {
      maxDurationSeconds: 900,
      silenceTimeoutSeconds: 10,
      recordCall: true,
    },
    assignedPhoneNumber: '+917965481286',
    totalCalls: 890,
    successRate: 92.4,
    updatedAt: '2026-10-23T08:00:00Z',
  },
  {
    id: 'agent-lims-tracker',
    name: 'Echo Lab Coordinator',
    description: 'Tracks specimen barcode chains of custody and HPLC assay incubation status.',
    projectId: 'LIMS',
    status: 'active',
    supportedLanguages: ['English (US)'],
    voiceModel: 'Sarvam Bulbul Core (en-IN)',
    speakingStyle: 'Objective, calm, analytical',
    speakingRate: 1.0,
    pitch: 1.0,
    greeting: 'Welcome to RainerTek LIMS Telemetry and Sample Tracker. Please provide the 9-digit barcode number.',
    systemPrompt: {
      identity: 'You are RainerTek EchoAI Laboratory Coordinator.',
      role: 'Report specimen status, freezer vault temperatures, and analytical assay completion timelines.',
      scope: 'LIMS database records and laboratory safety manuals.',
      tone: 'Analytical and unambiguous.',
      instructions: 'Confirm specimen seal integrity and temperature logger readings before confirming receipt.',
      restrictions: 'Never alter chain of custody records via voice.',
      escalation: 'Specimen seal breaches require immediate lab director notification.',
    },
    promptVersions: [],
    approvedKnowledgeSources: ['doc-lims-01'],
    permittedActions: ['Query Assay Stage', 'Check Freezer Temperature', 'Log Pickup Receipt'],
    identityVerificationRequired: true,
    fallbackResponse: 'Specimen barcode not located in current laboratory pipeline. Transferring to bench supervisor.',
    humanEscalationRules: {
      enabled: true,
      triggerKeywords: ['compromised seal', 'thawed sample', 'director'],
      maxFailedAttempts: 2,
      destinationNumber: '+91 80 4718 9030',
    },
    callBehavior: {
      maxDurationSeconds: 400,
      silenceTimeoutSeconds: 6,
      recordCall: true,
    },
    assignedPhoneNumber: '+917965481286',
    totalCalls: 620,
    successRate: 96.1,
    updatedAt: '2026-10-21T11:00:00Z',
  },
];

const INITIAL_DOCUMENTS: KnowledgeDoc[] = [
  {
    id: 'doc-hrms-01',
    title: '2026 Comprehensive Employee Benefits Guide',
    fileName: 'RainerTek_Benefits_Handbook_2026_v3.pdf',
    projectId: 'HRMS',
    category: 'policy',
    version: 'v3.2',
    format: 'pdf',
    sizeBytes: 4280000,
    chunkCount: 142,
    indexingStatus: 'indexed',
    lastUpdated: '2026-10-18T09:12:00Z',
    uploader: 'sandeepnaikb0@gmail.com',
    contentSnippet: 'Details open enrollment periods, health savings accounts ($1,200 annual employer contribution), vision, and tele-counseling allowances.',
    rawText: `RainerTek Comprehensive Employee Benefits Handbook 2026.
Open enrollment occurs annually from November 1st to November 30th.
High Deductible Health Plan (HDHP) includes employer HSA contributions: $1,200 for individuals, $2,400 for families.
Dental and vision coverage are 100% employer-sponsored for in-network preventative care.
Mental health counseling: Up to 12 fully subsidized confidential sessions per calendar year through the Employee Assistance Program (EAP).`,
  },
  {
    id: 'doc-hrms-02',
    title: 'Global Paid Time Off & Parental Leave SOP',
    fileName: 'SOP-HR-041_PTO_Leave_Policies.md',
    projectId: 'HRMS',
    category: 'sop',
    version: 'v2.1',
    format: 'markdown',
    sizeBytes: 450000,
    chunkCount: 38,
    indexingStatus: 'indexed',
    lastUpdated: '2026-10-12T16:00:00Z',
    uploader: 'sandeepnaikb0@gmail.com',
    contentSnippet: 'Defines 20 days standard PTO accrual, bereavement leave, and 16 weeks fully paid parental leave for primary caregivers.',
    rawText: `# SOP-HR-041: Paid Time Off & Leave of Absence Policies
1. Standard PTO Accrual: Full-time employees accrue 1.67 days per calendar month, totaling 20 standard paid days off per year.
2. Rollover Limit: A maximum of 5 unused standard PTO days may be carried forward into the subsequent calendar year. Unused days exceeding 5 will expire on December 31st.
3. Parental Leave: RainerTek provides 16 weeks of fully paid parental leave to eligible primary caregivers, accessible within the first 12 months following birth or adoption.
4. Bereavement Leave: Up to 5 consecutive paid days off for immediate family members.`,
  },
  {
    id: 'doc-qms-01',
    title: 'SOP-802: Non-Conformance & Deviation Reporting',
    fileName: 'SOP-802_RevF_Deviation_Control.pdf',
    projectId: 'QMS',
    category: 'sop',
    version: 'Rev F',
    format: 'pdf',
    sizeBytes: 2850000,
    chunkCount: 96,
    indexingStatus: 'indexed',
    lastUpdated: '2026-10-21T13:45:00Z',
    uploader: 'elena.rostova@rainertek.com',
    contentSnippet: 'Step-by-step containment protocol for Grade A/B cleanroom environmental monitoring excursions and 24-hour notification mandates.',
    rawText: `SOP-802 Revision F: Non-Conformance & Environmental Excursion Management.
Section 4.1: Cleanroom bay excursions exceeding 24.0°C in Grade B environments require immediate batch filling suspension and secondary nitrogen cooling.
Section 4.2: QA Supervisor on-call notification is mandatory within 30 minutes of excursion onset.
Section 5.0: Root cause analysis and CAPA tracking must be filed in Sparta TrackWise within 48 hours.`,
  },
  {
    id: 'doc-qms-02',
    title: 'ISO 13485:2016 Audit Readiness Checklist',
    fileName: 'Audit_Checklist_ISO13485_MedicalDevices.docx',
    projectId: 'QMS',
    category: 'specifications',
    version: 'v4.0',
    format: 'docx',
    sizeBytes: 1890000,
    chunkCount: 64,
    indexingStatus: 'indexed',
    lastUpdated: '2026-10-15T15:30:00Z',
    uploader: 'elena.rostova@rainertek.com',
    contentSnippet: 'Verification criteria for design history files, CAPA corrective actions, risk management per ISO 14971, and management reviews.',
  },
  {
    id: 'doc-lims-01',
    title: 'Specimen Intake, Barcode Verification & Chain of Custody',
    fileName: 'LIMS-PR-109_SpecimenIntake_v5.pdf',
    projectId: 'LIMS',
    category: 'sop',
    version: 'v5.0',
    format: 'pdf',
    sizeBytes: 3600000,
    chunkCount: 110,
    indexingStatus: 'indexed',
    lastUpdated: '2026-10-19T10:00:00Z',
    uploader: 'dr.arun.nair@rainertek.com',
    contentSnippet: 'Procedures for scanning 2D datamatrix vials, cryogenic storage transfer (-80C ultra-low freezers), and temperature logger calibration.',
    rawText: `LIMS Procedure 109: Specimen Chain of Custody.
All biological plasma and protein samples require dual 2D datamatrix barcode validation upon dock arrival.
Samples must be logged into cryogenic vaults at -80°C within 15 minutes of unpacking.
Any temperature excursion exceeding -70°C invalidates assay viability.`,
  },
];

const INITIAL_CALLS: CallSessionRecord[] = [
  {
    id: 'CALL-2026-9841',
    startTime: '2026-10-23T14:48:10Z',
    direction: 'inbound',
    projectId: 'HRMS',
    agentId: 'agent-hrms-concierge',
    agentName: 'Echo HR Concierge',
    callerNumber: '+91 7965***286',
    durationSeconds: 194,
    status: 'completed',
    outcome: 'completed',
    escalationStatus: 'none',
    estimatedCost: 0.14,
    actualProviderCost: 0.12,
    intent: 'PTO Balance & Annual Rollover Policy Inquiry',
    transcript: [
      { id: 't-1', speaker: 'agent', text: 'Hello, thank you for reaching RainerTek HR Services. How may I assist you today?', timestamp: '14:48:12' },
      { id: 't-2', speaker: 'caller', text: 'Hi, how many days of unused PTO can I carry over into next calendar year?', timestamp: '14:48:18' },
      { id: 't-3', speaker: 'agent', text: 'According to our Paid Time Off SOP (Section 2), employees may roll over up to 5 days of unused PTO into next year. Excess days expire on Dec 31st.', timestamp: '14:48:24' },
      { id: 't-4', speaker: 'caller', text: 'Does that require special manager pre-approval in the portal?', timestamp: '14:48:33' },
      { id: 't-5', speaker: 'agent', text: 'No formal pre-approval is required for the 5-day rollover; payroll processes it automatically on January 1st.', timestamp: '14:48:39' },
      { id: 't-6', speaker: 'caller', text: 'Wonderful, thank you!', timestamp: '14:48:45' },
    ],
    citedKnowledgeSources: ['SOP-HR-041_PTO_Leave_Policies.md (Section 2.0)'],
    lifecycleEvents: [
      { time: '14:48:10', type: 'info', label: 'Call Connected via Sarvam SIP Gateway' },
      { time: '14:48:20', type: 'info', label: 'Intent Classified: HR_PTO_ROLLOVER' },
      { time: '14:48:22', type: 'success', label: 'Grounding Hit: SOP-HR-041.md' },
      { time: '14:48:50', type: 'success', label: 'Call Terminated gracefully by caller' },
    ],
    costBreakdown: { stt: 0.03, llm: 0.05, tts: 0.04, telephony: 0.02 },
  },
  {
    id: 'CALL-2026-9840',
    startTime: '2026-10-23T14:15:02Z',
    direction: 'inbound',
    projectId: 'QMS',
    agentId: 'agent-qms-auditor',
    agentName: 'Echo Quality Auditor',
    callerNumber: '+91 8047***900',
    durationSeconds: 275,
    status: 'completed',
    outcome: 'escalated',
    escalationStatus: 'escalated_to_supervisor',
    estimatedCost: 0.22,
    actualProviderCost: 0.19,
    intent: 'Cleanroom Bay 4 Temperature Excursion Escalation',
    transcript: [
      { id: 't-10', speaker: 'agent', text: 'RainerTek Quality Management Automated Hotline. Please state your deviation report ID.', timestamp: '14:15:05' },
      { id: 't-11', speaker: 'caller', text: 'Cleanroom Bay 4 experienced a temperature spike to 26.5 Celsius during batch 409.', timestamp: '14:15:14' },
      { id: 't-12', speaker: 'agent', text: 'Under SOP-802 Section 4.1, temperature excursions exceeding 24C in Grade B cleanrooms require immediate batch hold and QA supervisor handoff.', timestamp: '14:15:22' },
      { id: 't-13', speaker: 'caller', text: 'Yes, please escalate to QA Supervisor immediately.', timestamp: '14:15:30' },
      { id: 't-14', speaker: 'agent', text: 'Initiating priority transfer to QA On-Call Officer now. Please hold.', timestamp: '14:15:34' },
      { id: 't-15', speaker: 'human_supervisor', text: 'This is QA Supervisor Dr. Rostova. Operator, engage nitrogen cooling protocol immediately.', timestamp: '14:15:42' },
    ],
    citedKnowledgeSources: ['SOP-802_RevF_Deviation_Control.pdf (Section 4.1)'],
    lifecycleEvents: [
      { time: '14:15:02', type: 'info', label: 'Inbound session connected' },
      { time: '14:15:16', type: 'alert', label: 'Trigger Keyword: "temperature spike", "critical deviation"' },
      { time: '14:15:32', type: 'warning', label: 'Escalation Policy Engaged: Transfer to Dr. Rostova' },
      { time: '14:15:40', type: 'success', label: 'Warm Handoff Complete' },
    ],
    costBreakdown: { stt: 0.05, llm: 0.08, tts: 0.05, telephony: 0.04 },
  },
  {
    id: 'CALL-2026-9838',
    startTime: '2026-10-23T11:22:15Z',
    direction: 'outbound',
    projectId: 'HRMS',
    agentId: 'agent-hrms-concierge',
    agentName: 'Echo HR Concierge',
    callerNumber: '+91 9884***102',
    durationSeconds: 165,
    status: 'completed',
    outcome: 'completed',
    escalationStatus: 'none',
    estimatedCost: 0.13,
    intent: 'Day-1 IT Hardware Receipt Confirmation',
    transcript: [
      { id: 't-20', speaker: 'agent', text: 'Good morning! This is RainerTek EchoAI verifying your new hire laptop delivery and Monday orientation schedule.', timestamp: '11:22:18' },
      { id: 't-21', speaker: 'caller', text: 'Yes, the courier just arrived with the laptop package.', timestamp: '11:22:24' },
      { id: 't-22', speaker: 'agent', text: 'Great! Your onboarding session starts Monday at 9:00 AM Central. Check your personal email for the calendar invitation.', timestamp: '11:22:31' },
    ],
    citedKnowledgeSources: ['2026 Comprehensive Employee Benefits Guide'],
    lifecycleEvents: [
      { time: '11:22:15', type: 'info', label: 'Outbound Dial dispatched via Campaign' },
      { time: '11:22:17', type: 'info', label: 'Human Voice Activity Detected' },
      { time: '11:22:58', type: 'success', label: 'Survey Logged: Verified' },
    ],
    costBreakdown: { stt: 0.03, llm: 0.04, tts: 0.04, telephony: 0.02 },
  },
  {
    id: 'CALL-2026-9837',
    startTime: '2026-10-23T09:41:00Z',
    direction: 'inbound',
    projectId: 'QMS',
    agentId: 'agent-qms-auditor',
    agentName: 'Echo Quality Auditor',
    callerNumber: '+91 8047***900',
    durationSeconds: 48,
    status: 'failed',
    outcome: 'failed',
    escalationStatus: 'none',
    estimatedCost: 0.04,
    intent: 'Incomplete Session - Network Drop',
    transcript: [
      { id: 't-30', speaker: 'agent', text: 'RainerTek Quality Management Automated Hotline. State your deviation ID.', timestamp: '09:41:03' },
      { id: 't-31', speaker: 'caller', text: 'Hello? Can you hear... [static burst]... deviation four two...', timestamp: '09:41:08' },
    ],
    citedKnowledgeSources: [],
    failureReason: 'SIP RTP Media Timeout: Jitter buffer overflow caused by remote cellular carrier drop.',
    lifecycleEvents: [
      { time: '09:41:00', type: 'info', label: 'SIP Handshake Inbound' },
      { time: '09:41:14', type: 'warning', label: 'RTP Packet Loss exceeded 40%' },
      { time: '09:41:20', type: 'alert', label: 'Carrier Network Reset: Call Disconnected' },
    ],
    costBreakdown: { stt: 0.01, llm: 0.01, tts: 0.01, telephony: 0.01 },
  },
];

const INITIAL_CAMPAIGNS: CampaignRecord[] = [
  {
    id: 'CMP-2026-01',
    name: 'Q4 Annual Benefits Enrollment Verification',
    projectId: 'HRMS',
    agentId: 'agent-hrms-concierge',
    status: 'running',
    scheduledDate: '2026-10-20 to 2026-10-31',
    totalContacts: 1250,
    dialedCount: 820,
    answeredCount: 740,
    successfulCount: 712,
    failedCount: 28,
    consentVerified: true,
    quietHoursEnforced: true,
    retryLimit: 2,
    approvedScript: 'Verifies employee election of medical coverage and answers HSA contribution queries.',
    createdAt: '2026-10-18',
  },
  {
    id: 'CMP-2026-02',
    name: 'QMS ISO 13485 Action Item Deadline Follow-up',
    projectId: 'QMS',
    agentId: 'agent-qms-auditor',
    status: 'scheduled',
    scheduledDate: '2026-10-28 09:00 IST',
    totalContacts: 48,
    dialedCount: 0,
    answeredCount: 0,
    successfulCount: 0,
    failedCount: 0,
    consentVerified: true,
    quietHoursEnforced: true,
    retryLimit: 3,
    approvedScript: 'Reminds lead plant engineers of open CAPA corrective action deadlines.',
    createdAt: '2026-10-22',
  },
];

const INITIAL_INTEGRATIONS: IntegrationCard[] = [
  {
    id: 'int-sarvam',
    name: 'Sarvam AI Voice Services (Bulbul & Turbo)',
    category: 'voice',
    status: 'connected',
    capabilities: ['Multilingual Text-to-Speech', 'Saaras Speech Recognition', 'Indian Language Accents'],
    lastSuccessfulOperation: 'Active Session (2m ago)',
    safeStatusMessage: 'SIP Media Plane latency: 84ms. Voice synthesis operational.',
    endpointPreview: 'https://api.sarvam.ai/text-to-speech',
  },
  {
    id: 'int-hrms',
    name: 'RainerTek HRMS Core (Workday REST Connector)',
    category: 'hrms',
    status: 'connected',
    capabilities: ['Employee Directory Sync', 'PTO Ledger Lookup', 'Badge ID Verification'],
    lastSuccessfulOperation: 'Directory Synced 12 mins ago',
    safeStatusMessage: 'Mutual TLS handshake verified. Caller identity checks active.',
    endpointPreview: 'https://api.internal.rainertek.com/hrms/v2',
  },
  {
    id: 'int-qms',
    name: 'RainerTek QMS Bridge (Sparta TrackWise)',
    category: 'qms',
    status: 'connected',
    capabilities: ['Deviation Ticket Logging', 'CAPA Remediation Query', 'Audit Checkpoint Retrieval'],
    lastSuccessfulOperation: 'CAPA Sync 4 mins ago',
    safeStatusMessage: 'Compliant with 21 CFR Part 11 electronic records mandate.',
    endpointPreview: 'https://api.internal.rainertek.com/qms/v1',
  },
  {
    id: 'int-lims',
    name: 'RainerTek LIMS Gateway (LabWare LabCore)',
    category: 'lims',
    status: 'connected',
    capabilities: ['Specimen Barcode Resolution', 'Freezer Vault Telemetry', 'Assay Status Dispatch'],
    lastSuccessfulOperation: 'Telemetry check 1 hour ago',
    safeStatusMessage: 'Ultra-low freezer temperature logger feed connected.',
    endpointPreview: 'https://api.internal.rainertek.com/lims/v1',
  },
  {
    id: 'int-telephony',
    name: 'Enterprise Telephony SIP Gateway',
    category: 'telephony',
    status: 'connected',
    capabilities: ['DID Phone Routing', 'Inbound Ring Groups', 'Call Recording Archival'],
    lastSuccessfulOperation: 'Channel Active',
    safeStatusMessage: 'Active Route: +917965481286. WebRTC jitter buffer: 40ms.',
    endpointPreview: 'sip:hotline.rainertek.internal',
  },
];

const INITIAL_TEAM: EnterpriseTeamMember[] = [
  {
    id: 'usr-1',
    name: 'Sandeep Naik',
    email: 'sandeepnaikb0@gmail.com',
    role: 'Administrator',
    projectScopes: ['HRMS', 'QMS', 'LIMS', 'GENERAL'],
    mfaEnabled: true,
    lastActive: 'Active Now',
  },
  {
    id: 'usr-2',
    name: 'Elena Rostova',
    email: 'elena.rostova@rainertek.com',
    role: 'Operator',
    projectScopes: ['QMS'],
    mfaEnabled: true,
    lastActive: '14 mins ago',
  },
  {
    id: 'usr-3',
    name: 'Dr. Arun Nair',
    email: 'dr.arun.nair@rainertek.com',
    role: 'Operator',
    projectScopes: ['LIMS'],
    mfaEnabled: true,
    lastActive: 'Yesterday',
  },
  {
    id: 'usr-4',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@rainertek.com',
    role: 'Read-only viewer',
    projectScopes: ['HRMS', 'QMS', 'LIMS'],
    mfaEnabled: true,
    lastActive: '3 days ago',
  },
];

const INITIAL_AUDIT_LOGS: AuditLogRecord[] = [
  {
    id: 'AUDIT-901',
    actor: 'sandeepnaikb0@gmail.com',
    role: 'Administrator',
    action: 'AGENT_PROMPT_VERSION_PUBLISHED',
    timestamp: '2026-10-23 14:30:10',
    projectId: 'HRMS',
    targetResource: 'Echo HR Concierge (agent-hrms-concierge)',
    result: 'SUCCESS',
    details: 'Published prompt version v1.2 with updated PTO carryover rules.',
  },
  {
    id: 'AUDIT-900',
    actor: 'elena.rostova@rainertek.com',
    role: 'Operator',
    action: 'DOC_REINDEX_COMPLETED',
    timestamp: '2026-10-23 13:45:00',
    projectId: 'QMS',
    targetResource: 'SOP-802_RevF_Deviation_Control.pdf',
    result: 'SUCCESS',
    details: 'Vectorized 96 text chunks into pgvector embeddings store.',
  },
  {
    id: 'AUDIT-899',
    actor: 'sandeepnaikb0@gmail.com',
    role: 'Administrator',
    action: 'CAMPAIGN_BATCH_DISPATCHED',
    timestamp: '2026-10-23 11:22:00',
    projectId: 'HRMS',
    targetResource: 'Q4 Annual Benefits Enrollment (CMP-2026-01)',
    result: 'SUCCESS',
    details: 'Dispatched outbound reminder batch to 820 confirmed employees.',
  },
  {
    id: 'AUDIT-898',
    actor: 'SYSTEM_MONITOR',
    role: 'Service Daemon',
    action: 'SIP_MEDIA_TIMEOUT',
    timestamp: '2026-10-23 09:41:20',
    projectId: 'QMS',
    targetResource: 'Call Session CALL-2026-9837',
    result: 'WARNING',
    details: 'Carrier packet drop detected. Inbound session terminated.',
  },
];

const INITIAL_METRICS: DashboardSummaryMetrics = {
  totalCalls: 3840,
  inboundCalls: 2890,
  outboundCalls: 950,
  totalConnectedMinutes: 11480,
  completedCalls: 3624,
  failedCalls: 86,
  missedCalls: 130,
  escalationRate: 3.4,
  avgCallDurationSeconds: 179,
  estimatedAiCost: 340.50,
  estimatedTelephonyCost: 241.50,
  actualProviderCostMonthToDate: 582.00,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [selectedProject, setSelectedProject] = useState<ProjectId>('ALL');
  const [selectedAgentId, setSelectedAgentId] = useState<string>('agent-hrms-concierge');
  const [userRole, setUserRole] = useState<UserRole>('Administrator');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);

  // Entities
  const [projects] = useState<EnterpriseProject[]>(INITIAL_PROJECTS);
  const [agents, setAgents] = useState<AIAgentConfig[]>(INITIAL_AGENTS);
  const [documents, setDocuments] = useState<KnowledgeDoc[]>(INITIAL_DOCUMENTS);
  const [calls, setCalls] = useState<CallSessionRecord[]>(INITIAL_CALLS);
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>(INITIAL_CAMPAIGNS);
  const [integrations] = useState<IntegrationCard[]>(INITIAL_INTEGRATIONS);
  const [team, setTeam] = useState<EnterpriseTeamMember[]>(INITIAL_TEAM);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>(INITIAL_AUDIT_LOGS);
  const [metrics] = useState<DashboardSummaryMetrics>(INITIAL_METRICS);

  // Live Call Workspace State
  const [liveCallState, setLiveCallState] = useState<{
    status: 'idle' | 'connecting' | 'connected' | 'completed' | 'failed';
    visual3DState: AssistantVisualState;
    agentId: string;
    projectId: ProjectId;
    callerNumber: string;
    durationSeconds: number;
    isMuted: boolean;
    transcript: Array<{ speaker: 'agent' | 'caller' | 'human_supervisor'; text: string; timestamp: string }>;
    events: Array<{ time: string; type: 'info' | 'success' | 'warning' | 'alert'; label: string }>;
    activeSources: string[];
    isEscalated: boolean;
  }>({
    status: 'idle',
    visual3DState: 'idle',
    agentId: 'agent-hrms-concierge',
    projectId: 'HRMS',
    callerNumber: '+91 7965481286',
    durationSeconds: 0,
    isMuted: false,
    transcript: [],
    events: [],
    activeSources: [],
    isEscalated: false,
  });

  // Call duration counter
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (liveCallState.status === 'connected') {
      interval = setInterval(() => {
        setLiveCallState((prev) => ({
          ...prev,
          durationSeconds: prev.durationSeconds + 1,
        }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [liveCallState.status]);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const updateAgent = (id: string, updates: Partial<AIAgentConfig>) => {
    setAgents((prev) =>
      prev.map((agent) => {
        if (agent.id === id) {
          const updated = { ...agent, ...updates, updatedAt: new Date().toISOString() };
          return updated;
        }
        return agent;
      })
    );
    // Add audit log
    const entry: AuditLogRecord = {
      id: `AUDIT-${Date.now().toString().slice(-4)}`,
      actor: 'sandeepnaikb0@gmail.com',
      role: userRole,
      action: 'AGENT_CONFIGURATION_SAVED',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      projectId: updates.projectId || 'HRMS',
      targetResource: `Agent ID: ${id}`,
      result: 'SUCCESS',
      details: `Modified fields: ${Object.keys(updates).join(', ')}`,
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  const createAgent = (agentData: Partial<AIAgentConfig>): AIAgentConfig => {
    const newAgent: AIAgentConfig = {
      id: `agent-${Date.now()}`,
      name: agentData.name || 'New Enterprise Agent',
      description: agentData.description || 'Enterprise voice assistant.',
      projectId: agentData.projectId || 'HRMS',
      status: 'active',
      supportedLanguages: agentData.supportedLanguages || ['English (India)'],
      voiceModel: agentData.voiceModel || 'Sarvam Bulbul Core (en-IN)',
      speakingStyle: agentData.speakingStyle || 'Professional',
      speakingRate: 1.0,
      pitch: 1.0,
      greeting: agentData.greeting || 'Hello! Thank you for calling RainerTek.',
      systemPrompt: agentData.systemPrompt || {
        identity: 'You are an internal voice assistant for RainerTek.',
        role: 'Answer questions based strictly on approved documentation.',
        scope: 'Enterprise systems only.',
        tone: 'Professional.',
        instructions: 'Be clear and concise.',
        restrictions: 'Do not invent unverified facts.',
        escalation: 'Transfer to supervisor upon request.',
      },
      promptVersions: [
        {
          version: 'v1.0 (Initial)',
          savedAt: new Date().toLocaleString(),
          savedBy: 'sandeepnaikb0@gmail.com',
          notes: 'Initial creation.',
          systemPrompt: agentData.systemPrompt || {
            identity: 'You are an internal voice assistant.',
            role: 'Answer questions.',
            scope: 'Enterprise systems.',
            tone: 'Professional.',
            instructions: 'Be clear.',
            restrictions: 'None.',
            escalation: 'Transfer if needed.',
          },
        },
      ],
      approvedKnowledgeSources: [],
      permittedActions: [],
      identityVerificationRequired: false,
      fallbackResponse: 'I am unable to verify that in approved records.',
      humanEscalationRules: {
        enabled: true,
        triggerKeywords: ['supervisor', 'human', 'escalate'],
        maxFailedAttempts: 2,
        destinationNumber: '+91 80 4718 9000',
      },
      callBehavior: {
        maxDurationSeconds: 600,
        silenceTimeoutSeconds: 8,
        recordCall: true,
      },
      totalCalls: 0,
      successRate: 100,
      updatedAt: new Date().toISOString(),
    };
    setAgents((prev) => [newAgent, ...prev]);
    return newAgent;
  };

  const restorePromptVersion = (agentId: string, version: PromptVersion) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === agentId) {
          return {
            ...a,
            systemPrompt: { ...version.systemPrompt },
            updatedAt: new Date().toISOString(),
          };
        }
        return a;
      })
    );
  };

  const addDocument = (docData: Omit<KnowledgeDoc, 'id' | 'lastUpdated' | 'chunkCount' | 'indexingStatus'>) => {
    const newDoc: KnowledgeDoc = {
      ...docData,
      id: `doc-${Date.now().toString().slice(-4)}`,
      chunkCount: Math.floor(Math.random() * 60) + 12,
      indexingStatus: 'indexed',
      lastUpdated: new Date().toISOString(),
    };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const updateDocument = (id: string, updates: Partial<KnowledgeDoc>) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...updates, lastUpdated: new Date().toISOString() } : d))
    );
  };

  const reindexDocument = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, indexingStatus: 'processing' } : d))
    );
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((d) => (d.id === id ? { ...d, indexingStatus: 'indexed', lastUpdated: new Date().toISOString() } : d))
      );
    }, 1400);
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const addCallRecord = (call: CallSessionRecord) => {
    setCalls((prev) => [call, ...prev]);
  };

  const createCampaign = (campData: Omit<CampaignRecord, 'id' | 'dialedCount' | 'answeredCount' | 'successfulCount' | 'failedCount' | 'createdAt'>) => {
    const newCamp: CampaignRecord = {
      ...campData,
      id: `CMP-${Date.now().toString().slice(-4)}`,
      dialedCount: 0,
      answeredCount: 0,
      successfulCount: 0,
      failedCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCampaigns((prev) => [newCamp, ...prev]);
  };

  const toggleCampaignStatus = (id: string, newStatus: CampaignRecord['status']) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  // Live Call Workspace Methods
  const startLiveCall = (agentId = 'agent-hrms-concierge') => {
    const agent = agents.find((a) => a.id === agentId) || agents[0];
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    setLiveCallState({
      status: 'connecting',
      visual3DState: 'connecting',
      agentId: agent.id,
      projectId: agent.projectId,
      callerNumber: '+91 7965481286',
      durationSeconds: 0,
      isMuted: false,
      transcript: [],
      events: [{ time: now, type: 'info', label: 'Initiating Sarvam SIP WebRTC Session...' }],
      activeSources: [],
      isEscalated: false,
    });

    setTimeout(() => {
      const connectTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLiveCallState((prev) => ({
        ...prev,
        status: 'connected',
        visual3DState: 'speaking',
        transcript: [{ speaker: 'agent', text: agent.greeting, timestamp: connectTime }],
        events: [
          ...prev.events,
          { time: connectTime, type: 'success', label: `Connected to ${agent.name} (Sarvam Bulbul)` },
        ],
        activeSources: agent.approvedKnowledgeSources,
      }));

      // Return to listening after greeting
      setTimeout(() => {
        setLiveCallState((prev) => ({
          ...prev,
          visual3DState: 'listening',
        }));
      }, 3000);
    }, 1200);
  };

  const endLiveCall = () => {
    const endTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLiveCallState((prev) => {
      const completedCall: CallSessionRecord = {
        id: `CALL-${Date.now().toString().slice(-6)}`,
        startTime: new Date().toISOString(),
        direction: 'inbound',
        projectId: prev.projectId,
        agentId: prev.agentId,
        agentName: agents.find((a) => a.id === prev.agentId)?.name || 'Echo Agent',
        callerNumber: prev.callerNumber,
        durationSeconds: prev.durationSeconds,
        status: 'completed',
        outcome: prev.isEscalated ? 'escalated' : 'completed',
        escalationStatus: prev.isEscalated ? 'escalated_to_supervisor' : 'none',
        estimatedCost: Math.max(0.04, Number((prev.durationSeconds * 0.0008).toFixed(3))),
        intent: 'Live Web Call Session',
        transcript: prev.transcript.map((t, idx) => ({ id: `t-${idx}`, ...t })),
        citedKnowledgeSources: prev.activeSources,
        lifecycleEvents: [
          ...prev.events,
          { time: endTime, type: 'info', label: 'Call Terminated gracefully by caller' },
        ],
        costBreakdown: {
          stt: 0.02,
          llm: 0.03,
          tts: 0.02,
          telephony: 0.01,
        },
      };
      setCalls((existing) => [completedCall, ...existing]);

      return {
        ...prev,
        status: 'completed',
        visual3DState: 'completed',
        events: [...prev.events, { time: endTime, type: 'info', label: 'Call Session Closed' }],
      };
    });

    setTimeout(() => {
      setLiveCallState((prev) => ({
        ...prev,
        status: 'idle',
        visual3DState: 'idle',
      }));
    }, 2000);
  };

  const toggleLiveMute = () => {
    setLiveCallState((prev) => ({
      ...prev,
      isMuted: !prev.isMuted,
      visual3DState: !prev.isMuted ? 'muted' : 'listening',
      events: [
        ...prev.events,
        {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          type: 'warning',
          label: !prev.isMuted ? 'Microphone Muted by Operator' : 'Microphone Unmuted',
        },
      ],
    }));
  };

  const escalateToHuman = () => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLiveCallState((prev) => ({
      ...prev,
      isEscalated: true,
      visual3DState: 'speaking',
      transcript: [
        ...prev.transcript,
        {
          speaker: 'human_supervisor',
          text: 'This is RainerTek Supervisor Dr. Rostova. I have taken over this session.',
          timestamp: time,
        },
      ],
      events: [
        ...prev.events,
        { time, type: 'alert', label: 'Human Supervisor Escalation Tripped (Warm Handoff)' },
      ],
    }));
  };

  const sendLiveUserMessage = async (msg: string) => {
    if (!msg.trim() || liveCallState.status !== 'connected') return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    setLiveCallState((prev) => ({
      ...prev,
      visual3DState: 'thinking',
      transcript: [...prev.transcript, { speaker: 'caller', text: msg, timestamp: time }],
      events: [...prev.events, { time, type: 'info', label: `Query: "${msg.slice(0, 30)}..."` }],
    }));

    try {
      const resp = await fetch('/api/sarvam/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          context: documents.map((d) => d.rawText || d.contentSnippet).join('\n'),
        }),
      });
      const data = await resp.json();
      const reply = data.reply || 'Under RainerTek approved policy, I have verified your request.';
      const agentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setLiveCallState((prev) => ({
        ...prev,
        visual3DState: 'speaking',
        transcript: [...prev.transcript, { speaker: 'agent', text: reply, timestamp: agentTime }],
        events: [
          ...prev.events,
          { time: agentTime, type: 'success', label: 'Knowledge Retrieved & Verified' },
        ],
      }));

      setTimeout(() => {
        setLiveCallState((prev) => ({
          ...prev,
          visual3DState: 'listening',
        }));
      }, 4000);
    } catch {
      setLiveCallState((prev) => ({
        ...prev,
        visual3DState: 'listening',
      }));
    }
  };

  return (
    <AppContext.Provider
      value={{
        selectedProject,
        setSelectedProject,
        selectedAgentId,
        setSelectedAgentId,
        userRole,
        setUserRole,
        sidebarCollapsed,
        toggleSidebar,
        notificationsOpen,
        setNotificationsOpen,
        projects,
        agents,
        updateAgent,
        createAgent,
        restorePromptVersion,
        documents,
        addDocument,
        updateDocument,
        reindexDocument,
        deleteDocument,
        calls,
        addCallRecord,
        campaigns,
        createCampaign,
        toggleCampaignStatus,
        integrations,
        team,
        auditLogs,
        metrics,
        liveCallState,
        startLiveCall,
        endLiveCall,
        toggleLiveMute,
        escalateToHuman,
        sendLiveUserMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
