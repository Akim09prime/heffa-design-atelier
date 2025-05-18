
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SceneContainer } from '@/components/3d/SceneContainer';
import { Project } from '@/types';
import { ProjectService } from '@/services/projectService';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Save, Share, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProjectEditor3D = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (projectId) {
          console.log(`Fetching project with ID: ${projectId}`);
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

  const handleSave = () => {
    toast({
      title: 'Project Saved',
      description: 'Your project has been saved successfully',
    });
  };

  const handleBack = () => {
    navigate(`/designer/projects`);
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
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleBack}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-medium gradient-text">{project.name} - 3D Editor</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSave} className="fancy-btn">
              <Save size={16} className="mr-2" />
              Save
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              <Share size={16} className="mr-2" />
              Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="shadow-lg border-gray-200 h-[600px]">
              <CardContent className="p-0 h-full">
                <SceneContainer
                  modules={project.modules}
                  roomWidth={project.dimensions.width / 1000} // Convert to meters
                  roomLength={project.dimensions.length / 1000} // Convert to meters
                  roomHeight={project.dimensions.height / 1000} // Convert to meters
                  showGrid={true}
                  enableOrbitControls={true}
                />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-lg border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Type</span>
                  <p className="font-medium">{project.type} {project.subType ? `(${project.subType})` : ''}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Room</span>
                  <p className="font-medium capitalize">{project.roomType}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Dimensions</span>
                  <p>{project.dimensions.width}mm × {project.dimensions.length}mm × {project.dimensions.height}mm</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-gray-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="modules">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="modules">Modules</TabsTrigger>
                    <TabsTrigger value="materials">Materials</TabsTrigger>
                  </TabsList>
                  <TabsContent value="modules" className="pt-4">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-3">Add furniture modules to your project</p>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => navigate('/designer/modules')}
                      >
                        Browse Modules
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="materials" className="pt-4">
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-3">Choose materials for your furniture</p>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => navigate('/designer/materials')}
                      >
                        Browse Materials
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-center border-t pt-4">
                <Button variant="outline" className="w-full" onClick={() => navigate(`/designer/exports/${projectId}`)}>
                  <Download size={16} className="mr-2" />
                  Export Project
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DesignerLayout>
  );
};

export default ProjectEditor3D;
