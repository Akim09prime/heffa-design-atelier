
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Space, FurnitureBody } from '@/types';
import { ProjectService } from '@/services/projectService';
import { SpaceService } from '@/services/spaceService';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Settings, Box, Copy, Trash2, FileOutput } from 'lucide-react';
import { BodyPresetSelector } from '@/components/bodies/BodyPresetSelector';

const SpaceView = () => {
  const { projectId, spaceId } = useParams<{ projectId: string, spaceId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [project, setProject] = useState<any | null>(null);
  const [space, setSpace] = useState<Space | null>(null);
  const [bodies, setBodies] = useState<FurnitureBody[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bodies');
  const [showPresetSelector, setShowPresetSelector] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        if (!projectId || !spaceId) {
          toast({
            title: "Eroare",
            description: "ID proiect sau spațiu lipsă",
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
        
        // Load space
        const spaceData = await SpaceService.getSpaceById(spaceId);
        if (!spaceData) {
          toast({
            title: "Eroare",
            description: "Spațiul nu a fost găsit",
            variant: "destructive"
          });
          navigate(`/designer/projects/${projectId}/edit`);
          return;
        }
        setSpace(spaceData);
        
        // In a real app, you would load bodies for this space from a service
        // For now, using empty array as we haven't implemented the body service yet
        setBodies([]);
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
  }, [projectId, spaceId, toast, navigate]);

  const handleAddBody = () => {
    // For now, just show the preset selector
    setShowPresetSelector(true);
  };

  const handleCreateCustomBody = () => {
    if (projectId && spaceId) {
      navigate(`/designer/projects/${projectId}/spaces/${spaceId}/bodies/new`);
    }
  };

  const handleAddPresetBody = (presetId: string) => {
    // Here we would handle adding a preset body
    console.log("Adding preset body with ID:", presetId);
    toast({
      title: "Succes",
      description: "Corp adăugat din presetări",
    });
    setShowPresetSelector(false);
  };

  if (isLoading) {
    return (
      <DesignerLayout>
        <div className="p-8 flex justify-center items-center h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-designer-primary mx-auto"></div>
            <p className="mt-4 text-designer-primary font-medium">Se încarcă datele spațiului...</p>
          </div>
        </div>
      </DesignerLayout>
    );
  }

  if (!project || !space) {
    return (
      <DesignerLayout>
        <div className="p-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Spațiu negăsit</h2>
            <p className="text-gray-500 mb-6">Spațiul solicitat nu a fost găsit sau a fost șters.</p>
            <Button onClick={() => navigate(`/designer/projects/${projectId}/edit`)}>
              Înapoi la proiect
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
            onClick={() => navigate(`/designer/projects/${projectId}/edit`)}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Înapoi la proiect
          </Button>
          <div>
            <h1 className="text-2xl font-medium designer-gradient-text">
              Spațiu: {space.name} - {project.name}
            </h1>
            <p className="text-gray-500 text-sm">
              {space.width}mm x {space.height}mm x {space.depth}mm
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="bodies">Corpuri mobilier</TabsTrigger>
            <TabsTrigger value="visualization">Vizualizare 3D</TabsTrigger>
            <TabsTrigger value="settings">Setări spațiu</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bodies" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Corpuri mobilier</h2>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={handleAddBody}>
                  <Plus className="h-4 w-4 mr-2" /> Adaugă din presetări
                </Button>
                <Button onClick={handleCreateCustomBody}>
                  <Settings className="h-4 w-4 mr-2" /> Creează corp personalizat
                </Button>
              </div>
            </div>

            {bodies.length === 0 ? (
              <Card className="bg-gray-50 border-dashed border-2 border-gray-200">
                <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center">
                  <div className="bg-gray-100 p-4 rounded-full mb-4">
                    <Box className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Niciun corp definit</h3>
                  <p className="text-gray-500 text-center mb-4">
                    Adaugă primul corp de mobilier pentru a începe configurația.
                  </p>
                  <div className="flex space-x-3">
                    <Button variant="outline" onClick={handleAddBody}>
                      <Plus className="h-4 w-4 mr-2" /> Adaugă din presetări
                    </Button>
                    <Button onClick={handleCreateCustomBody}>
                      <Settings className="h-4 w-4 mr-2" /> Creează corp personalizat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bodies.map((body) => (
                  <Card key={body.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle>{body.name}</CardTitle>
                      <CardDescription>
                        {body.width}mm x {body.height}mm x {body.depth}mm
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      {body.previewImgUrl ? (
                        <img 
                          src={body.previewImgUrl} 
                          alt={body.name} 
                          className="w-full h-48 object-cover rounded-md mb-4" 
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center mb-4">
                          <Box className="h-12 w-12 text-gray-300" />
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tip:</span>
                          <span className="badge-designer">{body.createdFromPreset ? 'Presetat' : 'Personalizat'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Status:</span>
                          <span className={`text-${body.status === 'finalized' ? 'green' : 'amber'}-500 font-medium`}>
                            {body.status === 'finalized' ? 'Finalizat' : 'Schiță'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Componente:</span>
                          <span>{body.parts?.length || 0} piese</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-between">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => console.log("Edit body", body.id)}
                        >
                          <Settings className="h-4 w-4 mr-1" /> Editează
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => console.log("Copy body", body.id)}
                        >
                          <Copy className="h-4 w-4 mr-1" /> Clonează
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-500 hover:bg-red-50"
                          onClick={() => console.log("Delete body", body.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Button 
                        size="sm"
                        onClick={() => console.log("Export body", body.id)}
                      >
                        <FileOutput className="h-4 w-4 mr-1" /> Export
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {/* Preset selector if shown */}
            {showPresetSelector && (
              <BodyPresetSelector 
                onSelect={handleAddPresetBody}
                onClose={() => setShowPresetSelector(false)}
              />
            )}
          </TabsContent>
          
          <TabsContent value="visualization" className="mt-6">
            <div className="bg-gray-100 h-[500px] rounded-lg flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Vizualizare 3D</h3>
                <p className="text-gray-500 mb-4">
                  Vizualizare 3D a spațiului și corpurilor de mobilier va fi disponibilă în curând.
                </p>
                <Button variant="outline" onClick={() => navigate(`/designer/projects/${projectId}/3d-editor`)}>
                  Deschide în Editorul 3D
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Setări spațiu</CardTitle>
                <CardDescription>
                  Modifică proprietățile spațiului și opțiunile specifice.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">
                  Editarea setărilor spațiului va fi disponibilă în curând.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DesignerLayout>
  );
};

export default SpaceView;
