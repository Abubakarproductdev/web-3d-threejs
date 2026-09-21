import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor({ label, enabled }: { label: string | null; enabled: boolean }) {
  const cursor = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!enabled || !cursor.current) return;
    const x = gsap.quickTo(cursor.current, 'x', { duration: 0.18, ease: 'power3.out' });
    const y = gsap.quickTo(cursor.current, 'y', { duration: 0.18, ease: 'power3.out' });
    const move = (event: PointerEvent) => { x(event.clientX + 16); y(event.clientY - 60); };
    window.addEventListener('pointermove', move, { passive: true });
    return () => { window.removeEventListener('pointermove', move); x.tween.kill(); y.tween.kill(); };
  }, [enabled]);
  return <div ref={cursor} className={`custom-cursor${enabled && label ? ' is-active' : ''}`} aria-hidden="true">{label}</div>;
}