// src/components/Ground.jsx
import React, { useMemo } from 'react';

const Ground = () => {
  // Create a large plane for the ground
  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, 0, 0]} 
      receiveShadow
    >
      <planeGeometry args={[100, 100]} />
      <meshStandardMaterial 
        color="#8d99ae" 
        roughness={0.8}
        metalness={0.2}
      />
      
      {/* Add a grid to help with orientation */}
      <gridHelper 
        args={[100, 100, '#222222', '#333333']} 
        position={[0, 0.01, 0]} 
        rotation={[Math.PI / 2, 0, 0]}
      />
      
      {/* Add buildings */}
      <Buildings />
      
      {/* Add ramps */}
      <Ramps />
    </mesh>
  );
};

// City buildings to drive around
const Buildings = () => {
  // Use useMemo to ensure buildings are created once and stay static
  const buildings = useMemo(() => {
    return Array.from({ length: 20 }).map((_, i) => {
      // Create a deterministic pattern instead of random positions
      // This ensures buildings stay in the same place
      const angle = (i / 20) * Math.PI * 2;
      const radius = 15 + (i % 3) * 5; // Buildings at different distances
      
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      
      // Building properties
      const width = 2 + (i % 3);
      const depth = 2 + ((i + 1) % 3);
      const height = 3 + (i % 5) * 2;
      
      return {
        position: [x, height / 2, z], // Position adjusted so bottom is at y=0
        size: [width, height, depth],
        color: ['#2b2d42', '#8d99ae', '#457b9d', '#e63946', '#1d3557'][i % 5]
      };
    });
  }, []);
  
  return (
    <group>
      {buildings.map((building, i) => (
        <mesh 
          key={i} 
          position={building.position} 
          castShadow 
          receiveShadow
        >
          <boxGeometry args={building.size} />
          <meshStandardMaterial color={building.color} />
        </mesh>
      ))}
      
      {/* Add some additional landmark buildings in the center */}
      <mesh position={[0, 10, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 20, 3]} />
        <meshStandardMaterial color="#1d3557" />
      </mesh>
      
      {/* Add some smaller buildings around the city */}
      {Array.from({ length: 40 }).map((_, i) => {
        const angle = (i / 40) * Math.PI * 2;
        const radius = 25 + (i % 5) * 3;
        
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        const height = 1 + (i % 3);
        
        return (
          <mesh 
            key={`small-${i}`} 
            position={[x, height / 2, z]} // Position adjusted so bottom is at y=0
            castShadow 
            receiveShadow
          >
            <boxGeometry args={[1.5, height, 1.5]} />
            <meshStandardMaterial color="#8d99ae" />
          </mesh>
        );
      })}
    </group>
  );
};

export default Ground;

// Ramps component to add wedge-shaped obstacles
const Ramps = () => {
  // Use useMemo to ensure ramps are created once and stay static
  const ramps = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => {
      // Create ramps in interesting locations
      const angle = (i / 8) * Math.PI * 2;
      const radius = 10;
      
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      
      return {
        position: [x, 0, z], // Position at ground level (y=0)
        rotation: [0, angle + Math.PI, 0], // Rotate to face away from center
        color: ['#e63946', '#457b9d'][i % 2]
      };
    });
  }, []);
  
  return (
    <group>
      {ramps.map((ramp, i) => (
        <RampWedge 
          key={i} 
          position={ramp.position} 
          rotation={ramp.rotation} 
          color={ramp.color} 
        />
      ))}
      
      {/* Add a few more challenging ramps */}
      <RampWedge 
        position={[0, 0, 20]} // Position at ground level
        rotation={[0, Math.PI, 0]} 
        scale={[2, 1.5, 2]} 
        color="#1d3557" 
      />
      <RampWedge 
        position={[-20, 0, 0]} // Position at ground level
        rotation={[0, Math.PI / 2, 0]} 
        scale={[2, 2, 2]} 
        color="#e63946" 
      />
      <RampWedge 
        position={[20, 0, 0]} // Position at ground level
        rotation={[0, -Math.PI / 2, 0]} 
        scale={[2, 1.8, 2]} 
        color="#457b9d" 
      />
    </group>
  );
};

// Individual ramp wedge using simple geometries
const RampWedge = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1], color = "#e63946" }) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Base of the ramp - positioned to sit exactly on the ground */}
      <mesh castShadow receiveShadow position={[0, 0.05, 0]}>
        <boxGeometry args={[3, 0.1, 4]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Sloped part of the ramp */}
      <mesh castShadow receiveShadow position={[0, 0.75, 1]}>
        {/* Use a custom rotated geometry to create the ramp */}
        <group rotation={[-Math.PI/6, 0, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[3, 0.1, 3]} />
            <meshStandardMaterial color={color} />
          </mesh>
        </group>
      </mesh>
    </group>
  );
}