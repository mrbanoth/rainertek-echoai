'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sparkles, Plus, Menu } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function Header() {
  const pathname = usePathname();
  const { toggleSidebar, setIsCreateAgentModalOpen } = useApp();

  const getBreadcrumb = () => {
    switch (pathname) {
      case '/':
        return 'Agents';
      case '/numbers':
        return 'Phone Numbers / Sarvam Vobiz';
      case '/inbound':
        return 'Inbound calls';
      case '/campaigns':
        return 'Outbound campaigns';
      case '/knowledge':
        return 'Knowledge base';
      case '/settings':
        return 'Settings / API Keys';
      default:
        return 'Agents';
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur px-6">
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="md:hidden flex items-center justify-center w-8 h-8 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Toggle Navigation"
        >
          <Menu size={18} />
        </button>

        <span className="text-sm font-semibold text-slate-900 tracking-tight">
          {getBreadcrumb()}
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => alert('Genie AI Assistant is ready. Connect your Sarvam API Key to run full voice synthesis.')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-orange-400" />
          <span>Ask Genie</span>
        </button>

        {pathname === '/' && (
          <button
            onClick={() => setIsCreateAgentModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus size={14} />
            <span>Create from scratch</span>
          </button>
        )}

        {pathname === '/inbound' && (
          <button
            onClick={() => alert('Inbound agent routing is active for phone +917965481286 (J Laptop).')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus size={14} />
            <span>Create inbound</span>
          </button>
        )}

        {pathname === '/campaigns' && (
          <button
            onClick={() => alert('New outbound campaign dialog.')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus size={14} />
            <span>Create campaign</span>
          </button>
        )}
      </div>
    </header>
  );
}
