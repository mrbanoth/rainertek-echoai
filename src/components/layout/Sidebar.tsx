'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  PhoneCall,
  BookOpen,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Key,
  Phone,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';

export const NAV_ITEMS = [
  { href: '/', label: 'Live Voice Call', icon: PhoneCall, desc: 'Real-time conversation' },
  { href: '/knowledge', label: 'Knowledge Context', icon: BookOpen, desc: 'What the AI knows' },
  { href: '/calls', label: 'Call History', icon: History, desc: 'Real call sessions' },
  { href: '/settings', label: 'Sarvam & Phone Setup', icon: Settings, desc: 'API key & hotline' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar, sarvamApiKey, hotlineNumber } = useApp();

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-slate-200 bg-white text-slate-700 transition-all duration-300 ease-in-out z-30 select-none shadow-xs',
        sidebarCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header with Transparent Logo */}
      <div className="flex h-18 items-center px-4 border-b border-slate-100 justify-between">
        <Link href="/" className="flex items-center gap-3 overflow-hidden group">
          <div className="relative flex-shrink-0 w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="RainerTek EchoAI Logo"
              width={40}
              height={40}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col truncate">
              <span className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-1">
                RainerTek <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">EchoAI</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium tracking-wide">
                Real-Time Voice Assistant
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden md:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Hotline Badge */}
      {!sidebarCollapsed && (
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-500 text-[11px]">Hotline:</span>
              <span className="font-semibold text-slate-800 font-mono text-xs truncate">
                {hotlineNumber || 'Not Set'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 relative text-sm',
                isActive
                  ? 'bg-indigo-50/80 text-indigo-700 font-semibold border border-indigo-200/80 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                  isActive
                    ? 'bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700'
                )}
              >
                <Icon size={17} />
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col truncate">
                  <span className="truncate leading-snug">{item.label}</span>
                  <span className="text-[11px] font-normal text-slate-400 truncate">
                    {item.desc}
                  </span>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Sarvam AI Status Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/60">
        {!sidebarCollapsed ? (
          <Link
            href="/settings"
            className="block p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 transition-colors group shadow-xs"
          >
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Sparkles size={13} className="text-indigo-600" />
                Sarvam AI Engine
              </span>
              {sarvamApiKey ? (
                <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={11} /> Connected
                </span>
              ) : (
                <span className="text-[10px] font-medium text-amber-600 flex items-center gap-1">
                  <AlertCircle size={11} /> Add Key
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              {sarvamApiKey
                ? 'Bulbul Text-to-Speech active'
                : 'Click to configure API key'}
            </p>
          </Link>
        ) : (
          <div className="flex justify-center" title="Sarvam AI Voice">
            <Sparkles size={18} className={sarvamApiKey ? 'text-emerald-500' : 'text-amber-500'} />
          </div>
        )}
      </div>
    </aside>
  );
}
