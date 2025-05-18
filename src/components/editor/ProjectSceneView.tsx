
import { Card, CardContent } from '@/components/ui/card';
import { SceneContainer } from '@/components/3d/SceneContainer';
import { FurnitureModule } from '@/types';

interface ProjectSceneViewProps {
  modules: FurnitureModule[];
  roomWidth: number;
  roomLength: number;
  roomHeight: number;
  onSelectModule: (id: string | null) => void;
  selectedModuleId: string | null;
}

export const ProjectSceneView = ({
  modules,
  roomWidth,
  roomLength,
  roomHeight,
  onSelectModule,
  selectedModuleId
}: ProjectSceneViewProps) => {
  return (
    <Card className="m-4 flex-1 shadow-md border-gray-200 overflow-hidden">
      <CardContent className="p-0 h-full">
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
      </CardContent>
    </Card>
  );
};
