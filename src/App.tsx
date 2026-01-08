import { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { useControls, folder, button } from 'leva';
import { Scene } from './components/Scene';
import { type ViewMode, DEFAULT_SETTINGS } from './types';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState(0);

  // Leva control panel
  const controls = useControls({
    'View Mode': folder({
      viewMode: {
        value: DEFAULT_SETTINGS.viewMode as ViewMode,
        options: {
          'Spread': 'spread',
          'Front Cover': 'front',
          'Back Cover': 'back',
          'Stacked': 'stacked',
          'Circular': 'circular',
          'Chair': 'chair',
        },
        label: 'Mode',
      },
    }),

    'Page Dimensions': folder({
      pageWidth: {
        value: DEFAULT_SETTINGS.pageWidth,
        min: 4,
        max: 16,
        step: 0.5,
        label: 'Width',
      },
      pageHeight: {
        value: DEFAULT_SETTINGS.pageHeight,
        min: 4,
        max: 20,
        step: 0.5,
        label: 'Height',
      },
    }),

    'Image Margins': folder({
      imageMarginTop: {
        value: DEFAULT_SETTINGS.imageMarginTop,
        min: 0,
        max: 2,
        step: 0.1,
        label: 'Top',
      },
      imageMarginBottom: {
        value: DEFAULT_SETTINGS.imageMarginBottom,
        min: 0,
        max: 2,
        step: 0.1,
        label: 'Bottom',
      },
      imageMarginLeft: {
        value: DEFAULT_SETTINGS.imageMarginLeft,
        min: 0,
        max: 2,
        step: 0.1,
        label: 'Left',
      },
      imageMarginRight: {
        value: DEFAULT_SETTINGS.imageMarginRight,
        min: 0,
        max: 2,
        step: 0.1,
        label: 'Right',
      },
    }),

    'Effects': folder({
      showSpotUV: {
        value: DEFAULT_SETTINGS.showSpotUV,
        label: 'Spot UV Varnish',
      },
      spotUVIntensity: {
        value: DEFAULT_SETTINGS.spotUVIntensity,
        min: 0,
        max: 1,
        step: 0.05,
        label: 'UV Intensity',
        render: (get) => get('Effects.showSpotUV'),
      },
      showPerforations: {
        value: DEFAULT_SETTINGS.showPerforations,
        label: 'Show Perforations',
      },
    }),

    'Layout': folder({
      pageGap: {
        value: DEFAULT_SETTINGS.pageGap,
        min: 0,
        max: 0.5,
        step: 0.01,
        label: 'Page Gap',
      },
      circleRadius: {
        value: DEFAULT_SETTINGS.circleRadius,
        min: 1,
        max: 8,
        step: 0.5,
        label: 'Circle Radius',
      },
      stackSpacing: {
        value: DEFAULT_SETTINGS.stackSpacing,
        min: 0.01,
        max: 0.2,
        step: 0.01,
        label: 'Stack Spacing',
      },
    }),

    'Animation': folder({
      animationSpeed: {
        value: DEFAULT_SETTINGS.animationSpeed,
        min: 0.1,
        max: 3,
        step: 0.1,
        label: 'Speed',
      },
    }),

    'Navigation': folder({
      prevPage: button(() => setCurrentPage((p) => Math.max(0, p - 1)), {
        disabled: false,
      }),
      nextPage: button(() => setCurrentPage((p) => Math.min(11, p + 1)), {
        disabled: false,
      }),
    }),
  });

  const handlePageClick = useCallback((index: number) => {
    setCurrentPage(index);
  }, []);

  return (
    <div className="app">
      <Canvas
        shadows
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={['#f0f0f0']} />
        <Scene
          viewMode={controls.viewMode as ViewMode}
          currentPage={currentPage}
          pageWidth={controls.pageWidth}
          pageHeight={controls.pageHeight}
          imageMargins={{
            top: controls.imageMarginTop,
            bottom: controls.imageMarginBottom,
            left: controls.imageMarginLeft,
            right: controls.imageMarginRight,
          }}
          showSpotUV={controls.showSpotUV}
          spotUVIntensity={controls.spotUVIntensity}
          showPerforations={controls.showPerforations}
          animationSpeed={controls.animationSpeed}
          pageGap={controls.pageGap}
          circleRadius={controls.circleRadius}
          stackSpacing={controls.stackSpacing}
          onPageClick={handlePageClick}
        />
      </Canvas>

      <div className="info-panel">
        <h1>Sit With That</h1>
        <p>Exhibition Catalogue Visualizer</p>
        <p className="current-page">Page {currentPage + 1} of 12</p>
      </div>
    </div>
  );
}

export default App;
