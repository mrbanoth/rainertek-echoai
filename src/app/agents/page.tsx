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
  UploadCloud,
  FileText,
  FileCode,
  File,
  Search,
  Trash2,
  Edit3,
  X,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AIAgentConfig, KnowledgeDoc } from '@/types';

export default function AgentsAndKnowledgePage() {
  const {
    agents,
    updateAgent,
    createAgent,
    documents,
    addDocument,
    updateDocument,
    deleteDocument,
  } = useApp();

  const [topTab, setTopTab] = useState<'agents' | 'knowledge'>('agents');
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || 'agent-hrms-concierge');
  const [activeSubTab, setActiveSubTab] = useState<'basic' | 'prompt' | 'knowledge' | 'tools'>('prompt');

  const selectedAgent = agents.find((a) => a.id === selectedAgentId) || agents[0];

  const [systemPromptText, setSystemPromptText] = useState(
    `You are RainerTek HR Assistant, an AI voice agent.\nYour role is to help employees with HR related queries such as leave balance, holiday list, policies, onboarding, etc.\n\nGuidelines:\n- Be polite, professional and concise.\n- Use company knowledge base and HRMS API for real-time data.\n- If you are not sure, say you cannot verify and suggest contacting HR.\n- Do not share sensitive information without proper verification.`
  );

  const [hasSaved, setHasSaved] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testQuery, setTestQuery] = useState('');
  const [testReply, setTestReply] = useState<string | null>(null);

  const handleSave = () => {
    updateAgent(selectedAgent.id, {
      systemPrompt: {
        ...selectedAgent.systemPrompt,
        instructions: systemPromptText,
      },
    });
    setHasSaved(true);
    setTimeout(() => setHasSaved(false), 2500);
  };

  const handleTestAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQuery.trim()) return;

    if (testQuery.toLowerCase().includes('leave') || testQuery.toLowerCase().includes('pto')) {
      setTestReply('Per RainerTek HR Policy, you have 12 casual leaves and 8 sick leaves remaining for this calendar year.');
    } else {
      setTestReply(`EchoAI response for "${testQuery}": Information verified against RainerTek company knowledge base.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Matching Mockup 4 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Agents & Knowledge</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage AI agents and their knowledge sources
          </p>
        </div>

        <button
          onClick={() => alert('New AI Agent creation dialog.')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer"
        >
          <Plus size={15} />
          <span>Create Agent</span>
        </button>
      </div>

      {/* Main Tabs: Agents / Knowledge Base */}
      <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 max-w-xs text-xs font-bold text-center">
        <button
          onClick={() => setTopTab('agents')}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            topTab === 'agents'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Agents
        </button>
        <button
          onClick={() => setTopTab('knowledge')}
          className={`flex-1 py-2 rounded-lg transition-colors ${
            topTab === 'knowledge'
              ? 'bg-white text-blue-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Knowledge Base
        </button>
      </div>

      {/* VIEW 1: AGENTS TAB (Matching Mockup 4) */}
      {topTab === 'agents' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (4.5 cols): Agents Directory List */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Configured Agents
            </h3>

            <div className="space-y-2.5">
              {/* HR Assistant */}
              <div
                onClick={() => setSelectedAgentId('agent-hrms-concierge')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedAgentId === 'agent-hrms-concierge'
                    ? 'border-blue-500 bg-blue-50/50 shadow-xs ring-1 ring-blue-500/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                      HR
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">HR Assistant</span>
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">HRMS</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold">
                    ● Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Employee support and HR queries
                </p>
              </div>

              {/* QA Bot */}
              <div
                onClick={() => setSelectedAgentId('agent-qms-auditor')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedAgentId === 'agent-qms-auditor'
                    ? 'border-blue-500 bg-blue-50/50 shadow-xs ring-1 ring-blue-500/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      QA
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">QA Bot</span>
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">QMS</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold">
                    ● Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Quality and compliance support
                </p>
              </div>

              {/* LIMS Support */}
              <div
                onClick={() => setSelectedAgentId('agent-lims-lab')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedAgentId === 'agent-lims-lab'
                    ? 'border-blue-500 bg-blue-50/50 shadow-xs ring-1 ring-blue-500/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold text-xs">
                      LM
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">LIMS Support</span>
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">LIMS</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold">
                    ● Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Lab and sample related queries
                </p>
              </div>

              {/* IT Helpdesk */}
              <div
                onClick={() => setSelectedAgentId('agent-it-helpdesk')}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  selectedAgentId === 'agent-it-helpdesk'
                    ? 'border-blue-500 bg-blue-50/50 shadow-xs ring-1 ring-blue-500/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs">
                      IT
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">IT Helpdesk</span>
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Internal</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold">
                    ● Active
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  IT support and system access
                </p>
              </div>
            </div>
          </div>

          {/* Right Column (7.5 cols): Selected Agent Detail & Prompt Editor */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
            {/* Top Detail Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
                    alt="Agent avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{selectedAgent.name}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold">
                      ● Active
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">ID: {selectedAgent.id}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTestModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Play size={12} />
                  <span>Test Agent</span>
                </button>
                <button
                  onClick={() => alert('Agent parameters configuration modal.')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>

            {/* Subtabs Matching Mockup 4: Basic Info / Prompt & Instructions / Knowledge Sources / Tools & APIs */}
            <div className="flex items-center gap-1 border-b border-slate-100 text-xs font-bold">
              <button
                onClick={() => setActiveSubTab('basic')}
                className={`px-3 py-2 border-b-2 transition-colors ${
                  activeSubTab === 'basic'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Basic Info
              </button>
              <button
                onClick={() => setActiveSubTab('prompt')}
                className={`px-3 py-2 border-b-2 transition-colors ${
                  activeSubTab === 'prompt'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Prompt & Instructions
              </button>
              <button
                onClick={() => setActiveSubTab('knowledge')}
                className={`px-3 py-2 border-b-2 transition-colors ${
                  activeSubTab === 'knowledge'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Knowledge Sources
              </button>
              <button
                onClick={() => setActiveSubTab('tools')}
                className={`px-3 py-2 border-b-2 transition-colors ${
                  activeSubTab === 'tools'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Tools & APIs
              </button>
            </div>

            {/* Prompt Editor Form Matching Mockup 4 */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                System Prompt
              </label>

              <textarea
                rows={9}
                value={systemPromptText}
                onChange={(e) => setSystemPromptText(e.target.value)}
                className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-600"
              />

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400 font-mono">
                  {systemPromptText.length}/1000 characters
                </span>

                <div className="flex items-center gap-2">
                  {hasSaved && (
                    <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 size={13} /> Saved!
                    </span>
                  )}
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: KNOWLEDGE BASE TAB */}
      {topTab === 'knowledge' && (
        <div className="space-y-6">
          {/* Drag & Drop Upload Zone */}
          <div className="p-8 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100/60 transition-colors text-center flex flex-col items-center justify-center cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
              <UploadCloud size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Drag and drop policy documents and manuals here
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Supports PDF, Markdown (.md), and TXT files up to 25MB for AI grounding.
            </p>
          </div>

          {/* Documents Table */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Indexed Knowledge Documents</h3>
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-blue-600" />
                    <div>
                      <span className="font-bold text-slate-900 block">{doc.title}</span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {doc.fileName} • {doc.chunkCount} chunks
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold">
                      ● Indexed
                    </span>
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Test Agent Modal */}
      {isTestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Play size={14} className="text-blue-600" />
                Test Prompt: {selectedAgent.name}
              </h3>
              <button onClick={() => setIsTestModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleTestAgent} className="space-y-3">
              <input
                type="text"
                placeholder="Ask e.g. What is my leave balance?"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                Simulate Agent Response
              </button>
            </form>

            {testReply && (
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 text-slate-800 text-xs">
                <span className="font-bold text-blue-700 block mb-1">AI Response:</span>
                {testReply}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
