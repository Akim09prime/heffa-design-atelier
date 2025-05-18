
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
    // Reset form data when opening dialog
    setNewModuleData({
      name: '',
      category: 'base',
      width: '600',
      depth: '560',
      height: '800',
      imageUrl: ''
    });
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setNewModuleData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateModule = () => {
    if (!newModuleData.name.trim()) {
      toast({
        title: "Eroare de validare",
        description: "Numele modulului este obligatoriu",
        variant: "destructive"
      });
      return;
    }

    const moduleId = Math.floor(Math.random() * 1000) + 100;
    
    // Create new module with additional data
    const createdModule = {
      ...newModuleData,
      id: moduleId,
      description: `${newModuleData.name} - ${newModuleData.width}×${newModuleData.height}×${newModuleData.depth}mm`,
      price: 275 + (Math.floor(Math.random() * 10) * 25),
      dimensions: `${newModuleData.width}×${newModuleData.height}×${newModuleData.depth}mm`,
      popularity: Math.floor(Math.random() * 5) + 1,
      imageUrl: imagePreview || undefined  // Use the image preview URL
    };
    
    // Cache the new module
    moduleCache[newModuleData.category] = [
      ...moduleCache[newModuleData.category], 
      createdModule
    ];
    
    setIsNewModuleDialogOpen(false);
    
    toast({
      title: "Modul creat",
      description: "Noul tău modul a fost creat cu succes",
    });
    
    // Navigate to the module details
    navigate(`/designer/modules/${moduleId}`);
  };

  const handleContinueTo3D = (moduleId: number) => {
    toast({
      title: "Se deschide configurarea 3D",
      description: "Se pregătește mediul 3D pentru configurarea modulului",
    });
    const projectId = `module-${moduleId}`;
    navigate(`/designer/projects/${projectId}/3d-editor`);
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
                <CardContent className="flex-1 flex items-center justify-center p-10">
                  <div className="text-center">
                    <TriangleAlert className="h-16 w-16 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">Constructorul de module nu este încă disponibil</h3>
                    <p className="text-muted-foreground mb-4">
                      Această funcționalitate va fi disponibilă în curând. Te rugăm să revii mai târziu.
                    </p>
                    <Button 
                      onClick={() => setActiveTab('gallery')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Înapoi la galeria de module
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* New Module Dialog */}
          <Dialog open={isNewModuleDialogOpen} onOpenChange={setIsNewModuleDialogOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Creează modul nou</DialogTitle>
                <DialogDescription>
                  Definește proprietățile de bază pentru noul tău modul de mobilier.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="name" className="text-right text-sm font-medium">
                    Nume
                  </label>
                  <Input
                    id="name"
                    className="col-span-3"
                    placeholder="Introdu numele modulului"
                    value={newModuleData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="category" className="text-right text-sm font-medium">
                    Categorie
                  </label>
                  <select
                    id="category"
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newModuleData.category}
                    onChange={handleInputChange}
                  >
                    <option value="base">Corp bază</option>
                    <option value="wall">Corp suspendat</option>
                    <option value="tall">Corp înalt</option>
                    <option value="drawer">Unitate sertare</option>
                    <option value="corner">Corp colț</option>
                    <option value="island">Insulă</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="width" className="text-right text-sm font-medium">
                    Lățime (mm)
                  </label>
                  <Input
                    id="width"
                    type="number"
                    className="col-span-3"
                    placeholder="600"
                    value={newModuleData.width}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="depth" className="text-right text-sm font-medium">
                    Adâncime (mm)
                  </label>
                  <Input
                    id="depth"
                    type="number"
                    className="col-span-3"
                    placeholder="560"
                    value={newModuleData.depth}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="height" className="text-right text-sm font-medium">
                    Înălțime (mm)
                  </label>
                  <Input
                    id="height"
                    type="number"
                    className="col-span-3"
                    placeholder="800"
                    value={newModuleData.height}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="moduleImage" className="text-right text-sm font-medium">
                    Imagine
                  </label>
                  <div className="col-span-3">
                    <div className="flex items-center gap-4">
                      <label htmlFor="moduleImage" className="cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50">
                        <Upload size={16} className="mr-2" />
                        Încarcă imagine
                        <Input
                          id="moduleImage"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                      {selectedImage && (
                        <span className="text-sm text-green-600 flex items-center">
                          <Check size={16} className="mr-1" />
                          {selectedImage.name}
                        </span>
                      )}
                    </div>
                    {imagePreview && (
                      <div className="mt-2 relative w-full h-32 bg-gray-100 rounded-md overflow-hidden">
                        <img 
                          src={imagePreview} 
                          alt="Preview modul" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Anulează</Button>
                </DialogClose>
                <Button onClick={handleCreateModule} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Creează modul
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </DesignerLayout>
    </TranslationProvider>
  );
};

export default Modules;
