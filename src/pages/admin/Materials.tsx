
import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Upload, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { MaterialType, Material } from '@/types';
import { MaterialService } from '@/services/materialService';
import { MaterialCard } from '@/components/materials/MaterialCard';
import { MaterialForm } from '@/components/materials/MaterialForm';
import { useTranslation } from '@/contexts/TranslationContext';

const Materials = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [materialType, setMaterialType] = useState<MaterialType>('PAL');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  
  // Load materials when component mounts or material type changes
  useEffect(() => {
    const fetchMaterials = async () => {
      setIsLoading(true);
      try {
        const fetchedMaterials = await MaterialService.getMaterialsByType(materialType);
        setMaterials(fetchedMaterials);
        setFilteredMaterials(fetchedMaterials);
      } catch (error) {
        console.error('Error fetching materials:', error);
        toast({
          title: t('common.error'),
          description: t('materials.failedToLoad'),
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMaterials();
  }, [materialType, toast, t]);
  
  // Filter materials when search query changes
  useEffect(() => {
    if (searchQuery) {
      const filtered = materials.filter(material => 
        material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMaterials(filtered);
    } else {
      setFilteredMaterials(materials);
    }
  }, [searchQuery, materials]);
  
  const handleTabChange = (value: string) => {
    setMaterialType(value.toUpperCase() as MaterialType);
  };
  
  const handleAddMaterial = async (formData: any) => {
    setIsLoading(true);
    try {
      // Create a new material object from form data
      const newMaterial = {
        ...formData,
        compatibleOperations: [],
        type: materialType
      };
      
      // Call the service to add the material
      const addedMaterial = await MaterialService.addMaterial(newMaterial);
      
      // Update the local state with the new material
      setMaterials(prevMaterials => [...prevMaterials, addedMaterial]);
      
      toast({
        title: t('materials.materialAdded'),
        description: `${formData.name} ${t('materials.hasBeenAdded')}`,
      });
    } catch (error) {
      console.error('Error adding material:', error);
      toast({
        title: t('common.error'),
        description: t('materials.failedToAdd'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsAddDialogOpen(false);
    }
  };
  
  const handleEditMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateMaterial = async (formData: any) => {
    if (!selectedMaterial) return;
    
    setIsLoading(true);
    try {
      // Call the service to update the material
      const updatedMaterial = await MaterialService.updateMaterial(selectedMaterial.id, {
        ...formData,
        type: selectedMaterial.type
      });
      
      // Update the local state with the updated material
      setMaterials(prevMaterials => 
        prevMaterials.map(m => m.id === selectedMaterial.id ? updatedMaterial : m)
      );
      
      toast({
        title: t('materials.materialUpdated'),
        description: `${formData.name} ${t('materials.hasBeenUpdated')}`,
      });
    } catch (error) {
      console.error('Error updating material:', error);
      toast({
        title: t('common.error'),
        description: t('materials.failedToUpdate'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsEditDialogOpen(false);
    }
  };
  
  const handleDeleteMaterial = async (material: Material) => {
    setIsLoading(true);
    try {
      // Call the service to delete the material
      await MaterialService.deleteMaterial(material.id);
      
      // Update the local state by removing the deleted material
      setMaterials(prevMaterials => prevMaterials.filter(m => m.id !== material.id));
      
      toast({
        title: t('materials.materialDeleted'),
        description: `${material.name} ${t('materials.hasBeenDeleted')}`,
      });
    } catch (error) {
      console.error('Error deleting material:', error);
      toast({
        title: t('common.error'),
        description: t('materials.failedToDelete'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImportMaterials = () => {
    toast({
      title: t('common.import'),
      description: t('materials.importFunctionality'),
    });
  };
  
  const handleExportMaterials = () => {
    toast({
      title: t('common.export'),
      description: t('materials.exportFunctionality'),
    });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-medium text-white">{t('materials.title')}</h1>
            <p className="text-gray-300">{t('materials.description')}</p>
          </div>
          <div className="flex flex-wrap w-full lg:w-auto gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t('materials.searchPlaceholder')}
                className="w-full pl-9 bg-gray-800 border-gray-700 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={handleImportMaterials}>
              <Upload className="h-4 w-4 mr-2" />
              {t('common.import')}
            </Button>
            <Button variant="outline" onClick={handleExportMaterials}>
              <Download className="h-4 w-4 mr-2" />
              {t('common.export')}
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {t('materials.addMaterial')}
            </Button>
          </div>
        </div>

        <Tabs 
          defaultValue="pal" 
          onValueChange={handleTabChange}
        >
          <TabsList className="mb-6 bg-gray-800">
            <TabsTrigger value="pal">PAL</TabsTrigger>
            <TabsTrigger value="mdf">MDF</TabsTrigger>
            <TabsTrigger value="mdf-agt">MDF-AGT</TabsTrigger>
            <TabsTrigger value="pfl">PFL</TabsTrigger>
            <TabsTrigger value="glass">{t('materials.glass')}</TabsTrigger>
            <TabsTrigger value="countertop">{t('materials.countertops')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pal">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-white">PAL {t('materials.materials')}</CardTitle>
                <CardDescription className="text-gray-400">
                  PAL {t('materials.materialsFrom')} {filteredMaterials.length} {t('materials.entries')}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <p className="text-gray-400">{t('materials.loading')}</p>
                  </div>
                ) : filteredMaterials.length === 0 ? (
                  <div className="flex justify-center items-center h-64">
                    <p className="text-gray-400">{t('materials.noMaterialsFound')}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredMaterials.map((material) => (
                      <MaterialCard 
                        key={material.id}
                        material={material}
                        onEdit={handleEditMaterial}
                        onDelete={handleDeleteMaterial}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {['mdf', 'mdf-agt', 'pfl', 'glass', 'countertop'].map((type) => (
            <TabsContent key={type} value={type}>
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="border-b border-gray-700">
                  <CardTitle className="text-white">{type.toUpperCase()} {t('materials.materials')}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {type.toUpperCase()} {t('materials.materialsAndSupplies')} {filteredMaterials.length} {t('materials.entries')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <p className="text-gray-400">{t('materials.loading')}</p>
                    </div>
                  ) : filteredMaterials.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                      <p className="text-gray-400">{t('materials.noMaterialsFound')}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {filteredMaterials.map((material) => (
                        <MaterialCard 
                          key={material.id}
                          material={material}
                          onEdit={handleEditMaterial}
                          onDelete={handleDeleteMaterial}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Add Material Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{t('materials.addNewMaterial')}</DialogTitle>
          </DialogHeader>
          <MaterialForm 
            onSubmit={handleAddMaterial}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Material Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">{t('materials.editMaterial')}</DialogTitle>
          </DialogHeader>
          {selectedMaterial && (
            <MaterialForm 
              material={selectedMaterial}
              onSubmit={handleUpdateMaterial}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default Materials;
