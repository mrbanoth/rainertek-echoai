import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppLayout } from '@/components/layout/AppLayout';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'RainerTek EchoAI — Real-Time Voice Platform',
  description:
    'Real-time AI Voice Assistant powered by Sarvam AI. Live voice calls, knowledge context grounding, and telephony integration.',
  icons: {
    icon: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full light`}>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 antialiased">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
