import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SceneContainer } from '@/components/3d/SceneContainer';
import { Project, FurnitureModule } from '@/types';
import { ProjectService } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Save, Share, Download, Layers, Export } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModuleLibrary } from '@/components/3d/ModuleLibrary';
import { ModuleProperties } from '@/components/3d/ModuleProperties';
import { ExportOptions } from '@/components/exports/ExportOptions';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { v4 as uuidv4 } from 'uuid';

const ProjectEditor3D = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [showLibrary, setShowLibrary] = useState(true);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get selected module
  const selectedModule = project?.modules.find(m => m.id === selectedModuleId);

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

  // Handle save project
  const handleSave = async () => {
    if (!project) return;
    
    try {
      // Save the project to the database
      await ProjectService.updateProject(project.id, {
        modules: project.modules,
        parameters: {
          ...project.parameters,
          // Store a JSON representation of the scene for later loading
          scene3D: {
            modules: project.modules.map(m => ({
              id: m.id,
              type: m.type,
              dim: {
                L: m.width,
                H: m.height,
                A: m.depth
              },
              material: m.materials.find(mat => mat.part === 'body')?.materialId || '',
              front: {
                material: m.materials.find(mat => mat.part === 'door' || mat.part === 'drawer_front')?.materialId || '',
                paint: m.processingOptions.some(p => p.type === 'painting'),
                cnc: m.processingOptions.some(p => p.type === 'cnc_rifled') ? 'rifled' : ''
              },
              accessories: m.accessories.map(acc => acc.accessoryItemId),
              position: {
                x: m.position[0],
                y: m.position[1],
                z: m.position[2]
              },
              rotation: m.rotation[1] // Using y-rotation as main rotation
            }))
          }
        },
        updatedAt: new Date()
      });
      
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

  const handleBack = () => {
    // Check if we're viewing a module or a regular project
    if (projectId?.startsWith('module-')) {
      navigate('/designer/modules');
    } else {
      navigate('/designer/projects');
    }
  };

  // Add a module to the scene
  const handleAddModule = (newModule: FurnitureModule) => {
    if (!project) return;
    
    setProject({
      ...project,
      modules: [...project.modules, newModule]
    });
    
    setSelectedModuleId(newModule.id);
    
    toast({
      title: 'Module Added',
      description: `${newModule.name} has been added to the scene`,
    });
  };

  // Update a module in the scene
  const handleUpdateModule = (updatedModule: FurnitureModule) => {
    if (!project) return;
    
    setProject({
      ...project,
      modules: project.modules.map(m => 
        m.id === updatedModule.id ? updatedModule : m
      )
    });
  };

  // Delete a module from the scene
  const handleDeleteModule = (moduleId: string) => {
    if (!project) return;
    
    setProject({
      ...project,
      modules: project.modules.filter(m => m.id !== moduleId)
    });
    
    setSelectedModuleId(null);
    
    toast({
      title: 'Module Deleted',
      description: 'The module has been removed from the scene',
    });
  };

  // Export project dialog
  const handleOpenExport = () => {
    setShowExportDialog(true);
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
      <div className="flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-white border-b shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-medium">
                {project?.name || 'Project'} - 3D Editor
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setShowLibrary(!showLibrary)}>
                <Layers size={16} className="mr-2" />
                {showLibrary ? 'Hide Library' : 'Show Library'}
              </Button>
              <Button variant="outline" onClick={handleSave}>
                <Save size={16} className="mr-2" />
                Save
              </Button>
              <Button onClick={handleOpenExport}>
                <Export size={16} className="mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>

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
            <Card className="m-4 flex-1 shadow-md border-gray-200 overflow-hidden">
              <CardContent className="p-0 h-full">
                <SceneContainer
                  modules={project?.modules || []}
                  roomWidth={(project?.dimensions?.width || 4000) / 1000} // Convert to meters
                  roomLength={(project?.dimensions?.length || 3000) / 1000} // Convert to meters
                  roomHeight={(project?.dimensions?.height || 2400) / 1000} // Convert to meters
                  showGrid={true}
                  enableOrbitControls={true}
                  onSelectModule={setSelectedModuleId}
                  selectedModuleId={selectedModuleId}
                />
              </CardContent>
            </Card>
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
