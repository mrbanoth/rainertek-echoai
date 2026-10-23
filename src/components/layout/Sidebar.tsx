'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  Users,
  BookOpen,
  Phone,
  PhoneIncoming,
  Megaphone,
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Code2,
  FileText,
  BarChart2,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';

export const NAV_SECTIONS = [
  {
    title: 'Build',
    items: [
      { href: '/', label: 'Agents', icon: Users },
      { href: '/knowledge', label: 'Knowledge base', icon: BookOpen },
    ],
  },
  {
    title: 'Deploy',
    items: [
      { href: '/numbers', label: 'Phone numbers', icon: Phone },
      { href: '/inbound', label: 'Inbound calls', icon: PhoneIncoming },
      { href: '/campaigns', label: 'Outbound campaigns', icon: Megaphone },
    ],
  },
  {
    title: 'Configure',
    items: [
      { href: '/settings', label: 'Settings & API Keys', icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, sarvamApiKey } = useApp();

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-slate-200 bg-white text-slate-700 transition-all duration-200 ease-in-out z-30 select-none min-h-screen',
        sidebarCollapsed ? 'w-18' : 'w-60'
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center px-4 border-b border-slate-100 justify-between">
        <Link href="/" className="flex items-center gap-2.5 overflow-hidden group">
          <div className="relative flex-shrink-0 w-8 h-8 flex items-center justify-center">
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
              <span className="text-sm font-semibold tracking-tight text-slate-900">
                Voice Agents
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                RainerTek EchoAI
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden md:flex items-center justify-center w-6 h-6 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Quick Search simulation */}
      {!sidebarCollapsed && (
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Search size={14} className="text-slate-400" />
              <span>Search</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px] text-slate-500">
              Ctrl+K
            </kbd>
          </div>
        </div>
      )}

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 text-xs">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} className="space-y-1">
            {!sidebarCollapsed && (
              <div className="px-2.5 py-1 text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                {section.title}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors text-xs font-medium',
                      isActive
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    )}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <Icon
                      size={16}
                      className={cn(
                        'flex-shrink-0',
                        isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-800'
                      )}
                    />
                    {!sidebarCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Footer: Documentation & Quick Status */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-xs">
        {!sidebarCollapsed ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Sarvam Engine</span>
              <span
                className={`font-medium ${
                  sarvamApiKey ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {sarvamApiKey ? '● Ready' : '○ Key Needed'}
              </span>
            </div>
            <a
              href="https://docs.sarvam.ai/conversations/overview"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-900 transition-colors"
            >
              <FileText size={12} />
              <span>Sarvam Docs</span>
              <ExternalLink size={10} className="ml-auto text-slate-400" />
            </a>
          </div>
        ) : (
          <div className="flex justify-center" title="Documentation">
            <FileText size={16} className="text-slate-400" />
          </div>
        )}
      </div>
    </aside>
  );
}
