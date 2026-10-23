'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Icosahedron, MeshDistortMaterial, Torus, Sphere } from '@react-three/drei';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';

function MainBlob() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.15;
    ref.current.rotation.z = state.clock.elapsedTime * 0.08;
  });
  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
      <Icosahedron ref={ref} args={[1.6, 12]}>
        <MeshDistortMaterial
          color="#007BA7"
          emissive="#03202b"
          roughness={0.15}
          metalness={0.85}
          distort={0.4}
          speed={1.6}
        />
      </Icosahedron>
    </Float>
  );
}

function Accents() {
  return (
    <>
      <Float speed={2} floatIntensity={2} rotationIntensity={2}>
        <Torus args={[0.5, 0.16, 24, 64]} position={[2.6, 1.3, -1]}>
          <meshStandardMaterial color="#FF2D95" metalness={0.9} roughness={0.2} emissive="#7a1049" emissiveIntensity={0.4} />
        </Torus>
      </Float>
      <Float speed={1.6} floatIntensity={2.4} rotationIntensity={1.4}>
        <Sphere args={[0.34, 32, 32]} position={[-2.7, -1, -0.5]}>
          <meshStandardMaterial color="#007BA7" metalness={0.8} roughness={0.25} emissive="#005a7a" emissiveIntensity={0.4} />
        </Sphere>
      </Float>
      <Float speed={2.2} floatIntensity={1.6} rotationIntensity={2}>
        <Icosahedron args={[0.28, 0]} position={[2.2, -1.5, 0.5]}>
          <meshStandardMaterial color="#FF2D95" metalness={0.6} roughness={0.3} flatShading />
        </Icosahedron>
      </Float>
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1.4} color="#d6eef7" />
        <pointLight position={[-5, -3, 2]} intensity={2} color="#33b8e6" />
        <pointLight position={[5, -2, -3]} intensity={1.5} color="#FF2D95" />
        <MainBlob />
        <Accents />
      </Suspense>
    </Canvas>
  );
}
