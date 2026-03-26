import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls, Float, Text, Cylinder, ContactShadows } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function CupModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.005;
  });

  return (
    <group ref={groupRef}>
      {/* Cup Body - Tapered Cylinder */}
      <Cylinder args={[1, 0.75, 2.8, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
      </Cylinder>
      
      {/* Cup Sleeve (Branding Area) */}
      <Cylinder args={[1.01, 0.88, 1.2, 32]} position={[0, -0.1, 0]}>
        <meshStandardMaterial color="#3d2b1f" roughness={0.8} />
      </Cylinder>

      {/* Branding Text */}
      <Text
        position={[0, 0, 1.02]}
        fontSize={0.15}
        color="#FDFCF0"
        font="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD7K83om0DzQF9i8Lks3_Xm9f.woff"
        anchorX="center"
        anchorY="middle"
        rotation={[0, 0, 0]}
      >
        COTTAGE COFFEE
      </Text>

      {/* Cup Top Lid */}
      <Cylinder args={[1.08, 1.08, 0.2, 32]} position={[0, 1.45, 0]}>
        <meshStandardMaterial color="#f5f5f5" roughness={0.1} />
      </Cylinder>
      
      {/* Lid Top */}
      <Cylinder args={[0.5, 0.5, 0.15, 32]} position={[0, 1.6, 0]}>
        <meshStandardMaterial color="#f5f5f5" roughness={0.1} />
      </Cylinder>
    </group>
  );
}

export default function CoffeeCup3D({ className }: { className?: string }) {
  return (
    <div 
      className={className} 
      style={{ 
        width: '100%', 
        height: '100%', 
        minHeight: '400px', 
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Canvas
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        camera={{ position: [0, 0, 5], fov: 45 }}
        shadows
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        
        <Suspense fallback={null}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <CupModel />
          </Float>
          <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
        </Suspense>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
