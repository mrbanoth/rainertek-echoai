'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { VoiceAgent, PhoneNumberRecord, InboundCallRecord, InboundCallMetric, OutboundCampaign } from '@/types';

interface AppContextType {
  // Sarvam API Key & Voice defaults
  sarvamApiKey: string;
  setSarvamApiKey: (key: string) => void;
  selectedVoice: string;
  setSelectedVoice: (v: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (l: string) => void;

  // Voice Agents
  agents: VoiceAgent[];
  activeAgent: VoiceAgent | null;
  setActiveAgent: (agent: VoiceAgent | null) => void;
  createAgent: (name: string, prompt?: string) => VoiceAgent;
  deleteAgent: (id: string) => void;

  // Phone Numbers (Sarvam Vobiz)
  phoneNumbers: PhoneNumberRecord[];
  addPhoneNumber: (number: string) => void;

  // Inbound Calls & Metrics (The loved graph!)
  inboundMetrics: InboundCallMetric[];
  inboundCalls: InboundCallRecord[];
  timeframe: '12h' | '24h';
  setTimeframe: (tf: '12h' | '24h') => void;

  // Outbound Campaigns
  campaigns: OutboundCampaign[];
  createCampaign: (name: string, agentId: string, count: number) => void;

  // Knowledge Context
  knowledgeContext: string;
  setKnowledgeContext: (ctx: string) => void;

  // UI state
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isCreateAgentModalOpen: boolean;
  setIsCreateAgentModalOpen: (open: boolean) => void;
}

const INITIAL_AGENTS: VoiceAgent[] = [
  {
    id: 'agent-1',
    name: 'J Laptop',
    creatorEmail: 'sandeepnaikb0@gmail.com',
    lastEdited: '3h ago',
    voiceModel: 'bulbul:v1',
    language: 'en-IN',
    appId: 'J-Laptop-faa2a2c2-89b1-41e9',
    assignedNumber: '+917965481286',
    greetingPrompt: 'Hello! Thank you for calling RainerTek. I am your voice agent assistant. How can I help you today?',
    status: 'active',
  },
];

const INITIAL_PHONE_NUMBERS: PhoneNumberRecord[] = [
  {
    id: 'phone-1',
    number: '+917965481286',
    group: '—',
    status: 'active',
    addedDate: '22 Oct 2026, 11:18 pm',
    updatedDate: '22 Oct 2026, 11:18 pm',
    renewsAt: '21 Nov 2026, 09:18 pm',
    assignedAgent: 'J Laptop',
  },
];

const INITIAL_GRAPH_METRICS_24H: InboundCallMetric[] = [
  { timeLabel: '20:00', calls: 0, concurrency: 0 },
  { timeLabel: '22:30', calls: 3, concurrency: 1 },
  { timeLabel: '23:30', calls: 1, concurrency: 1 },
  { timeLabel: '04:00', calls: 0, concurrency: 0 },
  { timeLabel: '09:30', calls: 2, concurrency: 1 },
  { timeLabel: '12:30', calls: 4, concurrency: 2 },
  { timeLabel: '15:00', calls: 0, concurrency: 0 },
];

const INITIAL_GRAPH_METRICS_12H: InboundCallMetric[] = [
  { timeLabel: '06:00', calls: 0, concurrency: 0 },
  { timeLabel: '08:00', calls: 1, concurrency: 1 },
  { timeLabel: '09:30', calls: 2, concurrency: 1 },
  { timeLabel: '11:00', calls: 1, concurrency: 1 },
  { timeLabel: '12:30', calls: 4, concurrency: 2 },
  { timeLabel: '14:00', calls: 2, concurrency: 1 },
];

const INITIAL_INBOUND_RECORDS: InboundCallRecord[] = [
  {
    id: 'inbound-1',
    agentName: 'J Laptop',
    status: 'active',
    appId: 'J-Laptop-faa2a2c2-...',
    phoneNumber: '+917965481286',
    createdAt: 'Oct 22, 11:26 PM',
    durationSeconds: 148,
    transcript: [
      { speaker: 'agent', text: 'Hello! Thank you for calling RainerTek. How may I assist you today?', time: '23:26:02' },
      { speaker: 'caller', text: 'Hi, I wanted to check the status of my laptop delivery.', time: '23:26:08' },
      { speaker: 'agent', text: 'Your laptop shipment was scanned into courier facility at 08:30 AM today.', time: '23:26:14' },
    ],
  },
];

const DEFAULT_KNOWLEDGE = `Welcome to RainerTek EchoAI voice assistant.
Operating on Sarvam AI voice engine.
Hotline: +917965481286
Agent: J Laptop
Company: RainerTek
Working Hours: Monday to Friday from 9:00 AM to 6:00 PM IST.
For escalation, transfer call to supervisor at extension 101.`;

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sarvamApiKey, setSarvamApiKeyState] = useState<string>('');
  const [selectedVoice, setSelectedVoiceState] = useState<string>('meera');
  const [selectedLanguage, setSelectedLanguageState] = useState<string>('en-IN');
  const [agents, setAgents] = useState<VoiceAgent[]>(INITIAL_AGENTS);
  const [activeAgent, setActiveAgent] = useState<VoiceAgent | null>(INITIAL_AGENTS[0]);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumberRecord[]>(INITIAL_PHONE_NUMBERS);
  const [inboundCalls, setInboundCalls] = useState<InboundCallRecord[]>(INITIAL_INBOUND_RECORDS);
  const [timeframe, setTimeframe] = useState<'12h' | '24h'>('24h');
  const [campaigns, setCampaigns] = useState<OutboundCampaign[]>([]);
  const [knowledgeContext, setKnowledgeContextState] = useState<string>(DEFAULT_KNOWLEDGE);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isCreateAgentModalOpen, setIsCreateAgentModalOpen] = useState<boolean>(false);

  // Restore saved state from localStorage
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('echoai_sarvam_api_key');
      if (savedKey) setSarvamApiKeyState(savedKey);

      const savedVoice = localStorage.getItem('echoai_selected_voice');
      if (savedVoice) setSelectedVoiceState(savedVoice);

      const savedLang = localStorage.getItem('echoai_selected_lang');
      if (savedLang) setSelectedLanguageState(savedLang);

      const savedAgents = localStorage.getItem('echoai_agents_list');
      if (savedAgents) {
        const parsed = JSON.parse(savedAgents);
        if (Array.isArray(parsed) && parsed.length > 0) setAgents(parsed);
      }

      const savedContext = localStorage.getItem('echoai_knowledge_context');
      if (savedContext) setKnowledgeContextState(savedContext);

      const savedSidebar = localStorage.getItem('echoai_sidebar_collapsed');
      if (savedSidebar !== null) setSidebarCollapsed(savedSidebar === 'true');
    } catch {}
  }, []);

  const setSarvamApiKey = (key: string) => {
    setSarvamApiKeyState(key);
    try {
      localStorage.setItem('echoai_sarvam_api_key', key);
    } catch {}
  };

  const setSelectedVoice = (v: string) => {
    setSelectedVoiceState(v);
    try {
      localStorage.setItem('echoai_selected_voice', v);
    } catch {}
  };

  const setSelectedLanguage = (l: string) => {
    setSelectedLanguageState(l);
    try {
      localStorage.setItem('echoai_selected_lang', l);
    } catch {}
  };

  const createAgent = (name: string, prompt?: string) => {
    const newAgent: VoiceAgent = {
      id: `agent-${Date.now()}`,
      name: name.trim() || 'New Voice Agent',
      creatorEmail: 'sandeepnaikb0@gmail.com',
      lastEdited: 'Just now',
      voiceModel: 'bulbul:v1',
      language: 'en-IN',
      appId: `${name.replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 7)}`,
      assignedNumber: '+917965481286',
      greetingPrompt: prompt || `Hello! This is ${name}. How may I help you today?`,
      status: 'active',
    };
    const updated = [newAgent, ...agents];
    setAgents(updated);
    setActiveAgent(newAgent);
    try {
      localStorage.setItem('echoai_agents_list', JSON.stringify(updated));
    } catch {}
    return newAgent;
  };

  const deleteAgent = (id: string) => {
    const updated = agents.filter((a) => a.id !== id);
    setAgents(updated);
    if (activeAgent?.id === id) {
      setActiveAgent(updated[0] || null);
    }
    try {
      localStorage.setItem('echoai_agents_list', JSON.stringify(updated));
    } catch {}
  };

  const addPhoneNumber = (num: string) => {
    const newRecord: PhoneNumberRecord = {
      id: `phone-${Date.now()}`,
      number: num,
      group: '—',
      status: 'active',
      addedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      updatedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      renewsAt: 'Next Month',
    };
    setPhoneNumbers([newRecord, ...phoneNumbers]);
  };

  const createCampaign = (name: string, agentId: string, count: number) => {
    const newCamp: OutboundCampaign = {
      id: `cmp-${Date.now().toString().slice(-4)}`,
      name,
      status: 'scheduled',
      targetCount: count,
      completedCount: 0,
      agentId,
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setCampaigns([newCamp, ...campaigns]);
  };

  const setKnowledgeContext = (ctx: string) => {
    setKnowledgeContextState(ctx);
    try {
      localStorage.setItem('echoai_knowledge_context', ctx);
    } catch {}
  };

  const toggleSidebar = () => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    try {
      localStorage.setItem('echoai_sidebar_collapsed', String(next));
    } catch {}
  };

  const inboundMetrics = timeframe === '24h' ? INITIAL_GRAPH_METRICS_24H : INITIAL_GRAPH_METRICS_12H;

  return (
    <AppContext.Provider
      value={{
        sarvamApiKey,
        setSarvamApiKey,
        selectedVoice,
        setSelectedVoice,
        selectedLanguage,
        setSelectedLanguage,
        agents,
        activeAgent,
        setActiveAgent,
        createAgent,
        deleteAgent,
        phoneNumbers,
        addPhoneNumber,
        inboundMetrics,
        inboundCalls,
        timeframe,
        setTimeframe,
        campaigns,
        createCampaign,
        knowledgeContext,
        setKnowledgeContext,
        sidebarCollapsed,
        toggleSidebar,
        isCreateAgentModalOpen,
        setIsCreateAgentModalOpen,
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
