'use client';

import React, { useState } from 'react';
import {
  Search,
  MoreVertical,
  Plus,
  FileText,
  Clock,
  PhoneIncoming,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function InboundCallsPage() {
  const { inboundMetrics, inboundCalls, timeframe, setTimeframe } = useApp();
  const [activeTab, setActiveTab] = useState<'calls' | 'concurrency'>('calls');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate total calls
  const totalCallsCount = 10;

  const filteredInbounds = inboundCalls.filter(
    (c) =>
      c.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phoneNumber.includes(searchQuery) ||
      c.appId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto py-2">
      {/* Top Controls: Tabs & 12h/24h Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        {/* Calls vs Concurrency Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-slate-100 max-w-xs text-xs font-medium">
          <button
            onClick={() => setActiveTab('calls')}
            className={`px-4 py-1.5 rounded-full transition-colors ${
              activeTab === 'calls'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Calls
          </button>
          <button
            onClick={() => setActiveTab('concurrency')}
            className={`px-4 py-1.5 rounded-full transition-colors ${
              activeTab === 'concurrency'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Concurrency
          </button>
        </div>

        {/* 12h / 24h Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-slate-100 text-xs font-medium">
          <button
            onClick={() => setTimeframe('12h')}
            className={`px-3 py-1 rounded-full transition-colors ${
              timeframe === '12h'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            12h
          </button>
          <button
            onClick={() => setTimeframe('24h')}
            className={`px-3 py-1 rounded-full transition-colors ${
              timeframe === '24h'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            24h
          </button>
        </div>
      </div>

      {/* The Loved Chart Container (Matching Screenshot 4) */}
      <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-xs space-y-6">
        <div>
          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span>Calls</span>
            <span className="cursor-help text-slate-400">ⓘ</span>
          </div>
          <div className="text-3xl font-medium text-slate-900 font-serif mt-1">
            {totalCallsCount}
          </div>
        </div>

        {/* High Resolution Minimal Bar Chart */}
        <div className="relative pt-6 pb-2">
          {/* Dashed Horizontal Grid Lines */}
          <div className="absolute inset-x-0 top-12 border-b border-dashed border-slate-200" />
          <div className="absolute inset-x-0 top-24 border-b border-dashed border-slate-200" />
          <div className="absolute inset-x-0 bottom-8 border-b border-slate-200" />

          {/* Left Axis Labels */}
          <div className="absolute left-0 top-10 text-[10px] text-slate-400 font-mono">
            4.15
          </div>
          <div className="absolute left-0 top-22 text-[10px] text-slate-400 font-mono">
            2
          </div>
          <div className="absolute left-0 bottom-9 text-[10px] text-slate-400 font-mono">
            0
          </div>

          {/* Y Axis Title */}
          <div className="absolute -left-6 top-1/2 -rotate-90 text-[10px] text-slate-400 font-medium">
            Number of calls
          </div>

          {/* Bar Chart Columns */}
          <div className="h-44 flex items-end justify-between pl-10 pr-6 pb-8">
            {inboundMetrics.map((m, idx) => {
              const value = activeTab === 'calls' ? m.calls : m.concurrency;
              const heightPct = Math.min(100, (value / 4.15) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group">
                  {value > 0 ? (
                    <div
                      className="w-2.5 sm:w-3 bg-blue-600 rounded-xs transition-all duration-300 group-hover:bg-blue-700 relative"
                      style={{ height: `${heightPct}%` }}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-mono px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap shadow-xs">
                        {value} {activeTab}
                      </div>
                    </div>
                  ) : (
                    <div className="h-0 w-2.5" />
                  )}
                  <span className="absolute bottom-1 text-[11px] text-slate-400 font-mono">
                    {m.timeLabel}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-center text-[11px] text-slate-400 pt-1">Time</div>
        </div>
      </div>

      {/* Inbound Routing Table & Search */}
      <div className="space-y-3 pt-2">
        {/* Search input */}
        <div className="relative max-w-xs">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search inbounds"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-slate-400"
          />
        </div>

        {/* Table matching Screenshot 4 */}
        <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/60 text-slate-500 font-medium text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-normal">Name</th>
                  <th className="py-3 px-4 font-normal">Status</th>
                  <th className="py-3 px-4 font-normal">App ID</th>
                  <th className="py-3 px-4 font-normal">Phone numbers</th>
                  <th className="py-3 px-4 font-normal">Created At</th>
                  <th className="py-3 px-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredInbounds.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      {item.agentName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {item.appId}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-800 font-medium">
                      {item.phoneNumber}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {item.createdAt}
                    </td>
                    <td className="py-3.5 px-4 text-right text-slate-400 hover:text-slate-700 cursor-pointer">
                      <MoreVertical size={14} className="ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
