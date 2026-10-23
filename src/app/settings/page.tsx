'use client';

import React, { useState } from 'react';
import {
  Settings,
  Volume2,
  Lock,
  Save,
  CheckCircle2,
  Shield,
  Clock,
  Sparkles,
  Phone,
  Layers,
  Globe,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function SettingsPage() {
  const { userRole } = useApp();

  const [sarvamApiKey, setSarvamApiKey] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('bulbul:v1');
  const [selectedCodec, setSelectedCodec] = useState('opus-24k');
  const [retentionPeriodDays, setRetentionPeriodDays] = useState('90');
  const [autoRedactPii, setAutoRedactPii] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (userRole === 'Read-only viewer') {
      alert('Action Restricted: Read-only viewers cannot update system settings.');
      return;
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#111A2E] border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Settings size={18} className="text-indigo-400" />
              General Platform Settings
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-bold">
              SYSTEM LEVEL CONFIGURATION
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Telephony audio sampling, voice model defaults, PII redaction policies, and Sarvam AI connection token.
          </p>
        </div>

        {saveSuccess && (
          <span className="text-[11px] font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
            <CheckCircle2 size={13} /> Settings Committed Successfully!
          </span>
        )}
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Section 1: Sarvam AI Voice Engine */}
        <div className="p-5 rounded-xl bg-[#111A2E] border border-slate-800 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Sparkles size={16} className="text-indigo-400" />
                Sarvam AI Voice Engine Integration
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Powers real-time Indian multilingual speech synthesis and speech-to-text.
              </p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
              ● Engine Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Sarvam API Key (Optional local override)
              </label>
              <input
                type="password"
                placeholder="Enter Sarvam API token to test live voice synthesis..."
                value={sarvamApiKey}
                onChange={(e) => setSarvamApiKey(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Leave blank to use default enterprise backend vault token.
              </span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Default Voice Synthesis Model
              </label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
              >
                <option value="bulbul:v1">Sarvam Bulbul v1 (English & Hindi)</option>
                <option value="meera:v1">Sarvam Meera v1 (Warm Conversational)</option>
                <option value="pavan:v1">Sarvam Pavan v1 (Clear Technical)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Audio Telephony Codecs */}
        <div className="p-5 rounded-xl bg-[#111A2E] border border-slate-800 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Volume2 size={16} className="text-cyan-400" />
                Telephony Audio Sampling & SIP Codecs
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                SIP trunk negotiation parameters and audio compression standards.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => setSelectedCodec('opus-24k')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedCodec === 'opus-24k'
                  ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-white">Opus HD (24 kHz)</div>
              <p className="text-[11px] text-slate-400 mt-1">
                Recommended for WebRTC & Live Voice workspace. Highest fidelity.
              </p>
            </div>

            <div
              onClick={() => setSelectedCodec('g711u')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedCodec === 'g711u'
                  ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-white">G.711 u-law (8 kHz)</div>
              <p className="text-[11px] text-slate-400 mt-1">
                PSTN carrier fallback for low-bandwidth cellular circuits.
              </p>
            </div>

            <div
              onClick={() => setSelectedCodec('pcm-16k')}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedCodec === 'pcm-16k'
                  ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="font-bold text-white">PCM Linear (16 kHz)</div>
              <p className="text-[11px] text-slate-400 mt-1">
                Raw uncompressed streaming for laboratory cleanroom intercoms.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Data Retention & PII Redaction */}
        <div className="p-5 rounded-xl bg-[#111A2E] border border-slate-800 space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Shield size={16} className="text-emerald-400" />
                Data Retention & Privacy Enforcement
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Automated transcript purge cycles and sensitive PII anonymization.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Call Transcript Retention Policy
              </label>
              <select
                value={retentionPeriodDays}
                onChange={(e) => setRetentionPeriodDays(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
              >
                <option value="30">30 Days (Standard Audit)</option>
                <option value="90">90 Days (Enterprise Recommended)</option>
                <option value="365">1 Year (GxP Regulatory Compliance)</option>
                <option value="indefinite">Indefinite (Legal Hold)</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRedactPii}
                  onChange={(e) => setAutoRedactPii(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-slate-200 font-semibold">
                  Automatic Voice PII Redaction (Mask phone numbers, passwords & SSNs)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={userRole === 'Read-only viewer'}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md disabled:opacity-40 transition-colors"
          >
            <Save size={14} />
            Save Platform Settings
          </button>
        </div>
      </form>
    </div>
  );
}
