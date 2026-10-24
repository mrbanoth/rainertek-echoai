'use client';

import React from 'react';
import {
  Network,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  Bot,
  Activity,
  PhoneCall,
  Lock,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function IntegrationsCataloguePage() {
  const { integrations } = useApp();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#111A2E] border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Network size={18} className="text-indigo-400" />
              Approved Enterprise Connectors
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-bold">
              BACKEND MANAGED SECRETS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Verified system connectors for voice synthesis, telephony carrier gateways, and real-time enterprise webhook streaming.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Total Integrations:</span>
          <span className="font-mono text-white font-bold bg-slate-900 px-2.5 py-1 rounded-md border border-slate-700">
            {integrations.length} Systems Active
          </span>
        </div>
      </div>

      {/* Security Disclaimer (Section 17 Requirements) */}
      <div className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Lock size={14} className="text-emerald-400" />
          <span>
            API secrets, mTLS certificates, and database connection strings are safely managed in backend environment vaults.
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">ISO 27001 / SOC-2 Type II</span>
      </div>

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-xl bg-[#111A2E] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              {/* Header: Name & Status Pill */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-white text-sm">{item.name}</h3>
                  <span className="text-[10px] font-mono uppercase text-indigo-400">
                    Category: {item.category}
                  </span>
                </div>
                {item.status === 'connected' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                    <CheckCircle2 size={11} /> Connected
                  </span>
                ) : item.status === 'degraded' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 rounded-full">
                    <AlertTriangle size={11} /> Degraded
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-400 bg-rose-950/80 border border-rose-500/40 px-2 py-0.5 rounded-full">
                    <XCircle size={11} /> Disconnected
                  </span>
                )}
              </div>

              {/* Endpoint Preview & Safe Status */}
              <div className="mt-3 p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-400 break-all">
                {item.endpointPreview}
              </div>

              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                {item.safeStatusMessage}
              </p>

              {item.actionableError && (
                <div className="mt-2.5 p-2 rounded bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[11px] flex items-center gap-1.5 font-mono">
                  <AlertTriangle size={12} className="flex-shrink-0" />
                  <span>Action: {item.actionableError}</span>
                </div>
              )}
            </div>

            {/* Supported Capabilities & Health Footer */}
            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-500">Permitted Scopes</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {item.capabilities.map((cap, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                <span>Last Telemetry Sync:</span>
                <span>{item.lastSuccessfulOperation}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
