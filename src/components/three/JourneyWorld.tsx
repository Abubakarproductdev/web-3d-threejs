import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Group } from 'three';
import { InkBox, InkCylinder, InkSphere, useInk } from './InkPrimitives';
import type { WorldState } from '../../lib/story';

type Props = {
  world: MutableRefObject<WorldState>;
  reducedMotion: boolean;
  mobile: boolean;
  onHover: (label: string | null) => void;
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

function IslandBase({ x, w = 7.6, d = 5.8, z = 0 }: { x: number; w?: number; d?: number; z?: number }) {
  return <group position={[x, 0, z]}>
    <InkBox position={[0.3, -0.645, 0.1]} size={[w + 0.1, 0.025, d + 0.1]} color="ink" outline={false} />
    <InkBox position={[0, -0.565, 0]} size={[w, 0.07, d]} color="orange" />
    <InkBox position={[0, -0.49, 0]} size={[w - 0.14, 0.068, d - 0.13]} />
    <InkBox position={[0, -0.42, 0]} size={[w - 0.14, 0.068, d - 0.13]} />
    <InkBox position={[0, 0.047, 0]} size={[w, 0.105, d]} />
  </group>;
}

function QrGate({ onHover }: { onHover: Props['onHover'] }) {
  const ink = useInk();
  const cells = useMemo(() => {
    const pattern = [
      '1111011', '1000010', '1011011', '1001010', '1011101', '1000001', '1111110',
    ];
    const out: { x: number; z: number; orange: boolean }[] = [];
    pattern.forEach((row, r) =>
      row.split('').forEach((c, col) => {
        if (c === '1') out.push({ x: (col - 3) * 0.19, z: (r - 3) * 0.19, orange: (r + col) % 5 === 0 });
      }),
    );
    return out;
  }, []);
  return <group position={[0, 0, -1.7]}>
    <InkBox position={[-1.15, 1.5, 0]} size={[0.22, 3, 0.22]} color="orange" />
    <InkBox position={[1.15, 1.5, 0]} size={[0.22, 3, 0.22]} color="orange" />
    <InkBox position={[0, 2.95, 0]} size={[2.52, 0.22, 0.22]} color="orange" />
    <group
      onPointerOver={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); onHover('SCAN'); }}
      onPointerOut={() => onHover(null)}
    >
      <InkBox position={[0, 1.7, 0]} size={[1.9, 1.9, 0.1]} color="white" />
      {cells.map((c, i) => (
        <InkBox key={i} position={[c.x, 1.7, 0.06]} size={[0.16, 0.16, 0.02]} color={c.orange ? 'orange' : 'ink'} outline={false} />
      ))}
      <mesh position={[0, 0.62, 0.06]} material={ink.ink}>
        <planeGeometry args={[1.9, 0.06]} />
      </mesh>
    </group>
  </group>;
}

function FastIsland({ world, reducedMotion, mobile, onHover }: Props) {
  const photos = useRef<(Group | null)[]>([]);
  const center = useRef<Group>(null);
  const count = mobile ? 4 : 7;
  const scattered = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => ({
        x: -2.6 + i * 0.85 + (i % 2 ? 0.25 : -0.2),
        z: 1.5 - (i % 3) * 0.9,
        r: -0.3 + i * 0.12,
      })),
    [],
  );
  useFrame(({ clock }) => {
    const t = clamp01((world.current.progress - 0.30) / 0.075);
    const float = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 1.1) * 0.05;
    photos.current.forEach((g, i) => {
      if (!g || i >= count) return;
      const s = scattered[i];
      const converge = t * t * (3 - 2 * t);
      g.position.set(
        s.x + (0.2 - s.x) * converge * 0.55,
        0.65 + i * 0.09 + converge * 0.5 + float * (1 + i * 0.1),
        s.z + (0.6 - s.z) * converge * 0.5,
      );
      g.rotation.y = s.r + converge * 0.5;
    });
    if (center.current) {
      center.current.position.y = 1.15 + t * 0.55 + (reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.9) * 0.06);
      center.current.rotation.y = -0.25 + t * 0.4;
    }
  });
  return <group>
    <QrGate onHover={onHover} />
    {scattered.slice(0, count).map((s, i) => (
      <group key={i} ref={(g) => { photos.current[i] = g; }} position={[s.x, 0.65 + i * 0.09, s.z]} rotation={[0, s.r, 0]}>
        <InkBox size={[1.05, 0.04, 1.35]} color="white" />
        <InkBox position={[0, 0.03, -0.28]} size={[0.5, 0.012, 0.5]} color={i % 3 === 0 ? 'orange' : 'ink'} outline={false} />
        <InkBox position={[0, 0.03, 0.32]} size={[0.8, 0.012, 0.08]} color="ink" outline={false} />
        <InkBox position={[0, 0.03, 0.45]} size={[0.6, 0.012, 0.08]} color="ink" outline={false} />
      </group>
    ))}
    <group ref={center} position={[0.2, 1.15, 0.6]}>
      <InkBox size={[1.7, 0.05, 2.1]} color="white" />
      <InkBox position={[0, 0.04, -0.4]} size={[0.85, 0.015, 0.85]} color="orange" outline={false} />
      <InkBox position={[-0.3, 0.04, 0.55]} size={[0.5, 0.015, 0.1]} color="ink" outline={false} />
      <InkBox position={[0.25, 0.04, 0.72]} size={[0.9, 0.015, 0.1]} color="ink" outline={false} />
    </group>
    <InkBox position={[2.4, 0.35, 1.2]} size={[1.1, 0.5, 0.7]} color="orange" />
    <InkBox position={[2.4, 0.68, 1.2]} size={[0.9, 0.12, 0.5]} />
  </group>;
}

function SivoIsland({ world, reducedMotion, mobile, onHover }: Props) {
  const dots = useRef<(Group | null)[]>([]);
  const trail = useRef<Group>(null);
  const hand = useRef<Group>(null);
  const dotCount = mobile ? 5 : 9;
  const dotPos: [number, number, number][] = useMemo(
    () => [
      [-0.5, 1.7, 0], [-0.17, 1.85, 0], [0.17, 1.8, 0], [0.5, 1.6, 0],
      [-0.5, 1.1, 0], [0, 1.15, 0.05], [0.5, 1.05, 0],
      [-0.75, 0.9, 0.2], [0.75, 0.75, 0.2],
    ],
    [],
  );
  useFrame(({ clock }) => {
    const t = clamp01((world.current.progress - 0.47) / 0.085);
    const e = t * t * (3 - 2 * t);
    dots.current.forEach((g, i) => {
      if (!g || i >= dotCount) return;
      const s = 0.001 + e * (0.09 + (i % 3) * 0.015);
      g.scale.setScalar(reducedMotion ? 0.09 : s + Math.sin(clock.elapsedTime * 2 + i) * 0.008 * e);
    });
    if (trail.current) {
      trail.current.children.forEach((child, i) => {
        const s = clamp01(e * 1.4 - i * 0.08);
        child.scale.set(0.12 + s * 0.1, 0.05, 0.12 + s * 0.1);
        child.position.y = 0.4 + i * 0.14 + s * 0.35;
      });
    }
    if (hand.current) {
      hand.current.rotation.y = -0.3 + e * 0.35 + (reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.8) * 0.04);
      hand.current.position.y = e * 0.3;
    }
  });
  return <group>
    <group ref={hand} position={[0, 0.1, 0]}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); onHover('LISTEN'); }}
      onPointerOut={() => onHover(null)}
    >
      <InkBox position={[0, 0.35, 0]} size={[1.25, 0.32, 0.9]} />
      {[-0.45, -0.15, 0.15, 0.45].map((fx, i) => (
        <InkBox key={i} position={[fx, 1.05 + (i === 1 ? 0.12 : 0), 0]} size={[0.22, i === 1 ? 0.95 : 0.8, 0.22]} color={i === 1 ? 'orange' : 'paper'} />
      ))}
      <InkBox position={[-0.8, 0.55, 0.15]} rotation={[0, 0, 0.5]} size={[0.2, 0.6, 0.2]} />
      {dotPos.slice(0, dotCount).map((p, i) => (
        <group key={i} ref={(g) => { dots.current[i] = g; }} position={p} scale={0.001}>
          <InkSphere position={[0, 0, 0.12]} radius={1} color="orange" />
        </group>
      ))}
    </group>
    <group ref={trail} position={[-2.2, 0, -0.5]}>
      {Array.from({ length: mobile ? 5 : 8 }).map((_, i) => (
        <group key={i} position={[-i * 0.22, 0.4 + i * 0.14, -i * 0.08]}>
          <InkBox size={[1, 1, 1]} color={i % 2 ? 'orange' : 'ink'} outline={false} />
        </group>
      ))}
    </group>
    <group position={[2.1, 1.3, 0.4]}>
      <InkBox size={[1.5, 1, 0.12]} color="white" />
      {[0, 1, 2].map((b) => (
        <InkBox key={b} position={[-0.35 + b * 0.35, 0, 0.08]} size={[0.12, 0.4 + (b === 1 ? 0.25 : 0), 0.03]} color="orange" outline={false} />
      ))}
      <InkBox position={[-0.5, -0.62, 0]} rotation={[0, 0, 0.5]} size={[0.12, 0.35, 0.1]} />
    </group>
    <InkCylinder position={[-0.1, 0.35, 1.6]} radius={0.55} height={0.5} />
    <InkCylinder position={[-0.1, 0.75, 1.6]} radius={0.42} height={0.3} color="orange" />
  </group>;
}

function BoostIsland({ world, reducedMotion, mobile }: Props) {
  const bars = useRef<(Group | null)[]>([]);
  const words = useRef<Group>(null);
  useFrame(({ clock }) => {
    const t = clamp01((world.current.progress - 0.575) / 0.08);
    const e = t * t * (3 - 2 * t);
    bars.current.forEach((g, i) => {
      if (!g) return;
      const h = [1.1, 1.7, 1.35][i] * (0.15 + e * 0.85);
      g.scale.set(0.5, h, 0.5);
      g.position.y = 0.1 + h / 2;
    });
    if (words.current) {
      words.current.children.forEach((child, i) => {
        const s = clamp01(e * 1.6 - i * 0.12);
        child.scale.set(0.7 * s + 0.001, 1, 1);
      });
      if (!reducedMotion) words.current.position.y = Math.sin(clock.elapsedTime * 1) * 0.04 + e * 0.35;
    }
  });
  return <group>
    <group position={[-1.2, 0.75, 0.3]} rotation={[0, 0.22, 0]}>
      <InkBox size={[2.3, 0.1, 3.1]} color="white" />
      <group ref={words} position={[0, 0.08, 0]}>
        {[0, 1, 2, 3, 4, 5].map((l) => (
          <group key={l} position={[-0.2 + (l % 2) * 0.1, 0, -1.15 + l * 0.42]}>
            <InkBox size={[1.6 - l * 0.12, 0.03, 0.14]} color={l === 0 ? 'orange' : 'ink'} outline={false} />
          </group>
        ))}
      </group>
      <InkBox position={[0.85, 0.12, 1.15]} size={[0.4, 0.04, 0.4]} color="orange" outline={false} />
    </group>
    <group position={[1.9, 0.1, -0.9]}>
      {[0, 1, 2].map((b) => (
        <group key={b} ref={(g) => { bars.current[b] = g; }} position={[-0.65 + b * 0.65, 0.6, 0]} scale={[0.5, 1, 0.5]}>
          <InkBox size={[1, 1, 1]} color={b === 1 ? 'orange' : b === 0 ? 'ink' : 'paper'} />
        </group>
      ))}
      <InkBox position={[0, 0.06, 0]} size={[2.2, 0.08, 0.9]} color="ink" outline={false} />
    </group>
    {!mobile && [0, 1, 2].map((c) => (
      <group key={c} position={[1.4 + c * 0.75, 0.4 + (c % 2) * 0.25, 1.5]} rotation={[0, -0.2 * c, 0]}>
        <InkBox size={[0.65, 0.45, 0.06]} color="white" />
        <InkBox position={[-0.12, 0, 0.05]} rotation={[0, 0, 0.7]} size={[0.2, 0.045, 0.02]} color="orange" outline={false} />
        <InkBox position={[0.08, -0.02, 0.05]} rotation={[0, 0, -0.7]} size={[0.28, 0.045, 0.02]} color="orange" outline={false} />
      </group>
    ))}
    <InkSphere position={[-2.5, 2.6, -1.2]} radius={0.32} color="orange" cel />
  </group>;
}

function HyperspeedStreaks({ world }: Pick<Props, 'world'>) {
  const group = useRef<Group>(null);
  const streaks = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      x: (i % 6) * 16 + ((i * 4.3) % 12),
      y: 1.1 + (i % 5) * 1.3,
      z: -4 + (i % 7) * 1.8,
      w: 4.8 + (i % 4) * 2.6,
      orange: i % 2 === 0,
    }));
  }, []);

  useFrame(() => {
    if (!group.current) return;
    const w = world.current;
    // Streaks appear exclusively during the fast-forward warp between islands:
    // Warp 1: journey between 0.04 and 0.46 (Fast Send -> SIVO)
    // Warp 2: journey between 0.54 and 0.96 (SIVO -> BoostWork)
    const inWarp1 = w.journey > 0.04 && w.journey < 0.46;
    const inWarp2 = w.journey > 0.54 && w.journey < 0.96;
    const isWarping = inWarp1 || inWarp2;

    group.current.visible = isWarping;
    if (isWarping) {
      const baseX = w.journey < 0.5 ? 14 + (w.journey / 0.5) * 42 : 56 + ((w.journey - 0.5) / 0.5) * 42;
      group.current.position.x = baseX - 20;
    }
  });

  return (
    <group ref={group} visible={false}>
      {streaks.map((s, idx) => (
        <group key={idx} position={[s.x, s.y, s.z]}>
          <InkBox size={[s.w, 0.05, 0.05]} color={s.orange ? 'orange' : 'white'} outline={false} />
        </group>
      ))}
    </group>
  );
}

export default function JourneyWorld(props: Props) {
  return <group>
    {/* Stage 1: Fast Send at X = 14 */}
    <group position={[14, 0, 0]}>
      <IslandBase x={0} />
      <FastIsland {...props} />
    </group>

    {/* Stage 2: SIVO at X = 56 (42 units from Fast Send) */}
    <group position={[56, 0, 0.5]}>
      <IslandBase x={0} w={8} />
      <SivoIsland {...props} />
    </group>

    {/* Stage 3: BoostWork at X = 98 (42 units from SIVO) */}
    <group position={[98, 0, 0]}>
      <IslandBase x={0} />
      <BoostIsland {...props} />
    </group>

    {/* Hyperspeed streaks during fast-forward warp between islands */}
    <HyperspeedStreaks world={props.world} />
  </group>;
}
