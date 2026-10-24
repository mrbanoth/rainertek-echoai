'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard,
  Bot,
  PhoneCall,
  Mic,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Building2,
  Wallet,
  Sparkles,
  Shield,
  User,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AdminAvatar } from './AdminAvatar';
import { EchoLogo } from './EchoLogo';
import { cn } from '@/lib/utils';

export const SIX_CORE_NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    href: '/agents',
    label: 'Agents & Knowledge',
    icon: Bot,
    badge: null,
  },
  {
    href: '/live',
    label: 'Live Call',
    icon: Mic,
    badge: null,
  },
  {
    href: '/calls',
    label: 'Call History',
    icon: PhoneCall,
    badge: null,
  },
  {
    href: '/settings',
    label: 'Team & Settings',
    icon: Settings,
    badge: null,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    sidebarCollapsed,
    toggleSidebar,
    selectedProject,
    setSelectedProject,
    projects,
    userRole,
  } = useApp();

  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch {
      router.push('/login');
    }
  };

  return (
    <aside
      className={cn(
        'flex h-dvh shrink-0 flex-col overflow-hidden border-r border-slate-200/90 bg-white text-slate-700 transition-all duration-300 ease-in-out z-30 select-none shadow-xs',
        sidebarCollapsed ? 'w-[76px]' : 'w-64'
      )}
    >
      {/* Top Header / Squircle Logo Area (Matching Screenshot) */}
      <div className="flex h-20 items-center px-3.5 justify-between border-b border-slate-100">
        <Link
          href="/dashboard"
          className={cn(
            'flex items-center gap-3 overflow-hidden group',
            sidebarCollapsed ? 'mx-auto' : ''
          )}
          title="Echo AI"
        >
          {/* Custom Squircle Geometric Logo */}
          <EchoLogo size={42} showText={!sidebarCollapsed} />
        </Link>

        {!sidebarCollapsed && (
          <button
            onClick={toggleSidebar}
            aria-label="Collapse sidebar"
            className="flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Expand Button When Collapsed (Subtle pill toggle) */}
      {sidebarCollapsed && (
        <div className="flex justify-center pt-2">
          <button
            onClick={toggleSidebar}
            aria-label="Expand sidebar"
            className="w-6 h-6 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-400 hover:text-blue-600 flex items-center justify-center transition-colors"
            title="Expand Navigation"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      )}



      {/* Navigation Items (Squircle Shape Matching Screenshot) */}
      <nav className="min-h-0 flex-1 overflow-hidden px-3 py-4 space-y-2">
        {SIX_CORE_NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === '/dashboard' && pathname === '/');

          const Icon = item.icon;

          if (sidebarCollapsed) {
            // Collapsed Squircle Item matching user screenshot
            return (
              <div key={item.href} className="flex justify-center relative group">
                <Link
                  href={item.href}
                  className={cn(
                    'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200',
                    isActive
                      ? 'bg-slate-100 text-blue-600 shadow-xs ring-1 ring-slate-200/90 font-bold'
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  )}
                  aria-label={item.label}
                >
                  <Icon
                    size={20}
                    className={cn(
                      'transition-colors',
                      isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-800'
                    )}
                  />
                </Link>

                {/* Floating Tooltip */}
                <div className="absolute left-16 px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-medium shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                  {item.label}
                </div>
              </div>
            );
          }

          // Expanded Navigation Item
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-xs font-medium',
                isActive
                  ? 'bg-blue-50 text-blue-600 font-bold border border-blue-100 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              <div className="flex items-center gap-3 truncate">
                <div
                  className={cn(
                    'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
                    isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:text-slate-900'
                  )}
                >
                  <Icon size={15} />
                </div>
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge ? (
                <span
                  className={cn(
                    'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                    isActive
                      ? 'bg-blue-100 text-blue-700 border-blue-200'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  )}
                >
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section: Telephony Status & User Avatar (Matching Screenshot) */}
      <div className="shrink-0 border-t border-slate-100 bg-white p-3 relative">
        {sidebarCollapsed ? (
          <div className="flex flex-col items-center gap-3">
            {/* Wallet / Telephony Icon in Squircle */}
            <div
              className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              title="Carrier SIP: Connected"
            >
              <Wallet size={16} />
            </div>

            {/* User Avatar Circle with Menu */}
            <div className="relative">
              <button
                onClick={() => setAvatarMenuOpen(!avatarMenuOpen)}
                className="rounded-full border-2 border-white shadow-sm hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer"
                aria-label="User profile and logout"
              >
                <AdminAvatar size={40} />
              </button>

              {/* Collapsed Avatar Dropdown */}
              {avatarMenuOpen && (
                <div className="absolute bottom-12 left-2 w-52 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 text-xs animate-in fade-in duration-150">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900 block">Praveen Manne</span>
                    <span className="text-[11px] text-slate-500 truncate block">praveenmanne@yopmail.com</span>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors text-left"
                    >
                      <LogOut size={14} />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Expanded User Info Card */
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <AdminAvatar size={36} />
                <div className="truncate">
                  <span className="font-bold text-slate-900 text-xs block truncate">
                    Praveen Manne
                  </span>
                  <span className="text-[10px] text-blue-600 font-mono font-semibold block">
                    {userRole}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 font-mono">
              <span>Voice Core:</span>
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                ● Ready
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
