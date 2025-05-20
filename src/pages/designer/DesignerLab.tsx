
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DesignerLayout } from '@/components/layout/DesignerLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { NewSpaceDialog } from '@/components/spaces/NewSpaceDialog';
import { NewBodyWizard } from '@/components/bodies/NewBodyWizard';
import { Space, FurnitureBody } from '@/types';
import { SpaceService } from '@/services/spaceService';
import { BodyService } from '@/services/bodyService';
import { ExportService } from '@/services/exportService';
import { useToast } from '@/hooks/use-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import { UiProvider, useUi } from '@/contexts/UiContext';
import { 
  Calculator, 
  Cube, 
  FileExport, 
  FlaskConical, 
  Loader, 
  Plus, 
  Ruler, 
  Wrench 
} from 'lucide-react';

// Body cards component
const BodiesGrid = ({ 
  bodies,
  onExportBody,
  onDeleteBody
}: { 
  bodies: FurnitureBody[],
  onExportBody: (bodyId: string) => void,
  onDeleteBody: (bodyId: string) => void
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {bodies.map(body => (
        <Card key={body.id} className="overflow-hidden">
          <div className="relative aspect-video bg-gray-100 flex items-center justify-center">
            {body.previewImgUrl ? (
              <img src={body.previewImgUrl} alt={body.name} className="object-contain max-h-full" />
            ) : (
              <Cube className="h-16 w-16 text-gray-400" />
            )}
            <div className="absolute bottom-0 right-0 p-2 bg-white/90 text-xs font-medium">
              {body.width}×{body.height}×{body.depth} mm
            </div>
          </div>
          
          <CardHeader className="p-4">
            <CardTitle className="text-base truncate">{body.name}</CardTitle>
            <CardDescription className="flex justify-between items-center">
              <span>{body.parts.length} piese</span>
              <span>{body.accessories.length} accesorii</span>
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-4 pt-0">
            <div className="flex justify-between">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onExportBody(body.id)}
              >
                <FileExport className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDeleteBody(body.id)}
              >
                Șterge
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Spaces grid component
const SpacesGrid = ({
  spaces,
  onSpaceSelected
}: {
  spaces: Space[],
  onSpaceSelected: (space: Space) => void
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {spaces.map(space => (
        <Card key={space.id} className="hover:border-designer-primary cursor-pointer transition-colors" onClick={() => onSpaceSelected(space)}>
          <CardHeader>
            <CardTitle>{space.name}</CardTitle>
            <CardDescription>
              {space.width}×{space.height}×{space.depth} mm
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {space.includePipe && (
                <div className="bg-designer-primary/10 text-designer-primary text-xs px-2 py-1 rounded-full">
                  Țevi
                </div>
              )}
              {space.includeFaucets && (
                <div className="bg-designer-primary/10 text-designer-primary text-xs px-2 py-1 rounded-full">
                  Robineți
                </div>
              )}
              {space.includeCornice && (
                <div className="bg-designer-primary/10 text-designer-primary text-xs px-2 py-1 rounded-full">
                  Scafă
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Main component
const DesignerLabContent = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [activeTab, setActiveTab] = useState('spaces');
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [bodies, setBodies] = useState<FurnitureBody[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [spaceDialogOpen, setSpaceDialogOpen] = useState(false);
  const [bodyWizardOpen, setBodyWizardOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { showSuccessToast, setLoading } = useUi();
  
  // Load spaces
  React.useEffect(() => {
    const loadSpaces = async () => {
      setIsLoading(true);
      try {
        let loadedSpaces: Space[];
        if (projectId) {
          loadedSpaces = await SpaceService.getSpacesByProjectId(projectId);
        } else {
          loadedSpaces = await SpaceService.getAllSpaces();
        }
        setSpaces(loadedSpaces);
      } catch (error) {
        console.error("Error loading spaces:", error);
        toast({
          title: "Eroare",
          description: "Nu s-au putut încărca spațiile.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSpaces();
  }, [projectId, toast]);
  
  // Load bodies for selected space
  React.useEffect(() => {
    const loadBodies = async () => {
      if (selectedSpace) {
        setIsLoading(true);
        try {
          const loadedBodies = await BodyService.getBodiesBySpaceId(selectedSpace.id);
          setBodies(loadedBodies);
        } catch (error) {
          console.error("Error loading bodies:", error);
          toast({
            title: "Eroare",
            description: "Nu s-au putut încărca corpurile pentru acest spațiu.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setBodies([]);
      }
    };
    
    loadBodies();
  }, [selectedSpace, toast]);
  
  const handleSpaceCreated = (space: Omit<Space, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>) => {
    const createSpace = async () => {
      try {
        const newSpace = await SpaceService.createSpace({
          ...space,
          projectId: projectId || 'default'
        });
        
        setSpaces(prev => [...prev, newSpace]);
        setSelectedSpace(newSpace);
        setActiveTab('bodies');
        showSuccessToast('Spațiu creat', `Spațiul ${newSpace.name} a fost creat cu succes.`);
      } catch (error) {
        console.error("Error creating space:", error);
        toast({
          title: "Eroare",
          description: "Nu s-a putut crea spațiul.",
          variant: "destructive"
        });
      }
    };
    
    createSpace();
  };
  
  const handleBodyCreated = (body: FurnitureBody) => {
    setBodies(prev => [...prev, body]);
  };
  
  const handleSpaceSelected = (space: Space) => {
    setSelectedSpace(space);
    setActiveTab('bodies');
  };
  
  const handleExportBody = async (bodyId: string) => {
    setLoading('export-body', true);
    try {
      // Generate DXF export
      const dxfUrl = await BodyService.exportBodyToDxf(bodyId);
      
      // Success notification
      showSuccessToast(
        'Export finalizat',
        'Exportul DXF a fost generat cu succes.'
      );
      
      // In a real app, this would trigger download
      console.log(`Download DXF from: ${dxfUrl}`);
    } catch (error) {
      console.error("Error exporting body:", error);
      toast({
        title: "Eroare la export",
        description: "Nu s-a putut exporta corpul în format DXF.",
        variant: "destructive"
      });
    } finally {
      setLoading('export-body', false);
    }
  };
  
  const handleDeleteBody = async (bodyId: string) => {
    try {
      await BodyService.deleteBody(bodyId);
      setBodies(prev => prev.filter(body => body.id !== bodyId));
      toast({
        title: "Corp șters",
        description: "Corpul a fost șters cu succes.",
      });
    } catch (error) {
      console.error("Error deleting body:", error);
      toast({
        title: "Eroare",
        description: "Nu s-a putut șterge corpul.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <>
      {/* Global loading overlay */}
      {(isLoading) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="glass p-6 rounded-2xl shadow-lg flex flex-col items-center space-y-3">
            <Loader className="h-8 w-8 animate-spin text-designer-primary" />
            <p className="text-sm font-medium">Se încarcă...</p>
          </div>
        </div>
      )}
      
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold designer-gradient-text">Laboratorul proiectantului</h1>
            <p className="text-gray-500 mt-1">Creează și gestionează spații și corpuri pentru mobilă la comandă</p>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => setSpaceDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Spațiu nou
            </Button>
            <Button onClick={() => setBodyWizardOpen(true)} disabled={!selectedSpace}>
              <Cube className="h-4 w-4 mr-2" />
              Corp nou
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center mb-6">
            <TabsList className="mr-auto bg-transparent border">
              <TabsTrigger 
                value="spaces" 
                className="data-[state=active]:bg-designer-primary/20 data-[state=active]:text-designer-primary"
              >
                <Ruler className="h-4 w-4 mr-2" />
                Spații
              </TabsTrigger>
              <TabsTrigger 
                value="bodies"
                className="data-[state=active]:bg-designer-primary/20 data-[state=active]:text-designer-primary"
              >
                <Cube className="h-4 w-4 mr-2" />
                Corpuri
              </TabsTrigger>
              <TabsTrigger 
                value="processing"
                className="data-[state=active]:bg-designer-primary/20 data-[state=active]:text-designer-primary"
              >
                <Wrench className="h-4 w-4 mr-2" />
                Prelucrare
              </TabsTrigger>
              <TabsTrigger 
                value="export"
                className="data-[state=active]:bg-designer-primary/20 data-[state=active]:text-designer-primary"
              >
                <FileExport className="h-4 w-4 mr-2" />
                Export
              </TabsTrigger>
              <TabsTrigger 
                value="calculator"
                className="data-[state=active]:bg-designer-primary/20 data-[state=active]:text-designer-primary"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculator
              </TabsTrigger>
            </TabsList>
            
            {activeTab === 'bodies' && selectedSpace && (
              <div className="text-sm ml-4">
                Spațiu selectat: <span className="font-medium">{selectedSpace.name}</span>
              </div>
            )}
            
            {activeTab === 'bodies' && !selectedSpace && (
              <div className="text-sm text-orange-500 ml-4">
                Selectați un spațiu pentru a gestiona corpurile
              </div>
            )}
          </div>
          
          <TabsContent value="spaces" className="mt-4">
            {spaces.length > 0 ? (
              <SpacesGrid spaces={spaces} onSpaceSelected={handleSpaceSelected} />
            ) : (
              <div className="text-center py-12">
                <FlaskConical className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">Niciun spațiu disponibil</h3>
                <p className="text-gray-500 mb-4">Adaugă un spațiu nou pentru a începe proiectarea</p>
                <Button onClick={() => setSpaceDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adaugă spațiu nou
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="bodies" className="mt-4">
            {!selectedSpace ? (
              <div className="text-center py-12">
                <FlaskConical className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">Niciun spațiu selectat</h3>
                <p className="text-gray-500">Selectează un spațiu din tab-ul "Spații" pentru a gestiona corpurile</p>
              </div>
            ) : bodies.length > 0 ? (
              <BodiesGrid 
                bodies={bodies} 
                onExportBody={handleExportBody}
                onDeleteBody={handleDeleteBody}
              />
            ) : (
              <div className="text-center py-12">
                <Cube className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-medium mb-2">Niciun corp disponibil</h3>
                <p className="text-gray-500 mb-4">Adaugă un corp nou pentru a începe proiectarea</p>
                <Button onClick={() => setBodyWizardOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adaugă corp nou
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="processing" className="mt-4">
            <div className="text-center py-12">
              <Wrench className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">Prelucrare și operațiuni</h3>
              <p className="text-gray-500 mb-4">Funcționalitate în dezvoltare</p>
            </div>
          </TabsContent>
          
          <TabsContent value="export" className="mt-4">
            <div className="text-center py-12">
              <FileExport className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">Export date</h3>
              <p className="text-gray-500 mb-4">Funcționalitate în dezvoltare</p>
            </div>
          </TabsContent>
          
          <TabsContent value="calculator" className="mt-4">
            <div className="text-center py-12">
              <Calculator className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium mb-2">Calculator dimensiuni</h3>
              <p className="text-gray-500 mb-4">Funcționalitate în dezvoltare</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Dialogs */}
      <NewSpaceDialog
        open={spaceDialogOpen}
        onOpenChange={setSpaceDialogOpen}
        onSpaceCreated={handleSpaceCreated}
      />
      
      {selectedSpace && (
        <NewBodyWizard
          open={bodyWizardOpen}
          onOpenChange={setBodyWizardOpen}
          spaceId={selectedSpace.id}
          onBodyCreated={handleBodyCreated}
        />
      )}
    </>
  );
};

// Main export with providers
const DesignerLab = () => {
  return (
    <AuthProvider>
      <UiProvider>
        <DesignerLayout>
          <DesignerLabContent />
        </DesignerLayout>
      </UiProvider>
    </AuthProvider>
  );
};

export default DesignerLab;
