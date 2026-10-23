'use client';

import React, { useState } from 'react';
import {
  Users,
  Plus,
  Shield,
  Network,
  Sliders,
  CheckCircle2,
  Trash2,
  Edit2,
  MoreVertical,
  Lock,
  Layers,
  Save,
  Building2,
} from 'lucide-react';

export default function TeamAndSettingsPage() {
  const [activeTab, setActiveTab] = useState<'team' | 'roles' | 'projects' | 'integrations' | 'general'>('team');

  // Exact team members list matching Mockup 6
  const teamMembers = [
    {
      id: '1',
      name: 'Sandeep Naik',
      email: 'sandeep@rainertek.com',
      role: 'Admin',
      department: 'IT',
      status: 'Active',
      initials: 'SN',
      avatarBg: 'bg-blue-600',
    },
    {
      id: '2',
      name: 'Priya Sharma',
      email: 'priya@rainertek.com',
      role: 'Operator',
      department: 'HR',
      status: 'Active',
      initials: 'PS',
      avatarBg: 'bg-emerald-600',
    },
    {
      id: '3',
      name: 'Ravi Kumar',
      email: 'ravi@rainertek.com',
      role: 'Viewer',
      department: 'QMS',
      status: 'Active',
      initials: 'RK',
      avatarBg: 'bg-indigo-600',
    },
    {
      id: '4',
      name: 'Anitha Reddy',
      email: 'anitha@rainertek.com',
      role: 'Operator',
      department: 'LIMS',
      status: 'Active',
      initials: 'AR',
      avatarBg: 'bg-cyan-600',
    },
    {
      id: '5',
      name: 'Karan Mehta',
      email: 'karan@rainertek.com',
      role: 'Viewer',
      department: 'Development',
      status: 'Active',
      initials: 'KM',
      avatarBg: 'bg-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Matching Mockup 6 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Team & Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage users, roles, permissions and integrations
          </p>
        </div>

        <button
          onClick={() => alert('Invite new employee to RainerTek EchoAI platform.')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer"
        >
          <Plus size={15} />
          <span>+ Invite User</span>
        </button>
      </div>

      {/* Subtabs Matching Mockup 6 */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('team')}
          className={`px-3.5 py-1.5 rounded-xl transition-all ${
            activeTab === 'team'
              ? 'bg-blue-50 text-blue-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Team Members
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-3.5 py-1.5 rounded-xl transition-all ${
            activeTab === 'roles'
              ? 'bg-blue-50 text-blue-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Roles & Permissions
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`px-3.5 py-1.5 rounded-xl transition-all ${
            activeTab === 'projects'
              ? 'bg-blue-50 text-blue-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Projects
        </button>
        <button
          onClick={() => setActiveTab('integrations')}
          className={`px-3.5 py-1.5 rounded-xl transition-all ${
            activeTab === 'integrations'
              ? 'bg-blue-50 text-blue-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Integrations
        </button>
        <button
          onClick={() => setActiveTab('general')}
          className={`px-3.5 py-1.5 rounded-xl transition-all ${
            activeTab === 'general'
              ? 'bg-blue-50 text-blue-600 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          General
        </button>
      </div>

      {/* TAB 1: TEAM MEMBERS (Matching Mockup 6) */}
      {activeTab === 'team' && (
        <div className="rounded-2xl bg-white border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">{member.id}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full text-white ${member.avatarBg} flex items-center justify-center font-bold text-[10px]`}
                        >
                          {member.initials}
                        </div>
                        <span className="font-bold text-slate-900">{member.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{member.email}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{member.role}</td>
                    <td className="py-3 px-4 font-medium text-slate-700">{member.department}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold">
                        ● {member.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-slate-400">
                        <button className="p-1 rounded hover:text-blue-600 hover:bg-blue-50">
                          <Edit2 size={13} />
                        </button>
                        <button className="p-1 rounded hover:text-red-600 hover:bg-red-50">
                          <Trash2 size={13} />
                        </button>
                        <button className="p-1 rounded hover:text-slate-800">
                          <MoreVertical size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Pagination Matching Mockup 6 */}
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Showing 1 to 5 of 5 results</span>
            <div className="flex items-center gap-1 font-mono font-bold">
              <button className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                1
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROLES & PERMISSIONS */}
      {activeTab === 'roles' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900">Role-Based Access Control (RBAC)</h3>
          <p className="text-xs text-slate-500">
            Department permissions enforced for employee data privacy and 21 CFR Part 11 / GxP compliance.
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Administrator</span>
                <span className="text-xs text-slate-500">Full access to voice calls, prompt editing, team permissions, and telephony routes.</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold text-[10px]">
                Global Scope
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Operator</span>
                <span className="text-xs text-slate-500">Authorized to handle live voice sessions, initiate outbound campaigns, and update knowledge.</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[10px]">
                Department Bound
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Read-Only Viewer</span>
                <span className="text-xs text-slate-500">Can view dashboard metrics, call transcripts, and audit logs without modification rights.</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px]">
                Audit Only
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROJECTS */}
      {activeTab === 'projects' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900">Active Company Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <span className="font-bold text-slate-900 block">HRMS</span>
              <p className="text-xs text-slate-500">Leave balances, benefits, and employee handbook support.</p>
              <span className="text-[10px] text-blue-600 font-bold block mt-1">2 Active Agents</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <span className="font-bold text-slate-900 block">QMS</span>
              <p className="text-xs text-slate-500">Cleanroom deviations, CAPA, and ISO 9001 compliance intake.</p>
              <span className="text-[10px] text-indigo-600 font-bold block mt-1">1 Active Agent</span>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
              <span className="font-bold text-slate-900 block">LIMS</span>
              <p className="text-xs text-slate-500">Specimen chain of custody and assay status logs.</p>
              <span className="text-[10px] text-cyan-600 font-bold block mt-1">1 Active Agent</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INTEGRATIONS (White-Labeled) */}
      {activeTab === 'integrations' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900">System Connectors (White-Labeled)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">RainerTek Neural Voice Engine</span>
                <span className="text-[11px] text-slate-500">Real-time multilingual speech synthesis & transcription</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">
                ● Connected
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">RainerTek Enterprise SIP Trunk</span>
                <span className="text-[11px] text-slate-500">Carrier telephony gateway for inbound/outbound calls</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">
                ● Connected
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">HRMS Database Connector</span>
                <span className="text-[11px] text-slate-500">Live employee record lookups and leave balances</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">
                ● Connected
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">QMS GxP Audit Vault</span>
                <span className="text-[11px] text-slate-500">21 CFR Part 11 compliant immutable logging</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">
                ● Connected
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GENERAL */}
      {activeTab === 'general' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900">General Platform Configuration</h3>
          <div className="space-y-3 max-w-lg">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Audio Recording Retention Policy
              </label>
              <select className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs">
                <option value="90">90 Days (Enterprise Standard)</option>
                <option value="365">1 Year (GxP Regulatory Compliance)</option>
                <option value="indefinite">Indefinite (Legal Hold)</option>
              </select>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                <span className="text-slate-700 font-semibold text-xs">
                  Automatic Voice PII Redaction (Phone, SSN, passwords masked in transcripts)
                </span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
