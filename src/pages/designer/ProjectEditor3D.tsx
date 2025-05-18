
import React from 'react';
import { useParams } from 'react-router-dom';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ProjectHeader } from '@/components/editor/ProjectHeader';
import { ProjectSceneView } from '@/components/editor/ProjectSceneView';
import { ProjectLoadingState } from '@/components/editor/ProjectLoadingState';
import { ProjectErrorState } from '@/components/editor/ProjectErrorState';
import { ModuleLibrary } from '@/components/3d/ModuleLibrary';
import { ModuleProperties } from '@/components/3d/ModuleProperties';
import { ExportSidebar } from '@/components/3d/ExportSidebar';
import { ExportOptions } from '@/components/exports/ExportOptions';
import { useProjectEditor } from '@/hooks/useProjectEditor';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';

const ProjectEditor3D = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const {
    project,
    loading,
    showLibrary,
    showExportDialog,
    selectedModule,
    selectedModuleId,
    handleBack,
    handleSave,
    handleAddModule,
    handleUpdateModule,
    handleDeleteModule,
    setSelectedModuleId,
    setShowLibrary,
    setShowExportDialog
  } = useProjectEditor(projectId);

  // Handle any keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Save on Ctrl+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (handleSave) {
          handleSave();
          toast({
            title: "Project Saved",
            description: "Project saved with keyboard shortcut (Ctrl+S)",
            variant: "default"
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, toast]);

  if (loading) {
    return <ProjectLoadingState />;
  }

  if (!project) {
    return <ProjectErrorState onBack={handleBack} />;
  }

  return (
    <DesignerLayout>
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <ProjectHeader
          projectName={project.name}
          onBack={handleBack}
          onSave={() => {
            handleSave();
            toast({
              title: "Project Saved",
              description: "Your project has been saved successfully",
              variant: "default"
            });
          }}
          onExport={() => setShowExportDialog(true)}
          showLibrary={showLibrary}
          onToggleLibrary={() => setShowLibrary(!showLibrary)}
        />

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Module Library */}
          {showLibrary && (
            <div className="w-64 border-r bg-white flex flex-col">
              <Tabs defaultValue="library" className="flex-1 flex flex-col">
                <TabsList className="w-full">
                  <TabsTrigger value="library" className="flex-1">Library</TabsTrigger>
                  <TabsTrigger value="export" className="flex-1">Export</TabsTrigger>
                </TabsList>
                <TabsContent value="library" className="flex-1 p-0 m-0 overflow-auto">
                  <ModuleLibrary
                    onAddModule={(module) => {
                      handleAddModule(module);
                      toast({
                        title: "Module Added",
                        description: `${module.name} has been added to your scene`,
                        variant: "default"
                      });
                    }}
                  />
                </TabsContent>
                <TabsContent value="export" className="flex-1 p-0 m-0 overflow-auto">
                  <ExportSidebar 
                    modulesRef={window.modules || { current: [] }} 
                    projectName={project.name}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* 3D Scene */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <ProjectSceneView
              modules={project.modules || []}
              roomWidth={(project.dimensions?.width || 4000) / 1000} // Convert to meters
              roomLength={(project.dimensions?.length || 3000) / 1000} // Convert to meters
              roomHeight={(project.dimensions?.height || 2400) / 1000} // Convert to meters
              onSelectModule={setSelectedModuleId}
              selectedModuleId={selectedModuleId}
              useAdvanced3D={true}
            />
          </div>

          {/* Right Sidebar - Module Properties */}
          {selectedModule && (
            <ModuleProperties
              module={selectedModule}
              onUpdate={(updatedModule) => {
                handleUpdateModule(updatedModule);
                toast({
                  title: "Module Updated",
                  description: "Module properties have been updated",
                  variant: "default"
                });
              }}
              onDelete={(moduleId) => {
                handleDeleteModule(moduleId);
                toast({
                  title: "Module Deleted",
                  description: "Module has been removed from the scene",
                  variant: "destructive"
                });
              }}
              onClose={() => setSelectedModuleId(null)}
            />
          )}
        </div>
        
        {/* Export Dialog */}
        <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
          <DialogContent className="sm:max-w-2xl">
            <ExportOptions 
              project={project} 
              onClose={() => setShowExportDialog(false)} 
            />
          </DialogContent>
        </Dialog>
      </div>
    </DesignerLayout>
  );
};

export default ProjectEditor3D;
