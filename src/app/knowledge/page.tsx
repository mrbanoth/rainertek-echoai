'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Sparkles,
  Save,
  Upload,
  RotateCcw,
  CheckCircle2,
  FileText,
  HelpCircle,
  PhoneCall,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function KnowledgeContextPage() {
  const { knowledgeContext, setKnowledgeContext } = useApp();
  const [contextInput, setContextInput] = useState(knowledgeContext);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setKnowledgeContext(contextInput);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleApplyPreset = (presetText: string) => {
    setContextInput(presetText);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setContextInput((prev) => `${prev}\n\n# Uploaded: ${file.name}\n${text}`);
        }
      };
      reader.readAsText(file);
    }
  };

  const PRESETS = [
    {
      name: 'Corporate General & IT Helpdesk',
      content: `Welcome to RainerTek Corporate Office.
Working Hours: Monday to Friday from 9:00 AM to 6:00 PM IST.
Headquarters: RainerTek Technology Park, Bangalore, India.
For IT hardware and VPN support, employees should email it-desk@rainertek.com or dial extension 104.
WiFi network for guests: 'RainerTek-Guest' with password credentials requested at reception.`,
    },
    {
      name: 'Customer Service & Sales Inquiry',
      content: `Welcome to RainerTek Customer Solutions.
We specialize in enterprise AI Voice Agents, CRM integration, and cloud data platforms.
Sales inquiries: sales@rainertek.com or call +91 80 4718 9000.
We offer a 14-day evaluation sandbox for enterprise clients.
Billing questions can be directed to accounts@rainertek.com.`,
    },
    {
      name: 'Employee Benefits & Leave Policy',
      content: `RainerTek Employee HR Services.
Annual Leave: Full-time employees accrue 20 standard PTO days annually.
Carryover: Up to 5 unused PTO days can be rolled over to the subsequent calendar year.
Health Insurance: Coverage includes employee, spouse, and up to 2 dependents with cashless hospital network.
HR Business Partner contact: hr@rainertek.com.`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Knowledge Context & Assistant Grounding
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
              REAL-TIME SYNC
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Provide the company rules, policies, or FAQs that RainerTek EchoAI will use when speaking to callers.
          </p>
        </div>

        <Link
          href="/"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 self-start sm:self-auto transition-all"
        >
          <PhoneCall size={14} />
          <span>Test Live Call Now</span>
        </Link>
      </div>

      {/* Editor & Guidance Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Context Editor (8 cols) */}
        <form onSubmit={handleSave} className="lg:col-span-8 rounded-2xl bg-white border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Active Knowledge Prompt</h3>
            </div>
            {savedSuccess && (
              <span className="text-xs font-medium text-emerald-600 flex items-center gap-1 animate-in fade-in">
                <CheckCircle2 size={13} /> Saved & Active
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">
              Paste or type your business information, FAQs, contact details, and guidelines:
            </label>
            <textarea
              rows={14}
              value={contextInput}
              onChange={(e) => setContextInput(e.target.value)}
              placeholder="Enter your company information here..."
              className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:outline-none text-xs text-slate-800 leading-relaxed font-mono"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer transition-colors">
              <Upload size={14} />
              <span>Import TXT or Markdown File</span>
              <input
                type="file"
                accept=".txt,.md,.json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 justify-center transition-colors"
            >
              <Save size={15} />
              <span>Save & Update Voice Assistant</span>
            </button>
          </div>
        </form>

        {/* Right: Quick Presets & Tips (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Quick Templates</h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Click any template to quickly populate your voice assistant with sample company facts:
            </p>

            <div className="space-y-2 pt-1">
              {PRESETS.map((p) => (
                <button
                  type="button"
                  key={p.name}
                  onClick={() => handleApplyPreset(p.content)}
                  className="w-full p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-200 text-left transition-colors group"
                >
                  <div className="font-semibold text-xs text-slate-800 group-hover:text-indigo-700 flex items-center justify-between">
                    <span>{p.name}</span>
                    <ArrowRight size={13} className="text-slate-400 group-hover:text-indigo-600" />
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                    {p.content}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-indigo-50/80 border border-indigo-100 p-5 text-xs text-indigo-900 space-y-2">
            <h4 className="font-bold flex items-center gap-1.5">
              <HelpCircle size={15} className="text-indigo-600" />
              How Grounding Works
            </h4>
            <p className="text-[11px] text-indigo-800 leading-relaxed">
              When a user asks a question during a live call, EchoAI consults this context to find the relevant answer. If a question is not covered in your context, the agent politely informs the caller.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
