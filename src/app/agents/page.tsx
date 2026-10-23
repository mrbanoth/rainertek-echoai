'use client';

import React, { useState } from 'react';
import {
  Bot,
  Plus,
  Save,
  RotateCcw,
  History,
  Play,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  Sliders,
  BookOpen,
  Volume2,
  PhoneCall,
  Check,
  X,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AIAgentConfig, PromptVersion } from '@/types';

export default function AgentsAndPromptEditorPage() {
  const {
    agents,
    projects,
    selectedProject,
    updateAgent,
    createAgent,
    restorePromptVersion,
    userRole,
  } = useApp();

  // Active agent selected for editing
  const filteredAgents = agents.filter(
    (a) => selectedProject === 'ALL' || a.projectId === selectedProject
  );
  const [activeAgentId, setActiveAgentId] = useState<string>(
    filteredAgents[0]?.id || agents[0]?.id || ''
  );

  const selectedAgent = agents.find((a) => a.id === activeAgentId) || agents[0];

  // Prompt Form Editable State
  const [formData, setFormData] = useState({
    identity: selectedAgent?.systemPrompt?.identity || '',
    role: selectedAgent?.systemPrompt?.role || '',
    scope: selectedAgent?.systemPrompt?.scope || '',
    tone: selectedAgent?.systemPrompt?.tone || '',
    instructions: selectedAgent?.systemPrompt?.instructions || '',
    restrictions: selectedAgent?.systemPrompt?.restrictions || '',
    escalation: selectedAgent?.systemPrompt?.escalation || '',
    greeting: selectedAgent?.greeting || '',
    fallbackResponse: selectedAgent?.fallbackResponse || '',
    voiceModel: selectedAgent?.voiceModel || 'Sarvam Bulbul Core (en-IN)',
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'versions' | 'playground' | 'settings'>('prompt');

  // Playground conversation simulator state
  const [testQuery, setTestQuery] = useState('');
  const [testResponses, setTestResponses] = useState<
    Array<{ q: string; a: string; citedDoc?: string; fallback?: boolean }>
  >([]);

  // When active agent changes, reset form
  const handleSelectAgent = (agent: AIAgentConfig) => {
    if (hasUnsavedChanges) {
      if (!confirm('You have unsaved prompt changes. Discard and switch agent?')) return;
    }
    setActiveAgentId(agent.id);
    setFormData({
      identity: agent.systemPrompt.identity,
      role: agent.systemPrompt.role,
      scope: agent.systemPrompt.scope,
      tone: agent.systemPrompt.tone,
      instructions: agent.systemPrompt.instructions,
      restrictions: agent.systemPrompt.restrictions,
      escalation: agent.systemPrompt.escalation,
      greeting: agent.greeting,
      fallbackResponse: agent.fallbackResponse,
      voiceModel: agent.voiceModel,
    });
    setHasUnsavedChanges(false);
  };

  const handleFieldChange = (field: string, val: string) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    setHasUnsavedChanges(true);
  };

  const handleSavePrompt = () => {
    if (userRole === 'Read-only viewer') {
      alert('Action Restricted: Read-only viewers cannot modify agent configurations.');
      return;
    }

    const newVersion: PromptVersion = {
      version: `v1.${(selectedAgent.promptVersions.length + 1).toString()}`,
      savedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      savedBy: 'admin@rainertek.com',
      notes: 'Prompt revisions updated via Enterprise Prompt Editor',
      systemPrompt: {
        identity: formData.identity,
        role: formData.role,
        scope: formData.scope,
        tone: formData.tone,
        instructions: formData.instructions,
        restrictions: formData.restrictions,
        escalation: formData.escalation,
      },
    };

    updateAgent(selectedAgent.id, {
      greeting: formData.greeting,
      fallbackResponse: formData.fallbackResponse,
      voiceModel: formData.voiceModel,
      systemPrompt: newVersion.systemPrompt,
      promptVersions: [newVersion, ...selectedAgent.promptVersions],
      updatedAt: new Date().toISOString().slice(0, 10),
    });

    setHasUnsavedChanges(false);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handleRestore = (v: PromptVersion) => {
    if (confirm(`Restore prompt to version ${v.version}? Current unsaved edits will be replaced.`)) {
      restorePromptVersion(selectedAgent.id, v);
      setFormData({
        identity: v.systemPrompt.identity,
        role: v.systemPrompt.role,
        scope: v.systemPrompt.scope,
        tone: v.systemPrompt.tone,
        instructions: v.systemPrompt.instructions,
        restrictions: v.systemPrompt.restrictions,
        escalation: v.systemPrompt.escalation,
        greeting: selectedAgent.greeting,
        fallbackResponse: selectedAgent.fallbackResponse,
        voiceModel: selectedAgent.voiceModel,
      });
      setHasUnsavedChanges(false);
    }
  };

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQuery.trim()) return;

    const lower = testQuery.toLowerCase();
    let reply = '';
    let cited = undefined;
    let isFallback = false;

    if (lower.includes('pto') || lower.includes('leave') || lower.includes('vacation')) {
      reply = 'According to RainerTek HR Employee Handbook Sec 4.2, employees accrue 1.75 days per month (21 days annual cap). Verified via HRMS policy.';
      cited = 'RainerTek Employee Handbook 2026.pdf (p.14)';
    } else if (lower.includes('deviation') || lower.includes('cleanroom') || lower.includes('capa')) {
      reply = 'Per SOP-QMS-402 Rev 4, cleanroom HEPA deviations exceeding 0.5 microns require immediate batch quarantine within 2 hours.';
      cited = 'SOP-QMS-402 Cleanroom Deviations.pdf (Sec 3.1)';
    } else if (lower.includes('specimen') || lower.includes('freezer') || lower.includes('assay')) {
      reply = 'LIMS Chain of Custody Spec-08 stipulates -80°C cryogenic storage verification before thaw protocol initiation.';
      cited = 'LIMS-SPEC-08 Specimen Cryogenic SOP.docx';
    } else {
      reply = formData.fallbackResponse || 'I cannot verify this request against approved RainerTek knowledge documents. Let me transfer you to an authorized supervisor.';
      isFallback = true;
    }

    setTestResponses((prev) => [
      ...prev,
      { q: testQuery, a: reply, citedDoc: cited, fallback: isFallback },
    ]);
    setTestQuery('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#111A2E] border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Bot size={18} className="text-indigo-400" />
              AI Agents & Prompt Engineering
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-bold">
              MULTI-PROJECT ISOLATION
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage system instructions, voice synthesis parameters, escalation rules, and prompt version control.
          </p>
        </div>

        {/* Unsaved changes pill & Actions */}
        <div className="flex items-center gap-3">
          {hasUnsavedChanges && (
            <span className="text-[11px] font-medium text-amber-400 bg-amber-950/60 border border-amber-500/40 px-2.5 py-1 rounded-md flex items-center gap-1.5 animate-pulse">
              <AlertTriangle size={12} /> Unsaved Changes
            </span>
          )}
          {saveSuccessNotice && (
            <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <CheckCircle2 size={12} /> Prompt Published!
            </span>
          )}
          <button
            onClick={handleSavePrompt}
            disabled={!hasUnsavedChanges || userRole === 'Read-only viewer'}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs disabled:opacity-40 transition-colors"
          >
            <Save size={14} />
            Publish Version
          </button>
        </div>
      </div>

      {/* Main Layout: Agent Directory (Left 4 cols) & Editor Canvas (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Agent Cards List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 px-1">
            <span>Configured Agents ({filteredAgents.length})</span>
            <span className="text-[10px] font-mono text-indigo-400">
              Project: {selectedProject}
            </span>
          </div>

          <div className="space-y-2.5">
            {filteredAgents.map((agent) => {
              const isSelected = agent.id === selectedAgent?.id;
              return (
                <div
                  key={agent.id}
                  onClick={() => handleSelectAgent(agent)}
                  className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#141E36] border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                      : 'bg-[#111A2E] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="font-bold text-white text-sm">{agent.name}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-indigo-300">
                      {agent.projectId}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {agent.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
                    <span>Voice: {agent.voiceModel.split(' ')[1]}</span>
                    <span>Calls: {agent.totalCalls}</span>
                    <span className="text-emerald-400 font-semibold">{agent.successRate}% Res.</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Prompt Editor, Version History, Playground */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium w-fit">
            <button
              onClick={() => setActiveTab('prompt')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === 'prompt' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              System Prompt Architecture
            </button>
            <button
              onClick={() => setActiveTab('versions')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'versions' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <History size={13} />
              Version History ({selectedAgent?.promptVersions?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('playground')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'playground' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Play size={13} />
              Assistant Playground
            </button>
          </div>

          {/* TAB 1: System Prompt Editor Canvas */}
          {activeTab === 'prompt' && (
            <div className="p-5 rounded-xl bg-[#111A2E] border border-slate-800 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-white text-sm">
                    Structured Prompt Architecture — {selectedAgent?.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Isolated scope guidelines. Never overrides backend authorization.
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/40 font-semibold">
                  Active: {selectedAgent?.promptVersions[0]?.version || 'v1.0'}
                </span>
              </div>

              {/* Identity & Scope */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Agent Identity</label>
                  <input
                    type="text"
                    value={formData.identity}
                    onChange={(e) => handleFieldChange('identity', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tone & Speaking Style</label>
                  <input
                    type="text"
                    value={formData.tone}
                    onChange={(e) => handleFieldChange('tone', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Role & Permitted Scope */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Permitted Knowledge Scope</label>
                <input
                  type="text"
                  value={formData.scope}
                  onChange={(e) => handleFieldChange('scope', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Core Instructions */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Operating Instructions</label>
                <textarea
                  rows={3}
                  value={formData.instructions}
                  onChange={(e) => handleFieldChange('instructions', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono text-[11px]"
                />
              </div>

              {/* Restrictions & Escalation Criteria */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-rose-300 font-semibold mb-1 flex items-center gap-1">
                    <ShieldAlert size={12} /> Strict Restrictions
                  </label>
                  <textarea
                    rows={3}
                    value={formData.restrictions}
                    onChange={(e) => handleFieldChange('restrictions', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-rose-500/40 text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-amber-300 font-semibold mb-1 flex items-center gap-1">
                    <AlertTriangle size={12} /> Escalation & Handoff Trigger
                  </label>
                  <textarea
                    rows={3}
                    value={formData.escalation}
                    onChange={(e) => handleFieldChange('escalation', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-amber-500/40 text-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Greeting & Fallback Response */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Initial Inbound Greeting</label>
                  <textarea
                    rows={2}
                    value={formData.greeting}
                    onChange={(e) => handleFieldChange('greeting', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Fallback (Unverified Query)</label>
                  <textarea
                    rows={2}
                    value={formData.fallbackResponse}
                    onChange={(e) => handleFieldChange('fallbackResponse', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Version History & Rollback */}
          {activeTab === 'versions' && (
            <div className="p-5 rounded-xl bg-[#111A2E] border border-slate-800 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-white text-sm">Prompt Version History</h3>
                  <p className="text-[11px] text-slate-400">
                    Review diffs, audit authors, and restore previous published instructions.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {selectedAgent?.promptVersions?.map((v, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-indigo-400">{v.version}</span>
                        {idx === 0 && (
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                            PUBLISHED CURRENT
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400">• {v.savedAt}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-1">{v.notes}</p>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                        Committed by: {v.savedBy}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRestore(v)}
                        disabled={idx === 0 || userRole === 'Read-only viewer'}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold disabled:opacity-40 transition-colors"
                      >
                        <RotateCcw size={12} />
                        Restore This Version
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Grounded Assistant Playground */}
          {activeTab === 'playground' && (
            <div className="p-5 rounded-xl bg-[#111A2E] border border-slate-800 space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-white text-sm">
                    Grounded Conversation Playground — {selectedAgent?.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Test response generation, knowledge retrieval citations, and fallback safety guards.
                  </p>
                </div>
              </div>

              {/* Chat Simulation Turns */}
              <div className="space-y-3 min-h-[220px] max-h-72 overflow-y-auto pr-1">
                {testResponses.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 flex flex-col items-center justify-center">
                    <Sparkles size={24} className="text-slate-600 mb-2" />
                    <p className="font-semibold text-slate-400">Playground Ready</p>
                    <p className="text-[11px] mt-0.5">
                      Type test questions like: "What is my PTO balance policy?" or "Cleanroom HEPA deviation threshold"
                    </p>
                  </div>
                ) : (
                  testResponses.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-indigo-100 mr-8">
                        <span className="text-[10px] font-mono text-indigo-300 font-bold block mb-0.5">
                          OPERATOR TEST QUERY
                        </span>
                        {item.q}
                      </div>
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 ml-8 space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="font-bold text-emerald-400">ECHOAI AGENT RESPONSE</span>
                          {item.fallback && (
                            <span className="text-amber-400 font-semibold bg-amber-950 px-1.5 py-0.2 rounded border border-amber-500/40">
                              FALLBACK TRIGGERED
                            </span>
                          )}
                        </div>
                        <p>{item.a}</p>
                        {item.citedDoc && (
                          <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-cyan-400 flex items-center gap-1 font-mono">
                            <BookOpen size={11} />
                            Source: {item.citedDoc}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Query Input Form */}
              <form onSubmit={handleTestSubmit} className="flex gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  placeholder="Enter a test prompt to verify knowledge citation..."
                  value={testQuery}
                  onChange={(e) => setTestQuery(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!testQuery.trim()}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold disabled:opacity-40 transition-colors"
                >
                  Send Query
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
