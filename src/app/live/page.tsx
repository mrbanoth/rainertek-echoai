'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Radio,
  UserCheck,
  Clock,
  Sparkles,
  BookOpen,
  Send,
  AlertTriangle,
  Info,
  CheckCircle2,
  Shield,
  Layers,
  ChevronRight,
  ExternalLink,
  Bot,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ThreeAssistant, AssistantVisualState } from '@/components/live/ThreeAssistant';

export default function LiveVoiceWorkspacePage() {
  const {
    agents,
    projects,
    selectedProject,
    selectedAgentId,
    setSelectedAgentId,
    liveCallState,
    startLiveCall,
    endLiveCall,
    toggleLiveMute,
    escalateToHuman,
    sendLiveUserMessage,
    documents,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [audioLevelSim, setAudioLevelSim] = useState(0.2);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  const activeAgent = agents.find((a) => a.id === liveCallState.agentId) || agents[0];

  // Auto scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveCallState.transcript]);

  // Audio level simulation when speaking/listening
  useEffect(() => {
    if (liveCallState.visual3DState === 'speaking' || liveCallState.visual3DState === 'listening') {
      const interval = setInterval(() => {
        setAudioLevelSim(0.2 + Math.random() * 0.7);
      }, 150);
      return () => clearInterval(interval);
    } else {
      setAudioLevelSim(0.05);
    }
  }, [liveCallState.visual3DState]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendLiveUserMessage(inputMessage);
    setInputMessage('');
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Verification and Environment Notice */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#111A2E] border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Radio size={18} className="text-indigo-400" />
              Live Voice Workspace
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-bold">
              SIMULATED TELEPHONY ENVIRONMENT
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time interactive session visualizer, audio stream synthesis, and knowledge-grounded context engine.
          </p>
        </div>

        {/* Call Status Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                liveCallState.status === 'connected'
                  ? 'bg-emerald-400 animate-pulse'
                  : liveCallState.status === 'connecting'
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-slate-500'
              }`}
            />
            <span className="font-semibold text-slate-200 uppercase font-mono text-[11px]">
              {liveCallState.status}
            </span>
            {liveCallState.status === 'connected' && (
              <span className="text-emerald-400 font-mono font-bold ml-1">
                {formatDuration(liveCallState.durationSeconds)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: 3D Assistant Orb (Left) & Live Context/Transcript (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Procedural 3D Assistant Visualizer & Controls */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="p-6 rounded-xl bg-[#111A2E] border border-slate-800 flex flex-col items-center justify-between relative overflow-hidden min-h-[440px]">
            {/* Top Info Header inside 3D Canvas */}
            <div className="w-full flex items-center justify-between text-xs z-10">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[11px] font-mono text-indigo-300">
                  {liveCallState.projectId}
                </span>
                <span className="text-slate-300 font-semibold">{activeAgent.name}</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                <span>Caller: {liveCallState.callerNumber}</span>
                <span>•</span>
                <span className="text-cyan-400">Inbound SIP</span>
              </div>
            </div>

            {/* Central 3D Procedural Visualizer */}
            <div className="relative w-full flex-1 flex items-center justify-center my-2">
              <ThreeAssistant
                state={liveCallState.visual3DState}
                audioLevel={audioLevelSim}
                className="w-full h-80 max-w-sm"
              />

              {/* Audio Reactive Equalizer Bars */}
              {liveCallState.status === 'connected' && (
                <div className="absolute bottom-2 flex items-center gap-1">
                  {[40, 70, 90, 60, 100, 50, 80, 45, 65, 30].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-indigo-500/80 rounded-full transition-all duration-150"
                      style={{
                        height: `${Math.max(4, h * audioLevelSim)}px`,
                        backgroundColor: liveCallState.isMuted
                          ? '#ef4444'
                          : liveCallState.visual3DState === 'speaking'
                          ? '#06b6d4'
                          : '#6366f1',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Visual State Indicator Pill */}
            <div className="z-10 flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Assistant State:</span>
              <span className="font-bold text-white uppercase px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-700">
                {liveCallState.visual3DState}
              </span>
              {liveCallState.isMuted && (
                <span className="text-rose-400 font-semibold flex items-center gap-1 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/40">
                  <MicOff size={12} /> MUTED
                </span>
              )}
              {liveCallState.isEscalated && (
                <span className="text-amber-400 font-semibold flex items-center gap-1 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
                  <UserCheck size={12} /> SUPERVISOR TAKEOVER
                </span>
              )}
            </div>
          </div>

          {/* Call Controls Area (Section 7 Requirements) */}
          <div className="p-4 rounded-xl bg-[#111A2E] border border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Agent Selector (when idle) */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Target Agent:</span>
                <select
                  disabled={liveCallState.status === 'connected'}
                  value={liveCallState.agentId}
                  aria-label="Select target agent for call"
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-md px-2.5 py-1.5 text-slate-200 font-semibold text-xs focus:outline-none disabled:opacity-50"
                >
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.projectId})
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {liveCallState.status !== 'connected' ? (
                  <button
                    onClick={() => startLiveCall(liveCallState.agentId)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-colors"
                  >
                    <PhoneCall size={14} />
                    Start Test Call
                  </button>
                ) : (
                  <>
                    {/* Mute Button */}
                    <button
                      onClick={toggleLiveMute}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors ${
                        liveCallState.isMuted
                          ? 'bg-rose-900/60 border-rose-500/40 text-rose-300'
                          : 'bg-slate-900 border-slate-700 text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {liveCallState.isMuted ? <MicOff size={14} /> : <Mic size={14} />}
                      {liveCallState.isMuted ? 'Unmute' : 'Mute'}
                    </button>

                    {/* Escalate to Human */}
                    <button
                      onClick={escalateToHuman}
                      disabled={liveCallState.isEscalated}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300 hover:bg-amber-900/60 text-xs font-semibold disabled:opacity-50 transition-colors"
                      title="Initiate warm transfer to human supervisor"
                    >
                      <UserCheck size={14} />
                      Escalate to Human
                    </button>

                    {/* End Call Button */}
                    <button
                      onClick={() => setShowEndConfirm(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md transition-colors"
                    >
                      <PhoneOff size={14} />
                      End Call
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* End Call Confirmation Modal */}
            {showEndConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
                <div className="w-full max-w-sm rounded-xl bg-[#0F172A] border border-slate-700 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                    <AlertTriangle size={18} />
                    End Active Voice Session?
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    This will disconnect the caller, commit the conversation transcript, and save usage metrics to Call History.
                  </p>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setShowEndConfirm(false)}
                      className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setShowEndConfirm(false);
                        endLiveCall();
                      }}
                      className="px-3 py-1.5 rounded bg-rose-600 text-white text-xs font-semibold hover:bg-rose-500"
                    >
                      Confirm Disconnect
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Live Transcript & Event Timeline */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Transcript Panel */}
          <div className="p-4 rounded-xl bg-[#111A2E] border border-slate-800 flex-1 flex flex-col min-h-[380px] max-h-[460px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Sparkles size={14} className="text-indigo-400" />
                Live Conversation Stream
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                {liveCallState.transcript.length} turns recorded
              </span>
            </div>

            {/* Transcript Messages Scroll */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
              {liveCallState.transcript.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 p-6">
                  <Bot size={28} className="mb-2 text-slate-600" />
                  <p className="font-semibold text-slate-400">Ready for Live Voice</p>
                  <p className="text-[11px] mt-1">Start a call or type below to test speech turns.</p>
                </div>
              ) : (
                liveCallState.transcript.map((t, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg text-xs leading-relaxed ${
                      t.speaker === 'agent'
                        ? 'bg-slate-900 border border-slate-800 text-slate-200 ml-4'
                        : t.speaker === 'human_supervisor'
                        ? 'bg-amber-950/40 border border-amber-500/40 text-amber-200'
                        : 'bg-indigo-950/40 border border-indigo-500/30 text-indigo-100 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-slate-400">
                      <span className="font-bold uppercase">
                        {t.speaker === 'agent'
                          ? `Agent (${activeAgent.name})`
                          : t.speaker === 'human_supervisor'
                          ? 'Supervisor Hand-off'
                          : 'Caller (Simulated)'}
                      </span>
                      <span>{t.timestamp}</span>
                    </div>
                    <p>{t.text}</p>
                  </div>
                ))
              )}
              <div ref={transcriptEndRef} />
            </div>

            {/* Manual Message Input for Voice Session Testing */}
            <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                disabled={liveCallState.status !== 'connected'}
                placeholder={
                  liveCallState.status === 'connected'
                    ? 'Speak or type caller message...'
                    : 'Start call above to send messages'
                }
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder:text-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={liveCallState.status !== 'connected' || !inputMessage.trim()}
                className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-50 transition-colors"
                aria-label="Send test caller turn"
              >
                <Send size={14} />
              </button>
            </form>
          </div>

          {/* Active Knowledge Sources & Event Timeline */}
          <div className="p-4 rounded-xl bg-[#111A2E] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <BookOpen size={14} className="text-cyan-400" />
                Active Knowledge Grounding
              </span>
              <span className="text-[10px] font-mono text-emerald-400">Zero Hallucination Guard</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              {documents
                .filter((d) => d.projectId === liveCallState.projectId)
                .slice(0, 2)
                .map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 text-slate-300"
                  >
                    <span className="truncate">{doc.title}</span>
                    <span className="text-[10px] font-mono text-slate-500">{doc.category}</span>
                  </div>
                ))}
            </div>

            {/* Event Timeline */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Call Lifecycle Events</span>
              <div className="mt-1 space-y-1 max-h-24 overflow-y-auto pr-1">
                {liveCallState.events.slice(-3).map((ev, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="truncate">↳ {ev.label}</span>
                    <span className="text-[10px] font-mono text-slate-500">{ev.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
