'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Menu,
  Bell,
  Search,
  Shield,
  CheckCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  X,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    toggleSidebar,
    userRole,
    setUserRole,
    selectedProject,
    notificationsOpen,
    setNotificationsOpen,
    liveCallState,
    auditLogs,
  } = useApp();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const getPageMeta = () => {
    switch (pathname) {
      case '/':
        return { title: 'Overview Dashboard', section: 'Monitoring & Operations' };
      case '/live':
        return { title: 'Live Voice Workspace', section: 'Voice Telephony' };
      case '/agents':
        return { title: 'AI Agents & Prompt Engineering', section: 'Agent Management' };
      case '/knowledge':
        return { title: 'Knowledge Base & Assistant Playground', section: 'Document Grounding' };
      case '/calls':
        return { title: 'Call History & Event Logs', section: 'Telephony Records' };
      case '/inbound':
        return { title: 'Inbound Call Routing', section: 'Telephony Ingress' };
      case '/campaigns':
        return { title: 'Outbound Calling Campaigns', section: 'Campaign Automation' };
      case '/analytics':
        return { title: 'Analytics & Usage Telemetry', section: 'Intelligence & Cost' };
      case '/integrations':
        return { title: 'Enterprise Integrations Catalogue', section: 'System Connectors' };
      case '/team':
        return { title: 'Team Directory & Access Roles', section: 'Governance' };
      case '/audit':
        return { title: 'Compliance & Audit Trail', section: 'Security & GxP' };
      case '/settings':
        return { title: 'General Platform Settings', section: 'Configuration' };
      default:
        return { title: 'RainerTek EchoAI', section: 'Voice Operations' };
    }
  };

  const meta = getPageMeta();

  // Search quick jump
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.toLowerCase();
    setSearchOpen(false);
    if (query.includes('agent') || query.includes('prompt')) router.push('/agents');
    else if (query.includes('call') || query.includes('phone')) router.push('/calls');
    else if (query.includes('doc') || query.includes('sop') || query.includes('policy')) router.push('/knowledge');
    else if (query.includes('campaign')) router.push('/campaigns');
    else if (query.includes('voice') || query.includes('live')) router.push('/live');
    else if (query.includes('audit') || query.includes('log')) router.push('/audit');
    else router.push('/calls');
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-[#0B1120]/95 backdrop-blur px-4 md:px-6">
        {/* Left: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Toggle Navigation"
          >
            <Menu size={18} />
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <span>EchoAI</span>
              <span>/</span>
              <span className="text-slate-300">{meta.section}</span>
              {selectedProject !== 'ALL' && (
                <>
                  <span>/</span>
                  <span className="font-mono text-indigo-400 bg-indigo-950/80 px-1.5 py-0.2 rounded border border-indigo-500/30 text-[10px] font-semibold">
                    {selectedProject}
                  </span>
                </>
              )}
            </div>
            <h1 className="text-sm md:text-base font-semibold text-white tracking-tight flex items-center gap-2">
              {meta.title}
              {pathname === '/live' && liveCallState.status === 'connected' && (
                <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold animate-pulse">
                  <Radio size={12} />
                  LIVE CALL ACTIVE
                </span>
              )}
            </h1>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Global Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900 border border-slate-700/80 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors"
            title="Global search across entities"
          >
            <Search size={14} className="text-slate-400" />
            <span className="hidden sm:inline">Search records...</span>
            <kbd className="hidden sm:inline px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-400">
              Ctrl+K
            </kbd>
          </button>

          {/* Environment Status Indicator (Section 5) */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-[11px] font-medium text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Echo Telephony: Operational</span>
            <span className="text-[10px] font-mono uppercase bg-slate-800 text-slate-400 px-1.5 rounded">DEMO</span>
          </div>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Recent alerts & audit events"
              aria-label="Open notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-[#0B1120]" />
            </button>

            {/* Notifications Dropdown Panel */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-lg bg-[#0F172A] border border-slate-700 shadow-xl shadow-black/50 z-50 overflow-hidden text-xs">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 bg-[#080D1A]">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Shield size={14} className="text-indigo-400" />
                    Security & Operational Feed
                  </span>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/80">
                  {auditLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="p-3 hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-300 flex items-center gap-1">
                          {log.result === 'SUCCESS' ? (
                            <CheckCircle size={12} className="text-emerald-400" />
                          ) : (
                            <AlertTriangle size={12} className="text-amber-400" />
                          )}
                          {log.action}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">{log.timestamp.slice(11)}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-tight">{log.details}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                        <span>Project: <strong className="text-slate-400">{log.projectId}</strong></span>
                        <span>•</span>
                        <span>Actor: {log.actor}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-slate-800 bg-[#080D1A] text-right">
                  <button
                    onClick={() => {
                      setNotificationsOpen(false);
                      router.push('/audit');
                    }}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    View All Audit Logs →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Role Switcher (Section 16 Governance) */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-md bg-slate-900 border border-slate-700/80 hover:bg-slate-850 hover:border-slate-600 transition-colors text-left"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                RT
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-medium text-slate-200 leading-none">RainerTek Ops</span>
                <span className="text-[10px] text-indigo-400 font-mono font-medium leading-tight mt-0.5">
                  {userRole}
                </span>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-lg bg-[#0F172A] border border-slate-700 shadow-xl shadow-black/50 z-50 py-1 text-xs">
                <div className="px-3 py-2 border-b border-slate-800 text-[11px] text-slate-400">
                  <span>Logged in as </span>
                  <span className="font-semibold text-slate-200">admin@rainertek.com</span>
                </div>
                <div className="px-3 py-1.5 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  Switch Active Role
                </div>
                {(['Administrator', 'Operator', 'Read-only viewer'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setUserRole(r);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-slate-800 text-xs ${
                      userRole === r ? 'text-indigo-400 font-semibold bg-indigo-950/40' : 'text-slate-300'
                    }`}
                  >
                    <span>{r}</span>
                    {userRole === r && <CheckCircle size={12} className="text-indigo-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Dialog Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-xl bg-[#0F172A] border border-slate-700 shadow-2xl p-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Search size={16} className="text-indigo-400" />
                Global Search (EchoAI Enterprise)
              </span>
              <button
                onClick={() => setSearchOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="mt-3">
              <input
                type="text"
                autoFocus
                placeholder="Search agents, knowledge documents, phone numbers, campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
              />
            </form>
            <div className="mt-3 space-y-1 text-slate-400 text-[11px]">
              <span className="text-[10px] font-mono uppercase text-slate-500">Quick Shortcuts</span>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  onClick={() => { setSearchOpen(false); router.push('/live'); }}
                  className="p-2 rounded bg-slate-900 hover:bg-slate-800 text-left border border-slate-800 text-slate-300"
                >
                  🎧 <strong>Live Voice</strong> — 3D Visualizer & calls
                </button>
                <button
                  onClick={() => { setSearchOpen(false); router.push('/agents'); }}
                  className="p-2 rounded bg-slate-900 hover:bg-slate-800 text-left border border-slate-800 text-slate-300"
                >
                  🤖 <strong>AI Agents</strong> — Prompt editor & testing
                </button>
                <button
                  onClick={() => { setSearchOpen(false); router.push('/knowledge'); }}
                  className="p-2 rounded bg-slate-900 hover:bg-slate-800 text-left border border-slate-800 text-slate-300"
                >
                  📄 <strong>Knowledge Base</strong> — Drag & drop upload
                </button>
                <button
                  onClick={() => { setSearchOpen(false); router.push('/calls'); }}
                  className="p-2 rounded bg-slate-900 hover:bg-slate-800 text-left border border-slate-800 text-slate-300"
                >
                  📞 <strong>Call History</strong> — Transcripts & audio
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
