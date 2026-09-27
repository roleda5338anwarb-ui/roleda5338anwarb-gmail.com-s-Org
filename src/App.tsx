/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ColorTheme, GameMode } from './types/game';
import { DeviceFrame } from './components/DeviceFrame';
import { StartScreen } from './components/StartScreen';
import { BlockBlastGame } from './components/BlockBlastGame';
import { GameOverModal } from './components/GameOverModal';
import { PauseSettingsModal } from './components/PauseSettingsModal';
import { sound } from './utils/audio';

const HIGH_SCORE_KEY = 'block_blast_high_score';
const THEME_KEY = 'block_blast_theme';
const MODE_KEY = 'block_blast_mode';

export default function App() {
  const [screen, setScreen] = useState<'start' | 'game'>('start');
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0', 10);
    } catch {
      return 0;
    }
  });

  const [selectedMode, setSelectedMode] = useState<GameMode>(() => {
    try {
      return (localStorage.getItem(MODE_KEY) as GameMode) || 'classic';
    } catch {
      return 'classic';
    }
  });

  const [currentTheme, setCurrentTheme] = useState<ColorTheme>(() => {
    try {
      return (localStorage.getItem(THEME_KEY) as ColorTheme) || 'vibrant';
    } catch {
      return 'vibrant';
    }
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(sound.enabled);
  const [gameKey, setGameKey] = useState<number>(1);
  const [isPauseOpen, setIsPauseOpen] = useState<boolean>(false);
  const [gameOverData, setGameOverData] = useState<{
    isOpen: boolean;
    score: number;
    highScore: number;
    isNewHighScore: boolean;
    linesCleared: number;
    highestCombo: number;
    blocksPlaced: number;
    reason?: string;
  }>({
    isOpen: false,
    score: 0,
    highScore: 0,
    isNewHighScore: false,
    linesCleared: 0,
    highestCombo: 0,
    blocksPlaced: 0,
  });

  // Sound toggle handler
  const handleToggleSound = () => {
    const nextVal = sound.toggle();
    setSoundEnabled(nextVal);
  };

  // High score update
  const handleUpdateHighScore = (newScore: number) => {
    if (newScore > highScore) {
      setHighScore(newScore);
      try {
        localStorage.setItem(HIGH_SCORE_KEY, String(newScore));
      } catch {
        // ignore
      }
    }
  };

  const handleSelectMode = (mode: GameMode) => {
    setSelectedMode(mode);
    try {
      localStorage.setItem(MODE_KEY, mode);
    } catch {
      // ignore
    }
  };

  const handleChangeTheme = (theme: ColorTheme) => {
    setCurrentTheme(theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
  };

  const handleStartGame = () => {
    setGameOverData((prev) => ({ ...prev, isOpen: false }));
    setIsPauseOpen(false);
    setGameKey((prev) => prev + 1);
    setScreen('game');
  };

  const handleGameOver = (stats: {
    score: number;
    linesCleared: number;
    highestCombo: number;
    blocksPlaced: number;
    reason?: string;
  }) => {
    const isNewBest = stats.score > highScore;
    if (isNewBest) {
      handleUpdateHighScore(stats.score);
    }
    setGameOverData({
      isOpen: true,
      score: stats.score,
      highScore: Math.max(stats.score, highScore),
      isNewHighScore: isNewBest,
      linesCleared: stats.linesCleared,
      highestCombo: stats.highestCombo,
      blocksPlaced: stats.blocksPlaced,
      reason: stats.reason,
    });
  };

  const handleRestartFromModal = () => {
    setGameOverData((prev) => ({ ...prev, isOpen: false }));
    setIsPauseOpen(false);
    setGameKey((prev) => prev + 1);
  };

  const handleBackToMenu = () => {
    setGameOverData((prev) => ({ ...prev, isOpen: false }));
    setIsPauseOpen(false);
    setScreen('start');
  };

  return (
    <DeviceFrame>
      {screen === 'start' ? (
        <StartScreen
          highScore={highScore}
          selectedMode={selectedMode}
          onSelectMode={handleSelectMode}
          onStartGame={handleStartGame}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
        />
      ) : (
        <div className="relative w-full h-full flex flex-col">
          <BlockBlastGame
            key={gameKey}
            mode={selectedMode}
            theme={currentTheme}
            highScore={highScore}
            onUpdateHighScore={handleUpdateHighScore}
            onGameOver={handleGameOver}
            onOpenSettings={() => setIsPauseOpen(true)}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
          />

          {/* Pause & Settings Modal */}
          <PauseSettingsModal
            isOpen={isPauseOpen}
            onClose={() => setIsPauseOpen(false)}
            onRestart={handleRestartFromModal}
            onHome={handleBackToMenu}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            currentTheme={currentTheme}
            onChangeTheme={handleChangeTheme}
            currentMode={selectedMode}
          />

          {/* Game Over Modal */}
          {gameOverData.isOpen && (
            <GameOverModal
              score={gameOverData.score}
              highScore={gameOverData.highScore}
              isNewHighScore={gameOverData.isNewHighScore}
              linesCleared={gameOverData.linesCleared}
              highestCombo={gameOverData.highestCombo}
              blocksPlaced={gameOverData.blocksPlaced}
              onRestart={handleRestartFromModal}
              onHome={handleBackToMenu}
              reason={gameOverData.reason}
            />
          )}
        </div>
      )}
    </DeviceFrame>
  );
}
