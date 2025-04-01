// src/App.jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Suspense, useState, useEffect } from 'react';
import DrivingGame from './components/DrivingGame';

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas shadows>
        <Suspense fallback={null}>
          <DrivingGame />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
