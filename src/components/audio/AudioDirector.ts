import type { Chapter } from '../../lib/story';

const STAGES: [number, number][] = [
  [130.81, 196.0], // opening — airy fifth
  [123.47, 185.0], // maker — warmer
  [146.83, 220.0], // projects — brighter, curious
  [138.59, 207.65], // experience + skills — focused build
  [110.0, 164.81], // finale — quiet resolution
];

function stageFor(progress: number) {
  if (progress >= 0.88) return 4;
  if (progress >= 0.635) return 3;
  if (progress >= 0.28) return 2;
  if (progress >= 0.245) return 1;
  return 0;
}

export class AudioDirector {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private voices: OscillatorNode[] = [];
  private enabled = false;
  private intent = 0;
  private stage = 0;
  private narration: HTMLAudioElement | null = null;
  private narrationSource = '';

  async enable() {
    const request = ++this.intent;
    this.enabled = true;
    if (!this.context) {
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = 0;
      this.master.connect(this.context.destination);
      STAGES[this.stage].forEach((frequency, i) => {
        const oscillator = this.context!.createOscillator();
        const gain = this.context!.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        gain.gain.value = i === 0 ? 0.45 : 0.17;
        oscillator.connect(gain);
        gain.connect(this.master!);
        oscillator.start();
        this.voices.push(oscillator);
      });
    }
    await this.context.resume();
    if (request !== this.intent || !this.enabled || !this.context) return;
    this.master!.gain.setTargetAtTime(0.038, this.context.currentTime, 0.5);
  }

  disable() {
    this.intent += 1;
    this.enabled = false;
    if (this.context && this.master) this.master.gain.setTargetAtTime(0, this.context.currentTime, 0.08);
    this.narration?.pause();
  }

  setProgress(progress: number) {
    const next = stageFor(progress);
    if (next === this.stage) return;
    this.stage = next;
    if (!this.context) return;
    this.voices.forEach((voice, index) => {
      voice.frequency.setTargetAtTime(STAGES[next][index], this.context!.currentTime, 0.7);
    });
    this.cue('page');
  }

  cue(kind: 'spark' | 'page') {
    if (!this.enabled || !this.context || !this.master) return;
    const time = this.context.currentTime;
    [0, 1].forEach((i) => {
      const oscillator = this.context!.createOscillator();
      const gain = this.context!.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = kind === 'spark' ? [523.25, 783.99][i] : [261.63, 329.63][i];
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.5, time + 0.018 + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.7 + i * 0.08);
      oscillator.connect(gain);
      gain.connect(this.master!);
      oscillator.start(time + i * 0.07);
      oscillator.stop(time + 0.9);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
    });
  }

  syncNarration(chapter: Chapter, progress: number, narrationEnabled: boolean, moving: boolean) {
    if (!chapter.narrationSrc || !narrationEnabled || !moving) { this.narration?.pause(); return; }
    if (this.narrationSource !== chapter.narrationSrc) {
      this.narration?.pause();
      this.narration = new Audio(chapter.narrationSrc);
      this.narrationSource = chapter.narrationSrc;
      this.narration.volume = 0.6;
    }
    const position = Math.max(0, Math.min(1, progress)) * chapter.duration;
    if (this.narration && this.narration.readyState > 0 && Math.abs(this.narration.currentTime - position) > 0.45) this.narration.currentTime = position;
    void this.narration?.play().catch(() => undefined);
  }

  suspend() { void this.context?.suspend(); this.narration?.pause(); }
  resume() { if (this.enabled) void this.context?.resume(); }

  dispose() {
    this.intent += 1;
    this.enabled = false;
    this.voices.forEach((voice) => { voice.stop(); voice.disconnect(); });
    this.voices = [];
    this.master?.disconnect();
    this.narration?.pause();
    if (this.context && this.context.state !== 'closed') void this.context.close();
    this.context = null;
    this.master = null;
  }
}
