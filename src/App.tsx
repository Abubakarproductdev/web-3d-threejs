import { useCallback, useEffect, useRef, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import gsap from 'gsap';
import '@fontsource/barlow-condensed/latin-600.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/ibm-plex-mono/latin-400.css';
import ProjectDetailPage from './components/projects/ProjectDetailPage';
import Experience from './components/experience/Experience';
import LoadingScene from './components/experience/LoadingScene';
import StoryDialog from './components/navigation/StoryDialog';
import CustomCursor from './components/ui/CustomCursor';
import { useAudio } from './components/audio/useAudio';
import { chapters, initialWorldState } from './lib/story';
import { useAssets } from './lib/useAssets';
import { useMediaQuery } from './lib/useMediaQuery';
import { getPreference, setPreference } from './lib/preferences';
import { supportsWebGL } from './lib/webgl';
import { releaseNarrativePin } from './lib/useNarrative';

const CHAPTER_CUTS = [0.15, 0.30, 0.43, 0.55, 0.64, 0.77, 0.91];

const INSTRUCTIONS = [
  'MOVE YOUR CURSOR. FIND THE SPARK.',
  'ONE THOUGHT BECOMES ANOTHER.',
  'SCAN. SMILE. DELIVERED.',
  'SIGNS BECOME SPEECH.',
  'DRAFT. DATA. DIRECTION.',
  'LEARN. SECURE. SHIP.',
  'SIX TRADES. ONE CRAFT.',
  'THE NEXT IDEA COULD BE YOURS.',
];

function chapterIndexFor(value: number) {
  for (let i = 0; i < CHAPTER_CUTS.length; i++) {
    if (value < CHAPTER_CUTS[i]) return i;
  }
  return CHAPTER_CUTS.length;
}

function chapterIdFor(value: number) {
  if (value <= 0) return chapters[0].id;
  let id = chapters[0].id;
  chapters.forEach((c) => { if (value >= c.progress - 0.02) id = c.id; });
  return id;
}

export default function App() {
  const mobile = useMediaQuery('(max-width: 760px), (max-width: 1100px) and (max-aspect-ratio: 1/1)');
  const coarsePointer = useMediaQuery('(pointer: coarse)');
  const systemReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [reducedMotion, setReducedMotion] = useState(() => getPreference('reduced-motion', window.matchMedia('(prefers-reduced-motion: reduce)').matches) || new URLSearchParams(window.location.search).get('motion') === 'reduced');
  const [webglAvailable, setWebglAvailable] = useState(supportsWebGL);
  const [illustrationMode, setIllustrationMode] = useState(() => !supportsWebGL() || getPreference('illustration') || new URLSearchParams(window.location.search).get('view') === 'illustration');
  const [started, setStarted] = useState(false);
  const [activeChapter, setActiveChapter] = useState(0);
  const [modal, setModal] = useState<'index' | 'contact' | null>(null);
  const [activeProject, setActiveProject] = useState<string | null>(() => {
    const hash = window.location.hash;
    const match = hash.match(/#\/project\/([a-z0-9-]+)/);
    return match ? match[1] : null;
  });
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [discovered, setDiscovered] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const world = useRef(initialWorldState());
  const track = useRef<HTMLDivElement>(null);
  const chapter = useRef(0);
  const discoveredRef = useRef(false);
  const { progress, ready, markLoaded } = useAssets();
  const { director, soundOn, toggle: toggleSound, audioError } = useAudio();

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash;
      const match = hash.match(/#\/project\/([a-z0-9-]+)/);
      setActiveProject(match ? match[1] : null);
    };
    window.addEventListener('hashchange', onHashChange);
    window.addEventListener('popstate', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
      window.removeEventListener('popstate', onHashChange);
    };
  }, []);

  useEffect(() => {
    if (!getPreference('motion-chosen') && new URLSearchParams(window.location.search).get('motion') !== 'reduced' && reducedMotion !== systemReducedMotion) {
      releaseNarrativePin();
      setReducedMotion(systemReducedMotion);
    }
  }, [systemReducedMotion, reducedMotion]);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    if (coarsePointer || reducedMotion || modal) return;
    const x = gsap.quickTo(world.current, 'pointerX', { duration: 0.85, ease: 'power3.out' });
    const y = gsap.quickTo(world.current, 'pointerY', { duration: 0.85, ease: 'power3.out' });
    const move = (event: PointerEvent) => {
      x((event.clientX / window.innerWidth - 0.5) * 2);
      y(-(event.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => { window.removeEventListener('pointermove', move); x.tween.kill(); y.tween.kill(); };
  }, [coarsePointer, reducedMotion, modal]);

  useEffect(() => {
    const state = world.current;
    return () => { gsap.killTweensOf(state); };
  }, []);

  const onWorldReady = useCallback(() => markLoaded('world'), [markLoaded]);
  const onWorldFailure = useCallback(() => { setIllustrationMode(true); setWebglAvailable(false); markLoaded('world'); }, [markLoaded]);
  const onLoadingComplete = useCallback(() => setStarted(true), []);
  const closeModal = useCallback(() => setModal(null), []);
  const openContact = useCallback(() => { setHoverLabel(null); setModal('contact'); }, []);

  const onProgress = useCallback((value: number) => {
    world.current.progress = value;
    document.documentElement.style.setProperty('--story-progress', String(value));
    // Orange covers the entire project phase (from "Make it useful" through BoostWork).
    const orange = value >= 0.245 && value < 0.638;
    document.documentElement.dataset.scene = orange ? 'orange' : 'paper';
    const index = chapterIndexFor(value);
    if (chapter.current !== index) { chapter.current = index; setActiveChapter(index); setHoverLabel(null); }
    director.current.setProgress(value);
  }, [director]);

  const openProject = useCallback((id: string) => {
    window.location.hash = `/project/${id}`;
    setActiveProject(id);
  }, []);

  const closeProject = useCallback(() => {
    if (window.location.hash.startsWith('#/project')) {
      history.pushState(null, '', window.location.pathname + window.location.search);
    }
    setActiveProject(null);
  }, []);

  const navigate = useCallback((value: number) => {
    setModal(null);
    setHoverLabel(null);
    requestAnimationFrame(() => {
      if (reducedMotion) {
        document.getElementById(chapterIdFor(value))?.scrollIntoView({ behavior: 'auto', block: 'start' });
      } else if (track.current) {
        const top = track.current.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: top + value * (track.current.offsetHeight - window.innerHeight), behavior: 'smooth' });
      }
    });
  }, [reducedMotion]);

  const touchSpark = useCallback(() => {
    const next = !discoveredRef.current;
    discoveredRef.current = next;
    setDiscovered(next);
    gsap.to(world.current, { spark: next ? 1 : 0, duration: reducedMotion ? 0 : 1.15, ease: 'power3.inOut', overwrite: 'auto' });
    director.current.cue('spark');
  }, [reducedMotion, director]);

  const toggleMotion = useCallback(() => {
    const next = !reducedMotion;
    setPreference('motion-chosen', true);
    setPreference('reduced-motion', next);
    releaseNarrativePin();
    setReducedMotion(next);
    onProgress(0);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  }, [reducedMotion, onProgress]);

  const toggleIllustration = useCallback(() => {
    if (!webglAvailable) return;
    const next = !illustrationMode;
    setPreference('illustration', next);
    setIllustrationMode(next);
  }, [webglAvailable, illustrationMode]);

  const instruction = activeChapter === 0
    ? (discovered ? 'CURIOSITY OPENS NEW DOORS.' : coarsePointer ? 'TOUCH THE ORANGE SPARK.' : INSTRUCTIONS[0])
    : INSTRUCTIONS[Math.min(activeChapter, INSTRUCTIONS.length - 1)];

  return <div className={`portfolio-app${started ? ' has-started' : ''}${reducedMotion ? ' reduced-motion' : ''}`} aria-busy={!started}>
    <a href="#story" className="skip-link" onClick={(event) => { event.preventDefault(); navigate(0.95); }}>Skip to the finale</a>
    <header className="site-header" inert={!started || activeProject !== null}>
      <button className="brand-mark" onClick={() => navigate(0)} aria-label="Muhammad Abubakar, back to the beginning">ma<span>.</span></button>
      <span className="header-caption">A BUILDER'S PERSPECTIVE</span>
      <button className="index-button" onClick={() => { setHoverLabel(null); setModal('index'); }}>INDEX<span className="menu-lines" aria-hidden="true"><i /><i /></span></button>
    </header>

    <Experience world={world} track={track} started={started} mobile={mobile} reducedMotion={reducedMotion} illustrationMode={illustrationMode} paused={hidden || modal !== null || activeProject !== null} activeChapter={activeChapter} discovered={discovered} onReady={onWorldReady} onFailure={onWorldFailure} onProgress={onProgress} onSpark={touchSpark} onHover={setHoverLabel} onNavigate={navigate} onContact={openContact} onOpenProject={openProject} />

    <footer className="experience-controls" inert={!started || activeProject !== null}>
      <p className="interaction-instruction" aria-live="polite">{instruction}</p>
      <button className={`sound-button${soundOn ? ' is-playing' : ''}`} onClick={toggleSound} aria-pressed={soundOn} aria-label={soundOn ? 'Turn ambient sound off' : 'Turn ambient sound on'}>
        <span className="sound-bars" aria-hidden="true"><i /><i /><i /><i /><i /></span>
        <span>{audioError ? 'AUDIO UNAVAILABLE' : soundOn ? 'SOUND ON' : 'SOUND OFF'}</span>
      </button>
    </footer>

    <CustomCursor label={hoverLabel} enabled={!coarsePointer && !reducedMotion && !modal && !activeProject} />
    {modal && <StoryDialog view={modal} onClose={closeModal} onNavigate={navigate} onContact={openContact} reducedMotion={reducedMotion} onToggleMotion={toggleMotion} illustrationMode={illustrationMode} onToggleIllustration={toggleIllustration} webglAvailable={webglAvailable} />}
    {activeProject && <ProjectDetailPage projectId={activeProject} onBack={closeProject} onSelectProject={openProject} />}
    {!started && <LoadingScene progress={progress} ready={ready} reducedMotion={reducedMotion} onComplete={onLoadingComplete} />}
    <Analytics />
  </div>;
}
