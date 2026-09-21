import { useCallback, useEffect, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Color, Fog, MathUtils, Vector3, type PerspectiveCamera } from 'three';
import MakersRoom from './MakersRoom';
import JourneyWorld from './JourneyWorld';
import { InkProvider } from './InkPrimitives';
import { PALETTE, type WorldState } from '../../lib/story';

type Props = {
  world: MutableRefObject<WorldState>;
  mobile: boolean;
  reducedMotion: boolean;
  paused: boolean;
  onReady: () => void;
  onFailure: () => void;
  onSpark: () => void;
  onDoor: () => void;
  onHover: (label: string | null) => void;
};

// Camera rest stops sit at the CENTER of each chapter's reading hold.
// Between stops we use smootherstep — almost flat at both ends — so the camera
// is effectively still while copy is on screen, and only glides in the gaps.
type Stop = { j: number; tx: number; ty: number; tz: number; ox: number; oy: number; oz: number };
const STOPS: Stop[] = [
  { j: 0.0, tx: 13.2, ty: 1.7, tz: 0.2, ox: 9.2, oy: 6.4, oz: 11 },
  { j: 0.5, tx: 55.2, ty: 1.8, tz: 0.5, ox: 9.2, oy: 6.2, oz: 10.6 },
  { j: 1.0, tx: 97.2, ty: 1.7, tz: 0.2, ox: 9.2, oy: 6.5, oz: 11 },
];

const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

function sampleStops(j: number) {
  const c = Math.max(0, Math.min(1, j));
  for (let i = 0; i < STOPS.length - 1; i++) {
    const a = STOPS[i];
    const b = STOPS[i + 1];
    if (c >= a.j && c <= b.j) {
      const t = (c - a.j) / Math.max(0.0001, b.j - a.j);
      const e = smootherstep(t);
      return {
        tx: MathUtils.lerp(a.tx, b.tx, e),
        ty: MathUtils.lerp(a.ty, b.ty, e),
        tz: MathUtils.lerp(a.tz, b.tz, e),
        ox: MathUtils.lerp(a.ox, b.ox, e),
        oy: MathUtils.lerp(a.oy, b.oy, e),
        oz: MathUtils.lerp(a.oz, b.oz, e),
      };
    }
  }
  const last = STOPS[STOPS.length - 1];
  return { tx: last.tx, ty: last.ty, tz: last.tz, ox: last.ox, oy: last.oy, oz: last.oz };
}

function CameraDirector({ world, mobile, reducedMotion, onReady, onFailure }: Pick<Props, 'world' | 'mobile' | 'reducedMotion' | 'onReady' | 'onFailure'>) {
  const { camera, gl, scene, setDpr, invalidate } = useThree();
  const target = useRef(new Vector3());
  const position = useRef(new Vector3());
  const ready = useRef(false);
  const measurements = useRef({ frames: 0, total: 0, adapted: false });
  const color = useRef(new Color(PALETTE.paper));

  useEffect(() => {
    let active = true;
    async function prepareWorld() {
      try {
        await gl.compileAsync(scene, camera);
      } catch {
        if (!active) return;
        try { gl.compile(scene, camera); }
        catch { if (active) onFailure(); return; }
      }
      if (active) { ready.current = true; onReady(); invalidate(); }
    }
    void prepareWorld();
    return () => { active = false; };
  }, [gl, scene, camera, onReady, onFailure, invalidate]);

  useFrame((state, delta) => {
    const w = world.current;
    const pointer = reducedMotion ? 0 : 1;
    if (w.progress < 0.26) {
      // ACT 1 — original opening choreography at Maker's room
      const back = w.cameraReturn;
      const push = w.cameraPush * (1 - back);
      const tx = mobile ? 0.08 : MathUtils.lerp(-3.05, -0.25, push);
      const ty = mobile ? MathUtils.lerp(2.65, 3.85, back) : MathUtils.lerp(1.15, 1.5, push);
      const tz = mobile ? 0.2 : MathUtils.lerp(1.95, 0.25, push);

      if (w.progress >= 0.245) {
        // While panel-purpose zooms over the viewport, seamlessly blend camera to Fast Send
        const t = MathUtils.clamp((w.progress - 0.245) / 0.015, 0, 1);
        const ease = t * t * (3 - 2 * t);
        const fastStop = STOPS[0];
        target.current.set(
          MathUtils.lerp(tx + w.pointerX * 0.10 * pointer, fastStop.tx + w.pointerX * 0.12 * pointer, ease),
          MathUtils.lerp(ty + w.pointerY * 0.07 * pointer, fastStop.ty + w.pointerY * 0.08 * pointer, ease),
          MathUtils.lerp(tz, fastStop.tz, ease),
        );
        const zoomOut = mobile ? 1.22 : 1;
        const act1Tx = tx + w.pointerX * 0.10 * pointer;
        const act1Ty = ty + w.pointerY * 0.07 * pointer;
        const act1Tz = tz;
        const act1Pos = new Vector3(
          act1Tx + MathUtils.lerp(10, 7.2, push) * (mobile ? MathUtils.lerp(1.16, 1.24, back) : 1) + w.pointerX * 0.21 * pointer,
          act1Ty + MathUtils.lerp(8, 5.8, push) * (mobile ? MathUtils.lerp(1.16, 1.24, back) : 1),
          act1Tz + MathUtils.lerp(13, 9.4, push) * (mobile ? MathUtils.lerp(1.16, 1.24, back) : 1),
        );
        const act2Pos = new Vector3(
          fastStop.tx + fastStop.ox * zoomOut + w.pointerX * 0.24 * pointer,
          fastStop.ty + fastStop.oy * zoomOut,
          fastStop.tz + fastStop.oz * zoomOut,
        );
        position.current.lerpVectors(act1Pos, act2Pos, ease);
      } else {
        target.current.set(tx + w.pointerX * 0.10 * pointer, ty + w.pointerY * 0.07 * pointer, tz);
        const zoomOut = mobile ? MathUtils.lerp(1.16, 1.24, back) : 1;
        position.current.set(
          target.current.x + MathUtils.lerp(10, 7.2, push) * zoomOut + w.pointerX * 0.21 * pointer,
          target.current.y + MathUtils.lerp(8, 5.8, push) * zoomOut,
          target.current.z + MathUtils.lerp(13, 9.4, push) * zoomOut,
        );
      }
    } else {
      // ACT 2 — Projects (Fast Send -> SIVO -> BoostWork)
      const s = sampleStops(w.journey);
      const sway = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.3) * 0.12;
      target.current.set(
        s.tx + w.pointerX * 0.12 * pointer,
        s.ty + w.pointerY * 0.08 * pointer,
        s.tz,
      );
      const zoomOut = mobile ? 1.22 : 1;
      position.current.set(
        target.current.x + s.ox * zoomOut + w.pointerX * 0.24 * pointer,
        target.current.y + s.oy * zoomOut,
        target.current.z + s.oz * zoomOut + sway,
      );
    }
    camera.position.copy(position.current);
    camera.lookAt(target.current);
    const perspective = camera as PerspectiveCamera;
    let targetFov = mobile ? 45 : 34;
    if (w.progress >= 0.26 && w.progress < 0.638) {
      // Warp 1: journey from 0.04 to 0.46 (Fast Send -> SIVO)
      // Warp 2: journey from 0.54 to 0.96 (SIVO -> BoostWork)
      const warp1 = Math.sin(Math.PI * Math.min(1, Math.max(0, (w.journey - 0.04) / 0.42)));
      const warp2 = Math.sin(Math.PI * Math.min(1, Math.max(0, (w.journey - 0.54) / 0.42)));
      const warp = Math.max(warp1, warp2);
      targetFov += warp * (mobile ? 12 : 16);
    }
    if (Math.abs(perspective.fov - targetFov) > 0.05) {
      perspective.fov = MathUtils.lerp(perspective.fov, targetFov, Math.min(1, delta * 14));
      perspective.updateProjectionMatrix();
    }
    const orange = w.progress >= 0.245 && w.progress < 0.638;
    color.current.set(orange ? PALETTE.orange : PALETTE.paper);
    scene.background = color.current;
    if (orange) {
      if (!scene.fog) scene.fog = new Fog(PALETTE.orange, 22, 46);
    } else {
      if (scene.fog) scene.fog = null;
    }

    const metrics = measurements.current;
    if (ready.current && !metrics.adapted && delta < 0.15) {
      metrics.frames += 1;
      metrics.total += delta;
      if (metrics.frames >= 100) {
        if (metrics.total / metrics.frames > 1 / 38) setDpr(1);
        metrics.adapted = true;
      }
    }
  });
  return null;
}

function ContextGuard({ onFailure }: { onFailure: () => void }) {
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    gl.domElement.addEventListener('webglcontextlost', lost);
    return () => gl.domElement.removeEventListener('webglcontextlost', lost);
  }, [gl, onFailure]);
  return null;
}

export default function WorldCanvas(props: Props) {
  const rendererReady = useRef(false);
  const notifyReady = useCallback(() => {
    rendererReady.current = true;
    props.onReady();
  }, [props.onReady]);

  useEffect(() => {
    const watchdog = window.setTimeout(() => {
      if (!rendererReady.current) props.onFailure();
    }, 10000);
    return () => window.clearTimeout(watchdog);
  }, [props.onFailure]);

  return <Canvas
    className="world-canvas"
    dpr={[1, props.mobile ? 1.25 : 1.5]}
    camera={{ position: [6.95, 9.15, 14.95], fov: 34, near: 0.1, far: 160 }}
    gl={{ antialias: !props.mobile, alpha: false, powerPreference: props.mobile ? 'low-power' : 'high-performance' }}
    flat
    frameloop={props.paused || props.reducedMotion ? 'demand' : 'always'}
    fallback={<span>An illustrated 3D maker's room. A reading alternative is available in the story index.</span>}
    onCreated={({ gl }) => { gl.setClearColor(PALETTE.paper, 1); }}
  >
    <color attach="background" args={[PALETTE.paper]} />
    <ambientLight intensity={0.4} />
    <directionalLight position={[-3, 9, 6]} intensity={1.2} />
    <CameraDirector world={props.world} mobile={props.mobile} reducedMotion={props.reducedMotion} onReady={notifyReady} onFailure={props.onFailure} />
    <ContextGuard onFailure={props.onFailure} />
    <InkProvider>
      <MakersRoom world={props.world} reducedMotion={props.reducedMotion} onSpark={props.onSpark} onDoor={props.onDoor} onHover={props.onHover} />
      <JourneyWorld world={props.world} reducedMotion={props.reducedMotion} mobile={props.mobile} onHover={props.onHover} />
    </InkProvider>
  </Canvas>;
}
