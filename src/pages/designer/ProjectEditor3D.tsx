
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EditorToolbar } from '@/components/3d/EditorToolbar';
import { EditorSidebar } from '@/components/3d/EditorSidebar';
import { ModulePropertiesSidebar } from '@/components/3d/ModulePropertiesSidebar';
import { SceneContainer } from '@/components/3d/SceneContainer';
import { Room } from '@/components/3d/Room';
import { FurnitureModule, ProjectType } from '@/types';
import { DesignerLayout } from '@/components/layout/DesignerLayout';
import { useToast } from '@/hooks/use-toast';
import { Move, RotateCw, Save } from 'lucide-react';

// Project editor for 3D design
const ProjectEditor3D: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPropertiesSidebarOpen, setIsPropertiesSidebarOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<FurnitureModule | null>(null);
  const [modules, setModules] = useState<FurnitureModule[]>([]);
  // Use "Kitchen" with capital K to match ProjectType enum
  const [projectType, setProjectType] = useState<ProjectType>('Kitchen');
  const [editorMode, setEditorMode] = useState<'move' | 'rotate' | 'scale'>('move');
  const [viewMode, setViewMode] = useState<'perspective' | 'top' | 'front' | 'side'>('perspective');
  const { toast } = useToast();

  const handleAddModule = (module: FurnitureModule) => {
    setModules([...modules, module]);
    toast({
      title: 'Module Added',
      description: `${module.name} added to the project.`,
    });
  };

  const handleUpdateModule = (updatedModule: FurnitureModule) => {
    const updatedModules = modules.map(module =>
      module.id === updatedModule.id ? updatedModule : module
    );
    setModules(updatedModules);
    setSelectedModule(updatedModule); // Keep the properties sidebar open for the updated module
    toast({
      title: 'Module Updated',
      description: `${updatedModule.name} updated successfully.`,
    });
  };

  const handleDeleteModule = (moduleId: string) => {
    setModules(modules.filter(module => module.id !== moduleId));
    setSelectedModule(null); // Clear the selected module after deletion
    setIsPropertiesSidebarOpen(false); // Close the properties sidebar after deletion
    toast({
      title: 'Module Deleted',
      description: 'Module deleted from the project.',
    });
  };

  const handleSelectModule = (module: FurnitureModule) => {
    setSelectedModule(module);
    setIsPropertiesSidebarOpen(true);
  };

  return (
    <DesignerLayout>
      <div className="flex h-full w-full">
        {/* Editor Sidebar */}
        {isSidebarOpen && (
          <EditorSidebar
            onClose={() => setIsSidebarOpen(false)}
            onAddModule={handleAddModule}
            projectType={projectType}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Create a simplified EditorToolbar as a placeholder */}
          <div className="border-b p-2 flex justify-between items-center">
            <div>
              <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                Toggle Sidebar
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant={editorMode === 'move' ? 'secondary' : 'ghost'} 
                size="sm"
                onClick={() => setEditorMode('move')}
              >
                <Move className="h-4 w-4 mr-1" /> Move
              </Button>
              <Button 
                variant={editorMode === 'rotate' ? 'secondary' : 'ghost'} 
                size="sm"
                onClick={() => setEditorMode('rotate')}
              >
                <RotateCw className="h-4 w-4 mr-1" /> Rotate
              </Button>
            </div>
            <Button variant="secondary" size="sm">
              <Save className="h-4 w-4 mr-1" /> Save
            </Button>
          </div>

          {/* 3D Scene */}
          <div className="flex-1 relative">
            <SceneContainer
              modules={modules}
              onSelectModule={handleSelectModule}
              selectedModuleId={selectedModule?.id}
              editorMode={editorMode}
              viewMode={viewMode}
              onModuleUpdate={handleUpdateModule}
            />
          </div>
        </div>

        {/* Module Properties Sidebar */}
        {isPropertiesSidebarOpen && selectedModule && (
          <ModulePropertiesSidebar
            module={selectedModule}
            onUpdate={handleUpdateModule}
            onDelete={handleDeleteModule}
            onClose={() => setIsPropertiesSidebarOpen(false)}
          />
        )}
      </div>
    </DesignerLayout>
  );
};

export default ProjectEditor3D;
