
import { useParams } from 'react-router-dom';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { ProjectHeader } from '@/components/editor/ProjectHeader';
import { ProjectSceneView } from '@/components/editor/ProjectSceneView';
import { ProjectLoadingState } from '@/components/editor/ProjectLoadingState';
import { ProjectErrorState } from '@/components/editor/ProjectErrorState';
import { ModuleLibrary } from '@/components/3d/ModuleLibrary';
import { ModuleProperties } from '@/components/3d/ModuleProperties';
import { ExportOptions } from '@/components/exports/ExportOptions';
import { useProjectEditor } from '@/hooks/useProjectEditor';

const ProjectEditor3D = () => {
  const { projectId } = useParams<{ projectId: string }>();
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
          onSave={handleSave}
          onExport={() => setShowExportDialog(true)}
          showLibrary={showLibrary}
          onToggleLibrary={() => setShowLibrary(!showLibrary)}
        />

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Module Library */}
          {showLibrary && (
            <ModuleLibrary
              onAddModule={handleAddModule}
              className="border-r"
            />
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
    </DesignerLayout>
  );
};

export default ProjectEditor3D;
