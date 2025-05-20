
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Space } from '@/types';
import { ProjectService } from '@/services/projectService';
import { SpaceService } from '@/services/spaceService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ArrowLeft, Edit2, Trash2, Layers, Box } from 'lucide-react';
import { NewSpaceDialog } from '@/components/spaces/NewSpaceDialog';

const ProjectEdit = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [project, setProject] = useState<any | null>(null);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewSpaceDialogOpen, setIsNewSpaceDialogOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        if (!projectId) {
          toast({
            title: "Eroare",
            description: "ID proiect lipsă",
            variant: "destructive"
          });
          navigate('/designer/projects');
          return;
        }
        
        // Load project
        const projectData = await ProjectService.getProjectById(projectId);
        if (!projectData) {
          toast({
            title: "Eroare",
            description: "Proiectul nu a fost găsit",
            variant: "destructive"
          });
          navigate('/designer/projects');
          return;
        }
        setProject(projectData);
        
        // Load spaces for this project
        const spacesData = await SpaceService.getSpacesByProjectId(projectId);
        setSpaces(spacesData);
      } catch (error) {
        toast({
          title: "Eroare",
          description: "Eroare la încărcarea datelor",
          variant: "destructive"
        });
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [projectId, toast, navigate]);

  const handleAddSpace = () => {
    setIsNewSpaceDialogOpen(true);
  };

  const handleSpaceCreated = async (space: Omit<Space, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (!projectId) return;
      
      // Add project ID to the space
      const newSpace = await SpaceService.createSpace({
        ...space,
        projectId: projectId
      });
      
      // Update spaces list
      setSpaces(prevSpaces => [...prevSpaces, newSpace]);
      
      toast({
        title: "Succes",
        description: `Spațiul "${space.name}" a fost creat cu succes`,
        variant: "default"
      });
      
      setIsNewSpaceDialogOpen(false);
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Eroare la crearea spațiului",
        variant: "destructive"
      });
      console.error("Error creating space:", error);
    }
  };

  const handleEditSpace = (spaceId: string) => {
    navigate(`/designer/projects/${projectId}/spaces/${spaceId}/edit`);
  };

  const handleDeleteSpace = async (spaceId: string) => {
    try {
      await SpaceService.deleteSpace(spaceId);
      
      // Update spaces list
      setSpaces(prevSpaces => prevSpaces.filter(space => space.id !== spaceId));
      
      toast({
        title: "Succes",
        description: "Spațiul a fost șters cu succes",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Eroare",
        description: "Eroare la ștergerea spațiului",
        variant: "destructive"
      });
      console.error("Error deleting space:", error);
    }
  };

  const handleViewSpaceModules = (spaceId: string, spaceName: string) => {
    navigate(`/designer/projects/${projectId}/spaces/${spaceId}`);
  };

  if (isLoading) {
    return (
      <DesignerLayout>
        <div className="p-8 flex justify-center items-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-designer-primary mx-auto"></div>
            <p className="mt-4 text-designer-primary font-medium">Se încarcă datele proiectului...</p>
          </div>
        </div>
      </DesignerLayout>
    );
  }

  if (!project) {
    return (
      <DesignerLayout>
        <div className="p-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Proiect negăsit</h2>
            <p className="text-gray-500 mb-6">Proiectul solicitat nu a fost găsit sau a fost șters.</p>
            <Button onClick={() => navigate('/designer/projects')}>
              Înapoi la proiecte
            </Button>
          </div>
        </div>
      </DesignerLayout>
    );
  }

  return (
    <DesignerLayout>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/designer/projects')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Înapoi la proiecte
          </Button>
          <div>
            <h1 className="text-2xl font-medium designer-gradient-text">Editare proiect: {project.name}</h1>
            <p className="text-gray-500 text-sm">
              {project.type} {project.subType ? `(${project.subType})` : ''} | Creat la {new Date(project.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium">Spații</h2>
            <Button onClick={handleAddSpace}>
              <Plus className="h-4 w-4 mr-2" /> Adaugă spațiu nou
            </Button>
          </div>

          {spaces.length === 0 ? (
            <Card className="bg-gray-50 border-dashed border-2 border-gray-200">
              <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Layers className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Niciun spațiu definit</h3>
                <p className="text-gray-500 text-center mb-4">
                  Adaugă primul spațiu pentru a începe configurarea proiectului.
                </p>
                <Button onClick={handleAddSpace}>
                  <Plus className="h-4 w-4 mr-2" /> Adaugă spațiu
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {spaces.map((space) => (
                <Card key={space.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle>{space.name}</CardTitle>
                    <CardDescription>
                      {space.width}mm x {space.height}mm x {space.depth}mm
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Țevi:</span>
                        <span>{space.includePipe ? 'Da' : 'Nu'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Robineți:</span>
                        <span>{space.includeFaucets ? 'Da' : 'Nu'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Scafă:</span>
                        <span>{space.includeCornice ? 'Da' : 'Nu'}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditSpace(space.id)}
                      >
                        <Edit2 className="h-4 w-4 mr-1" /> Editează
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => handleDeleteSpace(space.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                      </Button>
                    </div>
                    <Button 
                      onClick={() => handleViewSpaceModules(space.id, space.name)}
                    >
                      <Box className="h-4 w-4 mr-1" /> Corpuri
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => navigate(`/designer/projects/${projectId}/3d-editor`)}
          >
            Mergi la Editor 3D
          </Button>
          <Button
            onClick={() => navigate(`/designer/projects/${projectId}/quote`)}
          >
            Generează Ofertă
          </Button>
        </div>

        {/* Dialog pentru adăugarea unui spațiu nou */}
        <NewSpaceDialog
          open={isNewSpaceDialogOpen}
          onOpenChange={setIsNewSpaceDialogOpen}
          onSpaceCreated={handleSpaceCreated}
        />
      </div>
    </DesignerLayout>
  );
};

export default ProjectEdit;
