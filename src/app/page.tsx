'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowUp,
  Search,
  Bot,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  X,
  Plus,
  Play,
  Volume2,
  Clock,
  MoreVertical,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { VoiceAgent } from '@/types';

export default function AgentsPage() {
  const {
    agents,
    createAgent,
    sarvamApiKey,
    knowledgeContext,
    isCreateAgentModalOpen,
    setIsCreateAgentModalOpen,
  } = useApp();

  const [promptInput, setPromptInput] = useState('');
  const [searchRecents, setSearchRecents] = useState('');
  const [newAgentName, setNewAgentName] = useState('');

  // Active testing modal/call state for an agent
  const [activeCallAgent, setActiveCallAgent] = useState<VoiceAgent | null>(null);
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected'>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [transcript, setTranscript] = useState<Array<{ speaker: 'caller' | 'agent'; text: string; time: string }>>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [agentSpeaking, setAgentSpeaking] = useState(false);
  const [agentThinking, setAgentThinking] = useState(false);
  const [manualText, setManualText] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript, agentSpeaking, agentThinking]);

  // Call timer
  useEffect(() => {
    if (callStatus === 'connected') {
      timerRef.current = setInterval(() => setCallDuration((p) => p + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setCallDuration(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [callStatus]);

  // Speech recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const userSaid = event.results[current][0].transcript.trim();
          if (userSaid) {
            handleSpeak(userSaid);
          }
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    const name = promptInput.slice(0, 24);
    createAgent(name, promptInput);
    setPromptInput('');
  };

  const handleCreateAgentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim()) return;
    createAgent(newAgentName);
    setNewAgentName('');
    setIsCreateAgentModalOpen(false);
  };

  const startVoiceCall = (agent: VoiceAgent) => {
    setActiveCallAgent(agent);
    setCallStatus('calling');
    setTranscript([]);

    setTimeout(() => {
      setCallStatus('connected');
      const greeting = agent.greetingPrompt || `Hello! Thank you for calling RainerTek. I am ${agent.name}. How may I help you?`;
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setTranscript([{ speaker: 'agent', text: greeting, time }]);
      playAgentVoice(greeting);

      if (recognitionRef.current && !isMuted) {
        try {
          recognitionRef.current.start();
        } catch {}
      }
    }, 1000);
  };

  const endVoiceCall = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setCallStatus('idle');
    setActiveCallAgent(null);
    setAgentSpeaking(false);
    setAgentThinking(false);
  };

  const playAgentVoice = async (text: string) => {
    setAgentSpeaking(true);
    try {
      const resp = await fetch('/api/sarvam/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          speaker: activeCallAgent?.voiceModel || 'meera',
          language_code: activeCallAgent?.language || 'en-IN',
          apiKey: sarvamApiKey,
        }),
      });
      const data = await resp.json();
      if (data.audioBase64) {
        const audio = new Audio(data.audioBase64);
        audio.onended = () => setAgentSpeaking(false);
        await audio.play();
        return;
      }
    } catch {}

    // Fallback: Web speech
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.onend = () => setAgentSpeaking(false);
      window.speechSynthesis.speak(u);
    } else {
      setAgentSpeaking(false);
    }
  };

  const handleSpeak = async (userText: string) => {
    if (!userText.trim() || agentThinking) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setTranscript((prev) => [...prev, { speaker: 'caller', text: userText, time }]);
    setManualText('');
    setAgentThinking(true);

    try {
      const resp = await fetch('/api/sarvam/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          context: knowledgeContext,
        }),
      });
      const data = await resp.json();
      const reply = data.reply || 'I hear you. Let me check our knowledge base for details.';
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setTranscript((prev) => [...prev, { speaker: 'agent', text: reply, time: replyTime }]);
      setAgentThinking(false);
      playAgentVoice(reply);
    } catch {
      setAgentThinking(false);
      const fallback = 'Could you please repeat that?';
      setTranscript((prev) => [...prev, { speaker: 'agent', text: fallback, time }]);
      playAgentVoice(fallback);
    }
  };

  const filteredAgents = agents.filter((a) =>
    a.name.toLowerCase().includes(searchRecents.toLowerCase()) ||
    a.creatorEmail.toLowerCase().includes(searchRecents.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-12">
      {/* Hero Section: "What should your voice agent do?" */}
      <div className="flex flex-col items-center text-center space-y-6 pt-4">
        {/* Subtle Robot Graphic Icon matching screenshot */}
        <div className="w-16 h-16 rounded-2xl bg-slate-100/90 flex items-center justify-center text-slate-300">
          <Bot size={36} />
        </div>

        <h1 className="text-3xl font-medium tracking-tight text-slate-900 font-serif">
          What should your voice agent do?
        </h1>

        {/* Big Search / Input Bar with Arrow Button */}
        <form
          onSubmit={handlePromptSubmit}
          className="w-full max-w-2xl relative flex items-center"
        >
          <input
            type="text"
            placeholder="Create a voice agent to answer calls and confirm appointments"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            className="w-full py-4 pl-5 pr-14 rounded-full border border-slate-200 bg-white shadow-xs text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 transition-colors"
          />
          <button
            type="submit"
            disabled={!promptInput.trim()}
            className="absolute right-2.5 w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-950 disabled:opacity-30 text-white flex items-center justify-center transition-all"
          >
            <ArrowUp size={18} />
          </button>
        </form>
      </div>

      {/* Recents Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-slate-900">Recents</h2>

        {/* Filter input */}
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search"
            value={searchRecents}
            onChange={(e) => setSearchRecents(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
          />
        </div>

        {/* Agent Table Header */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-4 py-1">
          <span>Agent</span>
          <span>Last edited</span>
        </div>

        {/* Recents List */}
        <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              onClick={() => startVoiceCall(agent)}
              className="flex items-center justify-between px-4 py-3.5 hover:bg-slate-50 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3">
                {/* Pixelated / Gold-toned avatar box matching screenshot */}
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs border border-amber-200 flex-shrink-0">
                  JL
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-900 group-hover:text-slate-700">
                    {agent.name}
                  </div>
                  <div className="text-xs text-slate-500 font-mono">
                    {agent.creatorEmail}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-400">{agent.lastEdited}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    startVoiceCall(agent);
                  }}
                  className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <PhoneCall size={12} />
                  <span>Call Agent</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: "Name your agent" (Matching Screenshot 2) */}
      {isCreateAgentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Name your agent</h3>
              <button
                onClick={() => setIsCreateAgentModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAgentSubmit} className="space-y-6">
              <input
                type="text"
                autoFocus
                placeholder="e.g. Sales bot"
                value={newAgentName}
                onChange={(e) => setNewAgentName(e.target.value)}
                className="w-full px-4 py-3 rounded-full border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-slate-500"
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateAgentModalOpen(false)}
                  className="px-5 py-2.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newAgentName.trim()}
                  className="px-6 py-2.5 rounded-full bg-slate-600 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Create agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live Voice Call Drawer / Modal */}
      {activeCallAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 flex flex-col space-y-4 max-h-[85vh]">
            {/* Call Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <PhoneCall size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Live Session with {activeCallAgent.name}
                  </h3>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Hotline: {activeCallAgent.assignedNumber || '+917965481286'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {callStatus === 'connected' && (
                  <span className="text-xs font-mono font-bold text-emerald-600 px-2 py-0.5 rounded-full bg-emerald-50">
                    {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
                  </span>
                )}
                <button
                  onClick={endVoiceCall}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Speaking / Waveform Indicator */}
            <div className="py-2 flex items-center justify-center gap-2 text-xs">
              {agentSpeaking ? (
                <div className="flex items-center gap-1.5 text-indigo-600 font-medium">
                  <Volume2 size={15} className="animate-pulse" />
                  <span>Agent is speaking...</span>
                </div>
              ) : agentThinking ? (
                <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-ping" />
                  <span>Searching Knowledge Base...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
                  <Mic size={15} className="animate-pulse" />
                  <span>Listening to your microphone...</span>
                </div>
              )}
            </div>

            {/* Conversation Transcript */}
            <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs min-h-[220px]">
              {transcript.map((t, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${t.speaker === 'agent' ? 'items-start' : 'items-end'}`}
                >
                  <div className="text-[10px] text-slate-400 mb-0.5">
                    {t.speaker === 'agent' ? activeCallAgent.name : 'You'} • {t.time}
                  </div>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 leading-relaxed text-xs ${
                      t.speaker === 'agent'
                        ? 'bg-white text-slate-800 border border-slate-200'
                        : 'bg-slate-900 text-white'
                    }`}
                  >
                    {t.text}
                  </div>
                </div>
              ))}
              <div ref={transcriptEndRef} />
            </div>

            {/* Text Input Option */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSpeak(manualText);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Type question or speak into microphone..."
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-full border border-slate-200 text-xs focus:outline-none focus:border-slate-400"
              />
              <button
                type="submit"
                disabled={!manualText.trim()}
                className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold disabled:opacity-40"
              >
                Send
              </button>
            </form>

            {/* Call Footer */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-500">
                Powered by Sarvam Voice Engine
              </span>
              <button
                onClick={endVoiceCall}
                className="px-4 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <PhoneOff size={13} />
                <span>End Call</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
