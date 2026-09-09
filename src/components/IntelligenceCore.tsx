"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

export type Quality = "high" | "low";

type PointerRef = React.MutableRefObject<{ x: number; y: number }>;

function circle(r: number, segments = 140): [number, number, number][] {
  const pts: [number, number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push([Math.cos(a) * r, Math.sin(a) * r, 0]);
  }
  return pts;
}

function fibonacciSphere(count: number, radius: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(1, count - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push(
      new THREE.Vector3(
        Math.cos(theta) * rad * radius,
        y * radius,
        Math.sin(theta) * rad * radius
      )
    );
  }
  return pts;
}

function Core({ quality, pointer }: { quality: Quality; pointer: PointerRef }) {
  const group = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Group>(null);
  const innerGlow = useRef<THREE.Mesh>(null);
  const cloud = useRef<THREE.Points>(null);
  const nodeRefs = useRef<THREE.Mesh[]>([]);
  const isLow = quality === "low";

  const nodes = useMemo(
    () => fibonacciSphere(isLow ? 9 : 15, 2.1),
    [isLow]
  );

  const links = useMemo(() => {
    const lines: [number, number, number][][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        if (a.distanceTo(b) < 2.5) {
          lines.push([
            [a.x, a.y, a.z],
            [b.x, b.y, b.z],
          ]);
        }
      }
    }
    return lines;
  }, [nodes]);

  const particleArray = useMemo(() => {
    // Deterministic PRNG so render stays pure & SSR-stable.
    let seed = 1337;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    const n = isLow ? 90 : 220;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (rand() - 0.5) * 16;
      arr[i * 3 + 1] = (rand() - 0.5) * 16;
      arr[i * 3 + 2] = (rand() - 0.5) * 16;
    }
    return arr;
  }, [isLow]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y += delta * 0.07;
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        pointer.current.y * 0.22,
        0.03
      );
      group.current.position.x = THREE.MathUtils.lerp(
        group.current.position.x,
        pointer.current.x * 0.14,
        0.03
      );
    }
    if (rings.current) {
      rings.current.rotation.x += delta * 0.035;
      rings.current.rotation.y += delta * 0.045;
    }
    if (cloud.current) {
      cloud.current.rotation.y = t * 0.015;
      cloud.current.position.y = Math.sin(t * 0.12) * 0.4;
    }
    if (innerGlow.current) {
      const s = 1 + Math.sin(t * 1.4) * 0.07;
      innerGlow.current.scale.setScalar(s);
    }
    nodeRefs.current.forEach((m, i) => {
      if (!m) return;
      const mat = m.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.5 + Math.sin(t * 1.1 + i * 1.7) * 0.35;
      const s = 1 + Math.sin(t * 0.9 + i * 1.3) * 0.18;
      m.scale.setScalar(s);
    });
  });

  return (
    <group ref={group}>
      {/* glass core */}
      <mesh>
        <icosahedronGeometry args={[1.05, 4]} />
        <meshPhysicalMaterial
          color="#dfe3ea"
          transparent
          opacity={0.6}
          roughness={0.12}
          metalness={0.35}
          clearcoat={1}
          clearcoatRoughness={0.15}
          envMapIntensity={0.5}
          depthWrite={false}
        />
      </mesh>

      {/* internal energy */}
      <mesh ref={innerGlow}>
        <sphereGeometry args={[0.52, 24, 24]} />
        <meshStandardMaterial
          color="#e8b96f"
          emissive="#d99f52"
          emissiveIntensity={2.6}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* wireframe shells */}
      <mesh rotation={[0.4, 0.2, 0]}>
        <icosahedronGeometry args={[1.62, 1]} />
        <meshBasicMaterial wireframe color="#3a4152" transparent opacity={0.16} />
      </mesh>
      <mesh rotation={[0.1, 0.6, 0.3]}>
        <icosahedronGeometry args={[1.95, 1]} />
        <meshBasicMaterial wireframe color="#a97b2f" transparent opacity={0.12} />
      </mesh>

      {/* node network */}
      {nodes.map((p, i) => (
        <mesh
          key={i}
          position={p}
          ref={(el) => {
            if (el) nodeRefs.current[i] = el;
          }}
        >
          <icosahedronGeometry args={[0.055, 0]} />
          <meshStandardMaterial
            color="#5b6472"
            emissive="#a97b2f"
            emissiveIntensity={0.55}
            metalness={0.85}
            roughness={0.3}
          />
        </mesh>
      ))}
      {links.map((pts, i) => (
        <Line
          key={i}
          points={pts}
          color="#6b7280"
          transparent
          opacity={0.22}
          lineWidth={1}
        />
      ))}

      {/* orbital rings */}
      <group ref={rings}>
        <Line points={circle(2.55)} color="#6b7280" transparent opacity={0.3} lineWidth={1} />
        <Line
          points={circle(2.9)}
          color="#a97b2f"
          transparent
          opacity={0.28}
          dashed
          dashSize={0.28}
          gapSize={0.34}
          lineWidth={1}
        />
        <Line
          points={circle(3.3)}
          color="#6b7280"
          transparent
          opacity={0.2}
          dashed
          dashSize={0.12}
          gapSize={0.55}
          lineWidth={1}
        />
      </group>

      {/* particle cloud */}
      <Points ref={cloud}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particleArray, 3]} />
        </bufferGeometry>
        <PointMaterial
          size={0.035}
          color="#6b7280"
          transparent
          opacity={0.55}
          sizeAttenuation
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

function webglAvailable(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl2") || c.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

/** Static fallback shown when WebGL is unavailable. */
function CoreFallback() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="absolute h-64 w-64 rounded-full border border-ink/10 animate-[rot_40s_linear_infinite]" />
      <div className="absolute h-52 w-52 rounded-full border border-gold/25 animate-[rot-rev_30s_linear_infinite]" />
      <div className="absolute h-24 w-24 rounded-full bg-gold/15 blur-2xl" />
      <div className="absolute h-14 w-14 rounded-full border border-gold/40" />
      <div className="absolute h-4 w-4 rounded-full bg-gold/80" />
    </div>
  );
}

/**
 * The RAIQEN intelligence core — an abstract computational system of
 * connected nodes, thin rings and slow particles. Follows the cursor
 * with subtle parallax. `offset` moves the camera right-of-center.
 */
export default function IntelligenceCore({
  quality = "high",
  offset = false,
  className,
}: {
  quality?: Quality;
  offset?: boolean;
  className?: string;
}) {
  const [ok] = useState<boolean | null>(() =>
    typeof window === "undefined" ? null : webglAvailable()
  );
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className={className} aria-hidden="true" role="presentation">
      {ok === false ? (
        <CoreFallback />
      ) : (
        <Canvas
          dpr={quality === "high" ? [1, 1.75] : [1, 1.4]}
          camera={{
            position: [offset ? 2.1 : 0, 0, offset ? 7.4 : 10.6],
            fov: 45,
          }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[4, 6, 5]} intensity={1.5} color="#ffffff" />
            <directionalLight position={[-6, -2, -4]} intensity={0.4} color="#ffffff" />
            <pointLight position={[0, 0, 0.4]} intensity={6} distance={9} color="#e3b46c" />
            <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.5}>
              <Core quality={quality} pointer={pointer} />
            </Float>
          </Suspense>
        </Canvas>
      )}
    </div>
  );
}
