'use client';

import React, { useState } from 'react';
import {
  PhoneCall,
  Search,
  Download,
  X,
  FileText,
  Trash2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CallSessionRecord } from '@/types';

export default function CallHistoryPage() {
  const { calls, clearCallHistory } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDirectionFilter, setSelectedDirectionFilter] = useState('ALL');
  const [activeCallDetail, setActiveCallDetail] = useState<CallSessionRecord | null>(null);

  // Filter real calls
  const filteredCalls = calls.filter((c) => {
    if (selectedDirectionFilter !== 'ALL' && c.direction !== selectedDirectionFilter) return false;
    if (
      searchQuery &&
      !c.id.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.agentName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.callerNumber.includes(searchQuery) &&
      !c.intent.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(c.transcript || []).some((turn) => turn.text.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false;
    }
    return true;
  });

  const handleExport = () => {
    if (calls.length === 0) {
      alert('No calls recorded yet to export.');
      return;
    }
    const csv =
      'data:text/csv;charset=utf-8,ID,Date,Direction,Number,Project,Agent,Status,Duration,Caller said\n' +
      calls
        .map((c) => {
          const spoken = c.transcript
            .filter((turn) => turn.speaker === 'caller')
            .map((turn) => turn.text.replaceAll('"', "'"))
            .join(' | ');
          return `${c.id},${c.startTime},${c.direction},${c.callerNumber},${c.projectId},${c.agentName},${c.status},${c.durationSeconds}s,"${spoken}"`;
        })
        .join('\n');
    const encoded = encodeURI(csv);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', 'EchoAI_Call_History.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Call History</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time verified log of inbound calls and outbound voice sessions
          </p>
        </div>

        <div className="flex items-center gap-2">
          {calls.length > 0 && (
            <button
              onClick={clearCallHistory}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 font-bold text-xs transition-colors"
            >
              <Trash2 size={13} />
              <span>Clear History</span>
            </button>
          )}

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer"
          >
            <Download size={14} />
            <span>+ Export</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by number, agent name, or inquiry..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-xs"
          />
        </div>

        {/* Direction Filter */}
        <select
          value={selectedDirectionFilter}
          onChange={(e) => setSelectedDirectionFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none shadow-xs cursor-pointer"
        >
          <option value="ALL">All Directions</option>
          <option value="inbound">Inbound</option>
          <option value="outbound">Outbound</option>
        </select>
      </div>

      {/* Call History Table */}
      <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Direction</th>
                <th className="py-3 px-4">Caller / Recipient</th>
                <th className="py-3 px-4">Scope</th>
                <th className="py-3 px-4">Agent</th>
                <th className="py-3 px-4">Caller said</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Cost</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCalls.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <PhoneCall size={28} className="mx-auto text-slate-300 mb-2" />
                    <span className="font-bold text-slate-600 block">No call records yet</span>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Start a Live Call. The words you speak are saved on that record.
                    </span>
                  </td>
                </tr>
              ) : (
                filteredCalls.map((call, idx) => (
                  <tr key={call.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{call.startTime}</td>
                    <td className="py-3 px-4">
                      {call.direction === 'inbound' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-bold">
                          Inbound
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 text-[10px] font-bold">
                          Outbound
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{call.callerNumber}</td>
                    <td className="py-3 px-4 font-bold text-slate-700">{call.projectId}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{call.agentName}</td>
                    <td className="py-3 px-4 text-slate-700 max-w-[240px]">
                      {call.transcript
                        .filter((turn) => turn.speaker === 'caller')
                        .map((turn) => turn.text)
                        .join(' ') || '—'}
                    </td>
                    <td className="py-3 px-4">
                      {call.status === 'completed' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold">
                          ● Completed
                        </span>
                      ) : call.status === 'connected' ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-[10px] font-bold">
                          ● In progress
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold">
                          ● {call.status}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{call.durationSeconds}s</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">₹{call.estimatedCost.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-slate-400">
                        <button
                          onClick={() => setActiveCallDetail(call)}
                          className="p-1 rounded hover:text-blue-600 hover:bg-blue-50"
                          title="View Transcript & Waveform"
                        >
                          <FileText size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredCalls.length} verified sessions</span>
        </div>
      </div>

      {/* Call Detail Drawer Modal */}
      {activeCallDetail && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-lg h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col text-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="font-mono font-bold text-slate-900 text-sm block">
                  {activeCallDetail.id}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {activeCallDetail.startTime} • {activeCallDetail.callerNumber}
                </span>
              </div>
              <button
                onClick={() => setActiveCallDetail(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="space-y-2">
                <span className="font-bold text-slate-900 text-xs">What the caller said</span>
                {activeCallDetail.transcript.filter((turn) => turn.speaker === 'caller').length === 0 ? (
                  <p className="text-xs text-slate-500">No caller speech was captured on this session.</p>
                ) : (
                  activeCallDetail.transcript
                    .filter((turn) => turn.speaker === 'caller')
                    .map((turn) => (
                      <p key={turn.id} className="rounded-xl bg-slate-100 p-3 text-sm text-slate-900">
                        {turn.text}
                      </p>
                    ))
                )}
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-900 text-xs">Full Session Transcript</span>
                <div className="space-y-2">
                  {activeCallDetail.transcript.map((t, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl text-xs leading-relaxed ${
                        t.speaker === 'agent'
                          ? 'bg-blue-50/80 border border-blue-100 text-slate-800 ml-4'
                          : 'bg-slate-100 text-slate-900 mr-4'
                      }`}
                    >
                      <span className="font-bold block text-[10px] text-slate-500 uppercase mb-0.5">
                        {t.speaker === 'agent' ? activeCallDetail.agentName : 'Caller'}
                      </span>
                      <p>{t.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
