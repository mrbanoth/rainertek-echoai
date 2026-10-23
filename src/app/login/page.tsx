'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Users,
  Shield,
  FlaskConical,
  Terminal,
  Layers,
} from 'lucide-react';
import { EchoLogo } from '@/components/layout/EchoLogo';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('praveenmanne@yopmail.com');
  const [password, setPassword] = useState('PraveenManne@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter your email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password,
          rememberMe,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || 'Invalid email or password.');
        setIsLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setErrorMessage('Unable to connect to authentication server. Please retry.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-8 selection:bg-blue-100 selection:text-blue-900">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Hero Column Matching Mockup 1 */}
        <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 px-4">
          {/* Big RainerTek EchoAI Blue "E" Logo */}
          <div className="flex flex-col items-center lg:items-start space-y-3">
            <EchoLogo size={74} />
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                RainerTek <span className="text-blue-600">EchoAI</span>
              </h1>
              <p className="text-base sm:text-lg font-semibold text-slate-600">
                AI Voice Assistant for a Smarter Workplace
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-500 max-w-md leading-relaxed">
            Our company voice-calling platform for automated outbound business calls, inbound routing, and real-time knowledge grounding.
          </p>

          {/* Department Circles Below Logo (Matching Mockup 1) */}
          <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
            <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
              <div className="w-11 h-11 rounded-full bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <Users size={18} />
              </div>
              <span className="text-[11px] font-bold text-slate-700">HR</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
              <div className="w-11 h-11 rounded-full bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                <Shield size={18} />
              </div>
              <span className="text-[11px] font-bold text-slate-700">QMS</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
              <div className="w-11 h-11 rounded-full bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-cyan-600 group-hover:scale-110 transition-transform">
                <FlaskConical size={18} />
              </div>
              <span className="text-[11px] font-bold text-slate-700">LIMS</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
              <div className="w-11 h-11 rounded-full bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <Terminal size={18} />
              </div>
              <span className="text-[11px] font-bold text-slate-700">IT</span>
            </div>

            <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
              <div className="w-11 h-11 rounded-full bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                <Layers size={18} />
              </div>
              <span className="text-[11px] font-bold text-slate-700">All Teams</span>
            </div>
          </div>
        </div>

        {/* Right Login Card (Matching Mockup 1) */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-8 sm:p-10 space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Welcome Back
              </h2>
              <p className="text-xs text-slate-500">
                Sign in to your RainerTek EchoAI account
              </p>
            </div>

            {/* Error Notification Alert */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
                <AlertCircle size={16} className="flex-shrink-0 text-red-500" />
                <span className="font-semibold">{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="praveenmanne@yopmail.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span className="text-slate-600 font-medium">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Please contact RainerTek IT Administrator for password assistance.')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            <div className="pt-2 text-center text-[11px] text-slate-400 font-mono">
              Demo Credentials Pre-filled • Internal System
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
