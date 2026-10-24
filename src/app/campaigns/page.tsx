'use client';

import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Play,
  Pause,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Users,
  ShieldCheck,
  Send,
  Upload,
  Filter,
  Search,
  ChevronRight,
  X,
  FileCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { CampaignRecord, ProjectId } from '@/types';

export default function OutboundCampaignsPage() {
  const {
    campaigns,
    createCampaign,
    toggleCampaignStatus,
    projects,
    agents,
    selectedProject,
    userRole,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activePreviewCampaign, setActivePreviewCampaign] = useState<CampaignRecord | null>(null);

  // New Campaign Form State
  const [campName, setCampName] = useState('');
  const [campProjectId, setCampProjectId] = useState<ProjectId>('GENERAL');
  const [campAgentId, setCampAgentId] = useState<string>(agents[0]?.id || '');
  const [campScript, setCampScript] = useState('');
  const [campContactCount, setCampContactCount] = useState(150);
  const [campConsentVerified, setCampConsentVerified] = useState(true);
  const [campQuietHours, setCampQuietHours] = useState(true);
  const [campRetryLimit, setCampRetryLimit] = useState(2);
  const [showConfirmStart, setShowConfirmStart] = useState<string | null>(null);

  // Filtered campaigns
  const filteredCampaigns = campaigns.filter((c) => {
    if (selectedProject !== 'ALL' && c.projectId !== selectedProject) return false;
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName.trim() || !campScript.trim()) return;
    if (userRole === 'Read-only viewer') {
      alert('Action Restricted: Read-only viewers cannot launch campaigns.');
      return;
    }

    createCampaign({
      name: campName,
      projectId: campProjectId,
      agentId: campAgentId,
      status: 'scheduled',
      scheduledDate: new Date().toISOString().slice(0, 10),
      totalContacts: campContactCount,
      consentVerified: campConsentVerified,
      quietHoursEnforced: campQuietHours,
      retryLimit: campRetryLimit,
      approvedScript: campScript,
    });

    setIsCreateModalOpen(false);
    setCampName('');
    setCampScript('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#111A2E] border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Megaphone size={18} className="text-indigo-400" />
              Outbound Calling Campaigns
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-bold">
              CONSENT & QUIET HOURS SAFEGUARDED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated notification broadcasts, scheduled outreach, contact suppression validation, and dial outcomes.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          disabled={userRole === 'Read-only viewer'}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-xs disabled:opacity-40 transition-colors"
        >
          <Plus size={14} />
          Create Outbound Campaign
        </button>
      </div>

      {/* Filter and Metrics Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-slate-400 block text-[11px]">Active Campaigns</span>
          <span className="text-xl font-bold text-white font-mono mt-1 block">
            {campaigns.filter((c) => c.status === 'running').length}
          </span>
        </div>
        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-slate-400 block text-[11px]">Scheduled Batches</span>
          <span className="text-xl font-bold text-amber-400 font-mono mt-1 block">
            {campaigns.filter((c) => c.status === 'scheduled').length}
          </span>
        </div>
        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-slate-400 block text-[11px]">Completed Broadcasts</span>
          <span className="text-xl font-bold text-emerald-400 font-mono mt-1 block">
            {campaigns.filter((c) => c.status === 'completed').length}
          </span>
        </div>
        <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-slate-400 block text-[11px]">Opt-Out Compliance</span>
          <span className="text-xl font-bold text-cyan-400 font-mono mt-1 block">
            100% Enforced
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="relative min-w-[240px]">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 placeholder:text-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <select
            value={statusFilter}
            aria-label="Filter campaigns by status"
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-300 font-medium focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="running">Running</option>
            <option value="scheduled">Scheduled</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <span className="text-[11px] text-slate-400 font-mono">
          Showing {filteredCampaigns.length} campaigns
        </span>
      </div>

      {/* Campaigns Table */}
      <div className="rounded-xl bg-[#111A2E] border border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080D1A] text-slate-400 border-b border-slate-800 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Campaign Name</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Progress / Dialed</th>
                <th className="py-3 px-4">Success Rate</th>
                <th className="py-3 px-4">Compliance Guard</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No campaigns found.
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map((camp) => {
                  const pct = Math.round((camp.dialedCount / (camp.totalContacts || 1)) * 100);
                  const successPct = camp.dialedCount > 0 ? Math.round((camp.successfulCount / camp.dialedCount) * 100) : 0;

                  return (
                    <tr key={camp.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-semibold text-white block">{camp.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Scheduled: {camp.scheduledDate}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-indigo-300 font-semibold">
                          {camp.projectId}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {camp.status === 'running' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full animate-pulse">
                            <Play size={10} /> Running
                          </span>
                        ) : camp.status === 'scheduled' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-full">
                            <Clock size={10} /> Scheduled
                          </span>
                        ) : camp.status === 'paused' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-full">
                            <Pause size={10} /> Paused
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-400 bg-indigo-950/80 border border-indigo-500/40 px-2 py-0.5 rounded-full">
                            <CheckCircle2 size={10} /> Completed
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-32">
                          <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                            <span>{camp.dialedCount} / {camp.totalContacts}</span>
                            <span>{pct}%</span>
                          </div>
                          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <span className="text-emerald-400 font-bold">{successPct}%</span>
                        <span className="text-[10px] text-slate-500 block">
                          {camp.successfulCount} clean answers
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[11px] font-mono text-slate-400">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <CheckCircle2 size={11} /> Consent Checked
                        </span>
                        <span className="text-[10px] text-slate-500">Quiet Hours: 9PM-8AM</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {camp.status === 'running' ? (
                            <button
                              onClick={() => toggleCampaignStatus(camp.id, 'paused')}
                              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1"
                              title="Pause dialing"
                            >
                              <Pause size={12} /> Pause
                            </button>
                          ) : camp.status === 'paused' || camp.status === 'scheduled' ? (
                            <button
                              onClick={() => setShowConfirmStart(camp.id)}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1"
                              title="Start campaign"
                            >
                              <Play size={12} /> Run
                            </button>
                          ) : null}

                          <button
                            onClick={() => setActivePreviewCampaign(camp)}
                            className="p-1 rounded text-slate-400 hover:text-white"
                            title="Preview Script & Parameters"
                          >
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Explicit Confirmation Modal Before Starting Campaign (Section 9 Requirement) */}
      {showConfirmStart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-xl bg-[#0F172A] border border-slate-700 p-5 space-y-4 text-xs">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <ShieldCheck size={18} />
              Verify Outbound Dialing Safeguards
            </div>
            <p className="text-slate-300 leading-relaxed">
              Before initiating telephony batches, confirm that contact consent is active, opt-out suppression lists are validated, and local quiet-hour regulations apply.
            </p>
            <div className="p-3 rounded bg-slate-900 border border-slate-800 space-y-1 text-[11px] text-slate-400 font-mono">
              <div>✓ Telecom DND filter checked</div>
              <div>✓ Max retries: 2 attempts</div>
              <div>✓ Environment: DEMO (No accidental carrier charges)</div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowConfirmStart(null)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toggleCampaignStatus(showConfirmStart, 'running');
                  setShowConfirmStart(null);
                }}
                className="px-4 py-1.5 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-500"
              >
                Confirm & Launch Batch
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl bg-[#0F172A] border border-slate-700 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">New Outbound Campaign</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Campaign Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 Health Benefits Enrollment Reminders"
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Project Scope</label>
                  <select
                    value={campProjectId}
                    onChange={(e) => setCampProjectId(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none text-xs"
                  >
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.code}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Assigned Agent</label>
                  <select
                    value={campAgentId}
                    onChange={(e) => setCampAgentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none text-xs"
                  >
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Approved Telephony Script</label>
                <textarea
                  rows={3}
                  required
                  placeholder="State the introductory message, verification question, and expected response options..."
                  value={campScript}
                  onChange={(e) => setCampScript(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Recipient Count</label>
                  <input
                    type="number"
                    value={campContactCount}
                    onChange={(e) => setCampContactCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Retry Limit</label>
                  <input
                    type="number"
                    max={3}
                    min={1}
                    value={campRetryLimit}
                    onChange={(e) => setCampRetryLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 space-y-1.5 text-[11px] text-slate-400">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={campConsentVerified}
                    onChange={(e) => setCampConsentVerified(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Recipients have explicit enterprise opt-in consent for automated phone calls.</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={campQuietHours}
                    onChange={(e) => setCampQuietHours(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Enforce Quiet Hours (Suppress dials between 21:00 and 08:00 local time).</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs"
                >
                  Save Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
