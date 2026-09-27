class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  constructor() {
    // Check saved state from localStorage
    try {
      const saved = localStorage.getItem('block_blast_sound_enabled');
      if (saved !== null) {
        this.enabled = saved === 'true';
      }
    } catch {
      this.enabled = true;
    }
  }

  public init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    try {
      localStorage.setItem('block_blast_sound_enabled', String(this.enabled));
    } catch {
      // ignore
    }
    return this.enabled;
  }

  private playTone(freq: number, type: OscillatorType = 'sine', duration = 0.1, gainVal = 0.2, pitchBend = 0) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      if (pitchBend !== 0) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq + pitchBend), now + duration);
      }

      gain.gain.setValueAtTime(gainVal, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Audio playback suppressed or unsupported
    }
  }

  public playClick() {
    this.playTone(600, 'sine', 0.04, 0.1, -150);
  }

  public playPickup() {
    this.playTone(340, 'sine', 0.08, 0.15, 120);
  }

  public playDrop() {
    this.playTone(460, 'triangle', 0.1, 0.2, -180);
  }

  public playInvalid() {
    this.playTone(180, 'sawtooth', 0.15, 0.18, -40);
  }

  public playClear(linesCount: number, comboCount: number) {
    if (!this.enabled) return;
    const baseFreq = 440 + Math.min(comboCount * 75, 450);
    const notesCount = Math.min(linesCount * 2 + 1, 6);

    for (let i = 0; i < notesCount; i++) {
      setTimeout(() => {
        const factor = Math.pow(1.22, i);
        this.playTone(baseFreq * factor, 'triangle', 0.18, 0.22, 60);
      }, i * 55);
    }

    if (comboCount >= 2) {
      setTimeout(() => {
        this.playTone(baseFreq * 2, 'sine', 0.25, 0.25, 0);
      }, notesCount * 55);
    }
  }

  public playGameOver() {
    if (!this.enabled) return;
    const freqs = [380, 320, 260, 200];
    freqs.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sawtooth', 0.22, 0.22, -40), idx * 110);
    });
  }

  public playBombTick() {
    this.playTone(800, 'square', 0.05, 0.08, -300);
  }

  public playCelebration() {
    if (!this.enabled) return;
    const melody = [523.25, 659.25, 783.99, 1046.5];
    melody.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.2, 0.2, 0), i * 90);
    });
  }
}

export const sound = new SoundEngine();
