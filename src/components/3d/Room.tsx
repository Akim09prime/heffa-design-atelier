
import React from 'react';
import { Grid } from '@react-three/drei';
import { FurnitureModule as FurnitureModuleType } from '../../types';
import { FurnitureModule } from './FurnitureModule';
import * as THREE from 'three';

interface RoomProps {
  width: number;
  length: number;
  height: number;
  modules: FurnitureModuleType[];
  showGrid?: boolean;
  onSelectModule?: (moduleId: string | null) => void;
  selectedModuleId?: string | null;
}

export const Room: React.FC<RoomProps> = ({ 
  width, 
  length, 
  height, 
  modules, 
  showGrid = true,
  onSelectModule,
  selectedModuleId 
}) => {
  // Handler for background clicks to deselect modules
  const handleBackgroundClick = (e: any) => {
    e.stopPropagation();
    if (onSelectModule) {
      onSelectModule(null);
    }
  };

  return (
    <group>
      {/* Floor - clickable to deselect modules */}
      <mesh 
        rotation-x={-Math.PI / 2} 
        receiveShadow 
        position={[0, 0, 0]}
        onClick={handleBackgroundClick}
      >
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color={new THREE.Color("#f5f5f5")} />
      </mesh>

      {/* Grid */}
      {showGrid && (
        <Grid
          infiniteGrid
          cellSize={0.5}
          sectionSize={1}
          fadeStrength={1.5}
          fadeDistance={25}
          position={[0, 0.01, 0]}
          args={[width, length]}
          rotation-x={-Math.PI / 2}
        />
      )}

      {/* Walls - all clickable to deselect */}
      {/* Back wall */}
      <mesh 
        position={[0, height / 2, -length / 2]} 
        receiveShadow
        onClick={handleBackgroundClick}
      >
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={new THREE.Color("#ffffff")} />
      </mesh>

      {/* Left wall */}
      <mesh 
        position={[-width / 2, height / 2, 0]} 
        rotation={[0, Math.PI / 2, 0]} 
        receiveShadow
        onClick={handleBackgroundClick}
      >
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial color={new THREE.Color("#f0f0f0")} />
      </mesh>

      {/* Right wall */}
      <mesh 
        position={[width / 2, height / 2, 0]} 
        rotation={[0, -Math.PI / 2, 0]} 
        receiveShadow
        onClick={handleBackgroundClick}
      >
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial color={new THREE.Color("#f0f0f0")} />
      </mesh>

      {/* Furniture Modules */}
      {modules.map((module) => (
        <FurnitureModule 
          key={module.id} 
          module={module} 
          isSelected={selectedModuleId === module.id}
          onClick={() => onSelectModule && onSelectModule(module.id)}
        />
      ))}
    </group>
  );
};
