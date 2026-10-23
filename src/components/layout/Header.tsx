'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  Phone,
  Sparkles,
  Key,
  HelpCircle,
  Volume2,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function Header() {
  const pathname = usePathname();
  const { toggleSidebar, hotlineNumber, selectedVoice, selectedLanguage, sarvamApiKey } = useApp();

  const getPageTitle = () => {
    switch (pathname) {
      case '/':
        return 'Live Voice Assistant & Web Caller';
      case '/knowledge':
        return 'Knowledge Context Grounding';
      case '/calls':
        return 'Call History & Transcripts';
      case '/settings':
        return 'Sarvam AI & Phone Configuration';
      default:
        return 'RainerTek EchoAI';
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-18 w-full items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur px-4 md:px-6">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-base md:text-lg font-bold text-slate-900 tracking-tight">
            {getPageTitle()}
          </h1>
          <p className="hidden sm:block text-xs text-slate-500">
            Real-time interactive voice assistant powered by Sarvam AI
          </p>
        </div>
      </div>

      {/* Right: Hotline Number, Voice model & Quick Setup */}
      <div className="flex items-center gap-3">
        {/* Hotline display */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <Phone size={13} className="text-indigo-600" />
          <span className="text-slate-500">Hotline:</span>
          <span className="font-semibold text-slate-800 font-mono">{hotlineNumber}</span>
        </div>

        {/* Voice model badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-700">
          <Volume2 size={13} className="text-indigo-600" />
          <span className="capitalize font-semibold">{selectedVoice}</span>
          <span className="text-indigo-400">({selectedLanguage})</span>
        </div>

        {/* Settings button */}
        <Link
          href="/settings"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Key size={13} className="text-cyan-400" />
          <span>Setup Guide</span>
        </Link>
      </div>
    </header>
  );
}
