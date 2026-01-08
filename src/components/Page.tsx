import { useRef, useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader, DoubleSide, Mesh } from 'three';

interface PageProps {
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
  frontTexture: string | null;
  showSpotUV: boolean;
  spotUVIntensity: number;
  showPerforations: boolean;
  imageMargins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  onClick?: () => void;
}

export function Page({
  position,
  rotation,
  width,
  height,
  frontTexture,
  showSpotUV,
  spotUVIntensity,
  showPerforations,
  imageMargins,
  onClick,
}: PageProps) {
  const meshRef = useRef<Mesh>(null);

  // Load textures
  const frontTex = useLoader(
    TextureLoader,
    frontTexture || '/placeholder-front.png',
    undefined,
    () => {} // error handler
  );

  // Calculate image area within margins
  const imageWidth = width - imageMargins.left - imageMargins.right;
  const imageHeight = height - imageMargins.top - imageMargins.bottom;

  return (
    <group position={position} rotation={rotation}>
      {/* Main page */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[width, height, 0.01]} />
        <meshStandardMaterial
          color={0xffffff}
          roughness={0.8}
          side={DoubleSide}
        />
      </mesh>

      {/* Front image area */}
      {frontTexture && (
        <mesh position={[0, 0, 0.006]}>
          <planeGeometry args={[imageWidth, imageHeight]} />
          <meshStandardMaterial
            map={frontTex}
            roughness={showSpotUV ? 0.05 : 0.5}
            metalness={showSpotUV ? spotUVIntensity * 0.2 : 0}
            envMapIntensity={showSpotUV ? 2 : 0.5}
          />
        </mesh>
      )}

      {/* Back side - text placeholder */}
      <mesh position={[0, 0, -0.006]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[width * 0.8, height * 0.8]} />
        <meshStandardMaterial
          color={0xf0f0f0}
          roughness={0.95}
        />
      </mesh>

      {/* Perforation line at top */}
      {showPerforations && (
        <PerforationLine
          width={width}
          yPosition={height / 2 - 0.3}
        />
      )}
    </group>
  );
}

function PerforationLine({ width, yPosition }: { width: number; yPosition: number }) {
  const dots = useMemo(() => {
    const count = Math.floor(width / 0.15);
    const spacing = width / count;
    const positions: [number, number, number][] = [];

    for (let i = 0; i < count; i++) {
      positions.push([
        -width / 2 + spacing * i + spacing / 2,
        yPosition,
        0.007,
      ]);
    }
    return positions;
  }, [width, yPosition]);

  return (
    <group>
      {dots.map((pos, i) => (
        <mesh key={i} position={pos}>
          <circleGeometry args={[0.02, 8]} />
          <meshBasicMaterial color={0xcccccc} />
        </mesh>
      ))}
    </group>
  );
}
