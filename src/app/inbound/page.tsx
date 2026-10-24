'use client';

import React, { useState } from 'react';
import {
  PhoneIncoming,
  Plus,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Sliders,
  ShieldCheck,
  Globe,
  ChevronRight,
  X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { ProjectId } from '@/types';

export default function InboundCallingRoutesPage() {
  const { calls, agents, projects, selectedProject, userRole } = useApp();

  const echoHrNumber = process.env.NEXT_PUBLIC_SARVAM_PHONE_NUMBER || '+917965481343';

  const [inboundRoutes, setInboundRoutes] = useState([
    {
      id: 'route-primary-main',
      phoneNumber: echoHrNumber,
      provider: 'Sarvam',
      projectId: 'GENERAL',
      agentId: process.env.NEXT_PUBLIC_SARVAM_AGENT_ID || 'EchoHR-9c389d81-8777',
      agentName: 'Not connected',
      status: 'paused',
      greeting: 'The previous EchoHR deployment was removed. Attach a new agent before this number can answer.',
      supportedLanguages: ['en-IN', 'hi-IN'],
      fallbackNumber: 'Not set',
      totalCalls: calls.filter((c) => c.direction === 'inbound').length,
    },
  ]);

  React.useEffect(() => {
    fetch('/api/sarvam/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.sarvamPhoneNumber) {
          setInboundRoutes((prev) =>
            prev.map((r, i) =>
              i === 0
                ? {
                    ...r,
                    phoneNumber: data.sarvamPhoneNumber,
                    provider: 'Sarvam AI Samvaad Telephony',
                  }
                : r
            )
          );
        }
      })
      .catch(() => {});
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNumber, setNewNumber] = useState('');
  const [newProjectId, setNewProjectId] = useState<ProjectId>('GENERAL');
  const [newAgentId, setNewAgentId] = useState(agents[0]?.id || '');
  const [newGreeting, setNewGreeting] = useState('');
  const [newFallback, setNewFallback] = useState('');

  const inboundCallsList = calls.filter((c) => c.direction === 'inbound');

  const handleCreateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNumber.trim()) return;
    const targetAgent = agents.find((a) => a.id === newAgentId);

    setInboundRoutes((prev) => [
      ...prev,
      {
        id: `route-${Date.now()}`,
        phoneNumber: newNumber,
        provider: 'Echo AI phone line',
        projectId: newProjectId,
        agentId: newAgentId,
        agentName: targetAgent?.name || 'Assigned Agent',
        status: 'active',
        greeting: newGreeting || 'Hello, this is Echo AI.',
        supportedLanguages: ['en-IN'],
        fallbackNumber: newFallback,
        totalCalls: 0,
      },
    ]);

    setIsModalOpen(false);
    setNewNumber('');
    setNewGreeting('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#111A2E] border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <PhoneIncoming size={18} className="text-cyan-400" />
              Inbound Call Routing & Telephony Ingress
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold">
              ENTERPRISE SIP TRUNKED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Associate carrier phone numbers with designated AI agents, define greeting parameters, and set fallback human escalation routes.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          disabled={userRole === 'Read-only viewer'}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-xs disabled:opacity-40 transition-colors"
        >
          <Plus size={14} />
          Assign Telephony Route
        </button>
      </div>

      {/* Inbound Routes Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {inboundRoutes.map((route) => (
          <div
            key={route.id}
            className="p-5 rounded-xl bg-[#111A2E] border border-slate-800 flex flex-col justify-between space-y-4 text-xs"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  {route.phoneNumber}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30 font-semibold">
                  {route.projectId}
                </span>
              </div>

              <div className="mt-3">
                <span className="text-[10px] text-slate-500 font-mono block">Bound AI Agent</span>
                <span className="text-sm font-bold text-white">{route.agentName}</span>
              </div>

              <div className="mt-2.5 p-2.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 italic">
                "{route.greeting}"
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2 text-[11px] font-mono text-slate-400">
              <div className="flex justify-between">
                <span>Fallback Transfer:</span>
                <span className="text-slate-300">{route.fallbackNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Calls Ingested:</span>
                <span className="text-white font-bold">{route.totalCalls} calls</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Inbound Calls Feed */}
      <div className="p-5 rounded-xl bg-[#111A2E] border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Recent Inbound Telephony Traffic</h3>
          <span className="text-[11px] font-mono text-slate-400">
            {inboundCallsList.length} verified sessions
          </span>
        </div>

        <div className="space-y-2">
          {inboundCallsList.slice(0, 4).map((call) => (
            <div
              key={call.id}
              className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <PhoneIncoming size={14} className="text-cyan-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">{call.callerNumber}</span>
                    <span className="text-slate-400">→ {call.agentName}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{call.startTime}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-right">
                <span className="text-slate-400">{Math.floor(call.durationSeconds / 60)}m {call.durationSeconds % 60}s</span>
                <span className="text-emerald-400 font-semibold text-[10px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                  {call.outcome}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Assign Route Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-[#0F172A] border border-slate-700 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">Assign Telephony Number Route</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateRoute} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Carrier Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="+917965481343"
                  value={newNumber}
                  onChange={(e) => setNewNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Project Scope</label>
                  <select
                    value={newProjectId}
                    onChange={(e) => setNewProjectId(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none text-xs"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.code}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Target Agent</label>
                  <select
                    value={newAgentId}
                    onChange={(e) => setNewAgentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none text-xs"
                  >
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Greeting Prompt</label>
                <textarea
                  rows={2}
                  placeholder="Hello, this is Echo AI. How can I help you today?"
                  value={newGreeting}
                  onChange={(e) => setNewGreeting(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Fallback Transfer Destination</label>
                <input
                  type="text"
                  value={newFallback}
                  onChange={(e) => setNewFallback(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
                >
                  Activate Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
