import { lazy, Suspense, useEffect, useRef, type MutableRefObject, type RefObject } from 'react';
import { WorldBoundary } from '../three/WorldBoundary';
import IntroScene from './IntroScene';
import { BoostAct, FastSendAct, SivoAct } from './Acts';
import { ExperiencePlate, FinalePlate, SkillsPlate } from './Plates';
import NarrativePanels from '../narrative/NarrativePanels';
import { useNarrative } from '../../lib/useNarrative';
import type { WorldState } from '../../lib/story';

const WorldCanvas = lazy(() => import('../three/WorldCanvas'));

type Props = {
  world: MutableRefObject<WorldState>;
  track: RefObject<HTMLDivElement | null>;
  started: boolean;
  mobile: boolean;
  reducedMotion: boolean;
  illustrationMode: boolean;
  paused: boolean;
  activeChapter: number;
  discovered: boolean;
  onReady: () => void;
  onFailure: () => void;
  onProgress: (progress: number) => void;
  onSpark: () => void;
  onHover: (label: string | null) => void;
  onNavigate: (progress: number) => void;
  onContact: () => void;
  onOpenProject?: (id: string) => void;
};

function Illustration({ className = '' }: { className?: string }) {
  return <div className={`world-fallback ${className}`}><img src="/images/makers-room.jpg" alt="An original illustrated maker's room: a workbench, an orange doorway, and a spark of an idea, all built on a notebook" /></div>;
}

export default function Experience(props: Props) {
  const stage = useRef<HTMLDivElement>(null);
  useNarrative({ track: props.track, stage, world: props.world, started: props.started, mobile: props.mobile, reducedMotion: props.reducedMotion, onProgress: props.onProgress });

  useEffect(() => {
    if (props.reducedMotion || props.illustrationMode) props.onReady();
  }, [props.reducedMotion, props.illustrationMode, props.onReady]);

  useEffect(() => {
    if (!props.reducedMotion) return;
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const progress = Number((visible.target as HTMLElement).dataset.progress ?? 0);
      props.onProgress(progress);
    }, { threshold: [0.15, 0.4, 0.7] });
    document.querySelectorAll('.reading-section').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [props.reducedMotion, props.onProgress]);

  if (props.reducedMotion) return <main key="reading" className="reading-experience" ref={props.track} id="story" inert={!props.started}>
    <section className="reading-section reading-intro" id="beginning" data-progress="0">
      <Illustration />
      <IntroScene reading onBegin={() => props.onNavigate(0.15)} onSpark={props.onSpark} discovered={props.discovered} />
    </section>
    <section className="reading-section reading-panels" id="a-thought-takes-shape" data-progress="0.18"><NarrativePanels reading /></section>
    <section className="reading-section reading-act" id="fast-send" data-progress="0.35"><FastSendAct reading onOpenProject={props.onOpenProject} /></section>
    <section className="reading-section reading-act" id="sivo" data-progress="0.48"><SivoAct reading onOpenProject={props.onOpenProject} /></section>
    <section className="reading-section reading-act" id="boostwork" data-progress="0.61"><BoostAct reading onOpenProject={props.onOpenProject} /></section>
    <section className="reading-section reading-plate" id="experience" data-progress="0.71"><ExperiencePlate reading /></section>
    <section className="reading-section reading-plate" id="skills" data-progress="0.82"><SkillsPlate reading /></section>
    <section className="reading-section reading-plate reading-finale" id="finale" data-progress="0.95">
      <FinalePlate reading onContact={props.onContact} onRestart={() => props.onNavigate(0)} />
    </section>
  </main>;

  const sceneClass = props.activeChapter >= 7 ? 'is-finale' : props.activeChapter >= 1 ? 'is-transition' : '';
  return <main key="cinematic" className="story-track" ref={props.track} id="story" inert={!props.started}>
    <div className={`story-stage ${sceneClass}`} ref={stage}>
      <div className="world-wrap" aria-hidden="true">
        {props.illustrationMode ? <Illustration /> : <WorldBoundary onFailure={props.onFailure} fallback={<Illustration />}>
          <Suspense fallback={<Illustration />}>
            {/* Chapters 5–7 (Experience, Skills, Finale) are opaque plates, so the 3D loop sleeps */}
            <WorldCanvas world={props.world} mobile={props.mobile} reducedMotion={false} paused={props.paused || props.activeChapter >= 5} onReady={props.onReady} onFailure={props.onFailure} onSpark={props.onSpark} onDoor={() => props.onNavigate(0.15)} onHover={props.onHover} />
          </Suspense>
        </WorldBoundary>}
      </div>
      <div className="intro-scene" inert={props.activeChapter !== 0}>
        <IntroScene onBegin={() => props.onNavigate(0.15)} onSpark={props.onSpark} discovered={props.discovered} />
      </div>
      <NarrativePanels />
      <FastSendAct onOpenProject={props.onOpenProject} />
      <SivoAct onOpenProject={props.onOpenProject} />
      <BoostAct onOpenProject={props.onOpenProject} />
      <div className="drafting-curtain" aria-hidden="true">
        <div className="curtain-inner">
          <div className="curtain-meta-top">
            <span>LOC: 33.68&deg; N / 73.04&deg; E</span>
            <span>SECTION 02 &middot; ARCHITECTURAL FOLIO</span>
          </div>
          <div className="curtain-center">
            <span className="curtain-rule" />
            <span className="curtain-label">UNROLLING SPECIFICATION BLUEPRINT</span>
            <span className="curtain-rule" />
          </div>
          <div className="curtain-meta-bottom">
            <span>SCALE: 1:1 FIELD SYSTEM</span>
            <span>SPEC: ARCH-EXP-07</span>
          </div>
        </div>
      </div>
      <ExperiencePlate />
      <SkillsPlate />
      <FinalePlate onContact={props.onContact} onRestart={() => props.onNavigate(0)} active={props.activeChapter >= 7} />
      <div className="discovery-feedback" role="status">{props.discovered ? 'A little curiosity opens new doors.' : ''}</div>
    </div>
  </main>;
}
