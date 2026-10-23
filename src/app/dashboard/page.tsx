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
  Building2,
  Calendar,
  Layers,
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

  const [dateRange, setDateRange] = useState('Oct 1, 2026 - Oct 23, 2026');

  return (
    <div className="space-y-6">
      {/* Top Header Matching Mockup 2: Title, Date Filter & Project Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of AI voice activities across RainerTek
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Date Picker Button */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs cursor-pointer hover:border-slate-300">
            <Calendar size={13} className="text-slate-400" />
            <span>{dateRange}</span>
          </div>

          {/* All Projects Dropdown */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-xs">
            <select
              value={selectedProject}
              aria-label="Filter active workspace by department"
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-transparent text-slate-800 font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Projects</option>
              <option value="HRMS">HRMS</option>
              <option value="QMS">QMS</option>
              <option value="LIMS">LIMS</option>
              <option value="IT">IT Infrastructure</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5 KPI Cards Matching Mockup 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Calls: 1,248 (+12%) */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Calls</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <PhoneCall size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">1,248</span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center">
              ↑ 12%
            </span>
          </div>
        </div>

        {/* Successful Calls: 1,152 (+14%) */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Successful Calls</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">1,152</span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center">
              ↑ 14%
            </span>
          </div>
        </div>

        {/* Failed Calls: 68 (-5%) */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Failed Calls</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <PhoneCall size={14} className="rotate-135" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">68</span>
            <span className="text-[10px] text-rose-600 font-bold flex items-center">
              ↓ 5%
            </span>
          </div>
        </div>

        {/* Total Minutes: 523.6 (+21%) */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Minutes</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">523.6</span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center">
              ↑ 21%
            </span>
          </div>
        </div>

        {/* Estimated Cost: ₹1,892 (+9%) */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Estimated Cost</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <span className="font-bold text-xs">₹</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-2xl font-extrabold text-slate-900 font-mono">₹1,892</span>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center">
              ↑ 9%
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Call Volume Bar Chart & Call Outcomes Donut Chart (Matching Mockup 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Call Volume Bar Chart (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Call Volume</h3>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-blue-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> Inbound
              </span>
              <span className="flex items-center gap-1.5 text-indigo-600">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" /> Outbound
              </span>
            </div>
          </div>

          {/* SVG Bar Chart matching Mockup 2 */}
          <div className="h-56 w-full pt-4">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160">
              {/* Grid Lines */}
              <line x1="30" y1="20" x2="490" y2="20" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="30" y1="60" x2="490" y2="60" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="30" y1="100" x2="490" y2="100" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="30" y1="140" x2="490" y2="140" stroke="#F1F5F9" strokeWidth="1" />

              {/* Y Axis labels */}
              <text x="5" y="24" fontSize="9" fill="#94A3B8" fontFamily="monospace">200</text>
              <text x="5" y="64" fontSize="9" fill="#94A3B8" fontFamily="monospace">150</text>
              <text x="5" y="104" fontSize="9" fill="#94A3B8" fontFamily="monospace">100</text>
              <text x="12" y="144" fontSize="9" fill="#94A3B8" fontFamily="monospace">50</text>

              {/* Day Bars (Oct 1 to Oct 23) */}
              {/* Oct 1 */}
              <rect x="55" y="70" width="10" height="70" rx="3" fill="#3B82F6" />
              <rect x="68" y="90" width="10" height="50" rx="3" fill="#6366F1" />

              {/* Oct 5 */}
              <rect x="125" y="45" width="10" height="95" rx="3" fill="#3B82F6" />
              <rect x="138" y="75" width="10" height="65" rx="3" fill="#6366F1" />

              {/* Oct 10 */}
              <rect x="195" y="55" width="10" height="85" rx="3" fill="#3B82F6" />
              <rect x="208" y="65" width="10" height="75" rx="3" fill="#6366F1" />

              {/* Oct 15 */}
              <rect x="265" y="30" width="10" height="110" rx="3" fill="#3B82F6" />
              <rect x="278" y="50" width="10" height="90" rx="3" fill="#6366F1" />

              {/* Oct 20 */}
              <rect x="335" y="40" width="10" height="100" rx="3" fill="#3B82F6" />
              <rect x="348" y="60" width="10" height="80" rx="3" fill="#6366F1" />

              {/* Oct 23 */}
              <rect x="405" y="50" width="10" height="90" rx="3" fill="#3B82F6" />
              <rect x="418" y="70" width="10" height="70" rx="3" fill="#6366F1" />
            </svg>

            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1 px-8">
              <span>Oct 1</span>
              <span>Oct 5</span>
              <span>Oct 10</span>
              <span>Oct 15</span>
              <span>Oct 20</span>
              <span>Oct 23</span>
            </div>
          </div>
        </div>

        {/* Right: Call Outcomes Donut Chart (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-900">Call Outcomes</h3>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-2">
            {/* SVG Donut Chart */}
            <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle cx="50" cy="50" r="38" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                {/* Completed 92% (Cyan/Blue) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#06B6D4"
                  strokeWidth="12"
                  strokeDasharray="219.5 238.7"
                  strokeDashoffset="0"
                />
                {/* Failed 4% (Rose) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#F43F5E"
                  strokeWidth="12"
                  strokeDasharray="9.5 238.7"
                  strokeDashoffset="-219.5"
                />
                {/* Missed 3% (Amber) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="12"
                  strokeDasharray="7.1 238.7"
                  strokeDashoffset="-229"
                />
                {/* Escalated 1% (Indigo) */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="#6366F1"
                  strokeWidth="12"
                  strokeDasharray="2.4 238.7"
                  strokeDashoffset="-236.1"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-extrabold text-slate-900 font-mono">1,248</span>
                <span className="text-[10px] text-slate-400 font-medium">Total Calls</span>
              </div>
            </div>

            {/* Outcomes Legend Table */}
            <div className="flex-1 space-y-2 text-xs w-full">
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500" /> Completed
                </span>
                <span className="font-mono font-bold text-slate-900">92%</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> Failed
                </span>
                <span className="font-mono font-bold text-slate-900">4%</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Missed
                </span>
                <span className="font-mono font-bold text-slate-900">3%</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" /> Escalated
                </span>
                <span className="font-mono font-bold text-slate-900">1%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Recent Activity (Matching Mockup 2) */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
          <Link href="/calls" className="text-xs text-blue-600 hover:text-blue-700 font-bold">
            View All
          </Link>
        </div>

        <div className="space-y-2.5">
          {/* Event 1 */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <span className="font-bold text-slate-900">Inbound call completed</span>
                <span className="text-[11px] text-slate-500 block">HR Assistant</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-400">2 min ago</span>
          </div>

          {/* Event 2 */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <FileText size={16} />
              </div>
              <div>
                <span className="font-bold text-slate-900">Document indexed</span>
                <span className="text-[11px] text-slate-500 block">QMS_SOP_Guidelines.pdf</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-400">6 min ago</span>
          </div>

          {/* Event 3 */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div>
                <span className="font-bold text-slate-900">Agent updated</span>
                <span className="text-[11px] text-slate-500 block">QA Bot</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-400">12 min ago</span>
          </div>

          {/* Event 4 */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                <XCircle size={16} />
              </div>
              <div>
                <span className="font-bold text-slate-900">Outbound call failed</span>
                <span className="text-[11px] text-slate-500 block">+91 98765 43210</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-400">18 min ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
