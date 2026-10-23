'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  History,
  PhoneCall,
  Clock,
  Trash2,
  X,
  Bot,
  User,
  Volume2,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { useApp, CallLog } from '@/context/AppContext';

export default function CallHistoryPage() {
  const { callLogs, clearCallLogs, hotlineNumber } = useApp();
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);

  const formatSecs = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Live Call Session History
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-200 font-mono">
              {callLogs.length} Sessions
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Audit logs of actual conversational calls conducted through RainerTek EchoAI.
          </p>
        </div>

        {callLogs.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Clear all call logs?')) {
                clearCallLogs();
              }
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-medium transition-colors flex items-center gap-1.5 self-start sm:self-auto border border-slate-200"
          >
            <Trash2 size={13} />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Main Content */}
      {callLogs.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200 p-12 text-center shadow-xs space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <History size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 text-base">No Call Sessions Recorded Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Real conversational audio sessions conducted from the Voice Station will appear here with full speaker turns and audio metadata.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <PhoneCall size={14} />
            <span>Start Your First Call Now</span>
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 uppercase font-semibold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Session ID</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Hotline</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Voice Model</th>
                  <th className="py-3 px-4">Turns</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Transcript</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {callLogs.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setSelectedCall(log)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800 group-hover:text-indigo-600">
                      {log.id}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(log.timestamp).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{log.caller}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {formatSecs(log.durationSeconds)}
                    </td>
                    <td className="py-3.5 px-4 capitalize text-indigo-700 font-medium">
                      {log.voiceModel} ({log.language})
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{log.turns.length} turns</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        COMPLETED
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="text-indigo-600 font-semibold group-hover:underline flex items-center justify-end gap-1">
                        View Details <ArrowRight size={12} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transcript Drawer Modal */}
      {selectedCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Call Record: {selectedCall.id}
                </h3>
                <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span>{new Date(selectedCall.timestamp).toLocaleString()}</span>
                  <span>•</span>
                  <span>Duration: {formatSecs(selectedCall.durationSeconds)}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCall(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Conversation Log */}
            <div className="flex-1 overflow-y-auto space-y-3 p-2 text-xs">
              {selectedCall.turns.map((t, idx) => {
                const isAgent = t.speaker === 'agent';
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isAgent ? 'items-start' : 'items-end'}`}
                  >
                    <div className="text-[10px] text-slate-400 mb-0.5">
                      {isAgent ? 'RainerTek EchoAI' : 'Caller'} • {t.time}
                    </div>
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed text-xs shadow-xs ${
                        isAgent
                          ? 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200'
                          : 'bg-indigo-600 text-white rounded-tr-xs'
                      }`}
                    >
                      {t.text}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedCall(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Close Transcript
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
