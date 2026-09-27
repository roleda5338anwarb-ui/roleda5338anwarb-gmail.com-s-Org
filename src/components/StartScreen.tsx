import React from 'react';
import { GameMode } from '../types/game';
import { sound } from '../utils/audio';
import { Flame, Sparkles, Trophy, Volume2, VolumeX } from 'lucide-react';

interface StartScreenProps {
  highScore: number;
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onStartGame: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHowToPlay?: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  highScore,
  selectedMode,
  onSelectMode,
  onStartGame,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between py-6 px-4 text-center select-none overflow-hidden">
      {/* Top subtle toolbar */}
      <div className="w-full flex items-center justify-between px-2 z-10">
        <button
          onClick={() => {
            sound.playClick();
            onToggleSound();
          }}
          title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          className="w-10 h-10 rounded-2xl bg-slate-800/80 hover:bg-slate-700/90 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all active:scale-95 shadow-sm"
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-slate-300" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {/* Mode pill selector */}
        <div className="flex items-center gap-1 bg-slate-900/90 border border-white/10 rounded-2xl p-1 shadow-inner text-xs">
          <button
            onClick={() => {
              sound.playClick();
              onSelectMode('classic');
            }}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              selectedMode === 'classic'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Classic
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onSelectMode('rush');
            }}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1 transition-all ${
              selectedMode === 'rush'
                ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="w-3 h-3 text-amber-300" />
            Rush
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onSelectMode('zen');
            }}
            className={`px-3 py-1.5 rounded-xl font-medium flex items-center gap-1 transition-all ${
              selectedMode === 'zen'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-emerald-300" />
            Zen
          </button>
        </div>
      </div>

      {/* Main hero content - Exactly matching Image 1.png */}
      <div className="flex flex-col items-center max-w-xs w-full my-auto animate-pop-in">
        {/* App Icon matching Image 1.png */}
        <div className="relative mb-5">
          {/* Ambient Glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-pink-500 to-indigo-500 rounded-3xl opacity-50 blur-xl animate-pulse"></div>
          
          {/* Icon border with gradient frame */}
          <div className="relative w-20 h-20 rounded-[24px] p-[2.5px] bg-gradient-to-tr from-cyan-400 via-pink-500 to-amber-400 shadow-2xl flex items-center justify-center">
            {/* Dark inner container */}
            <div className="w-full h-full bg-[#0d1222] rounded-[22px] grid grid-cols-2 p-3 gap-2">
              <div className="bg-[#fbbf24] rounded-md shadow-sm"></div>
              <div className="bg-[#fb7185] rounded-md shadow-sm"></div>
              <div className="bg-[#38bdf8] rounded-md shadow-sm"></div>
              <div className="bg-[#34d399] rounded-md shadow-sm"></div>
            </div>
          </div>
        </div>

        {/* Title: BLOCK BLAST! in individual letter colors */}
        <h1 className="font-game text-4xl sm:text-[42px] font-extrabold tracking-wide mb-1 leading-tight flex items-center justify-center drop-shadow-md">
          <span className="text-[#fbbf24]">B</span>
          <span className="text-[#fbbf24]">L</span>
          <span className="text-[#fb923c]">O</span>
          <span className="text-[#f97316]">C</span>
          <span className="text-[#fb7185]">K</span>
          <span className="w-2.5"></span>
          <span className="text-[#f43f5e]">B</span>
          <span className="text-[#c084fc]">L</span>
          <span className="text-[#818cf8]">A</span>
          <span className="text-[#38bdf8]">S</span>
          <span className="text-[#22d3ee]">T</span>
          <span className="text-[#22d3ee]">!</span>
        </h1>

        <p className="text-xs text-slate-300 font-medium mb-7 tracking-normal">
          Fit shapes, blast lines, and rack up combos!
        </p>

        {/* High Score Card matching Image 1.png */}
        <div className="w-full bg-[#182035]/90 border border-white/10 rounded-2xl py-3 px-4 mb-4 shadow-inner flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-0.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>High Score</span>
          </div>
          <div className="font-game text-3xl font-extrabold text-[#fbbf24] tracking-wide">
            {highScore.toLocaleString()}
          </div>
        </div>

        {/* PLAY NOW button with radiant pink/violet glow */}
        <div className="relative w-full mb-6 group">
          {/* Radiant bottom glow matching Image 1.png */}
          <div className="absolute -bottom-2 inset-x-4 h-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-lg opacity-70 group-hover:opacity-90 transition-opacity"></div>
          
          <button
            onClick={() => {
              sound.playClick();
              onStartGame();
            }}
            className="relative w-full py-4 rounded-2xl bg-gradient-to-r from-[#6366f1] via-[#9333ea] to-[#ec4899] font-game text-xl font-bold text-white shadow-xl hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer tracking-wider"
          >
            PLAY NOW
          </button>
        </div>

        {/* 3 bullet indicators matching Image 1.png */}
        <div className="flex items-center justify-center gap-5 text-xs text-slate-300 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#34d399] shadow-[0_0_8px_#34d399]"></span>
            8x8 Grid
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fbbf24] shadow-[0_0_8px_#fbbf24]"></span>
            Combos
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]"></span>
            Particles
          </span>
        </div>
      </div>

      {/* Faint bottom text matching Image 1.png */}
      <div className="text-[10px] font-bold text-slate-600 tracking-[0.2em] uppercase py-2">
        Drag shapes to the grid
      </div>
    </div>
  );
};
