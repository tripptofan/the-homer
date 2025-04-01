// src/components/Car.jsx
import React, { forwardRef, useRef, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';

// Import the Homer model
const Car = forwardRef(({ position, rotation }, ref) => {
  // Load The Homer model
  const { scene } = useGLTF('/the_homer_from_the_simpsons_low-poly.glb');
  
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    }
  }, [scene]);

  return (
    <primitive
      ref={ref}
      object={scene.clone()}
      position={position}
      rotation={rotation}
      scale={[0.05, .05, .05]} // Adjust scale to fit your scene
    />
  );
});

export default Car;