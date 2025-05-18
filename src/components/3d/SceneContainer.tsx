
import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
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
  onSelectModule?: (moduleId: string | null) => void;
  selectedModuleId?: string | null;
}

export const SceneContainer: React.FC<SceneContainerProps> = ({
  modules = [],
  roomWidth = 4,
  roomLength = 4,
  roomHeight = 2.8,
  showGrid = true,
  enableOrbitControls = true,
  onSelectModule,
  selectedModuleId
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  return (
    <div ref={containerRef} className="scene-container w-full h-full bg-gray-100 rounded-lg shadow-inner">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[3, 2, 3]} fov={50} />
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
          onSelectModule={onSelectModule}
          selectedModuleId={selectedModuleId}
        />
        <Environment preset="apartment" />
        {enableOrbitControls && (
          <OrbitControls 
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={1}
            maxDistance={10}
            target={[0, 0.5, 0]}
          />
        )}
      </Canvas>
    </div>
  );
};
