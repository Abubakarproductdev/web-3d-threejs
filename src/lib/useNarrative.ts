import { useLayoutEffect, useEffect, type RefObject, type MutableRefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { WorldState } from './story';

gsap.registerPlugin(ScrollTrigger);

export function releaseNarrativePin() {
  ScrollTrigger.getById('makers-story')?.kill(true);
}

type Options = {
  track: RefObject<HTMLDivElement | null>;
  stage: RefObject<HTMLDivElement | null>;
  world: MutableRefObject<WorldState>;
  started: boolean;
  mobile: boolean;
  reducedMotion: boolean;
  onProgress: (progress: number) => void;
};

const ACTS = ['.act-fast', '.act-sivo', '.act-boost'];
const PLATES = ['.plate-experience', '.plate-skills', '.plate-finale'];

// ——— Sanitizer: the stage janitor. ———
// Every layer owns an exact progress window. Overlapping windows ensure
// seamless transitions without premature clipping or flashing.
const WINDOWS: [selector: string, start: number, end: number][] = [
  ['.intro-copy', -0.01, 0.132],
  ['.narrative-panels', 0.1, 0.30],
  ['.act-fast', 0.27, 0.415],
  ['.act-sivo', 0.415, 0.545],
  ['.act-boost', 0.545, 0.645],
  ['.drafting-curtain', 0.62, 0.685],
  ['.plate-experience', 0.64, 0.80],
  ['.plate-skills', 0.74, 0.93],
  ['.plate-finale', 0.88, 1.02],
];
const EPS = 0.006;

function useStageSanitizer(active: boolean, world: MutableRefObject<WorldState>) {
  useEffect(() => {
    if (!active) return;
    const layers = WINDOWS
      .map(([selector, start, end]) => ({ el: document.querySelector<HTMLElement>(selector), start, end }))
      .filter((l): l is { el: HTMLElement; start: number; end: number } => Boolean(l.el));
    let frame = 0;
    const tick = () => {
      const p = world.current.progress;
      for (const { el, start, end } of layers) {
        if (p < start - EPS || p > end + EPS) {
          if (el.style.visibility !== 'hidden') el.style.visibility = 'hidden';
        } else if (p > start + EPS && p < end - EPS) {
          if (el.style.visibility !== 'visible') el.style.visibility = 'visible';
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, world]);
}

// ——— Phases 4–6 beats: Fast Send, SIVO, BoostWork ———
const SCHEDULE = [
  { sel: '.act-fast', enter: 0.28, exit: 0.39 },
  { sel: '.act-sivo', enter: 0.42, exit: 0.52 },
  { sel: '.act-boost', enter: 0.54, exit: 0.63 },
];
const ENTER = 0.03;
const EXIT = 0.04;

// Annotation reveal offsets inside plate 7 (three rooms).
const CALLOUT_OFFSETS = [0.032, 0.052, 0.072];
// Legend row offsets inside plate 8 (six groups).
const LEGEND_OFFSETS = [0.008, 0.018, 0.028, 0.038, 0.048, 0.058];

export function useNarrative({ track, stage, world, started, mobile, reducedMotion, onProgress }: Options) {
  useStageSanitizer(started && !reducedMotion, world);

  useLayoutEffect(() => {
    if (!started || reducedMotion || !track.current || !stage.current) return;
    const state = world.current;
    const context = gsap.context(() => {
      gsap.set(['.narrative-panels', ...ACTS, '.drafting-curtain', ...PLATES], { visibility: 'hidden' });
      gsap.set('.narrative-panel', { yPercent: 120, y: 0 });
      gsap.set('.drafting-curtain', { yPercent: 100, opacity: 1 });
      gsap.set('.drafting-curtain .curtain-rule', { scaleX: 0 });
      gsap.set('.panel-question', { rotation: mobile ? -3 : -7, rotationY: -6 });
      gsap.set('.panel-exploration', { rotation: mobile ? 2 : 3, rotationY: 4 });
      gsap.set('.panel-purpose', { rotation: mobile ? -2 : 8, rotationY: -7 });
      ACTS.forEach((sel) => {
        gsap.set(sel, { y: 70, clipPath: 'inset(0 0 100% 0)', visibility: 'hidden' });
        gsap.set(`${sel} .act-copy > *`, { y: 22 });
        gsap.set(`${sel} .act-card`, { y: 46, rotation: mobile ? 0 : 3 });
      });

      // ——— Plates: Start with zero opacity and hidden visibility ———
      PLATES.forEach((sel) => {
        gsap.set(sel, { opacity: 0, visibility: 'hidden' });
        gsap.set(`${sel} .plate-head`, { y: 30, opacity: 0 });
        gsap.set(`${sel} .plate-frame`, { scale: 0.98, opacity: 0 });
        gsap.set(`${sel} .drafting-cross`, { scale: 0, opacity: 0 });
        gsap.set(`${sel} .plate-coordinates`, { y: -10, opacity: 0 });
      });
      gsap.set('.plate-experience .callout', { y: 24, opacity: 0 });
      gsap.set('.plate-experience .callout-leader', { scaleY: 0 });
      gsap.set('.plate-experience .callout-node', { scale: 0 });
      gsap.set('.plate-experience .scale-rail', { scaleX: 0 });
      gsap.set('.plate-experience .scale-tick-item', { opacity: 0, y: 8 });
      gsap.set('.plate-skills .legend-row', { x: -28, opacity: 0 });
      gsap.set('.plate-skills .legend-leader', { scaleX: 0 });
      gsap.set('.plate-skills .plate-notes', { y: 30, opacity: 0, scale: 0.96 });
      gsap.set('.plate-finale .plate-kicker', { y: 22, opacity: 0 });
      gsap.set('.plate-finale .finale-huge', { y: 34, opacity: 0 });
      gsap.set('.plate-finale .finale-name', { y: 26, opacity: 0 });
      gsap.set('.plate-finale .finale-invite', { y: 22, opacity: 0 });
      gsap.set('.plate-finale .finale-cta', { y: 26, opacity: 0 });

      state.progress = 0;
      state.cameraPush = 0;
      state.cameraReturn = 0;
      state.unfold = 0;
      state.paperLift = 0;
      state.turn = 0;
      state.journey = 0;

      const timeline = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        onUpdate: () => onProgress(state.progress),
        scrollTrigger: {
          id: 'makers-story',
          trigger: track.current,
          pin: stage.current,
          pinSpacing: false,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.85,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => { state.velocity = Math.max(-1, Math.min(1, self.getVelocity() / 2400)); },
        },
      });

      // Master clock
      timeline.to(state, { progress: 1, duration: 1, ease: 'none' }, 0);

      // Camera archipelago journey (Fast Forward Warp):
      // Fast Send (0.0): 0.28 – 0.385
      // Fast-forward warp to SIVO (0.5): 0.385 – 0.420 (single flick, expo.inOut)
      // SIVO (0.5): 0.420 – 0.515
      // Fast-forward warp to BoostWork (1.0): 0.515 – 0.550 (single flick, expo.inOut)
      // BoostWork (1.0): 0.550 – 0.615
      timeline.to(state, { journey: 0.5, duration: 0.035, ease: 'expo.inOut' }, 0.385);
      timeline.to(state, { journey: 1.0, duration: 0.035, ease: 'expo.inOut' }, 0.515);

      // ——— ACT 1: opening (0 – 0.27) ———
      timeline.to(state, { cameraPush: 1, duration: 0.07 }, 0.05);
      timeline.to('.intro-copy', { y: -65, clipPath: 'inset(0 0 100% 0)', duration: 0.05 }, 0.075);
      timeline.set('.intro-copy', { visibility: 'hidden' }, 0.13);
      timeline.to(state, { unfold: 1, paperLift: 1, turn: -0.18, duration: 0.09 }, 0.1);
      timeline.set('.narrative-panels', { visibility: 'visible' }, 0.105);

      if (mobile) {
        timeline.to('.panel-question', { yPercent: 0, duration: 0.045, ease: 'power3.out' }, 0.115);
        timeline.to('.panel-question', { xPercent: -150, rotationY: 30, duration: 0.045 }, 0.175);
        timeline.to('.panel-exploration', { yPercent: 0, duration: 0.045, ease: 'power3.out' }, 0.17);
        timeline.to('.panel-exploration', { xPercent: -155, rotationY: -20, duration: 0.045 }, 0.23);
        timeline.to('.panel-purpose', { yPercent: 0, duration: 0.045, ease: 'power3.out' }, 0.225);
      } else {
        timeline.to('.narrative-panel', { yPercent: 0, duration: 0.06, stagger: 0.018, ease: 'power3.out' }, 0.115);
        timeline.to('.panel-question', { xPercent: -160, yPercent: -15, rotationY: 35, rotation: -12, duration: 0.05 }, 0.2);
        timeline.to('.panel-exploration', { xPercent: -205, yPercent: -5, rotationY: -32, rotation: -8, duration: 0.05 }, 0.215);
      }

      timeline.to('.panel-purpose', { x: mobile ? '0vw' : '-29vw', rotation: 0, rotationY: 0, duration: 0.05 }, 0.225);
      timeline.to('.panel-purpose', { scale: mobile ? 3 : 5.8, duration: 0.045, ease: 'power2.in' }, 0.245);
      timeline.to('.panel-purpose .panel-inner', { yPercent: -145, duration: 0.035 }, 0.25);
      
      // Direct redirect from Make It Useful to Fast Send:
      // Panel-purpose lifts smoothly to reveal Fast Send island directly beneath
      timeline.to('.panel-purpose', { y: '-340vh', opacity: 0, rotation: -4, duration: 0.065, ease: 'power2.inOut' }, 0.26);
      timeline.set('.narrative-panels', { visibility: 'hidden' }, 0.30);
      
      // Fast Send enters smoothly over its dedicated 3D stage
      timeline.set('.act-fast', { visibility: 'visible' }, 0.28);
      timeline.to('.act-fast', { y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.045, ease: 'power2.out' }, 0.28);
      timeline.to('.act-fast .act-copy > *', { y: 0, duration: 0.035, stagger: 0.008, ease: 'power2.out' }, 0.29);
      timeline.to('.act-fast .act-card', { y: 0, rotation: 0, duration: 0.045, ease: 'power3.out' }, 0.295);
      timeline.to('.act-fast', { y: -60, clipPath: 'inset(100% 0 0 0)', duration: 0.025, ease: 'power2.inOut' }, 0.385);
      timeline.set('.act-fast', { visibility: 'hidden' }, 0.412);

      // ——— ACT 5: SIVO (0.420 – 0.515) ———
      timeline.set('.act-sivo', { visibility: 'visible' }, 0.420);
      timeline.to('.act-sivo', { y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.025, ease: 'power2.out' }, 0.420);
      timeline.to('.act-sivo .act-copy > *', { y: 0, duration: 0.03, stagger: 0.007, ease: 'power2.out' }, 0.428);
      timeline.to('.act-sivo .act-card', { y: 0, rotation: 0, duration: 0.035, ease: 'power3.out' }, 0.432);
      timeline.to('.act-sivo', { y: -60, clipPath: 'inset(100% 0 0 0)', duration: 0.025, ease: 'power2.inOut' }, 0.515);
      timeline.set('.act-sivo', { visibility: 'hidden' }, 0.542);

      // ——— ACT 6: BoostWork (0.550 – 0.615 hold) ———
      timeline.set('.act-boost', { visibility: 'visible' }, 0.550);
      timeline.to('.act-boost', { y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.025, ease: 'power2.out' }, 0.550);
      timeline.to('.act-boost .act-copy > *', { y: 0, duration: 0.03, stagger: 0.007, ease: 'power2.out' }, 0.558);
      timeline.to('.act-boost .act-card', { y: 0, rotation: 0, duration: 0.035, ease: 'power3.out' }, 0.562);

      // ——— HIGH-END ARCHITECTURAL TRANSITION: BoostWork -> Experience (0.615 – 0.655) ———
      // 1. BoostWork exits with horizontal parallax drift (no jarring clip wipe)
      timeline.to('.act-boost .act-copy', { xPercent: -14, opacity: 0, duration: 0.025, ease: 'power2.in' }, 0.615);
      timeline.to('.act-boost .act-card', { xPercent: 14, opacity: 0, duration: 0.025, ease: 'power2.in' }, 0.615);
      timeline.set('.act-boost', { visibility: 'hidden' }, 0.642);

      // 2. The Architectural Drafting Curtain unrolls across the viewport, blanketing the orange scene
      timeline.set('.drafting-curtain', { visibility: 'visible' }, 0.622);
      timeline.fromTo('.drafting-curtain', { yPercent: 100 }, { yPercent: 0, duration: 0.026, ease: 'power2.out' }, 0.625);
      timeline.fromTo('.drafting-curtain .curtain-rule', { scaleX: 0 }, { scaleX: 1, duration: 0.02, ease: 'power2.out' }, 0.630);

      // 3. Underneath the curtain, fade out 3D canvas so no geometry leaks into the plates
      timeline.to('.world-wrap', { opacity: 0, duration: 0.02, ease: 'power2.out' }, 0.636);

      // 4. Plate 7 (Experience) artwork & drafting frame assemble underneath the curtain
      timeline.set('.plate-experience', { visibility: 'visible' }, 0.642);
      timeline.fromTo('.plate-experience', { opacity: 0 }, { opacity: 1, duration: 0.025, ease: 'power2.out' }, 0.645);
      timeline.fromTo('.plate-experience .plate-art', { xPercent: 4, scale: 1.03 }, { xPercent: -2, scale: 1, duration: 0.09, ease: 'none' }, 0.645);
      timeline.to('.plate-experience .plate-frame', { scale: 1, opacity: 1, duration: 0.035, ease: 'power2.out' }, 0.648);

      // 5. Fade the curtain away as the technical plate takes over
      timeline.to('.drafting-curtain', { opacity: 0, duration: 0.018, ease: 'power1.out' }, 0.665);
      timeline.set('.drafting-curtain', { visibility: 'hidden' }, 0.685);

      // 6. Plate 7 technical annotations & rooms assemble in synchronized harmony
      timeline.to('.plate-experience .drafting-cross', { scale: 1, opacity: 0.7, duration: 0.025, stagger: 0.005, ease: 'back.out(2)' }, 0.648);
      timeline.to('.plate-experience .plate-coordinates', { y: 0, opacity: 0.8, duration: 0.025, ease: 'power2.out' }, 0.650);
      timeline.to('.plate-experience .plate-head', { y: 0, opacity: 1, duration: 0.035, ease: 'power3.out' }, 0.652);
      timeline.to('.plate-experience .scale-rail', { scaleX: 1, duration: 0.05, ease: 'power2.out' }, 0.655);
      timeline.to('.plate-experience .scale-tick-item', { opacity: 1, y: 0, duration: 0.025, stagger: 0.01, ease: 'power2.out' }, 0.658);

      // Staggered reveal of the three architectural rooms
      CALLOUT_OFFSETS.forEach((off, i) => {
        const t = 0.648 + off;
        timeline.to(`.plate-experience .callout-${i + 1} .callout-node`, { scale: 1, duration: 0.025, ease: 'back.out(2.5)' }, t);
        timeline.to(`.plate-experience .callout-${i + 1} .callout-leader`, { scaleY: 1, duration: 0.035, ease: 'power2.out' }, t + 0.006);
        timeline.to(`.plate-experience .callout-${i + 1}`, { y: 0, opacity: 1, duration: 0.04, ease: 'power3.out' }, t + 0.008);
      });

      /* ——— SEAMLESS EXPERIENCE TO SKILLS FOLIO TRANSITION (0.742 – 0.775) ——— */
      // 1. Experience elements smoothly retract
      timeline.to('.plate-experience .callout-leader', { scaleY: 0, duration: 0.025, ease: 'power2.in' }, 0.742);
      timeline.to('.plate-experience .callout-node', { scale: 0, duration: 0.02, ease: 'power2.in' }, 0.744);
      timeline.to('.plate-experience .callout', { y: -24, opacity: 0, duration: 0.03, stagger: 0.006, ease: 'power2.in' }, 0.745);
      timeline.to('.plate-experience .plate-head', { y: -24, opacity: 0, duration: 0.03, ease: 'power2.in' }, 0.748);
      timeline.to('.plate-experience .plate-coordinates', { y: -10, opacity: 0, duration: 0.025, ease: 'power2.in' }, 0.75);
      timeline.to('.plate-experience .scale-rail', { scaleX: 0, duration: 0.03, ease: 'power2.in' }, 0.752);
      timeline.to('.plate-experience .scale-tick-item', { opacity: 0, y: 10, duration: 0.025, ease: 'power2.in' }, 0.752);
      // Experience artwork smoothly drifts left with depth parallax
      timeline.to('.plate-experience .plate-art', { xPercent: -12, scale: 0.97, opacity: 0, duration: 0.045, ease: 'power2.inOut' }, 0.748);
      timeline.to('.plate-experience .plate-frame', { opacity: 0, duration: 0.03, ease: 'power2.in' }, 0.76);
      timeline.set('.plate-experience', { visibility: 'hidden' }, 0.775);

      /* ——— PLATE 8 · SKILLS (0.755 enter, hold 0.78 – 0.87) ——— */
      // 2. Skills plate smoothly enters from right with overlapping arrival
      timeline.set('.plate-skills', { visibility: 'visible' }, 0.752);
      timeline.fromTo('.plate-skills', { opacity: 0 }, { opacity: 1, duration: 0.03, ease: 'power2.out' }, 0.752);
      timeline.fromTo('.plate-skills .plate-art', { xPercent: 12, scale: 1.04, opacity: 0 }, { xPercent: 0, scale: 1, opacity: 1, duration: 0.055, ease: 'power2.out' }, 0.752);
      timeline.fromTo('.plate-skills .plate-frame', { scale: 0.98, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.04, ease: 'power2.out' }, 0.758);
      timeline.fromTo('.plate-skills .drafting-cross', { scale: 0, opacity: 0 }, { scale: 1, opacity: 0.7, duration: 0.03, stagger: 0.005, ease: 'back.out(2)' }, 0.762);
      timeline.fromTo('.plate-skills .plate-coordinates', { y: -10, opacity: 0 }, { y: 0, opacity: 0.8, duration: 0.03, ease: 'power2.out' }, 0.764);
      timeline.fromTo('.plate-skills .plate-head', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.045, ease: 'power3.out' }, 0.766);

      // 3. Staggered cascade of 6 Skills domains
      LEGEND_OFFSETS.forEach((off, i) => {
        const t = 0.765 + off;
        timeline.fromTo(`.plate-skills .legend-row-${i + 1}`, { x: -28, opacity: 0 }, { x: 0, opacity: 1, duration: 0.035, ease: 'power3.out' }, t);
        timeline.fromTo(`.plate-skills .legend-row-${i + 1} .legend-leader`, { scaleX: 0 }, { scaleX: 1, duration: 0.025, ease: 'power2.out' }, t + 0.008);
      });

      // 4. Certifications & accreditation seal
      timeline.fromTo('.plate-skills .plate-notes', { y: 28, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.045, ease: 'power3.out' }, 0.81);

      /* ——— SKILLS TO FINALE SEAMLESS TRANSITION (0.875 – 0.91) ——— */
      // Retract skills content
      timeline.to('.plate-skills .legend-row', { x: 20, opacity: 0, duration: 0.03, stagger: 0.005, ease: 'power2.in' }, 0.875);
      timeline.to('.plate-skills .plate-notes', { y: -20, opacity: 0, duration: 0.03, ease: 'power2.in' }, 0.88);
      timeline.to('.plate-skills .plate-head', { y: -24, opacity: 0, duration: 0.03, ease: 'power2.in' }, 0.882);
      timeline.to('.plate-skills .plate-coordinates', { y: -10, opacity: 0, duration: 0.025, ease: 'power2.in' }, 0.884);
      timeline.to('.plate-skills .plate-art', { xPercent: -10, scale: 0.97, opacity: 0, duration: 0.045, ease: 'power2.inOut' }, 0.882);
      timeline.to('.plate-skills .plate-frame', { opacity: 0, duration: 0.03, ease: 'power2.in' }, 0.89);
      timeline.set('.plate-skills', { visibility: 'hidden' }, 0.905);

      /* ——— PLATE 9 · FINALE (0.885 enter, holds to end) ——— */
      timeline.set('.plate-finale', { visibility: 'visible' }, 0.885);
      timeline.fromTo('.plate-finale', { opacity: 0 }, { opacity: 1, duration: 0.035, ease: 'power2.out' }, 0.885);
      timeline.fromTo('.plate-finale .plate-art', { scale: 1.02, opacity: 0 }, { scale: 1.12, opacity: 1, duration: 0.09, ease: 'power1.out' }, 0.885);
      timeline.fromTo('.plate-finale .plate-frame', { scale: 0.98, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.04, ease: 'power2.out' }, 0.89);
      timeline.fromTo('.plate-finale .drafting-cross', { scale: 0, opacity: 0 }, { scale: 1, opacity: 0.7, duration: 0.03, stagger: 0.005, ease: 'back.out(2)' }, 0.894);
      timeline.fromTo('.plate-finale .plate-kicker', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.035, ease: 'power3.out' }, 0.898);
      timeline.fromTo('.plate-finale .finale-huge', { y: 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.045, ease: 'power3.out' }, 0.902);
      timeline.fromTo('.plate-finale .finale-name', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.04, ease: 'power3.out' }, 0.91);
      timeline.fromTo('.plate-finale .finale-invite', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.04, ease: 'power3.out' }, 0.918);
      timeline.fromTo('.plate-finale .finale-cta', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.04, ease: 'power3.out' }, 0.926);

      ScrollTrigger.refresh();
    }, stage);

    return () => context.revert();
  }, [track, stage, world, started, mobile, reducedMotion, onProgress]);

  useLayoutEffect(() => {
    if (!started || reducedMotion || !stage.current) return;
    const context = gsap.context(() => {
      gsap.timeline()
        .to(world.current, { entrance: 1, duration: 1.2, ease: 'power3.out' }, 0)
        .fromTo('.intro-eyebrow', { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.7, ease: 'power2.out' }, 0.08)
        .fromTo('.name-line > span', { yPercent: 112, y: 0 }, { yPercent: 0, y: 0, duration: 1.05, stagger: 0.095, ease: 'power4.out' }, 0.15)
        .fromTo('.intro-bottom', { y: 24, clipPath: 'inset(0 0 100% 0)' }, { y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.85, ease: 'power3.out' }, 0.42);
    }, stage);
    return () => context.revert();
  }, [started, reducedMotion, stage, world]);
}
