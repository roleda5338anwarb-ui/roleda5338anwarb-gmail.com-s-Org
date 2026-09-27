import React from 'react';
import { ColorTheme, GameMode } from '../types/game';
import { sound } from '../utils/audio';
import { X, Play, RotateCcw, Home, Volume2, VolumeX, Palette, Sparkles, HelpCircle } from 'lucide-react';

interface PauseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  onHome: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  currentTheme: ColorTheme;
  onChangeTheme: (theme: ColorTheme) => void;
  currentMode: GameMode;
}

export const PauseSettingsModal: React.FC<PauseSettingsModalProps> = ({
  isOpen,
  onClose,
  onRestart,
  onHome,
  soundEnabled,
  onToggleSound,
  currentTheme,
  onChangeTheme,
  currentMode,
}) => {
  if (!isOpen) return null;

  const themes: { id: ColorTheme; label: string; colors: string[] }[] = [
    { id: 'vibrant', label: 'Vibrant', colors: ['#fbbf24', '#fb7185', '#38bdf8', '#34d399'] },
    { id: 'neon', label: 'Neon Cyber', colors: ['#f43f5e', '#06b6d4', '#a3e635', '#a855f7'] },
    { id: 'candy', label: 'Candy Pastel', colors: ['#fda4af', '#6ee7b7', '#93c5fd', '#fde047'] },
    { id: 'sunset', label: 'Sunset Glow', colors: ['#f59e0b', '#f97316', '#ef4444', '#8b5cf6'] },
  ];

  return (
    <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex flex-col items-center justify-center p-5 text-center select-none animate-fade-in">
      <div className="animate-pop-in flex flex-col items-center max-w-xs w-full bg-slate-900 border border-white/10 rounded-3xl p-5 shadow-2xl relative">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-game text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <span>GAME PAUSED</span>
        </h3>
        <p className="text-xs text-slate-400 mb-5 uppercase tracking-wider font-semibold">
          Mode: <span className="text-indigo-400 capitalize">{currentMode}</span>
        </p>

        {/* Theme Chooser */}
        <div className="w-full bg-slate-950/60 rounded-2xl p-3 border border-white/5 mb-4 text-left">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            <span>Block Color Theme</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((th) => (
              <button
                key={th.id}
                onClick={() => {
                  sound.playClick();
                  onChangeTheme(th.id);
                }}
                className={`p-2 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                  currentTheme === th.id
                    ? 'border-indigo-500 bg-indigo-950/40 text-white'
                    : 'border-white/5 bg-slate-800/40 text-slate-400 hover:text-white'
                }`}
              >
                <span>{th.label}</span>
                <div className="flex -space-x-1">
                  {th.colors.map((c, i) => (
                    <span
                      key={i}
                      className="w-2.5 h-2.5 rounded-full border border-black/40"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sound toggle */}
        <div className="w-full bg-slate-950/60 rounded-2xl p-3 border border-white/5 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
            <span>Sound Effects & Chimes</span>
          </div>
          <button
            onClick={() => {
              onToggleSound();
              sound.playClick();
            }}
            className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
              soundEnabled ? 'bg-indigo-600' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                soundEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5 w-full">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 font-game text-lg font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>RESUME</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-white/10 text-xs font-semibold text-slate-200 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restart Current Game</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onHome();
            }}
            className="w-full py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Exit to Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
