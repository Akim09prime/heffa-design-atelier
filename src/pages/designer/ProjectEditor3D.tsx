
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SceneContainer } from '@/components/3d/SceneContainer';
import { Project, FurnitureModule } from '@/types';
import { ProjectService } from '@/services/projectService';
import { EditorSidebar } from '@/components/3d/EditorSidebar';
import { ModulePropertiesSidebar } from '@/components/3d/ModulePropertiesSidebar';
import { EditorToolbar } from '@/components/3d/EditorToolbar';
import { useToast } from '@/hooks/use-toast';
import { 
  ChevronLeft, Save, Share, Download, Undo, Redo, 
  Grid3X3, Layers, ZoomIn, ZoomOut, RotateRight, Move 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProjectEditor3D = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [selectedModule, setSelectedModule] = useState<FurnitureModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [editorMode, setEditorMode] = useState<'move' | 'rotate' | 'scale'>('move');
  const [viewMode, setViewMode] = useState<'perspective' | 'top' | 'front' | 'side'>('perspective');
  const [undoStack, setUndoStack] = useState<Project[]>([]);
  const [redoStack, setRedoStack] = useState<Project[]>([]);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const editorRef = useRef(null);

  // Track history for undo/redo
  const addToHistory = (updatedProject: Project) => {
    setUndoStack(prev => [...prev, project as Project]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack(prev => [...prev, project as Project]);
      setProject(previousState);
      setUndoStack(prev => prev.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setUndoStack(prev => [...prev, project as Project]);
      setProject(nextState);
      setRedoStack(prev => prev.slice(0, -1));
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (projectId) {
          console.log(`Fetching project with ID: ${projectId}`);
          
          // For module IDs that start with "module-", create a temporary project
          if (projectId.startsWith('module-')) {
            const moduleId = projectId.replace('module-', '');
            console.log(`This is a module preview with ID: ${moduleId}`);
            
            // Create a temporary project for module preview
            const tempProject = {
              id: projectId,
              userId: 'designer',
              name: `Module Preview ${moduleId}`,
              description: 'Temporary project for module preview',
              type: 'Free Mode',
              parameters: {},
              status: 'draft',
              createdAt: new Date(),
              updatedAt: new Date(),
              roomType: 'other',
              modules: [],
              dimensions: {
                width: 3000,
                length: 3000,
                height: 2400,
                walls: ProjectService.generateDefaultWalls('Free Mode')
              }
            };
            
            setProject(tempProject as Project);
            setLoading(false);
            return;
          }
          
          const fetchedProject = await ProjectService.getProjectById(projectId);
          if (!fetchedProject) {
            console.error(`Project not found with ID: ${projectId}`);
            toast({
              title: 'Error',
              description: 'Project not found with the given ID',
              variant: 'destructive',
            });
            setProject(null);
          } else {
            console.log("Loaded project:", fetchedProject);
            setProject(fetchedProject);
          }
        }
      } catch (error) {
        console.error('Failed to fetch project:', error);
        toast({
          title: 'Error',
          description: 'Failed to load project',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, toast]);

  const handleSave = async () => {
    if (!project) return;
    
    try {
      // In a real implementation, this would save to the backend
      await ProjectService.updateProject(project.id, project);
      
      toast({
        title: 'Project Saved',
        description: 'Your project has been saved successfully',
      });
    } catch (error) {
      console.error('Failed to save project:', error);
      toast({
        title: 'Error',
        description: 'Failed to save project',
        variant: 'destructive',
      });
    }
  };

  const handleModuleAdd = (newModule: FurnitureModule) => {
    if (!project) return;
    
    const updatedProject = {
      ...project,
      modules: [...project.modules, newModule]
    };
    
    // Add current state to history for undo
    addToHistory(project);
    
    setProject(updatedProject);
    setSelectedModule(newModule);
    
    toast({
      title: 'Module Added',
      description: `Added ${newModule.name} to project`,
    });
  };

  const handleModuleUpdate = (updatedModule: FurnitureModule) => {
    if (!project) return;
    
    const updatedModules = project.modules.map(module => 
      module.id === updatedModule.id ? updatedModule : module
    );
    
    // Add current state to history for undo
    addToHistory(project);
    
    setProject({
      ...project,
      modules: updatedModules
    });
    
    setSelectedModule(updatedModule);
    
    toast({
      title: 'Module Updated',
      description: `Updated ${updatedModule.name}`,
    });
  };

  const handleModuleDelete = (moduleId: string) => {
    if (!project) return;
    
    // Add current state to history for undo
    addToHistory(project);
    
    const updatedModules = project.modules.filter(module => module.id !== moduleId);
    
    setProject({
      ...project,
      modules: updatedModules
    });
    
    setSelectedModule(null);
    
    toast({
      title: 'Module Deleted',
      description: 'Module has been removed from the project',
    });
  };

  const handleModuleSelect = (module: FurnitureModule | null) => {
    setSelectedModule(module);
  };

  const handleExport = (exportType: 'json' | 'excel' | 'pdf' | 'dxf') => {
    navigate(`/designer/exports/${projectId}?type=${exportType}`);
  };

  const handleBack = () => {
    // Check if we're viewing a module or a regular project
    if (projectId?.startsWith('module-')) {
      navigate('/designer/modules');
    } else {
      navigate('/designer/projects');
    }
  };

  if (loading) {
    return (
      <DesignerLayout>
        <div className="p-6 flex justify-center items-center h-[calc(100vh-100px)]">
          <div className="animate-pulse text-center">
            <div className="text-xl font-medium">Loading project...</div>
          </div>
        </div>
      </DesignerLayout>
    );
  }

  if (!project) {
    return (
      <DesignerLayout>
        <div className="p-6 flex justify-center items-center h-[calc(100vh-100px)]">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <div className="mb-4 text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Project Not Found</h3>
              <p className="text-gray-500 mb-4">The project you're looking for doesn't exist or you don't have permission to view it.</p>
              <Button onClick={handleBack}>Return to Projects</Button>
            </CardContent>
          </Card>
        </div>
      </DesignerLayout>
    );
  }

  return (
    <DesignerLayout>
      <div className="flex h-screen overflow-hidden">
        {/* Left Sidebar - Module Library */}
        {isLeftSidebarOpen && (
          <EditorSidebar 
            onClose={() => setIsLeftSidebarOpen(false)}
            onAddModule={handleModuleAdd}
            projectType={project.type}
          />
        )}
        
        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Toolbar */}
          <EditorToolbar 
            editorMode={editorMode}
            setEditorMode={setEditorMode}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={undoStack.length > 0}
            canRedo={redoStack.length > 0}
            onSave={handleSave}
            onExport={handleExport}
            onToggleLeftSidebar={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
            onToggleRightSidebar={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
            onBack={handleBack}
            projectName={project.name}
          />
          
          {/* 3D Editor Canvas */}
          <div className="flex-1 bg-gray-100 relative">
            <SceneContainer
              ref={editorRef}
              modules={project.modules}
              roomWidth={(project.dimensions?.width || 4000) / 1000} // Convert to meters
              roomLength={(project.dimensions?.length || 3000) / 1000} // Convert to meters
              roomHeight={(project.dimensions?.height || 2400) / 1000} // Convert to meters
              showGrid={true}
              enableOrbitControls={true}
              selectedModuleId={selectedModule?.id}
              onSelectModule={handleModuleSelect}
              editorMode={editorMode}
              viewMode={viewMode}
              onModuleUpdate={handleModuleUpdate}
            />
          </div>
        </div>
        
        {/* Right Sidebar - Properties Panel */}
        {isRightSidebarOpen && selectedModule && (
          <ModulePropertiesSidebar
            module={selectedModule}
            onUpdate={handleModuleUpdate}
            onDelete={handleModuleDelete}
            onClose={() => setIsRightSidebarOpen(false)}
          />
        )}
      </div>
    </DesignerLayout>
  );
};

export default ProjectEditor3D;
