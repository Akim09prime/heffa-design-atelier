
import React, { useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { FurnitureModule as FurnitureModuleType } from '../../types';
import { Vector3 } from 'three';

interface FurnitureModuleProps {
  module: FurnitureModuleType;
  isSelected?: boolean;
  onClick?: () => void;
}

// Placeholder model for modules without a specific model
const PlaceholderBox: React.FC<{ 
  width: number; 
  height: number; 
  depth: number; 
  position: [number, number, number];
  rotation: [number, number, number];
  isSelected?: boolean;
  onClick?: () => void;
}> = ({ width, height, depth, position, rotation, isSelected = false, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (meshRef.current && isSelected) {
      meshRef.current.scale.lerp(new Vector3(1.02, 1.02, 1.02), 0.1);
    } else if (meshRef.current) {
      meshRef.current.scale.lerp(new Vector3(1, 1, 1), 0.1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation.map(r => r * Math.PI / 180) as [number, number, number]}
      castShadow
      receiveShadow
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial 
        color={isSelected ? "#B29978" : hovered ? "#D5C7B2" : "#E7DFD1"} 
        metalness={0.1} 
        roughness={0.8} 
      />
    </mesh>
  );
};

export const FurnitureModule: React.FC<FurnitureModuleProps> = ({ 
  module, 
  isSelected = false,
  onClick 
}) => {
  const { width, height, depth, position, rotation, modelUrl } = module;
  
  // If we have a model URL, we'll try to load it
  if (modelUrl) {
    try {
      const { scene } = useGLTF(modelUrl);
      
      return (
        <primitive
          object={scene.clone()}
          position={position}
          rotation={rotation.map(r => r * Math.PI / 180) as [number, number, number]}
          scale={[1, 1, 1]}
          onClick={onClick}
        />
      );
    } catch (error) {
      console.error("Failed to load 3D model:", error);
      // Fall back to placeholder if model loading fails
    }
  }
  
  // Use placeholder for modules without models or if loading fails
  return (
    <PlaceholderBox
      width={width}
      height={height}
      depth={depth}
      position={position}
      rotation={rotation}
      isSelected={isSelected}
      onClick={onClick}
    />
  );
};
