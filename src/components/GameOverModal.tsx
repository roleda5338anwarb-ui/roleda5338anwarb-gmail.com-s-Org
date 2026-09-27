import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Home, Trophy, Award, Zap, Layers } from 'lucide-react';
import { sound } from '../utils/audio';

interface GameOverModalProps {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  linesCleared: number;
  highestCombo: number;
  blocksPlaced: number;
  onRestart: () => void;
  onHome: () => void;
  reason?: string;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  highScore,
  isNewHighScore,
  linesCleared,
  highestCombo,
  blocksPlaced,
  onRestart,
  onHome,
  reason = 'None of the available shapes fit on the board.',
}) => {
  useEffect(() => {
    if (isNewHighScore && score > 0) {
      sound.playCelebration();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#fbbf24', '#f43f5e', '#38bdf8', '#34d399', '#c084fc'],
        });
      } catch {
        // ignore if canvas not ready
      }
    }
  }, [isNewHighScore, score]);

  return (
    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in select-none">
      <div className="animate-pop-in flex flex-col items-center max-w-xs w-full bg-slate-900/90 border border-white/10 rounded-3xl p-6 shadow-2xl">
        {/* Icon status */}
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mb-3 shadow-inner">
          {isNewHighScore ? (
            <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
          ) : (
            <RotateCcw className="w-8 h-8 text-rose-400" />
          )}
        </div>

        <h2 className="font-game text-3xl font-extrabold text-white mb-1">
          {isNewHighScore ? 'NEW BEST SCORE!' : 'NO MORE MOVES!'}
        </h2>
        <p className="text-xs text-slate-400 mb-5 font-medium leading-relaxed">
          {reason}
        </p>

        {/* Score comparison cards */}
        <div className="grid grid-cols-2 gap-2.5 w-full mb-4">
          <div className="bg-slate-800/90 border border-white/10 rounded-2xl p-3 flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Score</span>
            <span className="font-game text-2xl font-black text-white">{score.toLocaleString()}</span>
          </div>
          <div className="bg-slate-800/90 border border-white/10 rounded-2xl p-3 flex flex-col items-center relative overflow-hidden">
            {isNewHighScore && (
              <span className="absolute top-0 right-0 bg-amber-400 text-slate-950 text-[8px] font-black px-1.5 py-0.5 rounded-bl">
                NEW!
              </span>
            )}
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
              <Award className="w-3 h-3" /> Best
            </span>
            <span className="font-game text-2xl font-black text-amber-300">{highScore.toLocaleString()}</span>
          </div>
        </div>

        {/* Mini stats breakdown */}
        <div className="w-full bg-slate-950/60 rounded-xl p-2.5 border border-white/5 mb-5 flex justify-around text-slate-400 text-xs">
          <div className="flex flex-col items-center">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-300">
              <Layers className="w-3 h-3 text-cyan-400" /> {linesCleared}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-slate-500">Lines</span>
          </div>
          <div className="w-px bg-white/10 h-7 self-center"></div>
          <div className="flex flex-col items-center">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-300">
              <Zap className="w-3 h-3 text-amber-400" /> x{highestCombo}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-slate-500">Combo</span>
          </div>
          <div className="w-px bg-white/10 h-7 self-center"></div>
          <div className="flex flex-col items-center">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-300">
              <span className="w-2.5 h-2.5 rounded-sm bg-purple-400 inline-block"></span> {blocksPlaced}
            </span>
            <span className="text-[9px] uppercase tracking-wider text-slate-500">Shapes</span>
          </div>
        </div>

        {/* Action Buttons */}
        <button
          onClick={() => {
            sound.playClick();
            onRestart();
          }}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 font-game text-xl font-bold text-white shadow-xl shadow-teal-500/25 hover:brightness-110 active:scale-95 transition-all mb-3 flex items-center justify-center gap-2 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>TRY AGAIN</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onHome();
          }}
          className="text-xs font-semibold text-slate-400 hover:text-white transition-colors py-2 flex items-center gap-1.5 cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Back to Menu</span>
        </button>
      </div>
    </div>
  );
};
