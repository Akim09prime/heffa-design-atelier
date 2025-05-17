
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

const Materials = () => {
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
          title: 'Error',
          description: 'Failed to load materials data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMaterials();
  }, [materialType, toast]);
  
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
  
  const handleAddMaterial = (formData: any) => {
    // In a real app, this would add the material to the database
    toast({
      title: 'Material Added',
      description: `${formData.name} has been added successfully`,
    });
    setIsAddDialogOpen(false);
  };
  
  const handleEditMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setIsEditDialogOpen(true);
  };
  
  const handleUpdateMaterial = (formData: any) => {
    if (!selectedMaterial) return;
    
    // In a real app, this would update the material in the database
    toast({
      title: 'Material Updated',
      description: `${formData.name} has been updated successfully`,
    });
    setIsEditDialogOpen(false);
  };
  
  const handleDeleteMaterial = (material: Material) => {
    // In a real app, this would delete the material from the database
    toast({
      title: 'Material Deleted',
      description: `${material.name} has been deleted successfully`,
    });
  };
  
  const handleImportMaterials = () => {
    toast({
      title: 'Import Materials',
      description: 'Material import functionality would be implemented here',
    });
  };
  
  const handleExportMaterials = () => {
    toast({
      title: 'Export Materials',
      description: 'Material export functionality would be implemented here',
    });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-medium text-white">Materials Database</h1>
            <p className="text-gray-300">Manage all materials in the system</p>
          </div>
          <div className="flex flex-wrap w-full lg:w-auto gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search materials..."
                className="w-full pl-9 bg-gray-800 border-gray-700 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={handleImportMaterials}>
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" onClick={handleExportMaterials}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Material
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
            <TabsTrigger value="glass">Glass</TabsTrigger>
            <TabsTrigger value="countertop">Countertops</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pal">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="text-white">PAL Materials</CardTitle>
                <CardDescription className="text-gray-400">
                  PAL materials from Egger and other suppliers. Total: {filteredMaterials.length} entries
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <p className="text-gray-400">Loading materials...</p>
                  </div>
                ) : filteredMaterials.length === 0 ? (
                  <div className="flex justify-center items-center h-64">
                    <p className="text-gray-400">No materials found. Add some materials to get started.</p>
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
                  <CardTitle className="text-white">{type.toUpperCase()} Materials</CardTitle>
                  <CardDescription className="text-gray-400">
                    {type.toUpperCase()} materials and supplies. Total: {filteredMaterials.length} entries
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <p className="text-gray-400">Loading materials...</p>
                    </div>
                  ) : filteredMaterials.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                      <p className="text-gray-400">No materials found. Add some materials to get started.</p>
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
            <DialogTitle className="text-white">Add New Material</DialogTitle>
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
            <DialogTitle className="text-white">Edit Material</DialogTitle>
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
