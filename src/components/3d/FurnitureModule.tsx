
import React, { useRef, useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { FurnitureModule as FurnitureModuleType } from '../../types';
import * as THREE from 'three';
import { MaterialService } from '@/services/materialService';

interface FurnitureModuleProps {
  module: FurnitureModuleType;
  isSelected?: boolean;
  onClick?: () => void;
  onHover?: () => void;
  onHoverEnd?: () => void;
  setObjectRef?: (object: THREE.Object3D) => void;
}

// Cache for material textures
const textureCache = new Map<string, THREE.Texture>();

// Load texture helper
const loadTexture = async (url: string): Promise<THREE.Texture> => {
  if (textureCache.has(url)) {
    return textureCache.get(url)!;
  }
  
  return new Promise((resolve) => {
    new THREE.TextureLoader().load(url, (texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
      textureCache.set(url, texture);
      resolve(texture);
    });
  });
};

// Placeholder box for modules
const PlaceholderBox: React.FC<{ 
  width: number; 
  height: number; 
  depth: number; 
  position: [number, number, number];
  rotation: [number, number, number];
  isSelected?: boolean;
  onClick?: () => void;
  onHover?: () => void;
  onHoverEnd?: () => void;
  setObjectRef?: (object: THREE.Object3D) => void;
  materials: FurnitureModuleType["materials"];
}> = ({ 
  width, 
  height, 
  depth, 
  position, 
  rotation, 
  isSelected = false, 
  onClick,
  onHover,
  onHoverEnd,
  setObjectRef,
  materials
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [bodyTexture, setBodyTexture] = useState<THREE.Texture | null>(null);
  const [frontTexture, setFrontTexture] = useState<THREE.Texture | null>(null);
  
  // Pass the ref to parent
  useEffect(() => {
    if (meshRef.current && setObjectRef) {
      setObjectRef(meshRef.current);
    }
  }, [setObjectRef]);
  
  // Load textures for materials
  useEffect(() => {
    const loadMaterialTextures = async () => {
      try {
        // Find body and door/front materials
        const bodyMaterial = materials.find(m => m.part === 'body');
        const frontMaterial = materials.find(m => 
          m.part === 'door' || m.part === 'drawer_front'
        );
        
        if (bodyMaterial) {
          // Get material data
          const allMaterials = await MaterialService.getAllMaterials();
          const bodyMaterialData = allMaterials.find(m => m.id === bodyMaterial.materialId);
          
          if (bodyMaterialData?.textureUrl) {
            const texture = await loadTexture(bodyMaterialData.textureUrl);
            setBodyTexture(texture);
          }
        }
        
        if (frontMaterial) {
          // Get material data
          const allMaterials = await MaterialService.getAllMaterials();
          const frontMaterialData = allMaterials.find(m => m.id === frontMaterial.materialId);
          
          if (frontMaterialData?.textureUrl) {
            const texture = await loadTexture(frontMaterialData.textureUrl);
            setFrontTexture(texture);
          }
        }
      } catch (error) {
        console.error('Failed to load textures:', error);
      }
    };
    
    loadMaterialTextures();
  }, [materials]);
  
  // Animation for selection and hover
  useFrame(() => {
    if (meshRef.current) {
      if (isSelected) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.02, 1.02, 1.02), 0.1);
      } else if (hovered) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.01, 1.01, 1.01), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });
  
  // Convert mm to m
  const widthM = width / 1000;
  const heightM = height / 1000;
  const depthM = depth / 1000;
  
  // Convert degree rotation to radians
  const rotationRad = rotation.map(r => r * Math.PI / 180) as [number, number, number];

  // Default material for the module
  const defaultMaterial = <meshStandardMaterial 
    color={isSelected ? "#B29978" : hovered ? "#D5C7B2" : "#E7DFD1"} 
    metalness={0.1} 
    roughness={0.8}
  />;

  // Body material with texture if available
  const bodyMaterial = bodyTexture ? 
    <meshStandardMaterial 
      map={bodyTexture} 
      metalness={0.1} 
      roughness={0.8} 
      color={isSelected ? "#eeeeee" : "#ffffff"} 
    /> : 
    defaultMaterial;

  // Front material with texture if available
  const frontMaterial = frontTexture ? 
    <meshStandardMaterial 
      map={frontTexture} 
      metalness={0.1} 
      roughness={0.8} 
      color={isSelected ? "#eeeeee" : "#ffffff"} 
    /> : 
    defaultMaterial;

  return (
    <group
      position={[position[0], position[1] + heightM / 2, position[2]]} // Adjust Y to place on floor
      rotation={rotationRad}
    >
      {/* Main body */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) {
            onClick();
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          if (onHover) onHover();
        }}
        onPointerOut={() => {
          setHovered(false);
          if (onHoverEnd) onHoverEnd();
        }}
      >
        <boxGeometry args={[widthM, heightM, depthM]} />
        {bodyMaterial}
      </mesh>
      
      {/* Front/Door (simplified representation) */}
      <mesh
        position={[0, 0, depthM / 2 + 0.001]} // Slightly in front of the body
        castShadow
      >
        <planeGeometry args={[widthM * 0.9, heightM * 0.9]} />
        {frontMaterial}
      </mesh>
    </group>
  );
};

export const FurnitureModule: React.FC<FurnitureModuleProps> = ({ 
  module, 
  isSelected = false,
  onClick,
  onHover,
  onHoverEnd,
  setObjectRef
}) => {
  const { width, height, depth, position, rotation, modelUrl, materials } = module;
  
  // If we have a model URL, we'll try to load it
  if (modelUrl) {
    try {
      const { scene } = useGLTF(modelUrl);
      const groupRef = useRef<THREE.Group>(null);
      
      // Pass the ref to parent
      useEffect(() => {
        if (groupRef.current && setObjectRef) {
          setObjectRef(groupRef.current);
        }
      }, [setObjectRef]);
      
      return (
        <group 
          ref={groupRef}
          position={position}
          rotation={rotation.map(r => r * Math.PI / 180) as [number, number, number]}
          scale={[1, 1, 1]}
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick();
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            if (onHover) onHover();
          }}
          onPointerOut={() => {
            if (onHoverEnd) onHoverEnd();
          }}
        >
          <primitive object={scene.clone()} />
        </group>
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
      onHover={onHover}
      onHoverEnd={onHoverEnd}
      setObjectRef={setObjectRef}
      materials={materials}
    />
  );
};
