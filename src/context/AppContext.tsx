'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CallLog {
  id: string;
  timestamp: string;
  durationSeconds: number;
  caller: string;
  turns: Array<{
    speaker: 'caller' | 'agent';
    text: string;
    time: string;
  }>;
  voiceModel: string;
  language: string;
  status: 'completed' | 'dropped';
}

interface AppContextType {
  // Sarvam & Phone config
  sarvamApiKey: string;
  setSarvamApiKey: (key: string) => void;
  hotlineNumber: string;
  setHotlineNumber: (num: string) => void;
  selectedVoice: string;
  setSelectedVoice: (voice: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;

  // Real Knowledge Context that the voice agent answers from
  knowledgeContext: string;
  setKnowledgeContext: (ctx: string) => void;

  // Real Call Logs (only actual sessions conducted)
  callLogs: CallLog[];
  addCallLog: (log: Omit<CallLog, 'id' | 'timestamp'>) => void;
  clearCallLogs: () => void;

  // UI state
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const DEFAULT_INITIAL_CONTEXT = `Welcome to RainerTek.
RainerTek provides enterprise voice intelligence and software engineering solutions.
Working Hours: Monday to Friday, 9:00 AM to 6:00 PM IST.
Support Email: support@rainertek.com
Hotline: +91 80 4718 9000
For urgent technical escalations, contact the on-call engineer at extension 404.
Our AI voice platform is powered by Sarvam AI for multilingual natural speech in Indian languages and English.`;

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [sarvamApiKey, setSarvamApiKeyState] = useState<string>('');
  const [hotlineNumber, setHotlineNumberState] = useState<string>('+91 80 4718 9000');
  const [selectedVoice, setSelectedVoiceState] = useState<string>('meera');
  const [selectedLanguage, setSelectedLanguageState] = useState<string>('en-IN');
  const [knowledgeContext, setKnowledgeContextState] = useState<string>(DEFAULT_INITIAL_CONTEXT);
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Restore real settings from localStorage on client mount
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('echoai_sarvam_api_key');
      if (savedKey) setSarvamApiKeyState(savedKey);

      const savedNumber = localStorage.getItem('echoai_hotline_number');
      if (savedNumber) setHotlineNumberState(savedNumber);

      const savedVoice = localStorage.getItem('echoai_selected_voice');
      if (savedVoice) setSelectedVoiceState(savedVoice);

      const savedLang = localStorage.getItem('echoai_selected_lang');
      if (savedLang) setSelectedLanguageState(savedLang);

      const savedContext = localStorage.getItem('echoai_knowledge_context');
      if (savedContext) setKnowledgeContextState(savedContext);

      const savedLogs = localStorage.getItem('echoai_call_logs');
      if (savedLogs) {
        const parsed = JSON.parse(savedLogs);
        if (Array.isArray(parsed)) setCallLogs(parsed);
      }

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

  const setHotlineNumber = (num: string) => {
    setHotlineNumberState(num);
    try {
      localStorage.setItem('echoai_hotline_number', num);
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

  const setKnowledgeContext = (ctx: string) => {
    setKnowledgeContextState(ctx);
    try {
      localStorage.setItem('echoai_knowledge_context', ctx);
    } catch {}
  };

  const addCallLog = (logData: Omit<CallLog, 'id' | 'timestamp'>) => {
    const newLog: CallLog = {
      ...logData,
      id: `CALL-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
    };
    const updated = [newLog, ...callLogs];
    setCallLogs(updated);
    try {
      localStorage.setItem('echoai_call_logs', JSON.stringify(updated));
    } catch {}
  };

  const clearCallLogs = () => {
    setCallLogs([]);
    try {
      localStorage.removeItem('echoai_call_logs');
    } catch {}
  };

  const toggleSidebar = () => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    try {
      localStorage.setItem('echoai_sidebar_collapsed', String(next));
    } catch {}
  };

  return (
    <AppContext.Provider
      value={{
        sarvamApiKey,
        setSarvamApiKey,
        hotlineNumber,
        setHotlineNumber,
        selectedVoice,
        setSelectedVoice,
        selectedLanguage,
        setSelectedLanguage,
        knowledgeContext,
        setKnowledgeContext,
        callLogs,
        addCallLog,
        clearCallLogs,
        sidebarCollapsed,
        toggleSidebar,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
