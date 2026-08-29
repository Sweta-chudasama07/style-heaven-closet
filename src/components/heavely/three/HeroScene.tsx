import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Html, OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";
import type { Mesh, Group } from "three";
import { DreamLights, glassProps } from "./Rig";

type Piece = {
  id: string;
  label: string;
  color: string;
  position: [number, number, number];
  shape: "dress" | "bag" | "shoe" | "gem" | "hanger";
};

const PIECES: Piece[] = [
  { id: "closet", label: "Closet", color: "#ffb7d5", position: [-2.6, 0.5, 0], shape: "dress" },
  { id: "style", label: "Style Me", color: "#c9b6ff", position: [-0.9, -0.4, 0.8], shape: "gem" },
  { id: "remix", label: "Remix", color: "#b6dcff", position: [0.9, 0.6, -0.4], shape: "hanger" },
  { id: "booth", label: "Booth", color: "#ffd7a8", position: [2.5, -0.3, 0.4], shape: "bag" },
  { id: "looks", label: "Diary", color: "#ffc9e6", position: [0.2, 1.5, -1.2], shape: "shoe" },
];

function Shape({ shape }: { shape: Piece["shape"] }) {
  if (shape === "dress") return <coneGeometry args={[0.55, 1.3, 24]} />;
  if (shape === "bag") return <boxGeometry args={[0.85, 0.7, 0.35]} />;
  if (shape === "shoe") return <capsuleGeometry args={[0.28, 0.7, 8, 20]} />;
  if (shape === "gem") return <octahedronGeometry args={[0.6, 0]} />;
  return <torusGeometry args={[0.5, 0.14, 18, 40]} />;
}

function Piece3D({ piece, onPick }: { piece: Piece; onPick: (id: string) => void }) {
  const mesh = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    m.rotation.y += delta * (hovered ? 1.2 : 0.35);
    const target = hovered ? 1.22 : 1;
    const k = 1 - Math.exp(-8 * Math.min(delta, 0.05));
    m.scale.lerp({ x: target, y: target, z: target } as never, k);
  });

  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.9}>
      <group position={piece.position}>
        <mesh
          ref={mesh}
          castShadow
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = "";
          }}
          onClick={(e) => {
            e.stopPropagation();
            onPick(piece.id);
          }}
        >
          <Shape shape={piece.shape} />
          <meshPhysicalMaterial {...glassProps(piece.color)} />
        </mesh>
        {hovered ? (
          <Html center position={[0, -1, 0]} distanceFactor={8}>
            <span className="whitespace-nowrap rounded-full bg-card/90 px-3 py-1 text-xs tracking-widest uppercase">
              {piece.label}
            </span>
          </Html>
        ) : null}
      </group>
    </Float>
  );
}

function Drifting({ onPick }: { onPick: (id: string) => void }) {
  const group = useRef<Group>(null);
  useFrame(({ pointer }, delta) => {
    const g = group.current;
    if (!g) return;
    const k = 1 - Math.exp(-3 * Math.min(delta, 0.05));
    g.rotation.y += (pointer.x * 0.4 - g.rotation.y) * k;
    g.rotation.x += (-pointer.y * 0.2 - g.rotation.x) * k;
  });
  return (
    <group ref={group}>
      {PIECES.map((p) => (
        <Piece3D key={p.id} piece={p} onPick={onPick} />
      ))}
    </group>
  );
}

export default function HeroScene({
  className,
  onPick,
}: {
  className?: string;
  onPick: (id: string) => void;
}) {
  return (
    <div className={className}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0.4, 6.2], fov: 50 }}>
        <DreamLights />
        <Drifting onPick={onPick} />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} minPolarAngle={1} maxPolarAngle={2} />
      </Canvas>
    </div>
  );
}
