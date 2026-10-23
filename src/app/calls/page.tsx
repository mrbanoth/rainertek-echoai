'use client';

import React, { useState } from 'react';
import {
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Play,
  Pause,
  Volume2,
  X,
  BookOpen,
  DollarSign,
  Activity,
  Layers,
  ShieldCheck,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CallSessionRecord, CallDirection, CallOutcome } from '@/types';

export default function CallHistoryPage() {
  const {
    calls,
    projects,
    agents,
    selectedProject,
    setSelectedProject,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [directionFilter, setDirectionFilter] = useState<'ALL' | CallDirection>('ALL');
  const [outcomeFilter, setOutcomeFilter] = useState<'ALL' | CallOutcome>('ALL');
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('ALL');

  // Selected Call for Detail Drawer
  const [activeCallDetail, setActiveCallDetail] = useState<CallSessionRecord | null>(null);

  // Audio Playback Simulation State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioPlaybackSec, setAudioPlaybackSec] = useState(0);

  // Filtered Calls
  const filteredCalls = calls.filter((c) => {
    if (selectedProject !== 'ALL' && c.projectId !== selectedProject) return false;
    if (selectedAgentFilter !== 'ALL' && c.agentId !== selectedAgentFilter) return false;
    if (directionFilter !== 'ALL' && c.direction !== directionFilter) return false;
    if (outcomeFilter !== 'ALL' && c.outcome !== outcomeFilter) return false;
    if (
      searchQuery &&
      !c.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.agentName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.callerNumber.includes(searchQuery) &&
      !c.intent.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleOpenDrawer = (call: CallSessionRecord) => {
    setActiveCallDetail(call);
    setIsPlayingAudio(false);
    setAudioPlaybackSec(0);
  };

  const toggleAudio = () => {
    setIsPlayingAudio(!isPlayingAudio);
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#111A2E] border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <PhoneCall size={18} className="text-indigo-400" />
              Call History & Conversational Audit
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-bold">
              CALL LIFECYCLE VERIFIED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete inbound and outbound voice records, turn transcripts, cited knowledge sources, and telephony billing breakdown.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400">Total Records:</span>
          <span className="font-mono text-white font-bold bg-slate-900 px-2.5 py-1 rounded-md border border-slate-700">
            {calls.length} Sessions
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search call ID, caller, intent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder:text-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Direction Filter */}
          <select
            value={directionFilter}
            aria-label="Filter calls by direction"
            onChange={(e) => setDirectionFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 font-medium focus:outline-none"
          >
            <option value="ALL">All Directions</option>
            <option value="inbound">Inbound</option>
            <option value="outbound">Outbound</option>
          </select>

          {/* Outcome Filter */}
          <select
            value={outcomeFilter}
            aria-label="Filter calls by outcome"
            onChange={(e) => setOutcomeFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 font-medium focus:outline-none"
          >
            <option value="ALL">All Outcomes</option>
            <option value="completed">Completed</option>
            <option value="escalated">Escalated</option>
            <option value="failed">Failed</option>
            <option value="missed">Missed</option>
          </select>

          {/* Agent Filter */}
          <select
            value={selectedAgentFilter}
            aria-label="Filter calls by agent"
            onChange={(e) => setSelectedAgentFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 font-medium focus:outline-none"
          >
            <option value="ALL">All Agents</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
          Showing {filteredCalls.length} of {calls.length} calls
        </span>
      </div>

      {/* Call History Table */}
      <div className="rounded-xl bg-[#111A2E] border border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080D1A] text-slate-400 border-b border-slate-800 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Call ID & Timestamp</th>
                <th className="py-3 px-4">Direction</th>
                <th className="py-3 px-4">Project & Agent</th>
                <th className="py-3 px-4">Caller / Recipient</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Outcome</th>
                <th className="py-3 px-4">Escalation</th>
                <th className="py-3 px-4">Est. Cost</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredCalls.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No calls match your criteria.
                  </td>
                </tr>
              ) : (
                filteredCalls.map((call) => (
                  <tr
                    key={call.id}
                    onClick={() => handleOpenDrawer(call)}
                    className="hover:bg-slate-850/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-200 block">{call.id}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{call.startTime}</span>
                    </td>
                    <td className="py-3 px-4">
                      {call.direction === 'inbound' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 px-2 py-0.5 rounded">
                          <PhoneIncoming size={10} /> Inbound
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-400 bg-purple-950/60 border border-purple-500/40 px-2 py-0.5 rounded">
                          <PhoneOutgoing size={10} /> Outbound
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-indigo-300 font-semibold">
                          {call.projectId}
                        </span>
                        <span className="text-slate-200 font-medium truncate">{call.agentName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {call.callerNumber}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {formatDuration(call.durationSeconds)}
                    </td>
                    <td className="py-3 px-4">
                      {call.outcome === 'completed' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={10} /> Completed
                        </span>
                      ) : call.outcome === 'escalated' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-full">
                          <UserCheck size={10} /> Escalated
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-950/80 border border-rose-500/40 px-2 py-0.5 rounded-full">
                          <XCircle size={10} /> Failed
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[11px] font-mono text-slate-400">
                      {call.escalationStatus === 'none' ? '—' : 'Supervisor Handoff'}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      ₹{call.estimatedCost.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDrawer(call);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-white"
                        aria-label="Inspect call details"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Call Detail Drawer / Slide Panel (Section 13 Requirements) */}
      {activeCallDetail && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl h-full bg-[#0F172A] border-l border-slate-800 shadow-2xl flex flex-col text-xs overflow-hidden">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-[#080D1A]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white text-sm">{activeCallDetail.id}</span>
                  <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                    {activeCallDetail.projectId}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">{activeCallDetail.startTime}</span>
              </div>
              <button
                onClick={() => setActiveCallDetail(null)}
                className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer Body Scroll */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Audio Waveform Player Simulation */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                    <Volume2 size={14} className="text-indigo-400" />
                    Telephony Audio Recording
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    {formatDuration(activeCallDetail.durationSeconds)}
                  </span>
                </div>

                {/* Simulated Audio Waveform Bars */}
                <div className="h-10 flex items-center gap-1 px-1 bg-slate-950 rounded-lg border border-slate-800/80">
                  {[20, 45, 75, 30, 90, 60, 40, 85, 55, 30, 70, 40, 80, 65, 35, 90, 50, 30].map(
                    (h, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all ${
                          isPlayingAudio ? 'bg-indigo-400 animate-pulse' : 'bg-slate-700'
                        }`}
                        style={{ height: `${h}%` }}
                      />
                    )
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={toggleAudio}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
                  >
                    {isPlayingAudio ? <Pause size={12} /> : <Play size={12} />}
                    {isPlayingAudio ? 'Pause Playback' : 'Play Audio Stream'}
                  </button>
                  <span className="text-[10px] font-mono text-slate-500">Opus 24kHz / G.711u</span>
                </div>
              </div>

              {/* Session Summary & Intent */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-slate-400">Inferred Call Intent</span>
                <p className="text-slate-200 font-medium">{activeCallDetail.intent}</p>
                {activeCallDetail.failureReason && (
                  <div className="mt-2 text-rose-400 font-mono text-[11px] bg-rose-950/60 p-2 rounded border border-rose-500/40">
                    Failure Reason: {activeCallDetail.failureReason}
                  </div>
                )}
              </div>

              {/* Complete Turn Transcript */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300">Conversation Transcript</span>
                <div className="space-y-2.5">
                  {activeCallDetail.transcript.map((turn) => (
                    <div
                      key={turn.id}
                      className={`p-3 rounded-lg text-xs leading-relaxed ${
                        turn.speaker === 'agent'
                          ? 'bg-slate-900 border border-slate-800 text-slate-200 ml-4'
                          : turn.speaker === 'human_supervisor'
                          ? 'bg-amber-950/40 border border-amber-500/40 text-amber-200'
                          : 'bg-indigo-950/40 border border-indigo-500/30 text-indigo-100 mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-slate-400">
                        <span className="font-bold uppercase">
                          {turn.speaker === 'agent'
                            ? activeCallDetail.agentName
                            : turn.speaker === 'human_supervisor'
                            ? 'Supervisor Hand-off'
                            : 'Caller'}
                        </span>
                        <span>{turn.timestamp}</span>
                      </div>
                      <p>{turn.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cited Knowledge Documents */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <BookOpen size={13} className="text-cyan-400" />
                  Knowledge Documents Referenced
                </span>
                <div className="space-y-1">
                  {activeCallDetail.citedKnowledgeSources.map((src, i) => (
                    <div
                      key={i}
                      className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[11px] flex items-center justify-between"
                    >
                      <span>{src}</span>
                      <span className="text-[10px] font-mono text-emerald-400">100% Match</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Telemetry Breakdown */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <DollarSign size={13} className="text-emerald-400" />
                    Telephony & AI Cost Breakdown
                  </span>
                  <span className="font-mono text-white font-bold">
                    ₹{activeCallDetail.estimatedCost.toFixed(2)}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 block">STT</span>
                    ₹{activeCallDetail.costBreakdown.stt.toFixed(2)}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">LLM</span>
                    ₹{activeCallDetail.costBreakdown.llm.toFixed(2)}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">TTS</span>
                    ₹{activeCallDetail.costBreakdown.tts.toFixed(2)}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">SIP</span>
                    ₹{activeCallDetail.costBreakdown.telephony.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
