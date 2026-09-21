import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Group, MathUtils, Path, Shape } from 'three';
import { InkBox, InkCylinder, InkShape, useInk } from './InkPrimitives';
import type { WorldState } from '../../lib/story';

type RoomProps = {
  world: MutableRefObject<WorldState>;
  reducedMotion: boolean;
  onSpark: () => void;
  onDoor: () => void;
  onHover: (label: string | null) => void;
};

function archShape(radius: number, spring: number) {
  const shape = new Shape();
  shape.moveTo(-radius, 0);
  shape.lineTo(radius, 0);
  shape.lineTo(radius, spring);
  shape.absarc(0, spring, radius, 0, Math.PI, false);
  shape.closePath();
  return shape;
}

function Workbench() {
  const ink = useInk();
  return <group position={[-1.65, 0.18, 0.38]}>
    <InkBox position={[0, 1.04, 0]} size={[2.5, 0.13, 1.32]} />
    <InkBox position={[-0.97, 0.5, 0]} size={[0.13, 0.97, 1.13]} color="orange" />
    <InkBox position={[0.97, 0.5, 0]} size={[0.13, 0.97, 1.13]} color="orange" />
    <group position={[-0.44, 1.13, -0.12]} rotation={[0, 0.08, 0]}>
      <InkBox size={[0.99, 0.055, 0.67]} />
      <InkBox position={[0, 0.035, -0.065]} size={[0.77, 0.008, 0.3]} color="stone" />
      {[0, 1, 2, 3].map((line) => <InkBox key={line} position={[0, 0.041, -0.175 + line * 0.075]} size={[0.72, 0.003, 0.008]} color="ink" outline={false} />)}
      <InkBox position={[0, 0.035, 0.215]} size={[0.24, 0.008, 0.11]} />
      <group position={[0, 0.04, -0.3]} rotation={[-0.15, 0, 0]}>
        <InkBox position={[0, 0.34, 0]} size={[0.99, 0.67, 0.045]} />
        <InkBox position={[0, 0.35, 0.027]} size={[0.86, 0.54, 0.013]} color="orange" outline={false} />
        <group position={[-0.19, 0.36, 0.04]}>
          <InkBox position={[0, 0.038, 0]} rotation={[0, 0, -0.55]} size={[0.14, 0.021, 0.003]} color="white" outline={false} />
          <InkBox position={[0, -0.038, 0]} rotation={[0, 0, 0.55]} size={[0.14, 0.021, 0.003]} color="white" outline={false} />
          <InkBox position={[0.19, -0.061, 0]} size={[0.15, 0.018, 0.003]} color="white" outline={false} />
        </group>
      </group>
    </group>
    <InkBox position={[0.69, 1.117, 0.2]} rotation={[0, 0.16, 0]} size={[0.52, 0.012, 0.66]} />
    <mesh position={[0.61, 1.132, 0.22]} rotation={[-Math.PI / 2, 0, 0]} material={ink.orange}>
      <circleGeometry args={[0.105, 24]} />
    </mesh>
    <InkCylinder position={[-0.05, 0.57, 1.28]} radius={0.37} height={0.11} />
    <InkBox position={[-0.05, 0.26, 1.28]} size={[0.16, 0.56, 0.16]} />
    <InkBox position={[-0.05, 0.03, 1.28]} size={[0.47, 0.06, 0.47]} />
  </group>;
}

function Plant() {
  const ink = useInk();
  return <group position={[2.93, 0.28, 1.18]}>
    <mesh position={[0, 0.21, 0]} material={ink.paper}>
      <cylinderGeometry args={[0.26, 0.2, 0.43, 6]} />
    </mesh>
    <mesh position={[0, 0.215, 0]} scale={1.045} material={ink.outline}>
      <cylinderGeometry args={[0.26, 0.2, 0.43, 6]} />
    </mesh>
    {[0, 1, 2, 3, 4].map((leaf) => <group key={leaf} position={[0, 0.4, 0]} rotation={[0, leaf * 1.25, 0.45]}>
      <mesh position={[0, 0.33, 0]} material={leaf % 2 ? ink.burnt : ink.orange}>
        <coneGeometry args={[0.11, 0.85, 3]} />
      </mesh>
      <mesh position={[0, 0.33, 0]} scale={1.025} material={ink.outline}>
        <coneGeometry args={[0.11, 0.85, 3]} />
      </mesh>
    </group>)}
  </group>;
}

function Sketch({ position, rotation, variant = 0 }: { position: [number, number, number]; rotation: [number, number, number]; variant?: number }) {
  const ink = useInk();
  return <group position={position} rotation={rotation}>
    <InkBox size={[1.08, 0.018, 1.48]} />
    {variant === 0 ? <>
      <InkBox position={[-0.06, 0.017, -0.22]} size={[0.57, 0.007, 0.01]} color="ink" outline={false} />
      <InkBox position={[-0.34, 0.017, 0.03]} size={[0.01, 0.007, 0.5]} color="ink" outline={false} />
      <InkBox position={[0.22, 0.017, 0.03]} size={[0.01, 0.007, 0.5]} color="ink" outline={false} />
      <mesh position={[0.08, 0.025, 0.19]} rotation={[-Math.PI / 2, 0, 0]} material={ink.orange}><circleGeometry args={[0.15, 24]} /></mesh>
      <InkBox position={[-0.06, 0.017, 0.41]} size={[0.57, 0.007, 0.01]} color="ink" outline={false} />
    </> : [0, 1, 2, 3].map((line) => <InkBox key={line} position={[-0.05 + line * 0.025, 0.017, -0.28 + line * 0.18]} size={[0.63 - line * 0.07, 0.007, 0.014]} color={line === 0 ? 'orange' : 'ink'} outline={false} />)}
  </group>;
}

export default function MakersRoom({ world, reducedMotion, onSpark, onDoor, onHover }: RoomProps) {
  const ink = useInk();
  const room = useRef<Group>(null);
  const wall = useRef<Group>(null);
  const fin = useRef<Group>(null);
  const door = useRef<Group>(null);
  const spark = useRef<Group>(null);
  const papers = useRef<Group>(null);
  const hovered = useRef(false);
  const paperInertia = useRef(0);
  const arch = useMemo(() => {
    const s = new Shape();
    s.moveTo(-1.86, 0); s.lineTo(-1.86, 4.3); s.lineTo(1.86, 4.3);
    s.lineTo(1.86, 0); s.lineTo(0.77, 0); s.lineTo(0.77, 2.52);
    s.absarc(0, 2.52, 0.77, 0, Math.PI, false);
    s.lineTo(-0.77, 0); s.closePath();
    return s;
  }, []);
  const archDoor = useMemo(() => archShape(0.745, 2.52), []);
  const windowWall = useMemo(() => {
    const s = new Shape();
    s.moveTo(-1.04, 0); s.lineTo(1.04, 0); s.lineTo(1.04, 2.75); s.lineTo(-1.04, 2.75); s.closePath();
    const hole = new Path();
    hole.absarc(0, 1.72, 0.56, 0, Math.PI * 2, true);
    s.holes.push(hole);
    return s;
  }, []);

  useFrame(({ clock }, delta) => {
    const state = world.current;
    const dt = Math.min(delta, 0.05);
    // The spark and door belong to the opening room only — quiet them once the story moves on.
    if (state.progress > 0.1) hovered.current = false;
    if (room.current) {
      room.current.visible = state.progress < 0.245;
      room.current.position.y = -0.35 * (1 - state.entrance);
      room.current.rotation.y = state.turn + (reducedMotion ? 0 : state.pointerX * 0.025);
      room.current.scale.setScalar(0.96 + state.entrance * 0.04);
    }
    if (wall.current) wall.current.rotation.y = -state.unfold * 0.42;
    if (fin.current) fin.current.rotation.y = -Math.PI / 2 + state.unfold * 0.55;
    if (door.current) door.current.rotation.y = -(state.spark * 1.03 + state.cameraPush * 0.42);
    if (spark.current) {
      spark.current.position.y = 3.5 + state.spark * 0.6 + state.paperLift * 0.2 + (reducedMotion ? 0 : Math.sin(clock.elapsedTime * 1.05) * 0.055);
      const size = MathUtils.damp(spark.current.scale.x, hovered.current ? 1.12 : 1, 6, dt);
      spark.current.scale.setScalar(size);
      spark.current.rotation.z = state.spark * 0.2;
    }
    if (papers.current) {
      paperInertia.current = MathUtils.damp(paperInertia.current, state.velocity * 0.045, 4, dt);
      papers.current.position.y = state.paperLift * 1.2 + state.spark * 0.48;
      papers.current.rotation.y = -state.unfold * 0.2;
      papers.current.rotation.z = reducedMotion ? 0 : paperInertia.current;
    }
    state.velocity = MathUtils.damp(state.velocity, 0, 3, dt);
  });

  const overSpark = (event: ThreeEvent<PointerEvent>) => { event.stopPropagation(); hovered.current = true; onHover('TOUCH'); };
  const outSpark = () => { hovered.current = false; onHover(null); };

  return <group ref={room}>
    <InkBox position={[0.34, -0.645, 0.15]} size={[7.95, 0.025, 6.1]} color="ink" outline={false} />
    <InkBox position={[0, -0.565, 0]} size={[7.86, 0.07, 6.12]} color="orange" />
    {[0, 1, 2, 3, 4, 5, 6].map((page) => <InkBox key={page} position={[page % 2 ? 0.015 : -0.015, -0.49 + page * 0.071, 0]} size={[7.72, 0.068, 5.99]} />)}
    <InkBox position={[0, 0.047, 0]} size={[7.85, 0.105, 6.12]} />

    {[0, 1, 2, 3, 4, 5].map((step) => <InkBox key={step} position={[-1.12, -0.58 + step * 0.125, 4.55 - step * 0.32]} size={[1.77, 0.14, 0.34]} />)}

    <group ref={wall} position={[-0.85, 0.104, -2.23]}>
      <InkShape shape={arch} depth={0.27} />
      <group ref={door} position={[-0.745, 0, 0.11]}>
        <group position={[0.745, 0, 0]} onClick={(event) => { event.stopPropagation(); onDoor(); }} onPointerOver={(event) => { event.stopPropagation(); onHover('ENTER'); }} onPointerOut={() => onHover(null)}>
          <InkShape shape={archDoor} depth={0.045} material={ink.orange} />
          <InkBox position={[0.51, 1.39, 0.065]} size={[0.028, 0.19, 0.033]} color="ink" />
        </group>
      </group>
      <InkBox position={[0, 0.065, 0.39]} size={[1.65, 0.12, 0.56]} />
    </group>

    <group ref={fin} position={[3.03, 0.104, -0.94]} rotation={[0, -Math.PI / 2, 0]}>
      <InkShape shape={windowWall} depth={0.2} />
    </group>

    <InkCylinder position={[1.72, 0.37, -1.38]} radius={0.91} height={0.54} />
    <InkCylinder position={[1.72, 0.85, -1.38]} radius={0.76} height={0.42} />
    <InkCylinder position={[1.72, 1.27, -1.38]} radius={0.61} height={0.42} />
    <group ref={spark} position={[1.72, 3.5, -1.38]} onPointerOver={overSpark} onPointerOut={outSpark} onClick={(event) => { event.stopPropagation(); onSpark(); }}>
      <mesh geometry={ink.sphere} material={ink.toon} scale={0.7} />
      <mesh geometry={ink.sphere} material={ink.outline} scale={0.709} />
    </group>

    <Workbench />
    <Plant />
    {[0, 1, 2].map((book) => <group key={book} position={[0.54 + book * 0.64, 0.16, 1.96 - book * 0.11]} rotation={[0, -0.11 + book * 0.05, 0]}>
      <InkBox size={[0.54, 0.12, 0.78]} color={book === 1 ? 'orange' : 'paper'} />
      <InkBox position={[0, 0, 0.007]} size={[0.51, 0.065, 0.77]} />
    </group>)}
    <group ref={papers}>
      <Sketch position={[4.45, 1.62, 1.42]} rotation={[0.19, -0.32, 0.18]} />
      <Sketch position={[4.39, 1.42, 1.52]} rotation={[0.1, -0.19, 0.11]} variant={1} />
      <Sketch position={[3.33, 0.38, 3.68]} rotation={[0, 0.34, -0.09]} variant={1} />
    </group>
    <InkBox position={[0.49, 0.14, 0.69]} rotation={[0, -0.33, 0]} size={[0.065, 0.065, 0.75]} color="orange" />
  </group>;
}