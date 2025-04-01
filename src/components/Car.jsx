// src/components/Car.jsx
import React, { forwardRef, useRef } from 'react';
import { useGLTF } from '@react-three/drei';

// For simplicity, we'll use a basic box as a car
// In a real game, you would import a car model with useGLTF
const Car = forwardRef(({ position, rotation }, ref) => {
  const materialRef = useRef();

  return (
    <group ref={ref} position={position} rotation={rotation}>
      {/* Car body */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.5, 3]} />
        <meshStandardMaterial ref={materialRef} color="#e63946" />
      </mesh>
      
      {/* Car top */}
      <mesh castShadow position={[0, 0.5, -0.2]}>
        <boxGeometry args={[1.2, 0.5, 1.5]} />
        <meshStandardMaterial color="#457b9d" />
      </mesh>
      
      {/* Wheels */}
      <Wheel position={[-0.8, -0.25, 0.7]} />
      <Wheel position={[0.8, -0.25, 0.7]} />
      <Wheel position={[-0.8, -0.25, -0.7]} />
      <Wheel position={[0.8, -0.25, -0.7]} />
    </group>
  );
});

// Simple wheel component
const Wheel = ({ position }) => {
  return (
    <mesh castShadow position={position}>
      <cylinderGeometry args={[0.3, 0.3, 0.2, 32]} rotation={[Math.PI / 2, 0, 0]} />
      <meshStandardMaterial color="#2a2a2a" />
    </mesh>
  );
};

export default Car;

// Uncomment and use this if you want to load a real car model
/*
const Car = forwardRef(({ position, rotation }, ref) => {
  // Replace this URL with a real model URL
  const { scene } = useGLTF('https://example.com/path-to-car-model.glb');
  
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
      scale={[0.01, 0.01, 0.01]} // Adjust scale as needed for your model
    />
  );
});
*/