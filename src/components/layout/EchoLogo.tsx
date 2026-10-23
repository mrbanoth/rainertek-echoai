'use client';

import React from 'react';

interface EchoLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  showSubtitle?: boolean;
}

export function EchoLogo({
  size = 40,
  className = '',
  showText = false,
  showSubtitle = false,
}: EchoLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Official Blue "E" Badge Matching User's Design Mockup */}
      <div
        style={{ width: size, height: size }}
        className="relative flex-shrink-0 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 shadow-md shadow-blue-500/25 flex items-center justify-center p-1.5 transition-transform duration-200 hover:scale-105"
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Stylized Dynamic Echo "E" */}
          <path
            d="M 68 28 C 64 24 55 20 44 20 C 30 20 22 32 22 50 C 22 68 31 80 46 80 C 58 80 66 74 72 68"
            stroke="white"
            strokeWidth="12"
          />
          <path
            d="M 22 50 L 62 50"
            stroke="white"
            strokeWidth="11"
          />
          {/* Subtle Soundwave Node Accent */}
          <circle cx="78" cy="50" r="5" fill="white" stroke="none" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="text-base font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
            RainerTek
            <span className="text-blue-600 font-extrabold">EchoAI</span>
          </span>
          {showSubtitle && (
            <span className="text-[11px] text-slate-500 font-medium tracking-tight">
              AI Voice Assistant Platform
            </span>
          )}
        </div>
      )}
    </div>
  );
}
