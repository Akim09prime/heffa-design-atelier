
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, Environment, PerspectiveCamera, 
  Grid, TransformControls, Text 
} from '@react-three/drei';
import * as THREE from 'three';
import { Room } from './Room';
import { FurnitureModule } from '../../types';
import { useIsMobile } from '@/hooks/use-mobile';

interface SceneContainerProps {
  modules?: FurnitureModule[];
  roomWidth?: number;
  roomLength?: number;
  roomHeight?: number;
  showGrid?: boolean;
  enableOrbitControls?: boolean;
  selectedModuleId?: string;
  onSelectModule?: (module: FurnitureModule | null) => void;
  editorMode?: 'move' | 'rotate' | 'scale';
  viewMode?: 'perspective' | 'top' | 'front' | 'side';
  onModuleUpdate?: (updatedModule: FurnitureModule) => void;
}

// Helper component to handle camera position based on view mode
const CameraController: React.FC<{
  viewMode: 'perspective' | 'top' | 'front' | 'side'
}> = ({ viewMode }) => {
  const { camera } = useThree();
  
  useEffect(() => {
    switch (viewMode) {
      case 'top':
        camera.position.set(0, 10, 0);
        camera.lookAt(0, 0, 0);
        break;
      case 'front':
        camera.position.set(0, 1.7, 5);
        camera.lookAt(0, 1, 0);
        break;
      case 'side':
        camera.position.set(5, 1.7, 0);
        camera.lookAt(0, 1, 0);
        break;
      default: // perspective
        camera.position.set(3, 2, 3);
        camera.lookAt(0, 1, 0);
        break;
    }
  }, [viewMode, camera]);
  
  return null;
};

// Helper component for transform controls
const ModuleTransformControls: React.FC<{
  object: THREE.Object3D | null;
  mode: 'translate' | 'rotate' | 'scale';
  onObjectUpdate: (object: THREE.Object3D) => void;
}> = ({ object, mode, onObjectUpdate }) => {
  if (!object) return null;
  
  return (
    <TransformControls 
      object={object} 
      mode={mode} 
      onObjectChange={(e) => {
        if (object) {
          onObjectUpdate(object);
        }
      }} 
    />
  );
};

export const SceneContainer: React.FC<SceneContainerProps> = ({
  modules = [],
  roomWidth = 4,
  roomLength = 4,
  roomHeight = 2.8,
  showGrid = true,
  enableOrbitControls = true,
  selectedModuleId,
  onSelectModule,
  editorMode = 'move',
  viewMode = 'perspective',
  onModuleUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const objectRefs = useRef<{ [key: string]: THREE.Object3D | null }>({});
  const isMobile = useIsMobile();
  const [hovered, setHovered] = useState<string | null>(null);
  
  // Mapping between editorMode and TransformControls mode
  const transformMode = 
    editorMode === 'move' ? 'translate' :
    editorMode === 'rotate' ? 'rotate' : 'scale';

  // Handle updating the module data when transform controls change
  const handleObjectUpdate = (moduleId: string, object: THREE.Object3D) => {
    if (!onModuleUpdate) return;
    
    const moduleToUpdate = modules.find(m => m.id === moduleId);
    if (!moduleToUpdate) return;
    
    const updatedModule = { ...moduleToUpdate };
    
    // Update position or rotation or scale based on the editor mode
    if (editorMode === 'move') {
      updatedModule.position = [
        object.position.x,
        object.position.y,
        object.position.z,
      ] as [number, number, number];
    } else if (editorMode === 'rotate') {
      const eulerAngles = object.rotation;
      // Convert from radians to degrees
      updatedModule.rotation = [
        eulerAngles.x * (180 / Math.PI),
        eulerAngles.y * (180 / Math.PI),
        eulerAngles.z * (180 / Math.PI),
      ] as [number, number, number];
    } else if (editorMode === 'scale') {
      // This would scale the module dimensions proportionally
      const scaleFactor = object.scale.x; // Assuming uniform scaling
      updatedModule.width = moduleToUpdate.width * scaleFactor;
      updatedModule.height = moduleToUpdate.height * scaleFactor;
      updatedModule.depth = moduleToUpdate.depth * scaleFactor;
      
      // Reset scale to avoid compounding
      object.scale.set(1, 1, 1);
    }
    
    onModuleUpdate(updatedModule);
  };

  return (
    <div ref={containerRef} className="scene-container w-full h-full bg-gray-100 rounded-lg shadow-inner">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[3, 2, 3]} fov={50} />
        <CameraController viewMode={viewMode} />
        
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 10]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={2048} 
          shadow-mapSize-height={2048} 
        />
        
        <Room 
          width={roomWidth} 
          length={roomLength} 
          height={roomHeight} 
          modules={modules} 
          showGrid={showGrid}
          selectedModuleId={selectedModuleId}
          onSelectModule={onSelectModule}
          onModuleHover={setHovered}
          setObjectRef={(moduleId, object) => {
            objectRefs.current[moduleId] = object;
          }}
        />
        
        {/* Transform controls for selected module */}
        {selectedModuleId && objectRefs.current[selectedModuleId] && (
          <ModuleTransformControls 
            object={objectRefs.current[selectedModuleId]} 
            mode={transformMode}
            onObjectUpdate={(object) => handleObjectUpdate(selectedModuleId, object)}
          />
        )}
        
        {/* Module hover labels */}
        {hovered && !selectedModuleId && (
          <Text 
            position={[0, 2, 0]} 
            fontSize={0.15}
            color="black"
            anchorX="center"
            anchorY="middle"
            fillOpacity={0.8}
          >
            {modules.find(m => m.id === hovered)?.name || ''}
          </Text>
        )}
        
        <Environment preset="apartment" />
        
        {enableOrbitControls && !selectedModuleId && (
          <OrbitControls 
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={1}
            maxDistance={10}
            target={[0, 0.5, 0]}
            makeDefault
          />
        )}
      </Canvas>
    </div>
  );
};
