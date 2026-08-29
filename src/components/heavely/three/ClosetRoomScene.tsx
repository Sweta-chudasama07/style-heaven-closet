import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, RoundedBox } from "@react-three/drei";
import { useRef, useState } from "react";
import type { Group } from "three";
import { DreamLights, glassProps } from "./Rig";

export type RoomSpot = { id: string; label: string; note: string; color: string };

const SPOTS: RoomSpot[] = [
  { id: "closet", label: "Closet", note: "your pieces", color: "#ffb7d5" },
  { id: "style", label: "Style Me", note: "three looks", color: "#c9b6ff" },
  { id: "booth", label: "Booth", note: "outfit of the day", color: "#b6dcff" },
  { id: "looks", label: "Diary", note: "saved looks", color: "#ffd7a8" },
];

function Podium({
  spot,
  index,
  total,
  onPick,
}: {
  spot: RoomSpot;
  index: number;
  total: number;
  onPick: (id: string) => void;
}) {
  const group = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const angle = (index / total) * Math.PI * 2;
  const radius = 2.6;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const k = 1 - Math.exp(-8 * Math.min(delta, 0.05));
    g.position.y += ((hovered ? 0.28 : 0) - g.position.y) * k;
    g.rotation.y += delta * (hovered ? 0.9 : 0.25);
  });

  return (
    <group
      ref={group}
      position={[x, 0, z]}
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
        onPick(spot.id);
      }}
    >
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.85, 0.95, 0.5, 32]} />
        <meshPhysicalMaterial {...glassProps("#ffeef6", { thickness: 1.6 })} />
      </mesh>
      <RoundedBox args={[0.9, 1.1, 0.5]} radius={0.2} smoothness={5} position={[0, 1.15, 0]} castShadow>
        <meshPhysicalMaterial {...glassProps(spot.color)} />
      </RoundedBox>
      <Html center position={[0, 2.1, 0]} distanceFactor={9}>
        <div className="pointer-events-none whitespace-nowrap rounded-2xl bg-card/90 px-3 py-1 text-center">
          <p className="text-xs tracking-widest uppercase">{spot.label}</p>
          <p className="text-[10px] text-muted-foreground">{spot.note}</p>
        </div>
      </Html>
    </group>
  );
}

export default function ClosetRoomScene({
  className,
  onPick,
}: {
  className?: string;
  onPick: (id: string) => void;
}) {
  return (
    <div className={className}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 3.4, 6.4], fov: 50 }}>
        <color attach="background" args={["#fdf3f8"]} />
        <fog attach="fog" args={["#fdf3f8", 10, 22]} />
        <DreamLights />
        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <circleGeometry args={[7, 48]} />
          <meshStandardMaterial color="#f6e4ef" roughness={0.6} />
        </mesh>
        {SPOTS.map((s, i) => (
          <Podium key={s.id} spot={s} index={i} total={SPOTS.length} onPick={onPick} />
        ))}
        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={9}
          minPolarAngle={0.6}
          maxPolarAngle={1.35}
          autoRotate
          autoRotateSpeed={0.4}
        />
      </Canvas>
    </div>
  );
}
