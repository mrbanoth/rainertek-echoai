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
      <div
        style={{ width: size, height: size }}
        className="flex-shrink-0 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-extrabold"
      >
        <span style={{ fontSize: Math.max(14, size * 0.38) }}>E</span>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="text-base font-extrabold tracking-tight text-slate-900">Echo AI</span>
          {showSubtitle && (
            <span className="text-[11px] text-slate-500 font-medium tracking-tight">
              Cheap voice agent POC
            </span>
          )}
        </div>
      )}
    </div>
  );
}
