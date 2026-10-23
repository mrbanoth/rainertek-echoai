'use client';

import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Lock,
  Mail,
  UserPlus,
  Shield,
  Key,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';

export default function TeamAndPermissionsPage() {
  const { team, userRole, setUserRole } = useApp();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  // Role Capability Matrix
  const PERMISSIONS_MATRIX = [
    {
      feature: 'Edit & Publish AI Agent Prompts',
      admin: true,
      operator: false,
      viewer: false,
    },
    {
      feature: 'Upload & Re-index Knowledge Documents',
      admin: true,
      operator: true,
      viewer: false,
    },
    {
      feature: 'Initiate Outbound Calling Campaigns',
      admin: true,
      operator: true,
      viewer: false,
    },
    {
      feature: 'Live Voice Interactivity & Human Takeover',
      admin: true,
      operator: true,
      viewer: false,
    },
    {
      feature: 'Inspect Call Transcripts & Cost Breakdown',
      admin: true,
      operator: true,
      viewer: true,
    },
    {
      feature: 'View Compliance & GxP Audit Trail',
      admin: true,
      operator: true,
      viewer: true,
    },
    {
      feature: 'System Integration Configuration',
      admin: true,
      operator: false,
      viewer: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#111A2E] border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Users size={18} className="text-indigo-400" />
              Team Directory & Role-Based Access Control
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-bold">
              RBAC GOVERNANCE
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage enterprise operators, multi-project access scopes, and multi-factor authorization enforcement.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-lg">
            <span className="text-slate-400">Current Session Role:</span>
            <span className="font-mono font-bold text-indigo-400">{userRole}</span>
          </div>
        </div>
      </div>

      {/* Team Members Table */}
      <div className="rounded-xl bg-[#111A2E] border border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Authorized RainerTek Personnel ({team.length})</h3>
          <span className="text-[11px] font-mono text-slate-400">SAML SSO / Okta Synced</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080D1A] text-slate-400 border-b border-slate-800 font-mono text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Member Name & Email</th>
                <th className="py-3 px-4">Access Role</th>
                <th className="py-3 px-4">Assigned Project Scopes</th>
                <th className="py-3 px-4">MFA Status</th>
                <th className="py-3 px-4 text-right">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {team.map((member) => (
                <tr key={member.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-300 flex items-center justify-center font-bold text-xs">
                        {member.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-semibold text-white block">{member.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{member.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-full font-mono ${
                        member.role === 'Administrator'
                          ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/40'
                          : member.role === 'Operator'
                          ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                          : 'bg-slate-900 text-slate-400 border border-slate-700'
                      }`}
                    >
                      <Shield size={10} />
                      {member.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {member.projectScopes.map((scope, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-900 text-slate-300 border border-slate-800"
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {member.mfaEnabled ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                        <CheckCircle2 size={12} /> Hardware Key (FIDO2)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 font-semibold">
                        <XCircle size={12} /> SMS OTP
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[11px] text-slate-400">
                    {member.lastActive}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Access Permission Matrix (Section 16 Governance) */}
      <div className="p-5 rounded-xl bg-[#111A2E] border border-slate-800 space-y-3">
        <h3 className="text-sm font-semibold text-white">Enterprise Role Permissions Matrix</h3>
        <p className="text-xs text-slate-400">
          Enforced strictly via API authorization token claims, protecting cross-project isolation.
        </p>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080D1A] text-slate-400 font-mono text-[11px] uppercase">
              <tr>
                <th className="py-2.5 px-3">System Capability</th>
                <th className="py-2.5 px-3 text-center">Administrator</th>
                <th className="py-2.5 px-3 text-center">Operator</th>
                <th className="py-2.5 px-3 text-center">Read-Only Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {PERMISSIONS_MATRIX.map((row, i) => (
                <tr key={i} className="hover:bg-slate-900/50">
                  <td className="py-2.5 px-3 font-medium">{row.feature}</td>
                  <td className="py-2.5 px-3 text-center">
                    {row.admin ? (
                      <CheckCircle2 size={14} className="text-emerald-400 inline" />
                    ) : (
                      <XCircle size={14} className="text-slate-600 inline" />
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.operator ? (
                      <CheckCircle2 size={14} className="text-emerald-400 inline" />
                    ) : (
                      <XCircle size={14} className="text-slate-600 inline" />
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.viewer ? (
                      <CheckCircle2 size={14} className="text-emerald-400 inline" />
                    ) : (
                      <XCircle size={14} className="text-slate-600 inline" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
