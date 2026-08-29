import { Environment, Lightformer } from "@react-three/drei";

/** Shared glossy-glass material props — pearly, translucent, iridescent. */
export function glassProps(color: string, opts?: { rough?: number; thickness?: number }) {
  return {
    color,
    transmission: 0.92,
    thickness: opts?.thickness ?? 1.1,
    roughness: opts?.rough ?? 0.08,
    ior: 1.4,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    iridescence: 1,
    iridescenceIOR: 1.3,
    transparent: true,
    opacity: 0.95,
  } as const;
}

/** Soft pastel studio lighting used by every HEAVELY scene. */
export function DreamLights() {
  return (
    <>
      <ambientLight intensity={0.75} />
      <hemisphereLight args={["#ffe6f1", "#dfe9ff", 0.9]} />
      <directionalLight position={[4, 8, 6]} intensity={1.6} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-5, 3, -3]} intensity={18} color="#c9b8ff" />
      <pointLight position={[5, 2, 4]} intensity={14} color="#ffc7de" />
      <Environment>
        <Lightformer intensity={2.4} position={[0, 5, 0]} scale={[12, 12, 1]} color="#fff4fa" />
        <Lightformer
          intensity={1.6}
          color="#bcd6ff"
          position={[-6, 1, -1]}
          rotation-y={Math.PI / 2}
          scale={[20, 2, 1]}
        />
        <Lightformer
          intensity={1.4}
          color="#ffd3e8"
          position={[6, 1, 1]}
          rotation-y={-Math.PI / 2}
          scale={[20, 2, 1]}
        />
      </Environment>
    </>
  );
}
