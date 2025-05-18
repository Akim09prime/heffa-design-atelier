
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
import { UiProvider, useUi } from '@/contexts/UiContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { Loader } from 'lucide-react';

// Editor content component that uses contexts
const ProjectEditorContent = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const { showSuccessToast, isLoading, setLoading } = useUi();
  
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
          showSuccessToast("Project Saved", "Project saved with keyboard shortcut (Ctrl+S)");
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, showSuccessToast]);

  const handleSaveWithLoading = async () => {
    try {
      setLoading('save-project', true);
      await handleSave();
      showSuccessToast("Project Saved", "Your project has been saved successfully");
    } finally {
      setLoading('save-project', false); 
    }
  };

  if (loading) {
    return <ProjectLoadingState />;
  }

  if (!project) {
    return <ProjectErrorState onBack={handleBack} />;
  }

  return (
    <>
      {/* Global loading overlay */}
      {(isLoading('save-project') || isLoading('export-project')) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center space-y-3">
            <Loader className="h-8 w-8 animate-spin text-heffa-600" />
            <p className="text-sm">
              {isLoading('save-project') ? 'Saving your project...' : 'Exporting your project...'}
            </p>
          </div>
        </div>
      )}
      
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <ProjectHeader
          projectName={project.name}
          onBack={handleBack}
          onSave={handleSaveWithLoading}
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
                      showSuccessToast("Module Added", `${module.name} has been added to your scene`);
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
              onUpdate={handleUpdateModule}
              onDelete={handleDeleteModule}
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
    </>
  );
};

// Main component with providers
const ProjectEditor3D = () => {
  return (
    <AuthProvider>
      <UiProvider>
        <DesignerLayout>
          <ProjectEditorContent />
        </DesignerLayout>
      </UiProvider>
    </AuthProvider>
  );
};

export default ProjectEditor3D;
