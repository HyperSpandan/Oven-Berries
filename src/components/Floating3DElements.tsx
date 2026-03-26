import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerspectiveCamera, Text } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const EMOJIS = ["🍰", "☕", "🍕", "🥐", "🥯", "🥖", "🥨", "🍩"];

function FloatingEmoji({ emoji, position, speed, rotationIntensity, floatIntensity }: { 
  emoji: string; 
  position: [number, number, number]; 
  speed: number;
  rotationIntensity: number;
  floatIntensity: number;
}) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    const scrollY = window.scrollY;
    meshRef.current.position.y = position[1] + (scrollY * 0.01);
  });

  return (
    <Float
      speed={speed}
      rotationIntensity={rotationIntensity}
      floatIntensity={floatIntensity}
      position={position}
    >
      <group ref={meshRef}>
        <Text
          fontSize={1.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {emoji}
        </Text>
      </group>
    </Float>
  );
}

export default function Floating3DElements() {
  const elements = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      emoji: EMOJIS[i % EMOJIS.length],
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5,
      ] as [number, number, number],
      speed: 1 + Math.random() * 2,
      rotationIntensity: 0.5 + Math.random(),
      floatIntensity: 0.5 + Math.random(),
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 10]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {elements.map((el, i) => (
          <FloatingEmoji key={i} {...el} />
        ))}
      </Canvas>
    </div>
  );
}
