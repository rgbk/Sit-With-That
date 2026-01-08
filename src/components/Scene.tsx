import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Catalogue } from './Catalogue';
import { ViewMode } from '../types';

interface SceneProps {
  viewMode: ViewMode;
  currentPage: number;
  pageWidth: number;
  pageHeight: number;
  imageMargins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  showSpotUV: boolean;
  spotUVIntensity: number;
  showPerforations: boolean;
  animationSpeed: number;
  pageGap: number;
  circleRadius: number;
  stackSpacing: number;
  onPageClick: (index: number) => void;
}

export function Scene({
  viewMode,
  currentPage,
  pageWidth,
  pageHeight,
  imageMargins,
  showSpotUV,
  spotUVIntensity,
  showPerforations,
  animationSpeed,
  pageGap,
  circleRadius,
  stackSpacing,
  onPageClick,
}: SceneProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.3}
      />

      {/* Environment for reflections (important for spot UV effect) */}
      <Environment preset="studio" />

      {/* Camera controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={20}
        autoRotate={false}
      />

      {/* Ground shadow */}
      <ContactShadows
        position={[0, -3, 0]}
        opacity={0.4}
        scale={20}
        blur={2}
        far={4}
      />

      {/* Catalogue */}
      <Catalogue
        viewMode={viewMode}
        currentPage={currentPage}
        pageWidth={pageWidth}
        pageHeight={pageHeight}
        imageMargins={imageMargins}
        showSpotUV={showSpotUV}
        spotUVIntensity={spotUVIntensity}
        showPerforations={showPerforations}
        animationSpeed={animationSpeed}
        pageGap={pageGap}
        circleRadius={circleRadius}
        stackSpacing={stackSpacing}
        onPageClick={onPageClick}
      />
    </>
  );
}
