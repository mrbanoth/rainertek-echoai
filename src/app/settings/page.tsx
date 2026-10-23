'use client';

import React, { useState } from 'react';
import {
  Settings,
  Key,
  Phone,
  Volume2,
  Sparkles,
  Save,
  CheckCircle2,
  Copy,
  ExternalLink,
  HelpCircle,
  Eye,
  EyeOff,
  Code,
  Check,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function SettingsPage() {
  const {
    sarvamApiKey,
    setSarvamApiKey,
    hotlineNumber,
    setHotlineNumber,
    selectedVoice,
    setSelectedVoice,
    selectedLanguage,
    setSelectedLanguage,
  } = useApp();

  const [inputKey, setInputKey] = useState(sarvamApiKey);
  const [inputNumber, setInputNumber] = useState(hotlineNumber);
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSarvamApiKey(inputKey.trim());
    setHotlineNumber(inputNumber.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const copyEnvSnippet = () => {
    const snippet = `# RainerTek EchoAI Configuration
SARVAM_API_KEY=${inputKey || 'your_sarvam_api_key_here'}
NEXT_PUBLIC_HOTLINE_NUMBER=${inputNumber || '+91 80 4718 9000'}
NEXT_PUBLIC_DEFAULT_VOICE=${selectedVoice}
NEXT_PUBLIC_DEFAULT_LANG=${selectedLanguage}
`;
    navigator.clipboard.writeText(snippet);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Sarvam AI & Phone Configuration
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              SETUP GUIDE
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Connect your Sarvam AI subscription key, configure your assigned hotline number, and review environment variables.
          </p>
        </div>

        {savedSuccess && (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 size={14} />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: API & Phone Form (7 cols) */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6">
          {/* Sarvam Key Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Key size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Sarvam AI API Key</h3>
                  <p className="text-[11px] text-slate-500">
                    Powers neural Indian multilingual Text-to-Speech (Bulbul) and speech recognition
                  </p>
                </div>
              </div>
              <a
                href="https://www.sarvam.ai/"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
              >
                Get API Key <ExternalLink size={11} />
              </a>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="font-medium text-slate-700">Enter your Sarvam API Key:</label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  placeholder="e.g. 5f8b9e24-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:outline-none font-mono text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                You can save this key directly in your browser or specify it in your <code className="text-indigo-600 font-mono">.env.local</code> file.
              </p>
            </div>
          </div>

          {/* Hotline & Voice Profile Card */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Phone size={16} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Hotline & Voice Persona</h3>
                <p className="text-[11px] text-slate-500">
                  Phone display parameters and speech voice selection
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-medium text-slate-700">Designated Hotline Number</label>
                <input
                  type="text"
                  placeholder="+91 80 4718 9000"
                  value={inputNumber}
                  onChange={(e) => setInputNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:outline-none font-mono text-slate-800"
                />
                <p className="text-[11px] text-slate-400">Displayed on the web dialer and call records.</p>
              </div>

              <div className="space-y-1.5">
                <label className="font-medium text-slate-700">Sarvam Voice Model</label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:outline-none text-slate-800 font-medium"
                >
                  <option value="meera">Meera (Warm, Professional Female)</option>
                  <option value="pavithra">Pavithra (Expressive Female)</option>
                  <option value="arvind">Arvind (Clear, Formal Male)</option>
                  <option value="bulbul:v1">Bulbul v1 (High Fidelity Core)</option>
                </select>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="font-medium text-slate-700">Primary Spoken Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white focus:outline-none text-slate-800 font-medium"
                >
                  <option value="en-IN">English (India) — en-IN</option>
                  <option value="hi-IN">Hindi — hi-IN</option>
                  <option value="ta-IN">Tamil — ta-IN</option>
                  <option value="te-IN">Telugu — te-IN</option>
                  <option value="kn-IN">Kannada — kn-IN</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Save size={15} />
                <span>Save All Settings</span>
              </button>
            </div>
          </div>
        </form>

        {/* Right Column: Step-by-Step Environment Setup Guide (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Code size={18} className="text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">Environment Setup Guide</h3>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span>Create `.env.local`</span>
                </div>
                <p className="text-[11px] text-slate-500 pl-7 leading-relaxed">
                  In your project root (<code className="font-mono text-indigo-600">d:\RainerTek\RainerTek EchoAI</code>), an <code className="font-mono text-slate-800">.env.local</code> file is already created for you.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>Add your Sarvam Key</span>
                </div>
                <p className="text-[11px] text-slate-500 pl-7 leading-relaxed">
                  Copy your key from <a href="https://www.sarvam.ai/" target="_blank" rel="noreferrer" className="text-indigo-600 underline">sarvam.ai</a> and paste it into <code className="font-mono text-slate-800">SARVAM_API_KEY</code> or directly into the input on the left!
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                    3
                  </span>
                  <span>Test in Live Voice Call</span>
                </div>
                <p className="text-[11px] text-slate-500 pl-7 leading-relaxed">
                  Navigate to the <strong>Live Voice Call</strong> tab, hit &quot;Start Call&quot;, and speak into your mic or type questions!
                </p>
              </div>
            </div>

            {/* Quick Copy Snippet */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span>Copyable .env.local configuration:</span>
                <button
                  type="button"
                  onClick={copyEnvSnippet}
                  className="text-[11px] text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-semibold"
                >
                  {copiedEnv ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  <span>{copiedEnv ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-3 rounded-xl bg-slate-900 text-slate-100 font-mono text-[11px] overflow-x-auto leading-relaxed">
{`SARVAM_API_KEY=${inputKey || 'your_sarvam_api_key'}
NEXT_PUBLIC_HOTLINE_NUMBER=${inputNumber || '+91 80 4718 9000'}
NEXT_PUBLIC_DEFAULT_VOICE=${selectedVoice}
NEXT_PUBLIC_DEFAULT_LANG=${selectedLanguage}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
