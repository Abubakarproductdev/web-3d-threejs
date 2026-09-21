import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import {
  BackSide, BoxGeometry, CanvasTexture, CylinderGeometry, DataTexture,
  EdgesGeometry, ExtrudeGeometry, LineBasicMaterial, MeshBasicMaterial,
  MeshToonMaterial, NearestFilter, RedFormat, RepeatWrapping,
  SphereGeometry, SRGBColorSpace, type Material, type Shape,
} from 'three';
import { PALETTE } from '../../lib/story';

type Vec3 = [number, number, number];

function createResources() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const context = canvas.getContext('2d')!;
  context.fillStyle = '#e7e5da';
  context.fillRect(0, 0, 128, 128);
  context.strokeStyle = '#8a897e';
  context.lineWidth = 0.8;
  for (let x = -128; x < 256; x += 9) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x + 128, 128);
    context.stroke();
  }
  const hatchTexture = new CanvasTexture(canvas);
  hatchTexture.colorSpace = SRGBColorSpace;
  hatchTexture.wrapS = hatchTexture.wrapT = RepeatWrapping;
  hatchTexture.repeat.set(2, 2);
  const gradient = new DataTexture(new Uint8Array([100, 185, 255]), 3, 1, RedFormat);
  gradient.minFilter = gradient.magFilter = NearestFilter;
  gradient.needsUpdate = true;

  const paper = new MeshBasicMaterial({ color: PALETTE.paper });
  const white = new MeshBasicMaterial({ color: PALETTE.white });
  const stone = new MeshBasicMaterial({ color: PALETTE.stone });
  const ink = new MeshBasicMaterial({ color: PALETTE.ink });
  const hatch = new MeshBasicMaterial({ map: hatchTexture });
  const orange = new MeshBasicMaterial({ color: PALETTE.orange });
  const burnt = new MeshBasicMaterial({ color: '#bf411b' });
  const toon = new MeshToonMaterial({ color: PALETTE.orange, gradientMap: gradient });
  const outline = new MeshBasicMaterial({ color: PALETTE.ink, side: BackSide });
  const line = new LineBasicMaterial({ color: '#30312b' });
  // Shared low-poly geometry — one upload, reused by every island for max performance.
  const box = new BoxGeometry(1, 1, 1);
  const boxEdges = new EdgesGeometry(box);
  const cylinder = new CylinderGeometry(1, 1, 1, 24);
  const cylinderEdges = new EdgesGeometry(cylinder, 20);
  const sphere = new SphereGeometry(1, 22, 14);
  const shadedPaper = [hatch, stone, white, stone, paper, hatch];
  const shadedOrange = [burnt, orange, orange, burnt, orange, burnt];
  const cylinderPaper = [hatch, white, stone];
  return {
    paper, white, stone, ink, hatch, orange, burnt, toon, outline, line,
    box, boxEdges, cylinder, cylinderEdges, sphere, shadedPaper, shadedOrange, cylinderPaper,
    dispose() {
      [paper, white, stone, ink, hatch, orange, burnt, toon, outline, line,
        box, boxEdges, cylinder, cylinderEdges, sphere, hatchTexture, gradient].forEach((item) => item.dispose());
    },
  };
}

type Resources = ReturnType<typeof createResources>;
const InkContext = createContext<Resources | null>(null);

export function InkProvider({ children }: { children: ReactNode }) {
  const resources = useMemo(createResources, []);
  useEffect(() => () => resources.dispose(), [resources]);
  return <InkContext.Provider value={resources}>{children}</InkContext.Provider>;
}

export function useInk() {
  const resources = useContext(InkContext);
  if (!resources) throw new Error('Ink primitives must be inside InkProvider.');
  return resources;
}

type BoxProps = {
  position?: Vec3;
  rotation?: Vec3;
  size: Vec3;
  color?: 'paper' | 'orange' | 'ink' | 'white' | 'stone';
  outline?: boolean;
};

export function InkBox({ position, rotation, size, color = 'paper', outline = true }: BoxProps) {
  const ink = useInk();
  const material = color === 'paper' ? ink.shadedPaper : color === 'orange' ? ink.shadedOrange : ink[color];
  return (
    <group position={position} rotation={rotation} scale={size}>
      <mesh geometry={ink.box} material={material} />
      {outline && <lineSegments geometry={ink.boxEdges} material={ink.line} />}
    </group>
  );
}

export function InkCylinder({ position, radius, height, color = 'paper' }: {
  position: Vec3; radius: number; height: number; color?: 'paper' | 'orange' | 'ink';
}) {
  const ink = useInk();
  return <group position={position} scale={[radius, height, radius]}>
    <mesh geometry={ink.cylinder} material={color === 'paper' ? ink.cylinderPaper : ink[color]} />
    <lineSegments geometry={ink.cylinderEdges} material={ink.line} />
  </group>;
}

export function InkSphere({ position, radius, color = 'orange', cel = false }: {
  position: Vec3; radius: number; color?: 'paper' | 'orange' | 'ink' | 'white'; cel?: boolean;
}) {
  const ink = useInk();
  const mat = cel ? ink.toon : color === 'orange' ? ink.orange : ink[color];
  return <group position={position}>
    <mesh geometry={ink.sphere} material={mat} scale={radius} />
    <mesh geometry={ink.sphere} material={ink.outline} scale={radius * 1.02} />
  </group>;
}

export function InkShape({ shape, depth = 0.22, material }: { shape: Shape; depth?: number; material?: Material | Material[] }) {
  const ink = useInk();
  const geometry = useMemo(() => new ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 20 }), [shape, depth]);
  const edges = useMemo(() => new EdgesGeometry(geometry, 25), [geometry]);
  useEffect(() => () => { geometry.dispose(); edges.dispose(); }, [geometry, edges]);
  return <group>
    <mesh geometry={geometry} material={material ?? [ink.paper, ink.hatch]} />
    <lineSegments geometry={edges} material={ink.line} />
  </group>;
}
