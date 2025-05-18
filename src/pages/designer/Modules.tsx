
import React, { useState } from 'react';
import { DesignerLayout } from '../../components/layout/DesignerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, Filter, Box, ArrowRight, Plus, Printer, 
  Settings, Check, Upload, Sofa, BedDouble, Car, TriangleAlert
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { ModuleLibrary } from '@/components/3d/ModuleLibrary';
import { SceneContainer } from '@/components/3d/SceneContainer';
import { TranslationProvider } from '@/contexts/TranslationContext';
import { ModuleCreationPanel } from '@/components/3d/ModuleCreationPanel';

// Define a ModuleData interface to better track module state
interface ModuleData {
  id?: number;
  name: string;
  category: string;
  width: string;
  depth: string;
  height: string;
  description?: string;
  imageUrl?: string;
}

// Cache for storing created modules
const moduleCache: Record<string, ModuleData[]> = {
  base: [],
  wall: [],
  tall: [],
  drawer: [],
  corner: [],
  island: []
};

const Modules = () => {
  const [isNewModuleDialogOpen, setIsNewModuleDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('gallery');
  const [hoveredModule, setHoveredModule] = useState<number | null>(null);
  const [modulesList, setModulesList] = useState<any[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [newModuleData, setNewModuleData] = useState<ModuleData>({
    name: '',
    category: 'base',
    width: '600',
    depth: '560',
    height: '800',
    imageUrl: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const params = useParams();
  const { moduleId } = params;

  const handleNewModule = () => {
    setIsNewModuleDialogOpen(true);
  };

  const handleAddModule = (module: any) => {
    setModulesList(prev => [...prev, module]);
    
    toast({
      title: "Modul adăugat",
      description: `${module.name} a fost adăugat în scenă`,
    });
  };

  const handleSelectModule = (moduleId: string | null) => {
    setSelectedModuleId(moduleId);
  };

  const handleContinueTo3D = (moduleId: number) => {
    toast({
      title: "Se deschide configurarea 3D",
      description: "Se pregătește mediul 3D pentru configurarea modulului",
    });
    const projectId = `module-${moduleId}`;
    navigate(`/designer/projects/${projectId}/3d-editor`);
  };

  return (
    <TranslationProvider>
      <DesignerLayout>
        <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 h-screen flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
                Module de Mobilier
              </h1>
              <p className="text-muted-foreground">Navighează și selectează module de mobilier preconfigurate</p>
            </div>
            
            <div className="flex w-full md:w-auto gap-4">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 shadow hover:shadow-lg transition-all duration-200"
                onClick={handleNewModule}
              >
                <Plus className="h-4 w-4 mr-2" />
                Modul Nou
              </Button>
            </div>
          </div>

          <Tabs 
            defaultValue="gallery" 
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <TabsList className="mb-6 bg-white border border-gray-200 shadow-sm">
              <TabsTrigger value="gallery" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Sofa className="h-4 w-4 mr-2" />
                Galerie module
              </TabsTrigger>
              <TabsTrigger value="3dView" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <BedDouble className="h-4 w-4 mr-2" />
                Vizualizare 3D
              </TabsTrigger>
              <TabsTrigger value="builder" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Car className="h-4 w-4 mr-2" />
                Constructor
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="gallery" className="flex-1 flex">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-1">
                <div className="col-span-1 md:col-span-3 lg:col-span-3 bg-white rounded-lg shadow">
                  <ModuleLibrary onAddModule={handleAddModule} className="h-full" />
                </div>
                
                <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-4 border-b">
                    <h3 className="font-medium text-lg">Preview 3D</h3>
                  </div>
                  <div className="h-64 lg:h-[500px]">
                    <SceneContainer 
                      modules={modulesList} 
                      roomWidth={3} 
                      roomLength={3} 
                      roomHeight={2.8}
                      onSelectModule={handleSelectModule}
                      selectedModuleId={selectedModuleId}
                    />
                  </div>
                  <div className="p-4 border-t bg-gray-50 text-center">
                    <p className="text-sm text-gray-500">
                      {modulesList.length} module în scenă
                    </p>
                    {modulesList.length > 0 && (
                      <Button 
                        variant="default"
                        size="sm"
                        className="mt-2 bg-blue-600 hover:bg-blue-700"
                        onClick={() => setActiveTab('3dView')}
                      >
                        Vizualizare completă
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="3dView" className="flex-1 flex flex-col">
              <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
                <SceneContainer 
                  modules={modulesList}
                  onSelectModule={handleSelectModule}
                  selectedModuleId={selectedModuleId}
                  roomWidth={5}
                  roomLength={5}
                  roomHeight={3}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="builder" className="flex-1 flex flex-col">
              <Card className="flex-1 flex flex-col">
                <CardContent className="p-6">
                  <ModuleCreationPanel onAddModule={handleAddModule} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* New Module Dialog */}
          <Dialog open={isNewModuleDialogOpen} onOpenChange={setIsNewModuleDialogOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create New Module</DialogTitle>
                <DialogDescription>
                  Define the properties for your new furniture module.
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <ModuleCreationPanel 
                  onAddModule={(module) => {
                    handleAddModule(module);
                    setIsNewModuleDialogOpen(false);
                  }}
                  onClose={() => setIsNewModuleDialogOpen(false)}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </DesignerLayout>
    </TranslationProvider>
  );
};

export default Modules;
