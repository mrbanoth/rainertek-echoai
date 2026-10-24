'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { AppProvider } from '@/context/AppContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <AppProvider>
      {isLoginPage ? (
        <div className="h-dvh overflow-y-auto bg-white text-slate-900 antialiased">
          {children}
        </div>
      ) : (
        <div className="flex h-dvh overflow-hidden bg-slate-50 text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
          <Sidebar />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <Header />
            <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-[#F8FAFC]">
              <div className="max-w-7xl mx-auto space-y-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      )}
    </AppProvider>
  );
}
