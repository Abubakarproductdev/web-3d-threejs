import { useCallback, useEffect, useRef, useState } from 'react';
import { AudioDirector } from './AudioDirector';
import { getPreference, setPreference } from '../../lib/preferences';

export function useAudio() {
  const director = useRef(new AudioDirector());
  const [soundOn, setSoundOn] = useState(() => getPreference('sound'));
  const [audioError, setAudioError] = useState(false);
  const enabled = useRef(soundOn);

  const start = useCallback(() => {
    director.current.enable().catch(() => {
      enabled.current = false;
      setPreference('sound', false);
      setSoundOn(false);
      setAudioError(true);
    });
  }, []);

  useEffect(() => {
    if (!soundOn) { director.current.disable(); return; }
    const onGesture = () => { start(); };
    window.addEventListener('pointerdown', onGesture, { once: true });
    window.addEventListener('keydown', onGesture, { once: true });
    return () => {
      window.removeEventListener('pointerdown', onGesture);
      window.removeEventListener('keydown', onGesture);
    };
  }, [soundOn, start]);

  useEffect(() => {
    const engine = director.current;
    const visibility = () => document.hidden ? engine.suspend() : engine.resume();
    document.addEventListener('visibilitychange', visibility);
    return () => { document.removeEventListener('visibilitychange', visibility); engine.dispose(); };
  }, []);

  const toggle = useCallback(() => {
    const next = !enabled.current;
    enabled.current = next;
    setSoundOn(next);
    setAudioError(false);
    setPreference('sound', next);
    if (next) start(); else director.current.disable();
  }, [start]);

  return { director, soundOn, toggle, audioError };
}