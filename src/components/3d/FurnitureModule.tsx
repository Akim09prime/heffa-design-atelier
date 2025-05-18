
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { useGLTF, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { FurnitureModule as FurnitureModuleType, Material } from '../../types';
import * as THREE from 'three';
import { MaterialService } from '@/services/materialService';

interface FurnitureModuleProps {
  module: FurnitureModuleType;
  isSelected?: boolean;
  onClick?: () => void;
}

// Placeholder box for modules without a model
const PlaceholderBox: React.FC<{ 
  width: number; 
  height: number; 
  depth: number; 
  position: [number, number, number];
  rotation: [number, number, number];
  isSelected?: boolean;
  onClick?: () => void;
  bodyTextureUrl?: string;
  frontTextureUrl?: string;
  materialType?: string;
}> = ({ 
  width, 
  height, 
  depth, 
  position, 
  rotation, 
  isSelected = false, 
  onClick,
  bodyTextureUrl,
  frontTextureUrl,
  materialType
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [bodyTexture, setBodyTexture] = useState<THREE.Texture | null>(null);
  const [frontTexture, setFrontTexture] = useState<THREE.Texture | null>(null);
  
  // Function to load a texture from URL
  const loadTexture = (url: string): Promise<THREE.Texture> => {
    return new Promise((resolve, reject) => {
      new THREE.TextureLoader().load(
        url,
        (texture) => {
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set(1, 1);
          resolve(texture);
        },
        undefined,
        reject
      );
    });
  };
  
  // Load textures when URLs change
  useEffect(() => {
    if (bodyTextureUrl) {
      loadTexture(bodyTextureUrl)
        .then(setBodyTexture)
        .catch(err => console.error('Error loading body texture:', err));
    }
    
    if (frontTextureUrl) {
      loadTexture(frontTextureUrl)
        .then(setFrontTexture)
        .catch(err => console.error('Error loading front texture:', err));
    }
  }, [bodyTextureUrl, frontTextureUrl]);

  // Selection animation
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
  
  // Create materials based on textures
  const bodyMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: bodyTexture || null,
      color: bodyTexture ? 0xffffff : (isSelected ? 0xE7DFD1 : (hovered ? 0xD5C7B2 : 0xE7DFD1)),
      metalness: 0.1,
      roughness: 0.8
    });
  }, [bodyTexture, isSelected, hovered]);
  
  const frontMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: frontTexture || null,
      color: frontTexture ? 0xffffff : (isSelected ? 0xB29978 : (hovered ? 0xD5C7B2 : 0xBEAC94)),
      metalness: 0.1,
      roughness: 0.7
    });
  }, [frontTexture, isSelected, hovered]);
  
  // Create material array for the cube
  const materials = [
    bodyMaterial, // Right
    bodyMaterial, // Left
    bodyMaterial, // Top
    bodyMaterial, // Bottom
    frontMaterial, // Front
    bodyMaterial, // Back
  ];

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
        {materials.map((material, index) => (
          <primitive 
            key={index} 
            object={material} 
            attach={`material-${index}`} 
          />
        ))}
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
  const [materials, setMaterials] = useState<Material[]>([]);
  const [bodyTextureUrl, setBodyTextureUrl] = useState<string | undefined>();
  const [frontTextureUrl, setFrontTextureUrl] = useState<string | undefined>();
  
  // Find body and front materials
  const bodyMaterial = module.materials.find(m => m.part === 'body');
  const frontMaterial = module.materials.find(m => m.part === 'door' || m.part === 'drawer_front');
  
  // Load materials to get textures
  useEffect(() => {
    const loadMaterials = async () => {
      try {
        const allMaterials = await MaterialService.getAllMaterials();
        setMaterials(allMaterials);
        
        // Set texture URLs based on material IDs
        if (bodyMaterial) {
          const materialData = allMaterials.find(m => m.id === bodyMaterial.materialId);
          setBodyTextureUrl(materialData?.textureUrl);
        }
        
        if (frontMaterial) {
          const materialData = allMaterials.find(m => m.id === frontMaterial.materialId);
          setFrontTextureUrl(materialData?.textureUrl);
        }
      } catch (error) {
        console.error("Failed to load materials:", error);
      }
    };
    
    loadMaterials();
  }, [bodyMaterial, frontMaterial]);
  
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
      width={width / 1000}
      height={height / 1000}
      depth={depth / 1000}
      position={position}
      rotation={rotation}
      isSelected={isSelected}
      onClick={onClick}
      bodyTextureUrl={bodyTextureUrl}
      frontTextureUrl={frontTextureUrl}
      materialType={bodyMaterial?.type}
    />
  );
};
