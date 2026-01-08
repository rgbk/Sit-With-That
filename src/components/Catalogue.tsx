import { useMemo, Suspense } from 'react';
import { useSpring, animated } from '@react-spring/three';
import { PAGE_IMAGES, type ViewMode } from '../types';
import { Page } from './Page';

interface CatalogueProps {
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

// Total pages: cover + 10 interior + back = 12
const TOTAL_PAGES = 12;

export function Catalogue({
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
}: CatalogueProps) {
  // Calculate scale factor based on page dimensions
  const scale = 1 / Math.max(pageWidth, pageHeight) * 3;
  const scaledWidth = pageWidth * scale;
  const scaledHeight = pageHeight * scale;

  // Generate page data
  const pages = useMemo(() => {
    const result = [];
    for (let i = 0; i < TOTAL_PAGES; i++) {
      // Page 0 = front cover, pages 1-10 = interior, page 11 = back cover
      let frontImage = null;
      if (i >= 1 && i <= 10) {
        frontImage = `/images/${PAGE_IMAGES[i - 1]}`;
      }
      result.push({
        id: i,
        frontImage,
      });
    }
    return result;
  }, []);

  // Calculate positions based on view mode
  const getPageTransform = (index: number): { position: [number, number, number]; rotation: [number, number, number] } => {
    const w = scaledWidth + pageGap;

    switch (viewMode) {
      case 'spread': {
        // Fan out pages horizontally
        const totalWidth = TOTAL_PAGES * w;
        const startX = -totalWidth / 2 + w / 2;
        return {
          position: [startX + index * w, 0, 0],
          rotation: [0, 0, 0],
        };
      }

      case 'front': {
        // Stack all pages, show front cover on top
        return {
          position: [0, 0, index * 0.02],
          rotation: [0, 0, 0],
        };
      }

      case 'back': {
        // Stack all pages, show back cover
        return {
          position: [0, 0, (TOTAL_PAGES - 1 - index) * 0.02],
          rotation: [0, Math.PI, 0],
        };
      }

      case 'stacked': {
        // Neat vertical stack with slight offset
        return {
          position: [index * 0.03, -index * 0.03, index * stackSpacing],
          rotation: [0, 0, 0],
        };
      }

      case 'circular': {
        // Arrange in a circle
        const angle = (index / TOTAL_PAGES) * Math.PI * 2 - Math.PI / 2;
        const r = circleRadius * scale;
        return {
          position: [
            Math.cos(angle) * r,
            Math.sin(angle) * r,
            0,
          ],
          rotation: [0, 0, angle + Math.PI / 2],
        };
      }

      case 'chair': {
        // Chair-like curve arrangement
        const t = index / (TOTAL_PAGES - 1); // 0 to 1
        const r = circleRadius * scale * 0.8;

        // Chair shape: curved back and seat
        let x, y, z, rotX, rotY, rotZ;

        if (t < 0.5) {
          // Back of chair (vertical curve)
          const backT = t * 2;
          x = 0;
          y = r * (1 - Math.cos(backT * Math.PI * 0.5));
          z = -r * Math.sin(backT * Math.PI * 0.5);
          rotX = -backT * Math.PI * 0.5;
          rotY = 0;
          rotZ = 0;
        } else {
          // Seat of chair (horizontal)
          const seatT = (t - 0.5) * 2;
          x = 0;
          y = r;
          z = -r - seatT * scaledWidth * 2;
          rotX = -Math.PI * 0.5;
          rotY = 0;
          rotZ = 0;
        }

        return {
          position: [x, y, z],
          rotation: [rotX, rotY, rotZ],
        };
      }

      default:
        return {
          position: [0, 0, 0],
          rotation: [0, 0, 0],
        };
    }
  };

  return (
    <group>
      <Suspense fallback={null}>
        {pages.map((page, index) => {
          const transform = getPageTransform(index);

          return (
            <AnimatedPage
              key={page.id}
              position={transform.position}
              rotation={transform.rotation}
              width={scaledWidth}
              height={scaledHeight}
              frontTexture={page.frontImage}
              showSpotUV={showSpotUV}
              spotUVIntensity={spotUVIntensity}
              showPerforations={showPerforations}
              imageMargins={{
                top: imageMargins.top * scale,
                bottom: imageMargins.bottom * scale,
                left: imageMargins.left * scale,
                right: imageMargins.right * scale,
              }}
              animationSpeed={animationSpeed}
              onClick={() => onPageClick(index)}
              isCurrentPage={index === currentPage}
            />
          );
        })}
      </Suspense>
    </group>
  );
}

interface AnimatedPageProps {
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
  animationSpeed: number;
  onClick: () => void;
  isCurrentPage: boolean;
}

function AnimatedPage({
  position,
  rotation,
  width,
  height,
  frontTexture,
  showSpotUV,
  spotUVIntensity,
  showPerforations,
  imageMargins,
  animationSpeed,
  onClick,
}: AnimatedPageProps) {
  const spring = useSpring({
    position,
    rotation,
    config: {
      mass: 1,
      tension: 170 * animationSpeed,
      friction: 26,
    },
  });

  return (
    <animated.group
      position={spring.position as unknown as [number, number, number]}
      rotation={spring.rotation as unknown as [number, number, number]}
    >
      <Page
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
        width={width}
        height={height}
        frontTexture={frontTexture}
        showSpotUV={showSpotUV}
        spotUVIntensity={spotUVIntensity}
        showPerforations={showPerforations}
        imageMargins={imageMargins}
        onClick={onClick}
      />
    </animated.group>
  );
}
