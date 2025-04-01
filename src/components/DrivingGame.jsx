// src/components/DrivingGame.jsx
import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { Vector3, MathUtils } from 'three';
import Car from './Car';
import Ground from './Ground';

const DrivingGame = () => {
  // Game state
  const [carPosition, setCarPosition] = useState([0, 0.5, 0]);
  const [carRotation, setCarRotation] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [steering, setSteering] = useState(0);
  
  // Constants
  const MAX_SPEED = 0.2;
  const ACCELERATION = 0.01;
  const DECELERATION = 0.005;
  const STEERING_SPEED = 0.03;  // Increased for better responsiveness
  const STEERING_RETURN = 0.02;  // Increased to center steering faster
  
  // References
  const carRef = useRef();
  const cameraRef = useRef();

  // Handle keyboard input
  useEffect(() => {
    const keys = {};
    
    const handleKeyDown = (e) => {
      keys[e.key.toLowerCase()] = true;
    };
    
    const handleKeyUp = (e) => {
      keys[e.key.toLowerCase()] = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Game loop for controls
    const interval = setInterval(() => {
      // Acceleration (W - forward, S - backward)
      if (keys['w']) {
        setSpeed((prev) => Math.min(prev + ACCELERATION, MAX_SPEED));
      } else if (keys['s']) {
        setSpeed((prev) => Math.max(prev - ACCELERATION, -MAX_SPEED / 1.5));
      } else {
        // Deceleration when no keys pressed
        setSpeed((prev) => {
          if (Math.abs(prev) < DECELERATION) return 0;
          return prev > 0 ? prev - DECELERATION : prev + DECELERATION;
        });
      }
      
      // Steering (A - left, D - right)
      if (keys['a']) {
        // Increase responsiveness when changing direction
        const steeringChange = steering < 0 ? STEERING_SPEED * 2 : STEERING_SPEED;
        setSteering((prev) => Math.min(prev + steeringChange, 1));
      } else if (keys['d']) {
        // Increase responsiveness when changing direction
        const steeringChange = steering > 0 ? STEERING_SPEED * 2 : STEERING_SPEED;
        setSteering((prev) => Math.max(prev - steeringChange, -1));
      } else {
        // Return steering to center
        setSteering((prev) => {
          if (Math.abs(prev) < STEERING_RETURN) return 0;
          return prev > 0 ? prev - STEERING_RETURN : prev + STEERING_RETURN;
        });
      }
    }, 16);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      clearInterval(interval);
    };
  }, []);
  
  // Update car position and rotation
  useFrame(() => {
    if (!carRef.current) return;
    
    // Calculate new position based on speed and rotation
    const direction = new Vector3(
      Math.sin(carRotation) * speed,
      0,
      Math.cos(carRotation) * speed
    );
    
    // Update car rotation based on steering (only when moving)
    const steeringFactor = Math.abs(speed) > 0.01 ? steering * (speed / MAX_SPEED) * 0.025 : 0;
    setCarRotation((prev) => prev + steeringFactor);
    
    // Update car position
    setCarPosition(([x, y, z]) => [
      x + direction.x,
      y,
      z + direction.z
    ]);
    
    // Update car model
    carRef.current.position.set(...carPosition);
    carRef.current.rotation.y = carRotation;
    
    // Update camera position to follow the car
    if (cameraRef.current) {
      // Position camera behind the car
      const cameraOffset = new Vector3(
        -Math.sin(carRotation) * 5,
        3,
        -Math.cos(carRotation) * 5
      );
      
      // Smoothly move camera to new position
      cameraRef.current.position.lerp(
        new Vector3(...carPosition).add(cameraOffset),
        0.1
      );
      
      // Make camera look at car
      cameraRef.current.lookAt(...carPosition);
    }
  });

  return (
    <>
      {/* Camera setup for 3rd person perspective */}
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[0, 3, -5]}
        fov={75}
      />
      
      {/* Car */}
      <Car ref={carRef} position={carPosition} rotation={[0, carRotation, 0]} />
      
      {/* Environment */}
      <Ground />
      <Environment preset="sunset" />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
    </>
  );
};

export default DrivingGame;