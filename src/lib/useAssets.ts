import { useCallback, useEffect, useRef, useState } from 'react';

const ASSETS = ['display-font', 'body-font', 'mono-font', 'illustration', 'world'] as const;

export function useAssets() {
  const completed = useRef(new Set<string>());
  const [count, setCount] = useState(0);
  const markLoaded = useCallback((asset: string) => {
    if (completed.current.has(asset)) return;
    completed.current.add(asset);
    setCount(completed.current.size);
  }, []);

  useEffect(() => {
    let alive = true;
    const mark = (name: string) => { if (alive) markLoaded(name); };
    const image = new Image();
    image.src = '/images/makers-room.jpg';
    const imagePromise = typeof image.decode === 'function' ? image.decode() : new Promise<void>((resolve) => {
      image.onload = () => resolve();
      image.onerror = () => resolve();
    });
    imagePromise.catch(() => undefined).then(() => mark('illustration'));

    const fonts = [
      ['display-font', '600 24px "Barlow Condensed"'],
      ['body-font', '400 16px "DM Sans"'],
      ['mono-font', '400 12px "IBM Plex Mono"'],
    ];
    fonts.forEach(([name, face]) => {
      document.fonts.load(face).catch(() => []).then(() => mark(name));
    });
    return () => { alive = false; };
  }, [markLoaded]);

  return {
    progress: Math.round((count / ASSETS.length) * 100),
    ready: count === ASSETS.length,
    markLoaded,
  };
}