'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

function FloatingSpheres() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[0.5, 32, 32]} position={[-2, 1, -1]}>
          <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={0.2} />
        </Sphere>
      </Float>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.2}>
        <Sphere args={[0.3, 32, 32]} position={[2, -1, -1]}>
          <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.2} />
        </Sphere>
      </Float>
      <Float speed={1} rotationIntensity={0.5} floatIntensity={0.8}>
        <Sphere args={[0.4, 32, 32]} position={[0, 2, 1]}>
          <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.2} />
        </Sphere>
      </Float>
    </group>
  );
}

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 100, 200]} scale={1.5} position={[0, 0, 0]}>
      <MeshDistortMaterial
        color="#4f46e5"
        attach="material"
        distort={0.3}
        speed={1}
        roughness={0.1}
      />
    </Sphere>
  );
}

export default function BlogPost3DVisualization() {
  return (
    <Canvas className="w-full h-full">
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} castShadow />
      
      <AnimatedSphere />
      <FloatingSpheres />
      
      <OrbitControls 
        enableZoom={true} 
        autoRotate 
        autoRotateSpeed={0.3}
        enablePan={true}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
      />
    </Canvas>
  );
}