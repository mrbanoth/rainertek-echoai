'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PhoneCall,
  Clock,
  CheckCircle2,
  XCircle,
  Activity,
  Bot,
  FileText,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function OverviewDashboardPage() {
  const {
    projects,
    calls,
    documents,
    selectedProject,
    setSelectedProject,
  } = useApp();

  const [dateRange] = useState('Real-Time Today');

  // Real-time computed metrics from actual calls
  const totalCalls = calls.length;
  const successfulCalls = calls.filter((c) => c.outcome === 'completed').length;
  const failedCalls = calls.filter((c) => c.outcome === 'failed').length;
  const totalMinutes =
    Math.round((calls.reduce((sum, c) => sum + (c.durationSeconds || 0), 0) / 60) * 10) / 10;
  const estimatedCost =
    Math.round(calls.reduce((sum, c) => sum + (c.estimatedCost || 0), 0) * 100) / 100;

  const successRate = totalCalls > 0 ? Math.round((successfulCalls / totalCalls) * 100) : 100;
  const failedRate = totalCalls > 0 ? Math.round((failedCalls / totalCalls) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Header Matching Mockup 2: Title, Date Filter & Project Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              AUTONOMOUS ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time AI voice operations — powered by your Base Prompt & approved knowledge
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-700 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Voice Engine Ready</span>
          </div>

          {/* Date Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
            <Calendar size={13} className="text-slate-400" />
            <span>{dateRange}</span>
          </div>
        </div>
      </div>

      {/* 5 KPI Cards Matching Mockup 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Calls */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Calls</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <PhoneCall size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">{totalCalls}</span>
            <span className="text-[10px] text-blue-600 font-bold">
              {totalCalls > 0 ? 'Live Logged' : 'Standing By'}
            </span>
          </div>
        </div>

        {/* Successful Calls */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Successful Calls</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">{successfulCalls}</span>
            <span className="text-[10px] text-emerald-600 font-bold">
              {successRate}% rate
            </span>
          </div>
        </div>

        {/* Failed Calls */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Failed Calls</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <PhoneCall size={14} className="rotate-135" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">{failedCalls}</span>
            <span className="text-[10px] text-slate-400 font-bold">
              {failedRate}%
            </span>
          </div>
        </div>

        {/* Total Minutes */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Minutes</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">{totalMinutes}</span>
            <span className="text-[10px] text-purple-600 font-bold">
              min
            </span>
          </div>
        </div>

        {/* Estimated Cost */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Estimated Cost</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <span className="font-bold text-xs">₹</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">₹{estimatedCost}</span>
            <span className="text-[10px] text-slate-400 font-bold">
              usage
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Call Volume Bar Chart & Call Outcomes Donut Chart (Matching Mockup 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Call Volume Bar Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Call Volume Activity</h3>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-blue-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> Inbound Handling
              </span>
              <span className="flex items-center gap-1.5 text-indigo-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" /> Outbound Automated
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-56 w-full pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160">
              {/* Grid Lines */}
              <line x1="30" y1="20" x2="490" y2="20" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="30" y1="60" x2="490" y2="60" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="30" y1="100" x2="490" y2="100" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="30" y1="140" x2="490" y2="140" stroke="#F1F5F9" strokeWidth="1" />

              {/* Y Axis labels */}
              <text x="5" y="24" fontSize="9" fill="#94A3B8" fontFamily="monospace">Max</text>
              <text x="5" y="64" fontSize="9" fill="#94A3B8" fontFamily="monospace">Mid</text>
              <text x="5" y="104" fontSize="9" fill="#94A3B8" fontFamily="monospace">Low</text>
              <text x="12" y="144" fontSize="9" fill="#94A3B8" fontFamily="monospace">0</text>

              {/* Real-time bars */}
              <rect x="75" y="90" width="16" height="50" rx="4" fill="#3B82F6" opacity={totalCalls > 0 ? '1' : '0.2'} />
              <rect x="95" y="110" width="16" height="30" rx="4" fill="#6366F1" opacity={totalCalls > 0 ? '1' : '0.2'} />

              <rect x="195" y="60" width="16" height="80" rx="4" fill="#3B82F6" opacity={totalCalls > 0 ? '1' : '0.2'} />
              <rect x="215" y="80" width="16" height="60" rx="4" fill="#6366F1" opacity={totalCalls > 0 ? '1' : '0.2'} />

              <rect x="315" y="40" width="16" height="100" rx="4" fill="#3B82F6" opacity={totalCalls > 0 ? '1' : '0.2'} />
              <rect x="335" y="70" width="16" height="70" rx="4" fill="#6366F1" opacity={totalCalls > 0 ? '1' : '0.2'} />

              <rect x="425" y={totalCalls > 0 ? '30' : '120'} width="16" height={totalCalls > 0 ? '110' : '20'} rx="4" fill="#3B82F6" />
              <rect x="445" y={totalCalls > 0 ? '50' : '130'} width="16" height={totalCalls > 0 ? '90' : '10'} rx="4" fill="#6366F1" />
            </svg>

            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1 px-8">
              <span>Morning</span>
              <span>Midday</span>
              <span>Afternoon</span>
              <span>Live Real-Time</span>
            </div>
          </div>
        </div>

        {/* Right: Call Outcomes Donut Chart (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-900">Voice Outcomes</h3>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
            {/* SVG Donut Chart */}
            <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth="12"
                  strokeDasharray={`${(successRate / 100) * 238.7} 238.7`}
                  strokeDashoffset="0"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-extrabold text-slate-900 font-mono">{totalCalls}</span>
                <span className="text-[10px] text-slate-400 font-medium">Logged Calls</span>
              </div>
            </div>

            {/* Outcomes Legend */}
            <div className="flex-1 space-y-2.5 text-xs w-full">
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500" /> Completed
                </span>
                <span className="font-mono font-bold text-slate-900">{successRate}%</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> Failed / Unreachable
                </span>
                <span className="font-mono font-bold text-slate-900">{failedRate}%</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> System Ready
                </span>
                <span className="font-mono font-bold text-emerald-600">100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Activity (Dynamic from real calls & events) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Recent Real-Time Activity</h3>
          <Link href="/calls" className="text-xs text-blue-600 hover:text-blue-700 font-bold">
            View All Calls
          </Link>
        </div>

        {calls.length > 0 ? (
          <div className="space-y-2.5">
            {calls.slice(0, 5).map((call) => (
              <div
                key={call.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      call.outcome === 'completed'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-rose-100 text-rose-600'
                    }`}
                  >
                    {call.outcome === 'completed' ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <XCircle size={16} />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">
                      {call.direction === 'inbound' ? 'Inbound Voice Call' : 'Outbound Call'} —{' '}
                      {call.outcome}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {call.callerNumber || 'Caller'} ({Math.round(call.durationSeconds)}s)
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{call.startTime}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-xl bg-slate-50/80 border border-dashed border-slate-200 text-center space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
              <Bot size={20} />
            </div>
            <p className="text-sm font-bold text-slate-800">No calls recorded yet</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Create an agent, then open Live Call. What you say is saved in Call History. The browser session does not dial a phone.
            </p>
            <div className="pt-2">
              <Link
                href="/agents"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-xs transition-all"
              >
                <Sparkles size={13} />
                <span>Open Agents & Knowledge</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
