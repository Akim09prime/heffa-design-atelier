
import React from 'react';
import { Grid } from '@react-three/drei';
import { FurnitureModule as FurnitureModuleType } from '../../types';
import { FurnitureModule } from './FurnitureModule';

interface RoomProps {
  width: number;
  length: number;
  height: number;
  modules: FurnitureModuleType[];
  showGrid?: boolean;
}

export const Room: React.FC<RoomProps> = ({ 
  width, 
  length, 
  height, 
  modules, 
  showGrid = true 
}) => {
  return (
    <group>
      {/* Floor */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color="#f5f5f5" />
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

      {/* Walls */}
      {/* Back wall */}
      <mesh position={[0, height / 2, -length / 2]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Left wall */}
      <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* Right wall */}
      <mesh position={[width / 2, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* Furniture Modules */}
      {modules.map((module) => (
        <FurnitureModule key={module.id} module={module} />
      ))}
    </group>
  );
};
