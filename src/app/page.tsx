'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  DollarSign,
  Activity,
  Bot,
  BookOpen,
  Filter,
  ShieldAlert,
  ChevronRight,
  Radio,
  FileText,
  UserCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function OverviewDashboardPage() {
  const {
    metrics,
    projects,
    agents,
    calls,
    documents,
    auditLogs,
    selectedProject,
    setSelectedProject,
  } = useApp();

  const [dateFilter, setDateFilter] = useState<'today' | '7d' | '30d'>('7d');
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('ALL');

  // Filtered dataset
  const filteredCalls = calls.filter((c) => {
    if (selectedProject !== 'ALL' && c.projectId !== selectedProject) return false;
    if (selectedAgentFilter !== 'ALL' && c.agentId !== selectedAgentFilter) return false;
    return true;
  });

  const failedCalls = filteredCalls.filter((c) => c.status === 'failed' || c.outcome === 'failed');

  return (
    <div className="space-y-6">
      {/* Top Banner: Enterprise Scope & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#111A2E] border border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">RainerTek EchoAI Operational Overview</h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold">
              DEMO DATA GROUNDED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Internal telemetry, provider utilization, call outcomes, and agent health across RainerTek business units.
          </p>
        </div>

        {/* Global Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Project Selector */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5">
            <span className="text-slate-400 text-[11px] font-medium">Project:</span>
            <select
              value={selectedProject}
              aria-label="Filter overview by project"
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Units</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-900">
                  {p.code}
                </option>
              ))}
            </select>
          </div>

          {/* Agent Filter */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5">
            <span className="text-slate-400 text-[11px] font-medium">Agent:</span>
            <select
              value={selectedAgentFilter}
              aria-label="Filter overview by agent"
              onChange={(e) => setSelectedAgentFilter(e.target.value)}
              className="bg-transparent text-slate-200 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Agents</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id} className="bg-slate-900">
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Selector */}
          <div className="flex items-center rounded-lg bg-slate-900 p-1 border border-slate-700/80">
            {(['today', '7d', '30d'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setDateFilter(period)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                  dateFilter === period
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {period === 'today' ? 'Today' : period === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 10 Summary Metrics Cards Grid (Section 6 Requirements) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* 1. Total Calls */}
        <div className="p-3.5 rounded-xl bg-[#111A2E] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Calls</span>
            <PhoneCall size={14} className="text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{metrics.totalCalls}</span>
            <span className="text-[10px] text-emerald-400 font-medium flex items-center">
              +12% <TrendingUp size={10} className="ml-0.5" />
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">Provider Verified</span>
        </div>

        {/* 2. Inbound Calls */}
        <div className="p-3.5 rounded-xl bg-[#111A2E] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Inbound Calls</span>
            <PhoneIncoming size={14} className="text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{metrics.inboundCalls}</span>
            <span className="text-[10px] text-slate-400">
              {Math.round((metrics.inboundCalls / metrics.totalCalls) * 100)}% of total
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">Telephony SIP</span>
        </div>

        {/* 3. Outbound Calls */}
        <div className="p-3.5 rounded-xl bg-[#111A2E] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Outbound Calls</span>
            <PhoneOutgoing size={14} className="text-purple-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{metrics.outboundCalls}</span>
            <span className="text-[10px] text-slate-400">
              {Math.round((metrics.outboundCalls / metrics.totalCalls) * 100)}% of total
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">Automated Dialing</span>
        </div>

        {/* 4. Connected Minutes */}
        <div className="p-3.5 rounded-xl bg-[#111A2E] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Connected Time</span>
            <Clock size={14} className="text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{metrics.totalConnectedMinutes}</span>
            <span className="text-[11px] text-slate-400 font-mono">mins</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">Month to Date</span>
        </div>

        {/* 5. Completed Calls */}
        <div className="p-3.5 rounded-xl bg-[#111A2E] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Completed Clean</span>
            <CheckCircle2 size={14} className="text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400 font-mono">{metrics.completedCalls}</span>
            <span className="text-[10px] text-emerald-400">
              {Math.round((metrics.completedCalls / metrics.totalCalls) * 100)}%
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">Clean Resolution</span>
        </div>

        {/* 6. Failed Calls */}
        <div className="p-3.5 rounded-xl bg-[#111A2E] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Failed Calls</span>
            <XCircle size={14} className="text-rose-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-400 font-mono">{metrics.failedCalls}</span>
            <span className="text-[10px] text-rose-400 font-semibold">Needs Review</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">Carrier / Timeout</span>
        </div>

        {/* 7. Missed / Dropped */}
        <div className="p-3.5 rounded-xl bg-[#111A2E] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Missed / Dropped</span>
            <AlertTriangle size={14} className="text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-400 font-mono">{metrics.missedCalls}</span>
            <span className="text-[10px] text-slate-400">1.8%</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">Inbound Ring Unanswered</span>
        </div>

        {/* 8. Escalation Rate */}
        <div className="p-3.5 rounded-xl bg-[#111A2E] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Escalation Rate</span>
            <UserCheck size={14} className="text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{metrics.escalationRate}%</span>
            <span className="text-[10px] text-slate-400">Warm transfer</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">To Human Supervisor</span>
        </div>

        {/* 9. Average Duration */}
        <div className="p-3.5 rounded-xl bg-[#111A2E] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Avg Duration</span>
            <Activity size={14} className="text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">
              {Math.floor(metrics.avgCallDurationSeconds / 60)}m {metrics.avgCallDurationSeconds % 60}s
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">Voice turns</span>
        </div>

        {/* 10. Estimated Usage Cost */}
        <div className="p-3.5 rounded-xl bg-[#111A2E] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Estimated Cost</span>
            <DollarSign size={14} className="text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white font-mono">
              ₹{(metrics.estimatedAiCost + metrics.estimatedTelephonyCost).toFixed(2)}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono mt-1 block">
            AI: ₹{metrics.estimatedAiCost.toFixed(2)} | SIP: ₹{metrics.estimatedTelephonyCost.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Main Charts & Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Call Volume Over Time SVG Chart (2 columns) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#111A2E] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Call Volume & Concurrency Trends</h3>
              <p className="text-[11px] text-slate-400">Daily inbound vs outbound conversational traffic</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Inbound
              </span>
              <span className="flex items-center gap-1.5 text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Outbound
              </span>
            </div>
          </div>

          {/* Procedural Visual SVG Graph */}
          <div className="h-52 w-full pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="inboundGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="outboundGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="700" y2="30" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="700" y2="80" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="130" x2="700" y2="130" stroke="#1e293b" strokeDasharray="3 3" />

              {/* Inbound Area & Line */}
              <path
                d="M 0,140 Q 100,80 200,95 T 400,60 T 550,40 T 700,75 L 700,180 L 0,180 Z"
                fill="url(#inboundGrad)"
              />
              <path
                d="M 0,140 Q 100,80 200,95 T 400,60 T 550,40 T 700,75"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
              />

              {/* Outbound Area & Line */}
              <path
                d="M 0,160 Q 120,130 220,110 T 420,120 T 580,90 T 700,105 L 700,180 L 0,180 Z"
                fill="url(#outboundGrad)"
              />
              <path
                d="M 0,160 Q 120,130 220,110 T 420,120 T 580,90 T 700,105"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2.5"
              />
            </svg>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2 px-1">
              <span>Mon 10/17</span>
              <span>Tue 10/18</span>
              <span>Wed 10/19</span>
              <span>Thu 10/20</span>
              <span>Fri 10/21</span>
              <span>Sat 10/22</span>
              <span>Sun 10/23 (Today)</span>
            </div>
          </div>

          {/* Project & Agent Performance Bars */}
          <div className="pt-3 border-t border-slate-800 grid grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-400">HRMS Inquiries</span>
              <div className="text-white font-mono font-bold mt-0.5">1,240 mins</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: '45%' }} />
              </div>
            </div>
            <div>
              <span className="text-slate-400">QMS Deviation Triage</span>
              <div className="text-white font-mono font-bold mt-0.5">940 mins</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '32%' }} />
              </div>
            </div>
            <div>
              <span className="text-slate-400">LIMS Laboratory Logs</span>
              <div className="text-white font-mono font-bold mt-0.5">780 mins</div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '23%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Agent Availability & System Readiness */}
        <div className="p-5 rounded-xl bg-[#111A2E] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Agent Readiness</h3>
            <Link href="/agents" className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold">
              Manage Agents →
            </Link>
          </div>

          <div className="space-y-3">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-semibold text-slate-200 text-xs">{agent.name}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                    {agent.projectId}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Voice: {agent.voiceModel.split(' ')[1] || 'Sarvam'}</span>
                  <span>Success: <strong className="text-emerald-400">{agent.successRate}%</strong></span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Voice Launch Shortcut */}
          <div className="p-3.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <Radio size={14} className="text-indigo-400 animate-pulse" />
                Live Voice Console
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Interactive 3D procedural visualizer, live audio waveform, and real-time knowledge grounding.
            </p>
            <Link
              href="/live"
              className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Launch Live Workspace
              <ChevronRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Operational Feeds: Failed Calls Requiring Investigation & Recent System Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Failed Calls Requiring Investigation (Section 6) */}
        <div className="p-5 rounded-xl bg-[#111A2E] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-rose-300 flex items-center gap-1.5">
              <ShieldAlert size={16} className="text-rose-400" />
              Failed Calls Requiring Investigation ({failedCalls.length})
            </h3>
            <Link href="/calls" className="text-[11px] text-indigo-400 hover:text-indigo-300">
              Full Logs →
            </Link>
          </div>

          <div className="space-y-2">
            {failedCalls.slice(0, 3).map((call) => (
              <div
                key={call.id}
                className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-rose-400 font-bold">{call.id}</span>
                    <span className="text-slate-300 font-medium">({call.agentName})</span>
                  </div>
                  <span className="text-[10px] text-rose-300 bg-rose-900/60 px-2 py-0.5 rounded border border-rose-500/40">
                    {call.failureReason || 'Audio stream dropped'}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Caller: {call.callerNumber}</span>
                  <span>Time: {call.startTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Activity Feed (Call lifecycle, Knowledge updates, Audit) */}
        <div className="p-5 rounded-xl bg-[#111A2E] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <Activity size={16} className="text-indigo-400" />
              Enterprise Activity & Audit Feed
            </h3>
            <Link href="/audit" className="text-[11px] text-indigo-400 hover:text-indigo-300">
              Audit Trail →
            </Link>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {auditLogs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300">{log.action}</span>
                  <span className="text-[10px] font-mono text-slate-500">{log.timestamp.slice(11)}</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">{log.details}</p>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                  <span className="text-indigo-400 font-mono font-semibold">[{log.projectId}]</span>
                  <span>Actor: {log.actor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
