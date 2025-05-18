
import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Grid } from '@react-three/drei';
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
  const [isLoading, setIsLoading] = useState(true);
  const [cameraPosition, setCameraPosition] = useState([4, 3, 4]);

  // Simulate a short loading period for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={containerRef} className="scene-container w-full h-full relative">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100/80 flex items-center justify-center z-10 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#6A4B31] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-[#6A4B31] font-medium">Se încarcă scena 3D...</p>
          </div>
        </div>
      )}
      
      {/* Info overlay */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between pointer-events-none">
        <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-md text-sm text-gray-700 pointer-events-auto">
          <p><strong>Module active:</strong> {modules.length}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-md text-sm text-gray-700 pointer-events-auto">
          <p><strong>Dimensiuni:</strong> {roomLength}m × {roomWidth}m × {roomHeight}m</p>
        </div>
      </div>
      
      {/* Camera controls overlay */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-md flex gap-2 pointer-events-auto">
          <button 
            onClick={() => setCameraPosition([4, 3, 4])} 
            className="p-1 hover:bg-gray-200 rounded"
            title="Vedere izometrică"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <circle cx="12" cy="12" r="10"/>
              <path d="m8 12 4-4 4 4"/>
              <path d="m16 16-4-4-4 4"/>
            </svg>
          </button>
          <button 
            onClick={() => setCameraPosition([0, 3, 8])} 
            className="p-1 hover:bg-gray-200 rounded"
            title="Vedere din față"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="m7 7 10 10"/>
              <path d="M17 7v10H7"/>
            </svg>
          </button>
          <button 
            onClick={() => setCameraPosition([8, 3, 0])} 
            className="p-1 hover:bg-gray-200 rounded"
            title="Vedere laterală"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="m7 7 10 10"/>
              <path d="M7 17V7h10"/>
            </svg>
          </button>
          <button 
            onClick={() => setCameraPosition([0, 8, 0])} 
            className="p-1 hover:bg-gray-200 rounded"
            title="Vedere de sus"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <circle cx="12" cy="12" r="10"/>
              <path d="m16 12-4-4-4 4"/>
              <path d="M12 16V8"/>
            </svg>
          </button>
        </div>
      </div>
      
      {/* 3D Canvas */}
      <Canvas shadows className="bg-gradient-to-b from-blue-50 to-gray-100">
        <PerspectiveCamera 
          makeDefault 
          position={cameraPosition as [number, number, number]} 
          fov={isMobile ? 60 : 50} 
        />
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[10, 10, 10]} 
          intensity={1.2} 
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
