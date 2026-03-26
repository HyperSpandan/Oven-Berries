import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Environment } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function Bean({ position, rotation, scale, speed }: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  speed: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const initialY = position[1];

  useFrame((state) => {
    if (!meshRef.current) return;
    const scrollY = window.scrollY;
    const time = state.clock.getElapsedTime();
    
    // Parallax effect: beans fall as we scroll
    meshRef.current.position.y = initialY - (scrollY * 0.04 * speed);
    
    // Subtle horizontal sway
    meshRef.current.position.x = position[0] + Math.sin(time * 0.5 + initialY) * 0.2;
    
    // Add some continuous rotation
    meshRef.current.rotation.x += 0.01 * speed;
    meshRef.current.rotation.z += 0.005 * speed;
  });

  return (
    <Float
      speed={speed}
      rotationIntensity={0.5}
      floatIntensity={0.5}
    >
      <mesh
        ref={meshRef}
        position={position}
        rotation={rotation}
        scale={[scale, scale * 0.6, scale * 0.5]}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color="#3d2b1f" 
          roughness={0.3} 
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
}

export default function FallingBeans3D() {
  const beans = useMemo(() => {
    return Array.from({ length: 80 }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 35, // X spread
        Math.random() * 40 - 5,     // Y start (localized to hero)
        (Math.random() - 0.5) * 15, // Z depth
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ] as [number, number, number],
      scale: 0.2 + Math.random() * 0.3,
      speed: 1.2 + Math.random() * 1.8,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={60} />
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
        
        <Environment preset="studio" />
        
        {beans.map((bean, i) => (
          <Bean key={i} {...bean} />
        ))}
      </Canvas>
    </div>
  );
}
