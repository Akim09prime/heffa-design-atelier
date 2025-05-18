import React, { useRef, useEffect } from 'react';
import { Grid } from '@react-three/drei';
import { FurnitureModule as FurnitureModuleType } from '../../types';
import { FurnitureModule } from './FurnitureModule';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface RoomProps {
  width: number;
  length: number;
  height: number;
  modules: FurnitureModuleType[];
  showGrid?: boolean;
  selectedModuleId?: string;
  onSelectModule?: (module: FurnitureModuleType | null) => void;
  onModuleHover?: (moduleId: string | null) => void;
  setObjectRef?: (moduleId: string, object: THREE.Object3D) => void;
}

export const Room: React.FC<RoomProps> = ({ 
  width, 
  length, 
  height, 
  modules, 
  showGrid = true,
  selectedModuleId,
  onSelectModule,
  onModuleHover,
  setObjectRef
}) => {
  const { scene } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  // Click on empty space to deselect
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      // Only handle clicks if we have a select handler
      if (!onSelectModule) return;
      
      // Get the topmost element under the cursor
      const element = document.elementFromPoint(event.clientX, event.clientY);
      
      // Check if we clicked on the canvas (and not a UI element)
      if (element?.tagName === 'CANVAS') {
        // If we have raycaster hit info, we'll use that
        // Otherwise we'll deselect
        if (!event.defaultPrevented) {
          onSelectModule(null);
        }
      }
    };
    
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [onSelectModule]);

  return (
    <group ref={groupRef}>
      {/* Floor */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow position={[0, 0, 0]}>
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

      {/* Walls */}
      {/* Back wall */}
      <mesh position={[0, height / 2, -length / 2]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color={new THREE.Color("#ffffff")} transparent opacity={0.6} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial color={new THREE.Color("#f0f0f0")} transparent opacity={0.6} />
      </mesh>

      {/* Right wall */}
      <mesh position={[width / 2, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[length, height]} />
        <meshStandardMaterial color={new THREE.Color("#f0f0f0")} transparent opacity={0.6} />
      </mesh>

      {/* Furniture Modules */}
      {modules.map((module) => (
        <FurnitureModule 
          key={module.id} 
          module={module} 
          isSelected={module.id === selectedModuleId}
          onClick={() => onSelectModule && onSelectModule(module)}
          onHover={() => onModuleHover && onModuleHover(module.id)}
          onHoverEnd={() => onModuleHover && onModuleHover(null)}
          setObjectRef={(object) => setObjectRef && setObjectRef(module.id, object)}
        />
      ))}
    </group>
  );
};
