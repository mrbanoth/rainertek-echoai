'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, Mic, PhoneIncoming, PhoneOutgoing, Plus, Trash2, UploadCloud, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DocumentFormat } from '@/types';

type Direction = 'inbound' | 'outbound';

function fileFormat(name: string): DocumentFormat {
  const lower = name.toLowerCase();
  if (lower.endsWith('.md')) return 'markdown';
  if (lower.endsWith('.csv')) return 'csv';
  if (lower.endsWith('.pdf')) return 'pdf';
  if (lower.endsWith('.docx')) return 'docx';
  return 'txt';
}

export default function AgentsPage() {
  const router = useRouter();
  const { agents, documents, createAgent, deleteAgent, addDocument, selectedAgentId, setSelectedAgentId } =
    useApp();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [direction, setDirection] = useState<Direction>('inbound');
  const [prompt, setPrompt] = useState('');
  const [pasted, setPasted] = useState('');
  const [files, setFiles] = useState<Array<{ name: string; text: string }>>([]);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement | null>(null);

  const selected = agents.find((agent) => agent.id === selectedAgentId) || agents[0];
  const selectedDocs = documents.filter((doc) =>
    selected?.approvedKnowledgeSources?.includes(doc.title)
  );

  const resetForm = () => {
    setName('');
    setDirection('inbound');
    setPrompt('');
    setPasted('');
    setFiles([]);
    setError('');
  };

  const readFiles = async (list: FileList | null) => {
    if (!list) return;
    const next: Array<{ name: string; text: string }> = [];
    for (const file of Array.from(list)) {
      const text = await file.text();
      next.push({ name: file.name, text });
    }
    setFiles((prev) => [...prev, ...next]);
  };

  const saveAgent = (event: React.FormEvent) => {
    event.preventDefault();
    const agentName = name.trim();
    const task = prompt.trim();
    if (!agentName || !task) {
      setError('Add a name and what the agent should do.');
      return;
    }

    const titles: string[] = [];
    if (pasted.trim()) {
      const title = `${agentName} notes`;
      titles.push(title);
      addDocument({
        title,
        fileName: `${agentName.toLowerCase().replace(/\s+/g, '-')}-notes.txt`,
        projectId: 'GENERAL',
        category: 'faq',
        version: '1.0',
        format: 'txt',
        sizeBytes: pasted.length,
        uploader: 'Echo AI',
        contentSnippet: pasted.slice(0, 180),
        rawText: pasted,
      });
    }

    files.forEach((file) => {
      titles.push(file.name);
      addDocument({
        title: file.name,
        fileName: file.name,
        projectId: 'GENERAL',
        category: 'policy',
        version: '1.0',
        format: fileFormat(file.name),
        sizeBytes: file.text.length,
        uploader: 'Echo AI',
        contentSnippet: file.text.slice(0, 180),
        rawText: file.text,
      });
    });

    const created = createAgent({
      name: agentName,
      description: task,
      channel: direction,
      greeting:
        direction === 'inbound'
          ? `Hello, this is ${agentName}. How can I help you today?`
          : `Hello, this is ${agentName}. Am I speaking with the right person?`,
      approvedKnowledgeSources: titles,
      voiceModel: 'Echo AI voice',
      supportedLanguages: ['English'],
      systemPrompt: {
        identity: `You are ${agentName}, an Echo AI agent.`,
        role: task,
        scope: titles.length ? titles.join(', ') : 'No context file was added.',
        tone: 'Short, clear, and polite.',
        instructions: task,
        restrictions: 'Answer only from the saved context. If it is not there, say you cannot verify it.',
        escalation: 'Offer to take a message when the answer is not in the context.',
      },
    });

    setSelectedAgentId(created.id);
    setOpen(false);
    resetForm();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-4 items-start">
      <section className="rounded-2xl bg-white border border-slate-200 p-5 min-h-[520px]">
        {selected ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-blue-600">
                  {selected.channel === 'outbound' ? 'Outbound' : 'Inbound'}
                </p>
                <h2 className="text-lg font-bold text-slate-900">{selected.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedAgentId(selected.id);
                  router.push('/live');
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-[11px] font-bold"
              >
                <Mic size={13} />
                Talk
              </button>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {selected.description || selected.systemPrompt.instructions}
            </p>
            <div>
              <p className="text-xs font-bold text-slate-900 mb-2">Context</p>
              {selectedDocs.length === 0 ? (
                <p className="text-xs text-slate-500">No file or pasted notes on this agent.</p>
              ) : (
                <ul className="space-y-2">
                  {selectedDocs.map((doc) => (
                    <li key={doc.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xs font-bold text-slate-900">{doc.title}</p>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-3">{doc.contentSnippet}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Talk opens a browser call with this prompt and context. Inbound means the caller starts.
              Outbound means the agent speaks first. The session does not dial a phone number.
            </p>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-16">
            <Bot className="text-blue-600 mb-3" />
            <p className="text-sm font-bold text-slate-900">No agent yet</p>
            <p className="text-xs text-slate-500 mt-1">Create one from the panel on the right.</p>
          </div>
        )}
      </section>

      <aside className="rounded-2xl bg-white border border-slate-200 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">Agents</h2>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setOpen(true);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-[11px] font-bold"
          >
            <Plus size={13} />
            New
          </button>
        </div>
        <div className="space-y-2">
          {agents.map((agent) => {
            const active = agent.id === selected?.id;
            return (
              <div
                key={agent.id}
                className={`rounded-xl border p-3 ${active ? 'border-blue-300 bg-blue-50' : 'border-slate-200'}`}
              >
                <button type="button" onClick={() => setSelectedAgentId(agent.id)} className="w-full text-left">
                  <span className="text-xs font-bold text-slate-900 block">{agent.name}</span>
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    {agent.channel === 'outbound' ? 'Outbound' : 'Inbound'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => deleteAgent(agent.id)}
                  className="mt-2 text-rose-500"
                  aria-label={`Delete ${agent.name}`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <form onSubmit={saveAgent} className="w-full max-w-lg rounded-2xl bg-white p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">New agent</h2>
              <button type="button" onClick={() => setOpen(false)} className="text-slate-400" aria-label="Close">
                <X size={16} />
              </button>
            </div>

            <label className="block space-y-1">
              <span className="text-xs font-bold text-slate-700">Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Agent name"
              />
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDirection('inbound')}
                className={`rounded-xl border px-3 py-2 text-xs font-bold flex items-center justify-center gap-1.5 ${
                  direction === 'inbound' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'
                }`}
              >
                <PhoneIncoming size={14} />
                Inbound
              </button>
              <button
                type="button"
                onClick={() => setDirection('outbound')}
                className={`rounded-xl border px-3 py-2 text-xs font-bold flex items-center justify-center gap-1.5 ${
                  direction === 'outbound' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'
                }`}
              >
                <PhoneOutgoing size={14} />
                Outbound
              </button>
            </div>

            <label className="block space-y-1">
              <span className="text-xs font-bold text-slate-700">What should it do?</span>
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                rows={4}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="The prompt for this agent"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-xs font-bold text-slate-700">Paste context</span>
              <textarea
                value={pasted}
                onChange={(event) => setPasted(event.target.value)}
                rows={4}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                placeholder="Paste notes, a handbook, or a contact list"
              />
            </label>

            <div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex items-center gap-1.5 text-xs font-bold text-blue-700"
              >
                <UploadCloud size={14} />
                Upload a file instead
              </button>
              <input
                ref={fileRef}
                type="file"
                multiple
                accept=".md,.txt,.csv,.json"
                className="hidden"
                onChange={(event) => {
                  void readFiles(event.target.files);
                  event.target.value = '';
                }}
              />
              {files.length > 0 && (
                <ul className="mt-2 text-[11px] text-slate-600 space-y-1">
                  {files.map((file) => (
                    <li key={file.name}>{file.name}</li>
                  ))}
                </ul>
              )}
            </div>

            {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setOpen(false)} className="px-3 py-2 text-xs font-bold text-slate-600">
                Cancel
              </button>
              <button type="submit" className="px-3 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold">
                Save agent
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
