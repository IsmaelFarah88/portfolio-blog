'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Box, Sphere, Torus, Octahedron, Text } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';

function TechOrbs({ technologies }: { technologies: string[] }) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  // Create positions for orbs in a circle
  const positions = technologies.map((_, i) => {
    const angle = (i / technologies.length) * Math.PI * 2;
    const radius = 3;
    return [
      Math.cos(angle) * radius,
      Math.sin(angle * 2) * 0.5,
      Math.sin(angle) * radius
    ];
  });

  return (
    <group ref={groupRef}>
      {technologies.map((tech, i) => {
        const [x, y, z] = positions[i];
        const isHovered = hovered === tech;
        
        return (
          <group key={tech} position={[x, y, z]}>
            <Sphere 
              args={[isHovered ? 0.8 : 0.6, 32, 32]} 
              onPointerEnter={() => setHovered(tech)}
              onPointerLeave={() => setHovered(null)}
            >
              <meshStandardMaterial 
                color={isHovered ? "#8b5cf6" : "#4f46e5"} 
                emissive={isHovered ? "#8b5cf6" : "#4f46e5"}
                emissiveIntensity={isHovered ? 0.3 : 0.1}
                metalness={0.5}
                roughness={0.2}
              />
            </Sphere>
            {isHovered && (
              <Text
                position={[0, 1.2, 0]}
                fontSize={0.3}
                color="white"
                anchorX="center"
                anchorY="middle"
              >
                {tech}
              </Text>
            )}
          </group>
        );
      })}
    </group>
  );
}

function GeometricShapes() {
  const boxRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const octahedronRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (boxRef.current) {
      boxRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      boxRef.current.rotation.y = state.clock.elapsedTime * 0.4;
    }
    if (torusRef.current) {
      torusRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      torusRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
    if (octahedronRef.current) {
      octahedronRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      octahedronRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <>
      <Box ref={boxRef} args={[1, 1, 1]} position={[-3, -2, 0]}>
        <meshStandardMaterial color="#06b6d4" metalness={0.7} roughness={0.3} />
      </Box>
      <Torus ref={torusRef} args={[0.8, 0.3, 16, 100]} position={[3, -2, 0]}>
        <meshStandardMaterial color="#10b981" metalness={0.7} roughness={0.3} />
      </Torus>
      <Octahedron ref={octahedronRef} args={[0.9]} position={[0, -3, -2]}>
        <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
      </Octahedron>
    </>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  const particleCount = 100;
  
  useEffect(() => {
    if (particlesRef.current) {
      const positions = new Float32Array(particleCount * 3);
      
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      }
      
      particlesRef.current.geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
      );
    }
  }, []);
  
  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime();
      particlesRef.current.rotation.y = time * 0.05;
    }
  });
  
  return (
    <instancedMesh ref={particlesRef} args={[undefined, undefined, particleCount]}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#8b5cf6" transparent opacity={0.6} />
    </instancedMesh>
  );
}

export default function Project3DVisualization({ technologies }: { technologies: string[] }) {
  return (
    <Canvas className="w-full h-full" camera={{ position: [0, 0, 8], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={1} castShadow />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      
      <TechOrbs technologies={technologies} />
      <GeometricShapes />
      <FloatingParticles />
      
      <OrbitControls 
        enableZoom={true} 
        autoRotate 
        autoRotateSpeed={0.5}
        enablePan={true}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 4}
      />
      
      {/* Environment */}
      <fog attach="fog" args={['#0f172a', 10, 20]} />
    </Canvas>
  );
}