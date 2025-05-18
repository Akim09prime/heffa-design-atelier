
import React, { useRef, useState, useEffect } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { FurnitureModule as FurnitureModuleType } from '../../types';
import * as THREE from 'three';

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
  textureUrl?: string;
  materialType?: string;
}> = ({ 
  width, 
  height, 
  depth, 
  position, 
  rotation, 
  isSelected = false, 
  onClick,
  textureUrl,
  materialType
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  
  // Load texture if URL is provided
  useEffect(() => {
    if (textureUrl) {
      const loader = new THREE.TextureLoader();
      loader.load(
        textureUrl,
        (loadedTexture) => {
          loadedTexture.wrapS = THREE.RepeatWrapping;
          loadedTexture.wrapT = THREE.RepeatWrapping;
          loadedTexture.repeat.set(1, 1);
          setTexture(loadedTexture);
        },
        undefined,
        (error) => {
          console.error('Error loading texture:', error);
        }
      );
    }
  }, [textureUrl]);

  useFrame(() => {
    if (meshRef.current && isSelected) {
      meshRef.current.scale.lerp(new THREE.Vector3(1.02, 1.02, 1.02), 0.1);
    } else if (meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  // Selection outline effect
  const outlineColor = isSelected ? new THREE.Color(0x4c9aff) : new THREE.Color(0x000000);
  const outlineOpacity = isSelected ? 0.8 : 0;

  return (
    <group>
      {/* Selection outline */}
      <mesh
        position={position}
        rotation={rotation.map(r => r * Math.PI / 180) as [number, number, number]}
        scale={[1.02, 1.02, 1.02]}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshBasicMaterial
          color={outlineColor}
          transparent={true}
          opacity={outlineOpacity}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Main mesh */}
      <mesh
        ref={meshRef}
        position={position}
        rotation={rotation.map(r => r * Math.PI / 180) as [number, number, number]}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onClick && onClick();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[width, height, depth]} />
        {texture ? (
          <meshStandardMaterial 
            map={texture}
            metalness={0.1} 
            roughness={0.8}
            color={isSelected ? new THREE.Color(0xffffff).multiplyScalar(1.2) : 0xffffff} 
          />
        ) : (
          <meshStandardMaterial 
            color={isSelected ? "#B29978" : hovered ? "#D5C7B2" : "#E7DFD1"} 
            metalness={0.1} 
            roughness={0.8} 
          />
        )}
      </mesh>
    </group>
  );
};

export const FurnitureModule: React.FC<FurnitureModuleProps> = ({ 
  module, 
  isSelected = false,
  onClick 
}) => {
  const { width, height, depth, position, rotation, modelUrl } = module;
  
  // Find the main body material texture URL if available
  const bodyMaterial = module.materials.find(m => m.part === 'body');
  const frontMaterial = module.materials.find(m => m.part === 'door' || m.part === 'drawer_front');
  
  // Get material type for body if available
  const bodyMaterialType = bodyMaterial?.type;
  
  // For preview purposes, use any textureUrl from any material
  const textureUrl = module.materials.find(m => m.textureUrl)?.textureUrl;
  
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
          onClick={(e: any) => {
            e.stopPropagation();
            onClick && onClick();
          }}
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
      textureUrl={textureUrl}
      materialType={bodyMaterialType}
    />
  );
};
