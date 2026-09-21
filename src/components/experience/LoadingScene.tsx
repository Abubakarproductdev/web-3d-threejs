import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { DoorIcon } from '../ui/Icons';

export default function LoadingScene({ progress, ready, reducedMotion, onComplete }: {
  progress: number; ready: boolean; reducedMotion: boolean; onComplete: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ready) return;
    if (reducedMotion) { onComplete(); return; }
    const context = gsap.context(() => {
      gsap.timeline({ onComplete })
        .to('.loading-content', { y: -36, clipPath: 'inset(0 0 100% 0)', duration: 0.3, ease: 'power2.in' })
        .to('.loading-curtain', { yPercent: -101, stagger: 0.07, duration: 0.78, ease: 'power4.inOut' }, 0.12);
    }, root);
    return () => context.revert();
  }, [ready, onComplete, reducedMotion]);

  return <div className="loading-scene" ref={root} role="status" aria-live="polite" aria-label={`Preparing the experience: ${progress} percent`}>
    <div className="loading-curtain" /><div className="loading-curtain" /><div className="loading-curtain" />
    <div className="loading-content">
      <span className="loading-kicker">A NEW PERSPECTIVE</span>
      <DoorIcon className="loading-door" />
      <p>A little curiosity.<br />A world of possibility.</p>
      <div className="loading-progress"><span style={{ transform: `scaleX(${progress / 100})` }} /></div>
      <div className="loading-caption"><span>PREPARING THE ROOM</span><span>{String(progress).padStart(2, '0')}%</span></div>
    </div>
  </div>;
}