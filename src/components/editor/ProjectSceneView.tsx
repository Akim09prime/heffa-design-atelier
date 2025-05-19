
import { Card, CardContent } from '@/components/ui/card';
import { SceneContainer } from '@/components/3d/SceneContainer';
import { ThreeDRoomCanvas } from '@/components/3d/3DRoomCanvas';
import { FurnitureModule } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface ProjectSceneViewProps {
  modules: FurnitureModule[];
  roomWidth: number;
  roomLength: number;
  roomHeight: number;
  onSelectModule: (id: string | null) => void;
  selectedModuleId: string | null;
  useAdvanced3D?: boolean;
}

export const ProjectSceneView = ({
  modules,
  roomWidth,
  roomLength,
  roomHeight,
  onSelectModule,
  selectedModuleId,
  useAdvanced3D = true // Set to true to use the new 3D room canvas
}: ProjectSceneViewProps) => {
  const { user } = useAuth();
  
  return (
    <div className="h-full w-full relative">
      {useAdvanced3D ? (
        <ThreeDRoomCanvas 
          userId={user?.id || 'demoUser'} 
          className="h-full w-full"
        />
      ) : (
        <SceneContainer
          modules={modules}
          roomWidth={roomWidth}
          roomLength={roomLength}
          roomHeight={roomHeight}
          showGrid={true}
          enableOrbitControls={true}
          onSelectModule={onSelectModule}
          selectedModuleId={selectedModuleId}
        />
      )}
    </div>
  );
};
