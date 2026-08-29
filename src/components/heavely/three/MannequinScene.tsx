import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, RoundedBox } from "@react-three/drei";
import { useRef, useState } from "react";
import type { Group } from "three";
import { DreamLights, glassProps } from "./Rig";

export type LayerSpec = {
  id: string;
  label: string;
  slot: "top" | "bottom" | "shoes" | "jewellery" | "bag";
  color: string;
  locked: boolean;
};

const SLOT_Y: Record<LayerSpec["slot"], number> = {
  jewellery: 1.62,
  top: 1.05,
  bottom: 0.35,
  shoes: -0.5,
  bag: 0.75,
};

function Layer({ layer, onToggle }: { layer: LayerSpec; onToggle: (id: string) => void }) {
  const group = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const y = SLOT_Y[layer.slot];

  useFrame((_, delta) => {
    const g = group.current;
    if (!g) return;
    const k = 1 - Math.exp(-9 * Math.min(delta, 0.05));
    const s = hovered ? 1.08 : 1;
    g.scale.lerp({ x: s, y: s, z: s } as never, k);
    if (layer.locked) g.rotation.y += delta * 0.4;
  });

  const body = (() => {
    switch (layer.slot) {
      case "jewellery":
        return (
          <mesh castShadow>
            <torusGeometry args={[0.3, 0.06, 14, 32]} />
            <meshPhysicalMaterial {...glassProps(layer.color)} />
          </mesh>
        );
      case "top":
        return (
          <RoundedBox args={[1.05, 0.95, 0.6]} radius={0.24} smoothness={5} castShadow>
            <meshPhysicalMaterial {...glassProps(layer.color)} />
          </RoundedBox>
        );
      case "bottom":
        return (
          <mesh castShadow>
            <coneGeometry args={[0.72, 1.05, 28]} />
            <meshPhysicalMaterial {...glassProps(layer.color)} />
          </mesh>
        );
      case "bag":
        return (
          <mesh position={[0.95, 0, 0]} castShadow>
            <boxGeometry args={[0.42, 0.36, 0.18]} />
            <meshPhysicalMaterial {...glassProps(layer.color)} />
          </mesh>
        );
      default:
        return (
          <group>
            {[-0.22, 0.22].map((x) => (
              <mesh key={x} position={[x, 0, 0.08]} castShadow>
                <capsuleGeometry args={[0.13, 0.24, 6, 16]} rotation-x={Math.PI / 2} />
                <meshPhysicalMaterial {...glassProps(layer.color)} />
              </mesh>
            ))}
          </group>
        );
    }
  })();

  return (
    <group
      ref={group}
      position={[0, y, 0]}
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
        onToggle(layer.id);
      }}
    >
      {body}
      {hovered || layer.locked ? (
        <Html center position={[0, 0.62, 0]} distanceFactor={7}>
          <span className="pointer-events-none whitespace-nowrap rounded-full bg-card/90 px-3 py-1 text-[11px]">
            {layer.locked ? "🔒 " : ""}
            {layer.label}
          </span>
        </Html>
      ) : null}
    </group>
  );
}

export default function MannequinScene({
  className,
  layers,
  onToggle,
}: {
  className?: string;
  layers: LayerSpec[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className={className}>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 1.2, 5] , fov: 45 }}>
        <color attach="background" args={["#fbf1f7"]} />
        <DreamLights />

        {/* mannequin form */}
        <group position={[0, -0.6, 0]}>
          <mesh position={[0, 2.35, 0]} castShadow>
            <sphereGeometry args={[0.3, 24, 24]} />
            <meshPhysicalMaterial {...glassProps("#f4e8ff", { thickness: 0.8 })} />
          </mesh>
          <mesh position={[0, 1.55, 0]} castShadow>
            <capsuleGeometry args={[0.42, 0.9, 8, 24]} />
            <meshPhysicalMaterial {...glassProps("#fff0f7", { thickness: 1.4 })} />
          </mesh>
          <mesh position={[0, 0.35, 0]} castShadow>
            <cylinderGeometry args={[0.34, 0.26, 1.4, 24]} />
            <meshPhysicalMaterial {...glassProps("#fff0f7", { thickness: 1.4 })} />
          </mesh>
          <mesh position={[0, -0.42, 0]} receiveShadow>
            <cylinderGeometry args={[0.9, 1, 0.12, 32]} />
            <meshPhysicalMaterial {...glassProps("#efe2ff", { thickness: 1.8 })} />
          </mesh>
        </group>

        <group position={[0, -0.6, 0]}>
          {layers.map((l) => (
            <Layer key={l.id} layer={l} onToggle={onToggle} />
          ))}
        </group>

        <OrbitControls enablePan={false} minDistance={3.5} maxDistance={7} minPolarAngle={0.7} maxPolarAngle={1.6} />
      </Canvas>
    </div>
  );
}
