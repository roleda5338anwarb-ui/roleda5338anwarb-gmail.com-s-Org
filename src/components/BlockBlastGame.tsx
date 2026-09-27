import React, { useEffect, useRef, useState, useCallback } from 'react';
import { BoardMatrix, ColorTheme, GameMode, Particle, ScorePopup, Shape } from '../types/game';
import { createParticlesForCell, getRandomShape, THEME_PALETTES } from '../utils/shapes';
import { sound } from '../utils/audio';
import { Trophy, Volume2, VolumeX, Pause, RotateCcw, Undo2, Flame, Sparkles } from 'lucide-react';

interface BlockBlastGameProps {
  mode: GameMode;
  theme: ColorTheme;
  highScore: number;
  onUpdateHighScore: (score: number) => void;
  onGameOver: (stats: {
    score: number;
    linesCleared: number;
    highestCombo: number;
    blocksPlaced: number;
    reason?: string;
  }) => void;
  onOpenSettings: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const GRID_SIZE = 8;

export const BlockBlastGame: React.FC<BlockBlastGameProps> = ({
  mode,
  theme,
  highScore,
  onUpdateHighScore,
  onGameOver,
  onOpenSettings,
  soundEnabled,
  onToggleSound,
}) => {
  // Game Board State
  const [board, setBoard] = useState<BoardMatrix>(() =>
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null))
  );

  // Undo history for Zen mode
  const [history, setHistory] = useState<{ board: BoardMatrix; score: number }[]>([]);

  // Score & Streak State
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [highestCombo, setHighestCombo] = useState<number>(0);
  const [totalLinesCleared, setTotalLinesCleared] = useState<number>(0);
  const [totalBlocksPlaced, setTotalBlocksPlaced] = useState<number>(0);

  // Spawner Tray State (3 shapes)
  const [spawnerShapes, setSpawnerShapes] = useState<(Shape | null)[]>([null, null, null]);

  // Screen shake state
  const [shaking, setShaking] = useState<boolean>(false);

  // Canvas Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const boardCanvasRef = useRef<HTMLCanvasElement>(null);
  const dragCanvasRef = useRef<HTMLCanvasElement>(null);

  // Dragging interaction state
  const dragStateRef = useRef<{
    active: boolean;
    slotIndex: number;
    shape: Shape | null;
    pointerX: number;
    pointerY: number;
    gridPreview: { r: number; c: number; valid: boolean } | null;
    touchOffsetY: number;
  }>({
    active: false,
    slotIndex: -1,
    shape: null,
    pointerX: 0,
    pointerY: 0,
    gridPreview: null,
    touchOffsetY: 70,
  });

  // Dynamic particle list & floating texts
  const particlesRef = useRef<Particle[]>([]);
  const [popups, setPopups] = useState<ScorePopup[]>([]);
  const cellSizeRef = useRef<number>(40);
  const boardOffsetRef = useRef<{ left: number; top: number; width: number; height: number }>({
    left: 0,
    top: 0,
    width: 320,
    height: 320,
  });

  // Add floating text
  const addPopup = useCallback((text: string, isCombo = false) => {
    const id = `popup_${Date.now()}_${Math.random()}`;
    setPopups((prev) => [...prev, { id, text, x: 50, y: 46, isCombo }]);
    setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== id));
    }, 900);
  }, []);

  // Check if a shape can be placed at startR, startC
  const canPlaceShapeAt = useCallback(
    (currentBoard: BoardMatrix, shape: Shape, startR: number, startC: number): boolean => {
      for (let r = 0; r < shape.rows; r++) {
        for (let c = 0; c < shape.cols; c++) {
          if (shape.matrix[r][c] === 1) {
            const targetR = startR + r;
            const targetC = startC + c;

            if (targetR < 0 || targetR >= GRID_SIZE || targetC < 0 || targetC >= GRID_SIZE) {
              return false;
            }
            if (currentBoard[targetR][targetC] !== null) {
              return false;
            }
          }
        }
      }
      return true;
    },
    []
  );

  // Check if any shape in spawner can fit anywhere
  const checkGameOverCondition = useCallback(
    (currentBoard: BoardMatrix, shapes: (Shape | null)[]) => {
      const activeShapes = shapes.filter((s): s is Shape => s !== null);
      if (activeShapes.length === 0) return;

      let canPlaceAny = false;
      for (const shape of activeShapes) {
        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
            if (canPlaceShapeAt(currentBoard, shape, r, c)) {
              canPlaceAny = true;
              break;
            }
          }
          if (canPlaceAny) break;
        }
        if (canPlaceAny) break;
      }

      if (!canPlaceAny) {
        sound.playGameOver();
        onGameOver({
          score,
          linesCleared: totalLinesCleared,
          highestCombo,
          blocksPlaced: totalBlocksPlaced,
          reason: 'None of the available shapes fit on the board.',
        });
      }
    },
    [canPlaceShapeAt, score, totalLinesCleared, highestCombo, totalBlocksPlaced, onGameOver]
  );

  // Spawn 3 shapes
  const spawnShapes = useCallback(() => {
    const newShapes = [getRandomShape(theme), getRandomShape(theme), getRandomShape(theme)];
    setSpawnerShapes(newShapes);
  }, [theme]);

  // Initial game setup
  useEffect(() => {
    spawnShapes();
  }, [spawnShapes]);

  // Check game over when shapes or board change
  useEffect(() => {
    checkGameOverCondition(board, spawnerShapes);
  }, [board, spawnerShapes, checkGameOverCondition]);

  // Measure and resize canvases
  const updateDimensions = useCallback(() => {
    if (!boardCanvasRef.current || !containerRef.current) return;
    const boardEl = boardCanvasRef.current;
    const rect = boardEl.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    boardOffsetRef.current = {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
    };

    cellSizeRef.current = rect.width / GRID_SIZE;

    boardEl.width = rect.width * dpr;
    boardEl.height = rect.height * dpr;

    if (dragCanvasRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      dragCanvasRef.current.width = containerRect.width * dpr;
      dragCanvasRef.current.height = containerRect.height * dpr;
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  // Draw a 3D arcade jewel block tile
  const drawTile = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    color: Shape['color'],
    alpha = 1,
    isGhost = false,
    bombCountdown?: number
  ) => {
    ctx.save();
    ctx.globalAlpha = alpha;

    const pad = 1.5;
    const drawX = x + pad;
    const drawY = y + pad;
    const drawSize = size - pad * 2;
    const radius = Math.max(3.5, size * 0.18);

    if (isGhost) {
      ctx.fillStyle = color.glow;
      ctx.strokeStyle = color.fill;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(drawX, drawY, drawSize, drawSize, radius);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      return;
    }

    // Main tile body
    ctx.fillStyle = color.fill;
    ctx.beginPath();
    ctx.roundRect(drawX, drawY, drawSize, drawSize, radius);
    ctx.fill();

    // Top Gloss Gradient
    const grad = ctx.createLinearGradient(drawX, drawY, drawX, drawY + drawSize * 0.55);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(drawX, drawY, drawSize, drawSize * 0.55, [radius, radius, 0, 0]);
    ctx.fill();

    // Bottom shadow bevel
    ctx.strokeStyle = color.border;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(drawX, drawY, drawSize, drawSize, radius);
    ctx.stroke();

    // Specular Shine Dot
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(drawX + radius * 1.3, drawY + radius * 1.3, radius * 0.38, 0, Math.PI * 2);
    ctx.fill();

    // If Bomb block (Rush mode)
    if (bombCountdown !== undefined) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.beginPath();
      ctx.arc(drawX + drawSize / 2, drawY + drawSize / 2, radius * 1.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(size * 0.45)}px Fredoka, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(bombCountdown), drawX + drawSize / 2, drawY + drawSize / 2 + 1);
    }

    ctx.restore();
  };

  // Main Canvas Render Loop
  useEffect(() => {
    let animId: number;

    const render = () => {
      const bCanvas = boardCanvasRef.current;
      if (!bCanvas) return;
      const bCtx = bCanvas.getContext('2d');
      if (!bCtx) return;

      const dpr = window.devicePixelRatio || 1;
      const w = bCanvas.width / dpr;
      const h = bCanvas.height / dpr;
      const cell = cellSizeRef.current;

      bCtx.save();
      bCtx.scale(dpr, dpr);
      bCtx.clearRect(0, 0, w, h);

      // 1. Draw empty grid slots with recessed look
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          const x = c * cell;
          const y = r * cell;

          bCtx.fillStyle = 'rgba(20, 27, 45, 0.6)';
          bCtx.beginPath();
          bCtx.roundRect(x + 2, y + 2, cell - 4, cell - 4, Math.max(3, cell * 0.16));
          bCtx.fill();

          bCtx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
          bCtx.lineWidth = 1;
          bCtx.stroke();
        }
      }

      // 2. Draw Ghost Snapping Preview when dragging
      const drag = dragStateRef.current;
      if (drag.active && drag.shape && drag.gridPreview && drag.gridPreview.valid) {
        const { r: startR, c: startC } = drag.gridPreview;
        const shape = drag.shape;

        for (let r = 0; r < shape.rows; r++) {
          for (let c = 0; c < shape.cols; c++) {
            if (shape.matrix[r][c] === 1) {
              const targetR = startR + r;
              const targetC = startC + c;
              if (targetR >= 0 && targetR < GRID_SIZE && targetC >= 0 && targetC < GRID_SIZE) {
                drawTile(
                  bCtx,
                  targetC * cell,
                  targetR * cell,
                  cell,
                  shape.color,
                  0.55,
                  true // Ghost mode
                );
              }
            }
          }
        }
      }

      // 3. Draw Placed Blocks on Board
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          const cellData = board[r][c];
          if (cellData) {
            drawTile(
              bCtx,
              c * cell,
              r * cell,
              cell,
              cellData.color,
              1,
              false,
              cellData.countdown
            );
          }
        }
      }

      // 4. Render and update particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity || 0.08;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        bCtx.save();
        bCtx.globalAlpha = p.alpha;
        bCtx.fillStyle = p.color;
        bCtx.beginPath();
        bCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        bCtx.fill();
        bCtx.restore();
      }

      bCtx.restore();

      // 5. Render Dragging Shape Canvas
      const dCanvas = dragCanvasRef.current;
      if (dCanvas && containerRef.current) {
        const dCtx = dCanvas.getContext('2d');
        if (dCtx) {
          dCtx.save();
          dCtx.scale(dpr, dpr);
          dCtx.clearRect(0, 0, dCanvas.width / dpr, dCanvas.height / dpr);

          if (drag.active && drag.shape) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const localX = drag.pointerX - containerRect.left;
            const localY = drag.pointerY - drag.touchOffsetY - containerRect.top;

            const shapeW = drag.shape.cols * cell;
            const shapeH = drag.shape.rows * cell;
            const startX = localX - shapeW / 2;
            const startY = localY - shapeH / 2;

            for (let r = 0; r < drag.shape.rows; r++) {
              for (let c = 0; c < drag.shape.cols; c++) {
                if (drag.shape.matrix[r][c] === 1) {
                  drawTile(
                    dCtx,
                    startX + c * cell,
                    startY + r * cell,
                    cell,
                    drag.shape.color,
                    0.96
                  );
                }
              }
            }
          }
          dCtx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [board]);

  // Place Shape Handler
  const handlePlaceShape = (shape: Shape, startR: number, startC: number, slotIndex: number) => {
    // Save history for Zen mode
    if (mode === 'zen') {
      setHistory((prev) => [...prev.slice(-5), { board: board.map((row) => [...row]), score }]);
    }

    const newBoard = board.map((row) => [...row]);

    // Place blocks
    for (let r = 0; r < shape.rows; r++) {
      for (let c = 0; c < shape.cols; c++) {
        if (shape.matrix[r][c] === 1) {
          newBoard[startR + r][startC + c] = {
            color: shape.color,
            placedAt: Date.now(),
          };
        }
      }
    }

    // Points for placing
    const placementPoints = shape.blocksCount * 10;
    const newScore = score + placementPoints;
    setScore(newScore);
    if (newScore > highScore) {
      onUpdateHighScore(newScore);
    }
    sound.playDrop();

    setTotalBlocksPlaced((prev) => prev + 1);

    // Remove placed shape from tray
    const newSpawner = [...spawnerShapes];
    newSpawner[slotIndex] = null;
    setSpawnerShapes(newSpawner);

    // Line clearing logic
    const rowsToClear: number[] = [];
    const colsToClear: number[] = [];

    for (let r = 0; r < GRID_SIZE; r++) {
      if (newBoard[r].every((cell) => cell !== null)) {
        rowsToClear.push(r);
      }
    }

    for (let c = 0; c < GRID_SIZE; c++) {
      let full = true;
      for (let r = 0; r < GRID_SIZE; r++) {
        if (newBoard[r][c] === null) {
          full = false;
          break;
        }
      }
      if (full) colsToClear.push(c);
    }

    const totalLines = rowsToClear.length + colsToClear.length;
    let finalScore = newScore;

    if (totalLines > 0) {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      if (nextCombo > highestCombo) {
        setHighestCombo(nextCombo);
      }
      setTotalLinesCleared((prev) => prev + totalLines);

      sound.playClear(totalLines, nextCombo);

      // Trigger screen shake for big combos
      if (nextCombo >= 2 || totalLines >= 2) {
        setShaking(true);
        setTimeout(() => setShaking(false), 250);
      }

      // Calculate score with combo multiplier
      const lineScore = totalLines * 100;
      const comboBonus = nextCombo > 1 ? nextCombo * 60 * totalLines : 0;
      const pointsGained = lineScore + comboBonus;
      finalScore = newScore + pointsGained;
      setScore(finalScore);

      if (finalScore > highScore) {
        onUpdateHighScore(finalScore);
      }

      // Explosive Particles for cleared cells
      const clearedSet = new Set<string>();
      rowsToClear.forEach((r) => {
        for (let c = 0; c < GRID_SIZE; c++) clearedSet.add(`${r},${c}`);
      });
      colsToClear.forEach((c) => {
        for (let r = 0; r < GRID_SIZE; r++) clearedSet.add(`${r},${c}`);
      });

      const cell = cellSizeRef.current;
      clearedSet.forEach((coord) => {
        const [r, c] = coord.split(',').map(Number);
        const cellData = newBoard[r][c];
        const color = cellData ? cellData.color.fill : '#fbbf24';
        const p = createParticlesForCell(c * cell + cell / 2, r * cell + cell / 2, color);
        particlesRef.current.push(...p);
        newBoard[r][c] = null; // Clear cell
      });

      // Show floating feedback popup
      if (nextCombo > 1) {
        addPopup(`COMBO x${nextCombo}! +${pointsGained}`, true);
      } else {
        addPopup(`+${pointsGained}`);
      }
    } else {
      setCombo(0);
    }

    // Rush mode: Tick down or spawn bombs
    if (mode === 'rush') {
      let bombExploded = false;
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          const cell = newBoard[r][c];
          if (cell && cell.countdown !== undefined) {
            cell.countdown -= 1;
            sound.playBombTick();
            if (cell.countdown <= 0) {
              bombExploded = true;
            }
          }
        }
      }

      // Chance to spawn a bomb block on an empty spot if none exists
      let hasBomb = false;
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (newBoard[r][c]?.countdown !== undefined) hasBomb = true;
        }
      }

      if (!hasBomb && Math.random() < 0.45) {
        // Find empty cell
        const emptyCells: [number, number][] = [];
        for (let r = 0; r < GRID_SIZE; r++) {
          for (let c = 0; c < GRID_SIZE; c++) {
            if (newBoard[r][c] === null) emptyCells.push([r, c]);
          }
        }
        if (emptyCells.length > 5) {
          const [br, bc] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
          const palette = THEME_PALETTES[theme] || THEME_PALETTES.vibrant;
          newBoard[br][bc] = {
            color: palette[2], // Rose/red
            placedAt: Date.now(),
            isBomb: true,
            countdown: 9, // 9 moves to clear
          };
        }
      }

      if (bombExploded) {
        sound.playGameOver();
        onGameOver({
          score: finalScore,
          linesCleared: totalLinesCleared + totalLines,
          highestCombo,
          blocksPlaced: totalBlocksPlaced + 1,
          reason: 'A bomb block was not cleared in time and exploded!',
        });
        return;
      }
    }

    setBoard(newBoard);

    // If all 3 slots empty, spawn 3 new shapes!
    if (newSpawner.every((s) => s === null)) {
      setTimeout(() => {
        spawnShapes();
      }, 220);
    }
  };

  // Undo Handler for Zen Mode
  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setBoard(last.board);
    setScore(last.score);
    setHistory((prev) => prev.slice(0, -1));
    sound.playClick();
  };

  // Drag interaction handlers
  const handleStartDrag = (
    e: React.MouseEvent | React.TouchEvent,
    shape: Shape,
    slotIndex: number
  ) => {
    e.preventDefault();
    sound.playPickup();

    const isTouch = 'touches' in e;
    const clientX = isTouch ? e.touches[0].clientX : e.clientX;
    const clientY = isTouch ? e.touches[0].clientY : e.clientY;

    updateDimensions();

    dragStateRef.current = {
      active: true,
      slotIndex,
      shape,
      pointerX: clientX,
      pointerY: clientY,
      gridPreview: null,
      touchOffsetY: isTouch ? 75 : 0, // Lift above thumb on mobile
    };
  };

  // Global Pointer / Touch Move
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const drag = dragStateRef.current;
      if (!drag.active || !drag.shape) return;

      const isTouch = 'touches' in e;
      const clientX = isTouch ? e.touches[0].clientX : e.clientX;
      const clientY = isTouch ? e.touches[0].clientY : e.clientY;

      drag.pointerX = clientX;
      drag.pointerY = clientY;

      // Board position
      const bOffset = boardOffsetRef.current;
      const cell = cellSizeRef.current;
      const effectiveY = clientY - drag.touchOffsetY;

      const shapeW = drag.shape.cols * cell;
      const shapeH = drag.shape.rows * cell;
      const shapeOriginX = clientX - shapeW / 2;
      const shapeOriginY = effectiveY - shapeH / 2;

      const col = Math.round((shapeOriginX - bOffset.left) / cell);
      const row = Math.round((shapeOriginY - bOffset.top) / cell);

      const isValid = canPlaceShapeAt(board, drag.shape, row, col);

      drag.gridPreview = {
        r: row,
        c: col,
        valid: isValid,
      };
    };

    const handleEnd = () => {
      const drag = dragStateRef.current;
      if (!drag.active || !drag.shape) return;

      if (drag.gridPreview && drag.gridPreview.valid) {
        handlePlaceShape(drag.shape, drag.gridPreview.r, drag.gridPreview.c, drag.slotIndex);
      } else {
        sound.playInvalid();
      }

      dragStateRef.current = {
        active: false,
        slotIndex: -1,
        shape: null,
        pointerX: 0,
        pointerY: 0,
        gridPreview: null,
        touchOffsetY: 70,
      };
    };

    window.addEventListener('mousemove', handleMove, { passive: false });
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [board, canPlaceShapeAt, handlePlaceShape]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex flex-col justify-between items-center py-4 px-3 select-none overflow-hidden ${
        shaking ? 'animate-shake' : ''
      }`}
    >
      {/* Top Header: Stats & Actions */}
      <header className="w-full flex items-center justify-between gap-2.5 mb-2 z-10">
        {/* High Score / Best Card */}
        <div className="flex-1 bg-slate-800/85 border border-white/10 rounded-2xl px-3 py-2 flex flex-col items-center shadow-inner">
          <div className="flex items-center gap-1 text-amber-400 text-[11px] font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5" />
            <span>Best</span>
          </div>
          <span className="font-game text-xl font-bold text-amber-300">
            {highScore.toLocaleString()}
          </span>
        </div>

        {/* Current Score Card with Combo Pill */}
        <div className="flex-[1.4] bg-indigo-950/80 border border-indigo-500/40 rounded-2xl px-4 py-2 flex flex-col items-center shadow-lg relative overflow-hidden">
          <div className="text-indigo-300 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
            {mode === 'rush' && <Flame className="w-3 h-3 text-rose-400" />}
            {mode === 'zen' && <Sparkles className="w-3 h-3 text-emerald-400" />}
            <span>Score</span>
          </div>
          <span className="font-game text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
            {score.toLocaleString()}
          </span>

          {/* Active Combo Multiplier Badge */}
          {combo > 1 && (
            <div className="absolute top-1 right-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tight shadow-md animate-combo-pulse">
              Combo x{combo}
            </div>
          )}
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-1.5">
          {mode === 'zen' && history.length > 0 && (
            <button
              onClick={handleUndo}
              title="Undo Last Move"
              className="w-10 h-10 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center text-emerald-300 hover:bg-emerald-900/80 active:scale-95 transition-all shadow-sm cursor-pointer"
            >
              <Undo2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              sound.playClick();
              onToggleSound();
            }}
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
            className="w-10 h-10 rounded-2xl bg-slate-800/85 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700/80 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            title="Pause & Settings"
            className="w-10 h-10 rounded-2xl bg-slate-800/85 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-700/80 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <Pause className="w-4 h-4 fill-current" />
          </button>
        </div>
      </header>

      {/* Main 8x8 Board Container */}
      <main className="relative w-full aspect-square flex items-center justify-center my-auto">
        <div className="relative w-full h-full max-w-[360px] max-h-[360px] bg-slate-950/85 rounded-2xl p-2 board-glow border border-indigo-500/25 flex items-center justify-center shadow-2xl">
          {/* Floating Score Popups Container */}
          <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
            {popups.map((popup) => (
              <div
                key={popup.id}
                className={`absolute font-game text-xl sm:text-2xl font-black drop-shadow-xl animate-score-float pointer-events-none ${
                  popup.isCombo
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-400 to-purple-300 text-2xl sm:text-3xl'
                    : 'text-amber-300'
                }`}
                style={{
                  left: `${popup.x}%`,
                  top: `${popup.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {popup.text}
              </div>
            ))}
          </div>

          {/* Board Canvas */}
          <canvas
            ref={boardCanvasRef}
            className="w-full h-full rounded-xl cursor-pointer touch-none"
          />
        </div>
      </main>

      {/* Bottom Shape Spawner Tray (3 Slots) */}
      <section className="w-full flex flex-col items-center justify-center gap-1.5 mt-2 z-10">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
          <span>Drag shapes to the grid</span>
        </div>

        <div className="w-full h-28 grid grid-cols-3 gap-2 px-1">
          {spawnerShapes.map((shape, idx) => (
            <div
              key={idx}
              className={`relative rounded-2xl bg-slate-800/60 border border-white/5 flex items-center justify-center transition-all p-1 cursor-grab active:cursor-grabbing ${
                !shape ? 'opacity-25' : 'hover:border-white/20'
              }`}
              onMouseDown={(e) => shape && handleStartDrag(e, shape, idx)}
              onTouchStart={(e) => shape && handleStartDrag(e, shape, idx)}
            >
              {shape && <ShapeMiniPreview shape={shape} />}
            </div>
          ))}
        </div>
      </section>

      {/* Fullscreen Overlay Canvas for dragging shape */}
      <canvas
        ref={dragCanvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full z-40"
      />
    </div>
  );
};

// Mini preview component for spawner slots
const ShapeMiniPreview: React.FC<{ shape: Shape }> = ({ shape }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 70;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, size, size);

    const maxDim = Math.max(shape.rows, shape.cols, 3);
    const miniCell = (size * 0.9) / maxDim;
    const offsetX = (size - shape.cols * miniCell) / 2;
    const offsetY = (size - shape.rows * miniCell) / 2;

    for (let r = 0; r < shape.rows; r++) {
      for (let c = 0; c < shape.cols; c++) {
        if (shape.matrix[r][c] === 1) {
          const drawX = offsetX + c * miniCell + 1;
          const drawY = offsetY + r * miniCell + 1;
          const drawSize = miniCell - 2;
          const radius = Math.max(2.5, drawSize * 0.18);

          // Fill
          ctx.fillStyle = shape.color.fill;
          ctx.beginPath();
          ctx.roundRect(drawX, drawY, drawSize, drawSize, radius);
          ctx.fill();

          // Gloss
          const grad = ctx.createLinearGradient(drawX, drawY, drawX, drawY + drawSize * 0.55);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
          grad.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(drawX, drawY, drawSize, drawSize * 0.55, [radius, radius, 0, 0]);
          ctx.fill();

          // Border
          ctx.strokeStyle = shape.color.border;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.roundRect(drawX, drawY, drawSize, drawSize, radius);
          ctx.stroke();
        }
      }
    }
  }, [shape]);

  return <canvas ref={canvasRef} style={{ width: '70px', height: '70px' }} />;
};
