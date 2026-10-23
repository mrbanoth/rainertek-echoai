'use client';

import React from 'react';
import { AppProvider } from '@/context/AppContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <div className="flex min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500/20 selection:text-indigo-900">
        {/* White-theme Sidebar */}
        <Sidebar />

        {/* Main Content Viewport */}
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AppProvider>
  );
}
