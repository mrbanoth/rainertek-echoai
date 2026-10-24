'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  DollarSign,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Layers,
  Bot,
  PhoneCall,
  Activity,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function AnalyticsAndUsagePage() {
  const { metrics, projects, agents, calls } = useApp();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  // Export CSV Action
  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Call ID,Project,Agent,Direction,Duration(sec),Outcome,Cost(INR),Timestamp']
        .concat(
          calls.map(
            (c) =>
              `${c.id},${c.projectId},${c.agentName},${c.direction},${c.durationSeconds},${c.outcome},${c.estimatedCost},${c.startTime}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EchoAI_Usage_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#111A2E] border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <BarChart3 size={18} className="text-indigo-400" />
              Internal Telemetry & Cost Accounting
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold">
              ESTIMATED VS CONFIRMED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Usage notes for this Echo AI proof of concept. Not a billing system.
          </p>
        </div>

        {/* Time Filter & Export Button */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center rounded-lg bg-slate-900 p-1 border border-slate-700/80">
            {(['7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded text-[11px] font-semibold transition-colors ${
                  timeRange === r ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : 'Quarterly (90d)'}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Download size={13} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#111A2E] border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Estimated AI Engine Cost</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">
              ₹{metrics.estimatedAiCost.toFixed(2)}
            </span>
            <span className="text-[10px] text-indigo-400 font-mono">Neural Voice</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block mt-1">
            STT + Voice Synthesis Engine
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#111A2E] border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Estimated Telephony SIP Cost</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">
              ₹{metrics.estimatedTelephonyCost.toFixed(2)}
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">Trunking</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block mt-1">
            ₹0.45 / minute active connect
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#111A2E] border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Actual Provider Invoiced (MTD)</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400 font-mono">
              ₹{metrics.actualProviderCostMonthToDate.toFixed(2)}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">CONFIRMED</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block mt-1">
            Counted inside Echo AI
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#111A2E] border border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Clean Resolution Rate</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">
              {Math.round((metrics.completedCalls / (metrics.totalCalls || 1)) * 100)}%
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Target &gt;90%</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono block mt-1">
            Zero hallucination handoff
          </span>
        </div>
      </div>

      {/* Breakdowns: Usage by Project & Usage by Agent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Breakdown */}
        <div className="p-5 rounded-xl bg-[#111A2E] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Telephony Minutes by Project Scope</h3>
            <span className="text-[10px] font-mono text-slate-400">Total: 2,960 mins</span>
          </div>

          <div className="space-y-3">
            {projects.map((proj) => {
              const pct = Math.round((proj.connectedMinutesThisMonth / 2960) * 100);
              return (
                <div key={proj.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-slate-200">
                      {proj.name} ({proj.code})
                    </span>
                    <span className="font-mono text-white font-bold">{proj.connectedMinutesThisMonth}m ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1.5">
                    <span>Active Agents: {proj.agentCount}</span>
                    <span>Knowledge Docs: {proj.documentCount}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Agent Breakdown */}
        <div className="p-5 rounded-xl bg-[#111A2E] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Agent Efficiency & Call Volume</h3>
            <span className="text-[10px] font-mono text-slate-400">Target &gt;95%</span>
          </div>

          <div className="space-y-3">
            {agents.map((ag) => (
              <div key={ag.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">{ag.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                    {ag.projectId}
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-400">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Total Calls</span>
                    <strong className="text-white">{ag.totalCalls}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Resolution</span>
                    <strong className="text-emerald-400">{ag.successRate}%</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Voice Engine</span>
                    <span>{ag.voiceModel.split(' ')[1]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
