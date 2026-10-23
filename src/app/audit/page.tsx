'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Download,
  Calendar,
  Layers,
  FileText,
  Lock,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function AuditLogsPage() {
  const { auditLogs, projects, selectedProject } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [resultFilter, setResultFilter] = useState<'ALL' | 'SUCCESS' | 'WARNING' | 'FAILED'>('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    if (selectedProject !== 'ALL' && log.projectId !== selectedProject) return false;
    if (resultFilter !== 'ALL' && log.result !== resultFilter) return false;
    if (
      searchQuery &&
      !log.action.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !log.actor.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !log.details.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !log.targetResource.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `RainerTek_Audit_Trail_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#111A2E] border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck size={18} className="text-indigo-400" />
              Compliance & Security Audit Trail
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold">
              21 CFR PART 11 / GXP READY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable system logs for prompt revisions, document indexing, campaign authorizations, and sensitive data access.
          </p>
        </div>

        <button
          onClick={handleExportJson}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-semibold transition-colors"
        >
          <Download size={13} />
          Export Audit Trail JSON
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="relative min-w-[260px]">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search actor, action, resource, or details..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder:text-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <select
            value={resultFilter}
            aria-label="Filter audit logs by result"
            onChange={(e) => setResultFilter(e.target.value as any)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 font-medium focus:outline-none"
          >
            <option value="ALL">All Outcomes</option>
            <option value="SUCCESS">Success Only</option>
            <option value="WARNING">Warning Only</option>
            <option value="FAILED">Failed Only</option>
          </select>
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
          Showing {filteredLogs.length} immutable events
        </span>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-xl bg-[#111A2E] border border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080D1A] text-slate-400 border-b border-slate-800 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Event ID & Timestamp</th>
                <th className="py-3 px-4">Actor & Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Project Scope</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">Result</th>
                <th className="py-3 px-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No audit records match your filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-200 block">{log.id}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{log.timestamp}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-white font-medium block">{log.actor}</span>
                      <span className="text-[10px] text-indigo-400 font-mono">{log.role}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-200">
                      {log.action}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-indigo-300 font-semibold">
                        {log.projectId}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                      {log.targetResource}
                    </td>
                    <td className="py-3 px-4">
                      {log.result === 'SUCCESS' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
                          <CheckCircle2 size={10} /> SUCCESS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono">
                          <AlertTriangle size={10} /> WARNING
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-300 text-[11px] max-w-xs truncate">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
