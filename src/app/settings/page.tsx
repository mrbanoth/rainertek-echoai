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
  Building2,
  Radio,
  RotateCcw,
  Sparkles,
  PhoneCall,
  Terminal,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AdminAvatar } from '@/components/layout/AdminAvatar';

export default function TeamAndSettingsPage() {
  const { projects, addProject, deleteProject, resetAllData } = useApp();
  const [activeTab, setActiveTab] = useState<'team' | 'roles' | 'projects' | 'integrations' | 'general'>('team');
  const [sarvamStatus, setSarvamStatus] = useState<{
    sarvamConfigured: boolean;
    sarvamKeyMasked: string | null;
    sarvamPhoneNumber: string | null;
    sarvamAgentId: string | null;
  } | null>(null);

  React.useEffect(() => {
    fetch('/api/sarvam/status')
      .then((r) => r.json())
      .then((data) => setSarvamStatus(data))
      .catch(() => {});
  }, []);

  // Dynamic projects creation form
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjCode, setNewProjCode] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');

  // Team members list with enterprise operational departments
  const [teamMembers, setTeamMembers] = useState([
    {
      id: '1',
      name: 'Praveen Manne',
      email: 'praveenmanne@yopmail.com',
      role: 'Administrator',
      department: 'Executive Operations',
      status: 'Active',
      initials: 'PM',
      avatarBg: 'bg-blue-600',
    },
  ]);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteDept, setInviteDept] = useState('Voice Operations');
  const [inviteRole, setInviteRole] = useState('Operator');

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;

    addProject({
      id: `proj-${Date.now()}`,
      name: newProjName.trim(),
      code: newProjCode.trim().toUpperCase() || 'PROJ',
      description: newProjDesc.trim() || 'Internal company operational workspace.',
      agentCount: 0,
      documentCount: 0,
      connectedMinutesThisMonth: 0,
      status: 'active',
      complianceLevel: 'Internal',
    });

    setNewProjName('');
    setNewProjCode('');
    setNewProjDesc('');
    setShowAddProject(false);
  };

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    setTeamMembers((prev) => [
      ...prev,
      {
        id: `usr-${Date.now()}`,
        name: inviteName.trim(),
        email: inviteEmail.trim(),
        role: inviteRole,
        department: inviteDept,
        status: 'Active',
        initials: inviteName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2),
        avatarBg: 'bg-purple-600',
      },
    ]);

    setInviteName('');
    setInviteEmail('');
    setShowInviteModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Matching Mockup 6 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Team & Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage users, permissions, custom workspaces, and voice integrations
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>+ Invite User</span>
          </button>
        </div>
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
          Projects ({projects.length})
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
          General & Reset
        </button>
      </div>

      {/* TAB 1: TEAM MEMBERS */}
      {activeTab === 'team' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Enterprise Users ({teamMembers.length})</h3>
            <span className="text-xs text-slate-500">Internal company access only</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold">
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Department</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        {member.role === 'Administrator' ? (
                          <AdminAvatar size={32} />
                        ) : (
                          <div
                            className={`w-8 h-8 rounded-full ${member.avatarBg} text-white flex items-center justify-center font-bold text-xs`}
                          >
                            {member.initials}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-slate-900 block">{member.name}</span>
                          <span className="text-[11px] text-slate-500 font-mono">{member.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 font-semibold text-slate-700 text-[11px]">
                        {member.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">{member.department}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[10px] flex items-center gap-1 w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {member.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {teamMembers.length > 1 && (
                        <button
                          onClick={() => setTeamMembers((prev) => prev.filter((m) => m.id !== member.id))}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Remove user"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ROLES & PERMISSIONS */}
      {activeTab === 'roles' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900">Role Privilege Hierarchy</h3>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Administrator</span>
                <span className="text-xs text-slate-500">
                  Full control over system base prompts, voice agents, knowledge indexing, campaigns, and team members.
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-bold text-[10px]">
                Full Access
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Operator</span>
                <span className="text-xs text-slate-500">
                  Authorized to monitor live voice sessions, test base prompts, and review verified answers.
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-[10px]">
                Operations Bound
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Read-Only Viewer</span>
                <span className="text-xs text-slate-500">
                  Can view dashboard metrics, call transcripts, and audit logs without modification rights.
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px]">
                Audit Only
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PROJECTS (Fully Dynamic, No Dummy HRMS/QMS) */}
      {activeTab === 'projects' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Active Workspaces ({projects.length})</h3>
              <p className="text-slate-500 text-xs mt-0.5">
                Organize your company knowledge, agents, and calls into isolated operational domains.
              </p>
            </div>
            <button
              onClick={() => setShowAddProject(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Plus size={14} />
              <span>+ Create Project</span>
            </button>
          </div>

          {/* Add Project Inline Modal/Form */}
          {showAddProject && (
            <form
              onSubmit={handleCreateProject}
              className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-3"
            >
              <h4 className="font-bold text-slate-900 text-xs">Create New Operational Project</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Project Name *</label>
                  <input
                    type="text"
                    required
                    value={newProjName}
                    onChange={(e) => setNewProjName(e.target.value)}
                    placeholder="e.g., Customer Service Operations"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Project Code</label>
                  <input
                    type="text"
                    value={newProjCode}
                    onChange={(e) => setNewProjCode(e.target.value)}
                    placeholder="e.g., CS-OPS"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs uppercase font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newProjDesc}
                  onChange={(e) => setNewProjDesc(e.target.value)}
                  placeholder="Operational scope for AI handling..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddProject(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-xs"
                >
                  Save Project
                </button>
              </div>
            </form>
          )}

          {/* Dynamic Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 block text-sm">{proj.name}</span>
                    <span className="font-mono text-[10px] text-slate-400 font-bold px-1.5 py-0.5 rounded bg-slate-200/60">
                      {proj.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{proj.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Active Scope
                  </span>
                  {projects.length > 1 && (
                    <button
                      onClick={() => {
                        if (confirm(`Delete project "${proj.name}"?`)) {
                          deleteProject(proj.id);
                        }
                      }}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-200 transition-colors"
                      title="Delete project"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: INTEGRATIONS (Clean & White-Labeled) */}
      {activeTab === 'integrations' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900">Voice & Carrier Telephony Connectors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Echo AI voice</span>
                <span className="text-[11px] text-slate-500">
                  Real-time multilingual speech-to-text (STT) and low-latency voice synthesis (TTS)
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Connected
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Echo AI phone line</span>
                <span className="text-[11px] text-slate-500">
                  Direct carrier telephony gateway for enterprise inbound and outbound routing
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Connected
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">Real-Time Webhook Gateway</span>
                <span className="text-[11px] text-slate-500">
                  Stream call events, customer intent, and transcript turns to external company systems
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: GENERAL & FACTORY RESET */}
      {activeTab === 'general' && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900">General Platform Configuration</h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Global audio recording retention, privacy, and system state controls.
            </p>
          </div>

          <div className="space-y-4 max-w-lg">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Audio Recording Retention Policy
              </label>
              <select className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600">
                <option value="90">90 Days (Enterprise Standard)</option>
                <option value="365">1 Year (Regulatory Audit Compliance)</option>
                <option value="indefinite">Indefinite (Legal Hold)</option>
              </select>
            </div>

            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                <span className="text-slate-700 font-semibold text-xs">
                  Automatic Voice PII Redaction (Phone numbers, employee IDs, and passwords masked in transcripts)
                </span>
              </label>
            </div>
          </div>

          {/* Reset All Data / Delete Dummy Data Section */}
          <div className="pt-6 border-t border-slate-200">
            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-3">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <RotateCcw size={16} />
                <span>Reset All Workspace Data & Clear Cache</span>
              </div>
              <p className="text-xs text-rose-600 leading-relaxed">
                Clicking this will remove all local cached dummy data, reset calls, documents, and reload fresh state.
                Use this to start with a clean slate where you define your own base prompt, agents, and documents.
              </p>
              <button
                onClick={resetAllData}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Delete All Mockup Data & Reset Fresh</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-slate-900">Invite Team Member</h3>
            <form onSubmit={handleInviteUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="e.g., Rajesh Sharma"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="name@echo.ai"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={inviteDept}
                    onChange={(e) => setInviteDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role</label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="Administrator">Administrator</option>
                    <option value="Operator">Operator</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-xs"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
