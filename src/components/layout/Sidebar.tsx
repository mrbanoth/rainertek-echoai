'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  Radio,
  Bot,
  BookOpen,
  PhoneCall,
  Megaphone,
  BarChart3,
  Network,
  Users,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  PhoneIncoming,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';

export const NAVIGATION_ITEMS = [
  { href: '/', label: 'Overview', icon: LayoutDashboard, badge: null },
  { href: '/live', label: 'Live Voice', icon: Radio, badge: 'Live 3D' },
  { href: '/agents', label: 'AI Agents', icon: Bot, badge: null },
  { href: '/knowledge', label: 'Knowledge Base', icon: BookOpen, badge: null },
  { href: '/calls', label: 'Call History', icon: PhoneCall, badge: null },
  { href: '/inbound', label: 'Inbound Routing', icon: PhoneIncoming, badge: null },
  { href: '/campaigns', label: 'Outbound Campaigns', icon: Megaphone, badge: null },
  { href: '/analytics', label: 'Analytics & Usage', icon: BarChart3, badge: null },
  { href: '/integrations', label: 'Integrations', icon: Network, badge: null },
  { href: '/team', label: 'Team & Permissions', icon: Users, badge: null },
  { href: '/audit', label: 'Audit Logs', icon: ShieldCheck, badge: null },
  { href: '/settings', label: 'General Settings', icon: Settings, badge: null },
];

export function Sidebar() {
  const pathname = usePathname();
  const {
    sidebarCollapsed,
    toggleSidebar,
    selectedProject,
    setSelectedProject,
    projects,
    liveCallState,
  } = useApp();

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-slate-800 bg-[#0B1120] text-slate-200 transition-all duration-200 ease-in-out z-30 select-none min-h-screen',
        sidebarCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center px-4 border-b border-slate-800/80 justify-between bg-[#080D1A]">
        <Link href="/" className="flex items-center gap-3 overflow-hidden group">
          <div className="relative flex-shrink-0 w-9 h-9 rounded-lg bg-slate-900 border border-slate-700/60 p-1 flex items-center justify-center shadow-xs">
            <Image
              src="/logo.png"
              alt="RainerTek EchoAI Logo"
              width={32}
              height={32}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
                RainerTek
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                  EchoAI
                </span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium truncate">
                Internal Voice Platform
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden md:flex items-center justify-center w-6 h-6 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Project Selector (Section 4 & 5 Isolation) */}
      {!sidebarCollapsed && (
        <div className="px-3 pt-3 pb-2 border-b border-slate-800/60">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1 px-1">
            <span className="flex items-center gap-1">
              <Building2 size={12} className="text-slate-400" />
              Project Scope
            </span>
            <span className="text-[10px] text-indigo-400 font-mono">Isolated</span>
          </div>
          <select
            value={selectedProject}
            aria-label="Filter active workspace by project scope"
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full text-xs font-semibold bg-slate-900/90 border border-slate-700 text-slate-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Projects (Global View)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} — {p.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 text-xs">
        {NAVIGATION_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const isLiveActive = item.href === '/live' && liveCallState.status === 'connected';

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center justify-between px-3 py-2 rounded-lg transition-all text-xs font-medium',
                isActive
                  ? 'bg-indigo-600 text-white font-semibold shadow-xs shadow-indigo-900/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-850/80 hover:bg-slate-800/60'
              )}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon
                  size={16}
                  className={cn(
                    'flex-shrink-0 transition-colors',
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200',
                    isLiveActive && 'animate-pulse text-emerald-400'
                  )}
                />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!sidebarCollapsed && (
                <div className="flex items-center gap-1.5">
                  {isLiveActive ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 animate-pulse px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40">
                      ON AIR
                    </span>
                  ) : item.badge ? (
                    <span
                      className={cn(
                        'text-[10px] font-medium px-1.5 py-0.5 rounded border',
                        isActive
                          ? 'bg-indigo-700/80 text-white border-indigo-400/40'
                          : 'bg-slate-800 text-indigo-300 border-indigo-500/30'
                      )}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Footer: Operational Status (Section 5 & 6) */}
      <div className="p-3 border-t border-slate-800/80 bg-[#080D1A] text-xs">
        {!sidebarCollapsed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400 font-medium">Platform Mode</span>
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                <CheckCircle2 size={10} />
                DEMO / READY
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Sarvam Voice Core</span>
              <span className="text-slate-300 font-mono text-[10px]">Indus v1.4</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="Platform Operational">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        )}
      </div>
    </aside>
  );
}
