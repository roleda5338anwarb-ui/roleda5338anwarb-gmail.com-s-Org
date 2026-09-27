import { ColorTheme, Matrix, Particle, Shape, ShapeColor } from '../types/game';

export const THEME_PALETTES: Record<ColorTheme, ShapeColor[]> = {
  vibrant: [
    {
      id: 'amber',
      name: 'Amber Gold',
      fill: '#fbbf24',
      border: '#d97706',
      glow: 'rgba(251, 191, 36, 0.45)',
      lightHighlight: 'rgba(254, 240, 138, 0.7)',
    },
    {
      id: 'cyan',
      name: 'Electric Cyan',
      fill: '#38bdf8',
      border: '#0284c7',
      glow: 'rgba(56, 189, 248, 0.45)',
      lightHighlight: 'rgba(186, 230, 253, 0.7)',
    },
    {
      id: 'rose',
      name: 'Vibrant Rose',
      fill: '#fb7185',
      border: '#e11d48',
      glow: 'rgba(251, 113, 133, 0.45)',
      lightHighlight: 'rgba(254, 205, 211, 0.7)',
    },
    {
      id: 'emerald',
      name: 'Emerald Mint',
      fill: '#34d399',
      border: '#059669',
      glow: 'rgba(52, 211, 153, 0.45)',
      lightHighlight: 'rgba(167, 243, 208, 0.7)',
    },
    {
      id: 'purple',
      name: 'Mystic Purple',
      fill: '#c084fc',
      border: '#9333ea',
      glow: 'rgba(192, 132, 252, 0.45)',
      lightHighlight: 'rgba(233, 213, 255, 0.7)',
    },
    {
      id: 'orange',
      name: 'Sun Orange',
      fill: '#fb923c',
      border: '#ea580c',
      glow: 'rgba(251, 146, 60, 0.45)',
      lightHighlight: 'rgba(254, 215, 170, 0.7)',
    },
    {
      id: 'blue',
      name: 'Sapphire Blue',
      fill: '#60a5fa',
      border: '#2563eb',
      glow: 'rgba(96, 165, 250, 0.45)',
      lightHighlight: 'rgba(191, 219, 254, 0.7)',
    },
  ],
  neon: [
    {
      id: 'neon-pink',
      name: 'Neon Pink',
      fill: '#f43f5e',
      border: '#be123c',
      glow: 'rgba(244, 63, 94, 0.6)',
      lightHighlight: 'rgba(255, 180, 195, 0.8)',
    },
    {
      id: 'neon-cyan',
      name: 'Cyber Cyan',
      fill: '#06b6d4',
      border: '#0891b2',
      glow: 'rgba(6, 182, 212, 0.6)',
      lightHighlight: 'rgba(165, 243, 252, 0.8)',
    },
    {
      id: 'neon-lime',
      name: 'Acid Lime',
      fill: '#a3e635',
      border: '#65a30d',
      glow: 'rgba(163, 230, 53, 0.6)',
      lightHighlight: 'rgba(236, 252, 203, 0.8)',
    },
    {
      id: 'neon-violet',
      name: 'Deep Violet',
      fill: '#a855f7',
      border: '#7e22ce',
      glow: 'rgba(168, 85, 247, 0.6)',
      lightHighlight: 'rgba(243, 232, 255, 0.8)',
    },
  ],
  candy: [
    {
      id: 'candy-peach',
      name: 'Peach Sweet',
      fill: '#fda4af',
      border: '#f43f5e',
      glow: 'rgba(253, 164, 175, 0.45)',
      lightHighlight: 'rgba(255, 241, 242, 0.7)',
    },
    {
      id: 'candy-mint',
      name: 'Mint Pastel',
      fill: '#6ee7b7',
      border: '#10b981',
      glow: 'rgba(110, 231, 183, 0.45)',
      lightHighlight: 'rgba(236, 253, 245, 0.7)',
    },
    {
      id: 'candy-sky',
      name: 'Baby Blue',
      fill: '#93c5fd',
      border: '#3b82f6',
      glow: 'rgba(147, 197, 253, 0.45)',
      lightHighlight: 'rgba(239, 246, 255, 0.7)',
    },
    {
      id: 'candy-lemon',
      name: 'Lemon Cream',
      fill: '#fde047',
      border: '#eab308',
      glow: 'rgba(253, 224, 71, 0.45)',
      lightHighlight: 'rgba(254, 252, 232, 0.7)',
    },
  ],
  sunset: [
    {
      id: 'sunset-gold',
      name: 'Sunset Gold',
      fill: '#f59e0b',
      border: '#b45309',
      glow: 'rgba(245, 158, 11, 0.5)',
      lightHighlight: 'rgba(254, 243, 199, 0.7)',
    },
    {
      id: 'sunset-coral',
      name: 'Warm Coral',
      fill: '#f97316',
      border: '#c2410c',
      glow: 'rgba(249, 115, 22, 0.5)',
      lightHighlight: 'rgba(255, 237, 213, 0.7)',
    },
    {
      id: 'sunset-crimson',
      name: 'Crimson Glow',
      fill: '#ef4444',
      border: '#b91c1c',
      glow: 'rgba(239, 68, 68, 0.5)',
      lightHighlight: 'rgba(254, 226, 226, 0.7)',
    },
    {
      id: 'sunset-dusk',
      name: 'Dusk Violet',
      fill: '#8b5cf6',
      border: '#6d28d9',
      glow: 'rgba(139, 92, 246, 0.5)',
      lightHighlight: 'rgba(245, 243, 255, 0.7)',
    },
  ],
};

// Shape templates with varying weights and classic Block Blast variety
export const SHAPE_TEMPLATES: { matrix: Matrix; preferredColorIdx?: number; weight: number }[] = [
  // 1x1 Single Dot
  { matrix: [[1]], weight: 6 },
  
  // 2x2 Square
  { matrix: [[1, 1], [1, 1]], weight: 7 },
  
  // 3x3 Large Square
  { matrix: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], weight: 3 },
  
  // Horizontal bars
  { matrix: [[1, 1]], weight: 7 },
  { matrix: [[1, 1, 1]], weight: 8 },
  { matrix: [[1, 1, 1, 1]], weight: 6 },
  { matrix: [[1, 1, 1, 1, 1]], weight: 3 },
  
  // Vertical bars
  { matrix: [[1], [1]], weight: 7 },
  { matrix: [[1], [1], [1]], weight: 8 },
  { matrix: [[1], [1], [1], [1]], weight: 6 },
  { matrix: [[1], [1], [1], [1], [1]], weight: 3 },
  
  // 2x2 Corners (L-small)
  { matrix: [[1, 1], [1, 0]], weight: 6 },
  { matrix: [[1, 1], [0, 1]], weight: 6 },
  { matrix: [[0, 1], [1, 1]], weight: 6 },
  { matrix: [[1, 0], [1, 1]], weight: 6 },

  // 3x3 Large Corners
  { matrix: [[1, 1, 1], [1, 0, 0], [1, 0, 0]], weight: 4 },
  { matrix: [[1, 1, 1], [0, 0, 1], [0, 0, 1]], weight: 4 },
  { matrix: [[1, 0, 0], [1, 0, 0], [1, 1, 1]], weight: 4 },
  { matrix: [[0, 0, 1], [0, 0, 1], [1, 1, 1]], weight: 4 },

  // Standard Tetromino L-shapes (3x2 and 2x3)
  { matrix: [[1, 0], [1, 0], [1, 1]], weight: 6 },
  { matrix: [[0, 1], [0, 1], [1, 1]], weight: 6 },
  { matrix: [[1, 1], [1, 0], [1, 0]], weight: 6 },
  { matrix: [[1, 1], [0, 1], [0, 1]], weight: 6 },
  { matrix: [[1, 1, 1], [1, 0, 0]], weight: 6 },
  { matrix: [[1, 1, 1], [0, 0, 1]], weight: 6 },
  { matrix: [[1, 0, 0], [1, 1, 1]], weight: 6 },
  { matrix: [[0, 0, 1], [1, 1, 1]], weight: 6 },

  // T-shapes
  { matrix: [[1, 1, 1], [0, 1, 0]], weight: 6 },
  { matrix: [[0, 1, 0], [1, 1, 1]], weight: 6 },
  { matrix: [[1, 0], [1, 1], [1, 0]], weight: 6 },
  { matrix: [[0, 1], [1, 1], [0, 1]], weight: 6 },

  // Z & S shapes
  { matrix: [[1, 1, 0], [0, 1, 1]], weight: 5 },
  { matrix: [[0, 1, 1], [1, 1, 0]], weight: 5 },
  { matrix: [[1, 0], [1, 1], [0, 1]], weight: 5 },
  { matrix: [[0, 1], [1, 1], [1, 0]], weight: 5 },

  // Plus / Cross shape
  { matrix: [[0, 1, 0], [1, 1, 1], [0, 1, 0]], weight: 3 },

  // Diagonal 2
  { matrix: [[1, 0], [0, 1]], weight: 4 },
  { matrix: [[0, 1], [1, 0]], weight: 4 },
];

export function getRandomShape(theme: ColorTheme = 'vibrant'): Shape {
  const palette = THEME_PALETTES[theme] || THEME_PALETTES.vibrant;
  
  // Calculate total weight
  const totalWeight = SHAPE_TEMPLATES.reduce((acc, t) => acc + t.weight, 0);
  let randomVal = Math.random() * totalWeight;
  let chosenTemplate = SHAPE_TEMPLATES[0];

  for (const template of SHAPE_TEMPLATES) {
    if (randomVal < template.weight) {
      chosenTemplate = template;
      break;
    }
    randomVal -= template.weight;
  }

  const matrix = chosenTemplate.matrix;
  const rows = matrix.length;
  const cols = matrix[0].length;
  const blocksCount = matrix.flat().filter(v => v === 1).length;

  const color = palette[Math.floor(Math.random() * palette.length)];

  return {
    id: `shape_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    matrix,
    color,
    rows,
    cols,
    blocksCount,
  };
}

export function createParticlesForCell(
  centerX: number,
  centerY: number,
  color: string,
  count = 14
): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const speed = 2 + Math.random() * 5.2;
    particles.push({
      x: centerX,
      y: centerY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 3 + Math.random() * 4,
      color,
      alpha: 1,
      decay: 0.022 + Math.random() * 0.02,
      gravity: 0.08,
    });
  }
  return particles;
}
