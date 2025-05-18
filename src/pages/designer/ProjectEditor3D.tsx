
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EditorToolbar } from '@/components/3d/EditorToolbar';
import { EditorSidebar } from '@/components/3d/EditorSidebar';
import { ModulePropertiesSidebar } from '@/components/3d/ModulePropertiesSidebar';
import { SceneContainer } from '@/components/3d/SceneContainer';
import { FurnitureModule, ProjectType } from '@/types';
import { DesignerLayout } from '@/components/layout/DesignerLayout';
import { useToast } from '@/hooks/use-toast';

// Project editor for 3D design
const ProjectEditor3D: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPropertiesSidebarOpen, setIsPropertiesSidebarOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<FurnitureModule | null>(null);
  const [modules, setModules] = useState<FurnitureModule[]>([]);
  const [projectType, setProjectType] = useState<ProjectType>('Kitchen');
  const [editorMode, setEditorMode] = useState<'move' | 'rotate' | 'scale'>('move');
  const [viewMode, setViewMode] = useState<'perspective' | 'top' | 'front' | 'side'>('perspective');
  const { toast } = useToast();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

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

  const handleSaveProject = () => {
    toast({
      title: 'Project Saved',
      description: 'Your project has been saved successfully.',
    });
  };

  const handleUndo = () => {
    // Placeholder for undo functionality
    console.log('Undo action');
    // After undo, maybe disable canUndo if at the beginning of history
    // setCanUndo(false);
  };

  const handleRedo = () => {
    // Placeholder for redo functionality
    console.log('Redo action');
    // After redo, maybe disable canRedo if at the end of history
    // setCanRedo(false);
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
          <EditorToolbar
            currentMode={editorMode}
            currentView={viewMode}
            onModeChange={setEditorMode}
            onViewChange={setViewMode}
            onSave={handleSaveProject}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={canUndo}
            canRedo={canRedo}
          />

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
