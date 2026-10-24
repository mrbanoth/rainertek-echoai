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
  ChevronDown,
  X,
  LogOut,
  Building2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AdminAvatar } from './AdminAvatar';
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
    auditLogs,
  } = useApp();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  // If on login page, don't show header
  if (pathname === '/login') return null;

  const getPageMeta = () => {
    switch (pathname) {
      case '/':
      case '/dashboard':
        return { title: 'Dashboard', section: 'Overview & Telemetry' };
      case '/agents':
        return { title: 'Agents & Knowledge', section: 'Prompt & Document Grounding' };
      case '/live':
        return { title: 'Live Call', section: 'Browser voice' };
      case '/calls':
        return { title: 'Call History', section: 'Telephony Session Logs' };
      case '/settings':
        return { title: 'Team & Settings', section: 'Governance, Roles & System' };
      default:
        return { title: 'Echo AI', section: 'Voice POC' };
    }
  };

  const meta = getPageMeta();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch {
      router.push('/login');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    setSearchOpen(false);
    if (q.includes('call') || q.includes('transcript')) router.push('/calls');
    else if (q.includes('agent') || q.includes('doc') || q.includes('prompt')) router.push('/agents');
    else if (q.includes('team') || q.includes('setting') || q.includes('role')) router.push('/settings');
    else router.push('/dashboard');
  };

  return (
    <>
      <header className="z-20 flex h-16 w-full shrink-0 items-center justify-between border-b border-slate-200/90 bg-white/95 backdrop-blur px-4 md:px-6">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Toggle navigation"
          >
            <Menu size={18} />
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
              <span>Echo AI</span>
              <span>/</span>
              <span className="text-slate-600">{meta.section}</span>
              {selectedProject !== 'ALL' && (
                <>
                  <span>/</span>
                  <span className="font-mono text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 text-[10px] font-bold">
                    {selectedProject}
                  </span>
                </>
              )}
            </div>
            <h1 className="text-sm md:text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              {meta.title}
            </h1>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Global Search Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-colors"
            title="Global Search"
          >
            <Search size={14} className="text-slate-400" />
            <span className="hidden sm:inline">Search platform...</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px] text-slate-400">
              Ctrl+K
            </kbd>
          </button>

          {/* Environment Status Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-[11px] font-medium text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Telephony: Active</span>
          </div>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Recent alerts"
              aria-label="Open notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 md:w-96 rounded-2xl bg-white border border-slate-200 shadow-xl z-50 overflow-hidden text-xs">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Shield size={14} className="text-blue-600" />
                    Security & Event Feed
                  </span>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {auditLogs.slice(0, 4).map((log) => (
                    <div key={log.id} className="p-3 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-slate-800 flex items-center gap-1">
                          {log.result === 'SUCCESS' ? (
                            <CheckCircle size={12} className="text-emerald-500" />
                          ) : (
                            <AlertTriangle size={12} className="text-amber-500" />
                          )}
                          {log.action}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{log.timestamp.slice(11)}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">{log.details}</p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                        <span>Department: <strong className="text-slate-700">{log.projectId}</strong></span>
                        <span>•</span>
                        <span>Actor: {log.actor}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill with Role & Logout */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors text-left"
            >
              <AdminAvatar size={28} />
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-semibold text-slate-900 leading-none">Praveen Manne</span>
                <span className="text-[10px] text-blue-600 font-mono font-semibold mt-0.5">
                  {userRole}
                </span>
              </div>
              <ChevronDown size={14} className="text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-mono block">Signed in as</span>
                  <span className="font-bold text-slate-900 truncate block">praveenmanne@yopmail.com</span>
                </div>

                <div className="py-1">
                  <div className="px-3 py-1 text-[10px] font-mono text-slate-400 uppercase">Switch Active Role</div>
                  {(['Administrator', 'Operator', 'Read-only viewer'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setUserRole(r);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
                        userRole === r ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{r}</span>
                      {userRole === r && <CheckCircle size={12} className="text-blue-600" />}
                    </button>
                  ))}
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
                  >
                    <LogOut size={14} />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Dialog Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Search size={16} className="text-blue-600" />
                Quick Search Platform
              </span>
              <button onClick={() => setSearchOpen(false)} className="text-slate-400 hover:text-slate-800">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit} className="mt-3">
              <input
                type="text"
                autoFocus
                placeholder="Search dashboard, agents, knowledge documents, calls, settings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs"
              />
            </form>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
              <button
                onClick={() => { setSearchOpen(false); router.push('/dashboard'); }}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/80 text-left font-medium"
              >
                📊 <strong>Dashboard</strong> — Metrics & activity
              </button>
              <button
                onClick={() => { setSearchOpen(false); router.push('/agents'); }}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/80 text-left font-medium"
              >
                🤖 <strong>Agents & Knowledge</strong> — Prompts & docs
              </button>
              <button
                onClick={() => { setSearchOpen(false); router.push('/calls'); }}
                className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200/80 text-left font-medium"
              >
                📞 <strong>Call History</strong> — Transcripts & audio
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
