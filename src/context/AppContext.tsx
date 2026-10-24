'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
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

export const DEFAULT_BASE_PROMPT = `You are Echo AI, a voice assistant.
Answer only from the context saved with this agent.
If the answer is not in that context, say you cannot verify it.`;

interface AppContextType {
  // Global Base Prompt
  basePrompt: string;
  setBasePrompt: (prompt: string) => void;

  // Global Navigation & Scope
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

  // Domain Entities (Clean, real-time reactive)
  projects: EnterpriseProject[];
  addProject: (p: EnterpriseProject) => void;
  deleteProject: (id: string) => void;

  agents: AIAgentConfig[];
  createAgent: (agent: Partial<AIAgentConfig>) => AIAgentConfig;
  updateAgent: (id: string, updates: Partial<AIAgentConfig>) => void;
  deleteAgent: (id: string) => void;
  restorePromptVersion: (agentId: string, version: PromptVersion) => void;

  documents: KnowledgeDoc[];
  addDocument: (doc: Omit<KnowledgeDoc, 'id' | 'lastUpdated' | 'chunkCount' | 'indexingStatus'>) => void;
  updateDocument: (id: string, updates: Partial<KnowledgeDoc>) => void;
  reindexDocument: (id: string) => void;
  deleteDocument: (id: string) => void;

  calls: CallSessionRecord[];
  addCallRecord: (call: CallSessionRecord) => void;
  upsertCall: (call: CallSessionRecord) => void;
  clearCallHistory: () => void;

  campaigns: CampaignRecord[];
  createCampaign: (camp: Omit<CampaignRecord, 'id' | 'dialedCount' | 'answeredCount' | 'successfulCount' | 'failedCount' | 'createdAt'>) => void;
  toggleCampaignStatus: (id: string, newStatus: CampaignRecord['status']) => void;

  integrations: IntegrationCard[];
  team: EnterpriseTeamMember[];
  auditLogs: AuditLogRecord[];
  metrics: DashboardSummaryMetrics;

  // Live Real-Time Voice State (Auto-handled, always ready)
  liveCallState: {
    status: 'idle' | 'listening' | 'thinking' | 'speaking' | 'connected' | 'completed' | 'failed';
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
    isAutoActive: boolean;
  };
  startLiveCall: (agentId?: string) => void;
  endLiveCall: () => void;
  toggleLiveMute: () => void;
  escalateToHuman: () => void;
  sendLiveUserMessage: (msg: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Clean Default Initial Entities (No mock data, user creates as needed)
const CLEAN_PROJECTS: EnterpriseProject[] = [
  {
    id: 'GENERAL',
    name: 'General Company Operations',
    code: 'GENERAL',
    description: 'Main corporate company operations and inquiries.',
    agentCount: 1,
    documentCount: 0,
    connectedMinutesThisMonth: 0,
    status: 'active',
    complianceLevel: 'Internal',
  },
];

const CLEAN_DEFAULT_AGENT: AIAgentConfig = {
  id: 'agent-primary',
  name: 'Echo AI',
  description: 'Starter agent. Add a prompt and context before using it.',
  projectId: 'GENERAL',
  status: 'active',
  supportedLanguages: ['English', 'Multilingual'],
  voiceModel: 'Echo AI voice',
  speakingStyle: 'Professional, empathetic, and clear',
  speakingRate: 1.0,
  pitch: 1.0,
  greeting: 'Hello, this is Echo AI. How can I help you today?',
  channel: 'inbound',
  systemPrompt: {
    identity: 'You are Echo AI.',
    role: 'Answer questions accurately and follow instructions given in the base prompt and knowledge base.',
    scope: 'Grounded strictly in approved company documents and guidelines.',
    tone: 'Polite, concise, and professional.',
    instructions: DEFAULT_BASE_PROMPT,
    restrictions: 'Do not invent unverified information or disclose confidential details.',
    escalation: 'Offer to connect to a human supervisor if you cannot verify.',
  },
  promptVersions: [
    {
      version: 'v1.0 (Active)',
      savedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      savedBy: 'admin@echo.ai',
      notes: 'Initial base prompt',
      systemPrompt: {
        identity: 'You are Echo AI.',
        role: 'Answer questions accurately and follow instructions given in the base prompt.',
        scope: 'Grounded strictly in approved company documents.',
        tone: 'Polite, concise, and professional.',
        instructions: DEFAULT_BASE_PROMPT,
        restrictions: 'Do not invent unverified information.',
        escalation: 'Offer human assistance when needed.',
      },
    },
  ],
  approvedKnowledgeSources: [],
  permittedActions: ['Live voice response', 'Transfer to human supervisor'],
  identityVerificationRequired: false,
  fallbackResponse: 'I cannot verify this request against our approved knowledge base. Let me connect you with a representative.',
  humanEscalationRules: {
    enabled: true,
    triggerKeywords: ['speak to human', 'supervisor', 'agent', 'operator'],
    maxFailedAttempts: 2,
    destinationNumber: '+91 80 4912 3000',
  },
  callBehavior: {
    maxDurationSeconds: 600,
    silenceTimeoutSeconds: 15,
    recordCall: true,
  },
  totalCalls: 0,
  successRate: 100,
  updatedAt: new Date().toISOString().slice(0, 10),
};

const CLEAN_INTEGRATIONS: IntegrationCard[] = [
  {
    id: 'int-neural-voice',
    name: 'Echo AI voice',
    category: 'voice',
    status: 'connected',
    capabilities: ['Speech-to-Text (STT)', 'Text-to-Speech (TTS)', 'Real-time Streaming'],
    lastSuccessfulOperation: 'Active Real-Time',
    safeStatusMessage: 'Voice synthesis engine ready. Processes speech turns instantly.',
    endpointPreview: 'local://echo-ai/voice',
  },
  {
    id: 'int-telephony-sip',
    name: 'Echo AI phone line',
    category: 'telephony',
    status: 'connected',
    capabilities: ['Inbound Ingress', 'Outbound Automated Dialing', 'Carrier Recording'],
    lastSuccessfulOperation: 'Online / Gateway Active',
    safeStatusMessage: 'Carrier telephony gateway configured for company inbound and outbound routing.',
    endpointPreview: 'local://echo-ai/phone',
  },
];

const CLEAN_TEAM: EnterpriseTeamMember[] = [
  {
    id: 'usr_praveen',
    name: 'Praveen Manne',
    email: 'praveenmanne@yopmail.com',
    role: 'Administrator',
    projectScopes: ['ALL'],
    mfaEnabled: true,
    lastActive: 'Just now',
  },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Base Prompt
  const [basePrompt, setBasePrompt] = useState<string>(DEFAULT_BASE_PROMPT);

  // Global Navigation & Isolation
  const [selectedProject, setSelectedProject] = useState<ProjectId>('ALL');
  const [selectedAgentId, setSelectedAgentId] = useState<string>('agent-primary');
  const [userRole, setUserRole] = useState<UserRole>('Administrator');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);

  // Entities stored in local state (with localStorage persistence)
  const [projects, setProjects] = useState<EnterpriseProject[]>(CLEAN_PROJECTS);
  const [agents, setAgents] = useState<AIAgentConfig[]>([CLEAN_DEFAULT_AGENT]);
  const [documents, setDocuments] = useState<KnowledgeDoc[]>([]);
  const [calls, setCalls] = useState<CallSessionRecord[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignRecord[]>([]);
  const [integrations] = useState<IntegrationCard[]>(CLEAN_INTEGRATIONS);
  const [team] = useState<EnterpriseTeamMember[]>(CLEAN_TEAM);
  const [auditLogs, setAuditLogs] = useState<AuditLogRecord[]>([]);
  const [storageReady, setStorageReady] = useState(false);

  // Load from localStorage on mount (Filter out any legacy dummy data)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedPrompt = localStorage.getItem('echoai_base_prompt');
        if (savedPrompt) setBasePrompt(savedPrompt);

        const savedAgents = localStorage.getItem('echoai_agents');
        if (savedAgents) {
          const parsed = JSON.parse(savedAgents);
          const cleaned = parsed.filter((a: any) => !a.id.includes('hrms') && !a.id.includes('qms') && !a.id.includes('lims'));
          if (cleaned.length > 0) setAgents(cleaned);
        }

        const savedDocs = localStorage.getItem('echoai_docs');
        if (savedDocs) {
          const parsed = JSON.parse(savedDocs);
          const cleaned = parsed.filter((d: any) => d.projectId !== 'HRMS' && d.projectId !== 'QMS' && d.projectId !== 'LIMS');
          setDocuments(cleaned);
        }

        const savedCalls = localStorage.getItem('echoai_calls');
        if (savedCalls) {
          const parsed = JSON.parse(savedCalls);
          const cleaned = parsed.filter((c: any) => c.projectId !== 'HRMS' && c.projectId !== 'QMS' && c.projectId !== 'LIMS');
          setCalls(cleaned);
        }

        const savedProjects = localStorage.getItem('echoai_projects');
        if (savedProjects) {
          const parsed = JSON.parse(savedProjects);
          const cleaned = parsed.filter((p: any) => p.id !== 'HRMS' && p.id !== 'QMS' && p.id !== 'LIMS');
          if (cleaned.length > 0) setProjects(cleaned);
        }

        const savedSelectedAgent = localStorage.getItem('echoai_selected_agent');
        if (savedSelectedAgent) setSelectedAgentId(savedSelectedAgent);
      } catch (e) {
        console.warn('Failed loading local state:', e);
      }
    }
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    let cancelled = false;
    const syncCalls = async () => {
      try {
        const response = await fetch('/api/calls');
        if (!response.ok) return;
        const serverCalls = (await response.json()) as CallSessionRecord[];
        if (cancelled || !Array.isArray(serverCalls)) return;
        setCalls((local) => {
          const merged = new Map<string, CallSessionRecord>();
          for (const call of local) merged.set(call.id, call);
          for (const call of serverCalls) merged.set(call.id, call);
          const serverIds = new Set(serverCalls.map((call) => call.id));
          for (const call of local) {
            if (!serverIds.has(call.id)) {
              void fetch('/api/calls', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(call),
              });
            }
          }
          return Array.from(merged.values());
        });
      } catch {
        // The page still shows calls kept in this browser.
      }
    };
    void syncCalls();
    return () => {
      cancelled = true;
    };
  }, [storageReady]);

  // Save only after the stored copy has been read, so the first render cannot overwrite it.
  useEffect(() => {
    if (!storageReady || typeof window === 'undefined') return;
    localStorage.setItem('echoai_base_prompt', basePrompt);
    localStorage.setItem('echoai_agents', JSON.stringify(agents));
    localStorage.setItem('echoai_docs', JSON.stringify(documents));
    localStorage.setItem('echoai_calls', JSON.stringify(calls));
    localStorage.setItem('echoai_projects', JSON.stringify(projects));
    localStorage.setItem('echoai_selected_agent', selectedAgentId);
  }, [storageReady, basePrompt, agents, documents, calls, projects, selectedAgentId]);

  const toggleSidebar = () => setSidebarCollapsed((p) => !p);

  // Real-time calculated Dashboard Summary Metrics derived from actual calls
  const metrics = useMemo<DashboardSummaryMetrics>(() => {
    const totalCalls = calls.length;
    const inboundCalls = calls.filter((c) => c.direction === 'inbound').length;
    const outboundCalls = calls.filter((c) => c.direction === 'outbound').length;
    const completedCalls = calls.filter((c) => c.status === 'completed').length;
    const failedCalls = calls.filter((c) => c.status === 'failed').length;
    const missedCalls = calls.filter((c) => c.status === 'missed').length;
    const escalatedCalls = calls.filter((c) => c.escalationStatus !== 'none').length;

    const totalDuration = calls.reduce((acc, c) => acc + (c.durationSeconds || 0), 0);
    const totalConnectedMinutes = Math.round((totalDuration / 60) * 10) / 10;
    const avgDuration = totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0;
    const escalationRate = totalCalls > 0 ? Math.round((escalatedCalls / totalCalls) * 100) : 0;

    const estimatedAiCost = Math.round(calls.reduce((acc, c) => acc + (c.costBreakdown?.llm || 0) + (c.costBreakdown?.tts || 0), 0) * 100) / 100;
    const estimatedTelephonyCost = Math.round(calls.reduce((acc, c) => acc + (c.costBreakdown?.telephony || 0), 0) * 100) / 100;

    return {
      totalCalls,
      inboundCalls,
      outboundCalls,
      totalConnectedMinutes,
      completedCalls,
      failedCalls,
      missedCalls,
      escalationRate,
      avgCallDurationSeconds: avgDuration,
      estimatedAiCost,
      estimatedTelephonyCost,
      actualProviderCostMonthToDate: estimatedAiCost + estimatedTelephonyCost,
    };
  }, [calls]);

  // Project Management
  const addProject = (p: EnterpriseProject) => {
    setProjects((prev) => [...prev, p]);
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // Agent Management
  const createAgent = (newAgentData: Partial<AIAgentConfig>): AIAgentConfig => {
    const id = newAgentData.id || `agent-${Date.now()}`;
    const newAgent: AIAgentConfig = {
      id,
      name: newAgentData.name || 'Custom AI Agent',
      description: newAgentData.description || 'Configured AI agent for company calls.',
      projectId: newAgentData.projectId || (selectedProject === 'ALL' ? 'GENERAL' : selectedProject),
      status: 'active',
      supportedLanguages: newAgentData.supportedLanguages || ['English', 'Hindi'],
      voiceModel: newAgentData.voiceModel || 'Echo AI voice',
      channel: newAgentData.channel || 'inbound',
      speakingStyle: newAgentData.speakingStyle || 'Professional and conversational',
      speakingRate: 1.0,
      pitch: 1.0,
      greeting: newAgentData.greeting || 'Hello, how can I assist you today?',
      assignedPhoneNumber: newAgentData.assignedPhoneNumber,
      systemPrompt: {
        identity: newAgentData.systemPrompt?.identity || `You are ${newAgentData.name || 'AI Voice Agent'}.`,
        role: newAgentData.systemPrompt?.role || newAgentData.description || 'Answer company questions based on knowledge.',
        scope: newAgentData.systemPrompt?.scope || 'Grounded in approved company documents.',
        tone: newAgentData.systemPrompt?.tone || 'Polite and clear.',
        instructions: newAgentData.systemPrompt?.instructions || basePrompt,
        restrictions: newAgentData.systemPrompt?.restrictions || 'Do not invent claims.',
        escalation: newAgentData.systemPrompt?.escalation || 'Transfer to representative if unable to answer.',
      },
      promptVersions: [
        {
          version: 'v1.0 (Active)',
          savedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
          savedBy: 'admin@echo.ai',
          notes: 'Initial creation',
          systemPrompt: {
            identity: `You are Echo AI, agent ${newAgentData.name || 'AI Agent'}.`,
            role: newAgentData.description || 'Answer questions based on company knowledge.',
            scope: 'Approved company knowledge.',
            tone: 'Polite and clear.',
            instructions: newAgentData.systemPrompt?.instructions || basePrompt,
            restrictions: 'Do not invent claims.',
            escalation: 'Transfer to representative if unable to answer.',
          },
        },
      ],
      approvedKnowledgeSources: newAgentData.approvedKnowledgeSources || [],
      permittedActions: ['Voice call handling'],
      identityVerificationRequired: newAgentData.identityVerificationRequired ?? false,
      fallbackResponse: 'I cannot verify this request against our knowledge base. Please hold for a human agent.',
      humanEscalationRules: {
        enabled: true,
        triggerKeywords: ['speak to human', 'representative'],
        maxFailedAttempts: 2,
        destinationNumber: '+91 80 4912 3000',
      },
      callBehavior: {
        maxDurationSeconds: 600,
        silenceTimeoutSeconds: 15,
        recordCall: true,
      },
      totalCalls: 0,
      successRate: 100,
      updatedAt: new Date().toISOString().slice(0, 10),
    };

    setAgents((prev) => [newAgent, ...prev]);
    setSelectedAgentId(id);
    return newAgent;
  };

  const updateAgent = (id: string, updates: Partial<AIAgentConfig>) => {
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  const deleteAgent = (id: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== id));
    if (selectedAgentId === id && agents.length > 1) {
      setSelectedAgentId(agents.find((a) => a.id !== id)?.id || '');
    }
  };

  const restorePromptVersion = (agentId: string, version: PromptVersion) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === agentId) {
          return {
            ...a,
            systemPrompt: version.systemPrompt,
            updatedAt: new Date().toISOString().slice(0, 10),
          };
        }
        return a;
      })
    );
  };

  // Knowledge Documents Management
  const addDocument = (docData: Omit<KnowledgeDoc, 'id' | 'lastUpdated' | 'chunkCount' | 'indexingStatus'>) => {
    const newDoc: KnowledgeDoc = {
      ...docData,
      id: `doc-${Date.now()}`,
      lastUpdated: new Date().toISOString().slice(0, 10),
      chunkCount: Math.max(1, Math.ceil((docData.rawText?.length || docData.sizeBytes || 500) / 400)),
      indexingStatus: 'indexed',
    };
    setDocuments((prev) => [newDoc, ...prev]);

    // Record audit event
    setAuditLogs((prev) => [
      {
        id: `aud-${Date.now()}`,
        actor: 'Praveen Manne',
        role: 'Administrator',
        action: 'DOCUMENT_UPLOAD',
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
        projectId: newDoc.projectId,
        targetResource: newDoc.title,
        result: 'SUCCESS',
        details: `Uploaded and indexed ${newDoc.fileName} into knowledge base.`,
      },
      ...prev,
    ]);
  };

  const updateDocument = (id: string, updates: Partial<KnowledgeDoc>) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const reindexDocument = (id: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          return { ...d, indexingStatus: 'processing' };
        }
        return d;
      })
    );
    setTimeout(() => {
      setDocuments((prev) =>
        prev.map((d) => {
          if (d.id === id) {
            return { ...d, indexingStatus: 'indexed', lastUpdated: new Date().toISOString().slice(0, 10) };
          }
          return d;
        })
      );
    }, 1000);
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // Real Calls History Management
  const addCallRecord = (call: CallSessionRecord) => {
    setCalls((prev) => [call, ...prev.filter((item) => item.id !== call.id)]);
  };

  const upsertCall = (call: CallSessionRecord) => {
    setCalls((prev) => {
      const index = prev.findIndex((item) => item.id === call.id);
      if (index === -1) return [call, ...prev];
      const next = [...prev];
      next[index] = call;
      return next;
    });
  };

  const clearCallHistory = () => {
    setCalls([]);
    void fetch('/api/calls', { method: 'DELETE' });
  };

  // Campaigns
  const createCampaign = (campData: any) => {
    const newCamp: CampaignRecord = {
      ...campData,
      id: `camp-${Date.now()}`,
      dialedCount: 0,
      answeredCount: 0,
      successfulCount: 0,
      failedCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setCampaigns((prev) => [newCamp, ...prev]);
  };

  const toggleCampaignStatus = (id: string, newStatus: CampaignRecord['status']) => {
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c)));
  };

  // Live Real-Time Voice State (Auto-active, handles everything)
  const [liveCallState, setLiveCallState] = useState<{
    status: 'idle' | 'listening' | 'thinking' | 'speaking' | 'connected' | 'completed' | 'failed';
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
    isAutoActive: boolean;
  }>({
    status: 'connected', // Always ready & connected
    visual3DState: 'listening',
    agentId: 'agent-primary',
    projectId: 'GENERAL',
    callerNumber: '+91 98765 43210',
    durationSeconds: 0,
    isMuted: false,
    transcript: [
      {
        speaker: 'agent',
        text: 'Hello, this is Echo AI. How can I help you today?',
        timestamp: 'Just now',
      },
    ],
    events: [
      {
        time: 'Active',
        type: 'success',
        label: 'Voice Core Online — Real-Time Speech Ready',
      },
    ],
    activeSources: [],
    isEscalated: false,
    isAutoActive: true,
  });

  // Call timer running when connected
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (liveCallState.status === 'connected' || liveCallState.status === 'speaking' || liveCallState.status === 'listening' || liveCallState.status === 'thinking') {
      timer = setInterval(() => {
        setLiveCallState((prev) => ({
          ...prev,
          durationSeconds: prev.durationSeconds + 1,
        }));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [liveCallState.status]);

  const startLiveCall = (agentId?: string) => {
    const aid = agentId || selectedAgentId || agents[0]?.id || 'agent-primary';
    const targetAgent = agents.find((a) => a.id === aid) || agents[0];
    const greeting = targetAgent?.greeting || 'Hello, this is Echo AI. How can I help you today?';

    setLiveCallState({
      status: 'connected',
      visual3DState: 'speaking',
      agentId: aid,
      projectId: targetAgent?.projectId || 'GENERAL',
      callerNumber: '+91 98765 43210',
      durationSeconds: 0,
      isMuted: false,
      transcript: [
        {
          speaker: 'agent',
          text: greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
      events: [
        {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'success',
          label: 'Voice Session Initialized',
        },
      ],
      activeSources: documents.map((d) => d.title),
      isEscalated: false,
      isAutoActive: true,
    });

    setTimeout(() => {
      setLiveCallState((prev) => ({
        ...prev,
        visual3DState: 'listening',
      }));
    }, 2500);
  };

  const endLiveCall = () => {
    const duration = liveCallState.durationSeconds;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Commit to real calls history
    if (liveCallState.transcript.length > 1) {
      const newCallRecord: CallSessionRecord = {
        id: `call-${Date.now().toString().slice(-4)}`,
        startTime: `Today, ${time}`,
        direction: 'inbound',
        projectId: liveCallState.projectId,
        agentId: liveCallState.agentId,
        agentName: agents.find((a) => a.id === liveCallState.agentId)?.name || 'Echo AI',
        callerNumber: liveCallState.callerNumber,
        durationSeconds: duration,
        status: 'completed',
        outcome: 'completed',
        escalationStatus: liveCallState.isEscalated ? 'escalated_to_supervisor' : 'none',
        estimatedCost: Math.round(((duration / 60) * 1.85 + 2) * 100) / 100,
        intent: 'Employee / Business Telephony Inquiry',
        transcript: liveCallState.transcript.map((t, idx) => ({
          id: `turn-${idx}`,
          speaker: t.speaker,
          text: t.text,
          timestamp: t.timestamp,
        })),
        citedKnowledgeSources: documents.slice(0, 2).map((d) => d.title),
        lifecycleEvents: liveCallState.events,
        costBreakdown: {
          stt: 0.8,
          llm: 1.2,
          tts: 1.0,
          telephony: Math.round((duration / 60) * 0.45 * 100) / 100,
        },
      };
      setCalls((prev) => [newCallRecord, ...prev]);
    }

    setLiveCallState((prev) => ({
      ...prev,
      status: 'idle',
      visual3DState: 'idle',
      events: [...prev.events, { time, type: 'info', label: 'Call ended and recorded' }],
    }));
  };

  const toggleLiveMute = () => {
    setLiveCallState((prev) => ({
      ...prev,
      isMuted: !prev.isMuted,
      visual3DState: !prev.isMuted ? 'muted' : 'listening',
    }));
  };

  const escalateToHuman = () => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLiveCallState((prev) => ({
      ...prev,
      isEscalated: true,
      visual3DState: 'speaking',
      transcript: [
        ...prev.transcript,
        {
          speaker: 'human_supervisor',
          text: 'This is Echo AI support. I have taken over this call.',
          timestamp: time,
        },
      ],
      events: [
        ...prev.events,
        { time, type: 'alert', label: 'Transferred to Human Supervisor' },
      ],
    }));
  };

  // Real-Time Speech and Text Message Handler
  const sendLiveUserMessage = async (msg: string) => {
    if (!msg.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Show caller message & set assistant thinking
    setLiveCallState((prev) => ({
      ...prev,
      visual3DState: 'thinking',
      status: 'connected',
      transcript: [...prev.transcript, { speaker: 'caller', text: msg, timestamp: time }],
      events: [...prev.events, { time, type: 'info', label: `Inquiry: "${msg.slice(0, 28)}..."` }],
    }));

    const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLiveCallState((prev) => ({
      ...prev,
      visual3DState: 'listening',
      transcript: [
        ...prev.transcript,
        {
          speaker: 'agent',
          text: 'Portal chat is turned off. Use the Sarvam agent after the handbook and directory are uploaded.',
          timestamp: replyTime,
        },
      ],
    }));
  };

  // Reset function to clear everything to clean slate
  const resetAllData = () => {
    if (confirm('Clear all data and reset to fresh empty state?')) {
      if (typeof window !== 'undefined') {
        localStorage.clear();
      }
      setBasePrompt(DEFAULT_BASE_PROMPT);
      setAgents([CLEAN_DEFAULT_AGENT]);
      setDocuments([]);
      setCalls([]);
      setProjects(CLEAN_PROJECTS);
      setAuditLogs([]);
    }
  };

  return (
    <AppContext.Provider
      value={{
        basePrompt,
        setBasePrompt,
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
        addProject,
        deleteProject,
        agents,
        createAgent,
        updateAgent,
        deleteAgent,
        restorePromptVersion,
        documents,
        addDocument,
        updateDocument,
        reindexDocument,
        deleteDocument,
        calls,
        addCallRecord,
        upsertCall,
        clearCallHistory,
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
        resetAllData,
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
