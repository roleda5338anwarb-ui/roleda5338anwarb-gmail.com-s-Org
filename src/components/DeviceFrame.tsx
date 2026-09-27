import React, { useState } from 'react';
import { Smartphone, Maximize2, Minimize2 } from 'lucide-react';

interface DeviceFrameProps {
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const [isFrameMode, setIsFrameMode] = useState<boolean>(true);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#070913] p-0 sm:p-4 overflow-hidden select-none">
      {/* Background ambient lighting matching Image 1.png */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep navy/indigo radial gradient backdrop */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 30%, #151936 0%, #0d1024 45%, #05060d 100%)',
          }}
        />

        {/* Ambient colored glowing orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />
      </div>

      {/* Floating View Mode Switcher in top right corner */}
      <div className="hidden sm:flex absolute top-4 right-4 z-50 items-center gap-2 bg-slate-900/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full shadow-lg text-xs text-slate-300">
        <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
        <span>Mockup View:</span>
        <button
          onClick={() => setIsFrameMode((prev) => !prev)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
            isFrameMode
              ? 'bg-indigo-600 text-white shadow'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          {isFrameMode ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          <span>{isFrameMode ? 'Phone Frame' : 'Full Window'}</span>
        </button>
      </div>

      {/* Device Chassis or Fullscreen Container */}
      <div
        className={`relative z-10 transition-all duration-300 flex flex-col justify-between items-center ${
          isFrameMode
            ? 'w-full max-w-[420px] h-[100dvh] sm:h-[860px] sm:max-h-[92vh] sm:rounded-[44px] bg-[#0c1020]/95 backdrop-blur-2xl border-0 sm:border sm:border-white/15 sm:shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_50px_rgba(99,102,241,0.12)] overflow-hidden'
            : 'w-full max-w-[460px] h-[100dvh] bg-[#0c1020] sm:rounded-3xl border-0 sm:border sm:border-white/10 overflow-hidden shadow-2xl'
        }`}
      >
        {/* Subtle iPhone-like speaker notch / status indicator on top in frame mode */}
        {isFrameMode && (
          <div className="hidden sm:flex absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 rounded-full bg-slate-950/70 border border-white/5 items-center justify-center gap-2 z-50 pointer-events-none">
            <div className="w-10 h-1 rounded-full bg-slate-800"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
          </div>
        )}

        {/* Screen Content */}
        <div className="w-full h-full relative overflow-hidden flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
};
