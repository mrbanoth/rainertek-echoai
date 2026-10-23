'use client';

import React from 'react';
import Image from 'next/image';

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
      {/* Official 3D Ribbon "R" RainerTek EchoAI Logo */}
      <div
        style={{ width: size, height: size }}
        className="relative flex-shrink-0 flex items-center justify-center transition-transform duration-200 hover:scale-105"
      >
        <Image
          src="/logo.png"
          alt="RainerTek EchoAI Logo"
          width={size * 2}
          height={size * 2}
          className="w-full h-full object-contain"
          priority
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="text-base font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
            RainerTek
            <span className="text-blue-600 font-extrabold">EchoAI</span>
          </span>
          {showSubtitle && (
            <span className="text-[11px] text-slate-500 font-medium tracking-tight">
              One Voice. Every Possibility.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
