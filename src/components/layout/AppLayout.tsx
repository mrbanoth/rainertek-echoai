'use client';

import React from 'react';
import { AppProvider } from '@/context/AppContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <div className="flex min-h-screen bg-[#070B14] text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-white">
        {/* Persistent Enterprise Sidebar */}
        <Sidebar />

        {/* Main Content Viewport */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#0A0F1D]">
            <div className="max-w-7xl mx-auto space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AppProvider>
  );
}
