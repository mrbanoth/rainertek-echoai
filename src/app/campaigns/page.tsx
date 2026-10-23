'use client';

import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  ArrowRight,
  FileSpreadsheet,
  X,
  Play,
  CheckCircle2,
  Clock,
  PhoneOutgoing,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function OutboundCampaignsPage() {
  const { campaigns, createCampaign, agents } = useApp();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [campName, setCampName] = useState('');
  const [targetCount, setTargetCount] = useState(50);
  const [selectedAgent, setSelectedAgent] = useState(agents[0]?.id || 'agent-1');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campName.trim()) return;
    createCampaign(campName.trim(), selectedAgent, targetCount);
    setCampName('');
    setIsCreateOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      {campaigns.length === 0 ? (
        /* Empty State Matching Screenshot 5 */
        <div className="py-16 flex flex-col items-center justify-center text-center space-y-6">
          {/* Illustration box */}
          <div className="w-20 h-20 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-center justify-center text-amber-600 shadow-xs">
            <Megaphone size={38} className="text-amber-500" />
          </div>

          <div className="space-y-2 max-w-md">
            <h1 className="text-2xl font-serif font-medium text-slate-900 tracking-tight">
              Reach thousands of customers by phone
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload a contact list, pick an agent, and launch automated outbound calls.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://docs.sarvam.ai/conversations/overview"
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-full border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Build with API</span>
              <ArrowRight size={13} />
            </a>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus size={14} />
              <span>Create campaign</span>
            </button>
          </div>
        </div>
      ) : (
        /* Campaign List */
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900">Active Outbound Campaigns</h2>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 flex items-center gap-1.5"
            >
              <Plus size={13} />
              <span>New Campaign</span>
            </button>
          </div>

          <div className="space-y-3">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700">
                    <PhoneOutgoing size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">{camp.name}</h3>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Target Contacts: {camp.targetCount} • Created: {camp.createdAt}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-full font-semibold text-[10px] bg-slate-100 text-slate-700 uppercase">
                    {camp.status}
                  </span>
                  <button
                    onClick={() => alert(`Campaign ${camp.name} initiated via Sarvam API.`)}
                    className="px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5"
                  >
                    <Play size={11} />
                    <span>Run Batch</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-semibold text-slate-900">Create Outbound Campaign</h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-slate-700">Campaign Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Appointment Reminder Batch"
                  value={campName}
                  onChange={(e) => setCampName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-300 text-xs focus:outline-none focus:border-slate-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-700">Assigned Agent</label>
                <select
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-300 text-xs focus:outline-none focus:border-slate-500"
                >
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.assignedNumber || '+917965481286'})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-700">Number of Contacts</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={targetCount}
                  onChange={(e) => setTargetCount(parseInt(e.target.value) || 10)}
                  className="w-full px-4 py-2.5 rounded-full border border-slate-300 text-xs font-mono focus:outline-none focus:border-slate-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                >
                  Launch Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
