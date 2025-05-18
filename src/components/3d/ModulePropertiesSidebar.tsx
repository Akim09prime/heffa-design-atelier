import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FurnitureModule, Material, AccessoryItem } from '@/types';
import { X, Save, Trash, Move, RotateRight, Cube, ArrowsOut } from 'lucide-react';
import { MaterialService } from '@/services/materialService';
import { AccessoryService } from '@/services/accessoryService';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';

interface ModulePropertiesSidebarProps {
  module: FurnitureModule;
  onUpdate: (module: FurnitureModule) => void;
  onDelete: (moduleId: string) => void;
  onClose: () => void;
}

export const ModulePropertiesSidebar: React.FC<ModulePropertiesSidebarProps> = ({
  module,
  onUpdate,
  onDelete,
  onClose
}) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [accessories, setAccessories] = useState<AccessoryItem[]>([]);
  const [editedModule, setEditedModule] = useState<FurnitureModule>({ ...module });
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedMaterials = await MaterialService.getAllMaterials();
        setMaterials(fetchedMaterials);
        
        const fetchedAccessories = await AccessoryService.getAllAccessories();
        setAccessories(fetchedAccessories);
      } catch (error) {
        console.error('Failed to fetch materials and accessories:', error);
        toast({
          title: 'Error',
          description: 'Failed to load materials and accessories',
          variant: 'destructive',
        });
      }
    };
    
    fetchData();
  }, [toast]);

  // Update the module when the props change
  useEffect(() => {
    setEditedModule({ ...module });
  }, [module]);

  const handleDimensionChange = (dimension: 'width' | 'height' | 'depth', value: number) => {
    const updatedModule = { ...editedModule };
    updatedModule[dimension] = value;
    setEditedModule(updatedModule);
  };

  const handlePositionChange = (axis: 0 | 1 | 2, value: number) => {
    const updatedModule = { ...editedModule };
    const newPosition = [...updatedModule.position];
    newPosition[axis] = value;
    updatedModule.position = newPosition as [number, number, number];
    setEditedModule(updatedModule);
  };

  const handleRotationChange = (axis: 0 | 1 | 2, value: number) => {
    const updatedModule = { ...editedModule };
    const newRotation = [...updatedModule.rotation];
    newRotation[axis] = value;
    updatedModule.rotation = newRotation as [number, number, number];
    setEditedModule(updatedModule);
  };

  const handleMaterialChange = (partType: string, materialId: string) => {
    const updatedModule = { ...editedModule };
    
    // Find the material in the module or create a new one
    const materialIndex = updatedModule.materials.findIndex(m => m.part === partType);
    
    if (materialIndex >= 0) {
      // Update existing material
      updatedModule.materials[materialIndex].materialId = materialId;
    } else {
      // Add new material
      const selectedMaterial = materials.find(m => m.id === materialId);
      if (selectedMaterial) {
        updatedModule.materials.push({
          id: uuidv4(),
          type: selectedMaterial.type,
          materialId,
          part: partType as any,
          quantity: 1 // Default quantity, would be calculated based on dimensions in a real app
        });
      }
    }
    
    setEditedModule(updatedModule);
  };

  const handleAddAccessory = (accessoryType: string, accessoryItemId: string) => {
    const updatedModule = { ...editedModule };
    const selectedAccessory = accessories.find(a => a.id === accessoryItemId);
    
    if (selectedAccessory) {
      updatedModule.accessories.push({
        id: uuidv4(),
        type: selectedAccessory.type,
        accessoryItemId,
        quantity: 1
      });
      
      setEditedModule(updatedModule);
    }
  };

  const handleRemoveAccessory = (accessoryId: string) => {
    const updatedModule = { ...editedModule };
    updatedModule.accessories = updatedModule.accessories.filter(acc => acc.id !== accessoryId);
    setEditedModule(updatedModule);
  };

  const handleSave = () => {
    // Calculate price based on materials, accessories, etc.
    const updatedModule = calculatePrice(editedModule);
    onUpdate(updatedModule);
  };

  // Helper function to calculate module price based on materials and accessories
  const calculatePrice = (moduleToPrice: FurnitureModule): FurnitureModule => {
    const calculatedModule = { ...moduleToPrice };
    
    // Calculate materials cost
    const materialsCost = calculatedModule.materials.reduce((total, mat) => {
      const materialData = materials.find(m => m.id === mat.materialId);
      if (materialData) {
        // A simple calculation based on dimensions, would be more complex in real app
        const area = (calculatedModule.width * calculatedModule.height) / 1000000; // Convert to m²
        return total + (materialData.pricePerSqm * mat.quantity * area);
      }
      return total;
    }, 0);
    
    // Calculate accessories cost
    const accessoriesCost = calculatedModule.accessories.reduce((total, acc) => {
      const accessoryData = accessories.find(a => a.id === acc.accessoryItemId);
      if (accessoryData) {
        return total + (accessoryData.price * acc.quantity);
      }
      return total;
    }, 0);
    
    // Add processing costs (would have more complex logic in a real app)
    const processingCost = calculatedModule.processingOptions.length * 50;
    
    // Set the calculated price
    calculatedModule.price = materialsCost + accessoriesCost + processingCost;
    
    return calculatedModule;
  };

  return (
    <div className="w-80 border-l bg-white flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-medium">{editedModule.name}</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs defaultValue="properties" className="flex-1 flex flex-col">
        <div className="px-4 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="accessories">Accessories</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="properties" className="flex-1 p-0 m-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="space-y-2">
                <Label htmlFor="module-name">Name</Label>
                <Input 
                  id="module-name" 
                  value={editedModule.name} 
                  onChange={(e) => setEditedModule({ ...editedModule, name: e.target.value })} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="module-type">Type</Label>
                <Select 
                  value={editedModule.type} 
                  onValueChange={(value) => setEditedModule({ ...editedModule, type: value as any })}
                >
                  <SelectTrigger id="module-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="base_cabinet">Base Cabinet</SelectItem>
                    <SelectItem value="wall_cabinet">Wall Cabinet</SelectItem>
                    <SelectItem value="tall_cabinet">Tall Cabinet</SelectItem>
                    <SelectItem value="drawer_unit">Drawer Unit</SelectItem>
                    <SelectItem value="corner_cabinet">Corner Cabinet</SelectItem>
                    <SelectItem value="shelf_unit">Shelf Unit</SelectItem>
                    <SelectItem value="island">Island</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Dimensions */}
              <div>
                <h3 className="text-sm font-medium mb-2">Dimensions (mm)</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="module-width">Width</Label>
                    <Input 
                      id="module-width" 
                      type="number" 
                      value={editedModule.width} 
                      onChange={(e) => handleDimensionChange('width', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="module-height">Height</Label>
                    <Input 
                      id="module-height" 
                      type="number" 
                      value={editedModule.height} 
                      onChange={(e) => handleDimensionChange('height', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="module-depth">Depth</Label>
                    <Input 
                      id="module-depth" 
                      type="number" 
                      value={editedModule.depth} 
                      onChange={(e) => handleDimensionChange('depth', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Position */}
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Move className="h-4 w-4 mr-1" /> Position
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="position-x">X</Label>
                    <Input 
                      id="position-x" 
                      type="number" 
                      value={editedModule.position[0]} 
                      onChange={(e) => handlePositionChange(0, parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="position-y">Y</Label>
                    <Input 
                      id="position-y" 
                      type="number" 
                      value={editedModule.position[1]} 
                      onChange={(e) => handlePositionChange(1, parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="position-z">Z</Label>
                    <Input 
                      id="position-z" 
                      type="number" 
                      value={editedModule.position[2]} 
                      onChange={(e) => handlePositionChange(2, parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Rotation */}
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <RotateRight className="h-4 w-4 mr-1" /> Rotation
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="rotation-x">X</Label>
                    <Input 
                      id="rotation-x" 
                      type="number" 
                      value={editedModule.rotation[0]} 
                      onChange={(e) => handleRotationChange(0, parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rotation-y">Y</Label>
                    <Input 
                      id="rotation-y" 
                      type="number" 
                      value={editedModule.rotation[1]} 
                      onChange={(e) => handleRotationChange(1, parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="rotation-z">Z</Label>
                    <Input 
                      id="rotation-z" 
                      type="number" 
                      value={editedModule.rotation[2]} 
                      onChange={(e) => handleRotationChange(2, parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="materials" className="flex-1 p-0 m-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              {/* Body Material */}
              <div>
                <Label htmlFor="body-material" className="block mb-2">Body Material</Label>
                <Select 
                  value={editedModule.materials.find(m => m.part === 'body')?.materialId || ''}
                  onValueChange={(value) => handleMaterialChange('body', value)}
                >
                  <SelectTrigger id="body-material">
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials
                      .filter(m => m.type === 'PAL' || m.type === 'MDF')
                      .map((material) => (
                        <SelectItem key={material.id} value={material.id}>
                          {material.name} ({material.thickness}mm)
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              
              {/* Door/Front Material */}
              <div>
                <Label htmlFor="door-material" className="block mb-2">Door/Front Material</Label>
                <Select 
                  value={editedModule.materials.find(m => m.part === 'door' || m.part === 'drawer_front')?.materialId || ''}
                  onValueChange={(value) => handleMaterialChange('door', value)}
                >
                  <SelectTrigger id="door-material">
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials
                      .filter(m => m.type === 'PAL' || m.type === 'MDF' || m.type === 'MDF-AGT' || m.type === 'GLASS')
                      .map((material) => (
                        <SelectItem key={material.id} value={material.id}>
                          {material.name} ({material.thickness}mm)
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              
              {/* Back Panel Material */}
              <div>
                <Label htmlFor="back-material" className="block mb-2">Back Panel</Label>
                <Select 
                  value={editedModule.materials.find(m => m.part === 'back_panel')?.materialId || ''}
                  onValueChange={(value) => handleMaterialChange('back_panel', value)}
                >
                  <SelectTrigger id="back-material">
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials
                      .filter(m => m.type === 'PFL' || m.type === 'PAL')
                      .map((material) => (
                        <SelectItem key={material.id} value={material.id}>
                          {material.name} ({material.thickness}mm)
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              
              {/* Additional material types can be added here */}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="accessories" className="flex-1 p-0 m-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              {/* Hinges */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Hinges</h3>
                <Select onValueChange={(value) => handleAddAccessory('hinge', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add hinge" />
                  </SelectTrigger>
                  <SelectContent>
                    {accessories
                      .filter(a => a.type === 'hinge')
                      .map((accessory) => (
                        <SelectItem key={accessory.id} value={accessory.id}>
                          {accessory.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
                
                {/* List current hinges */}
                <div className="space-y-1 mt-2">
                  {editedModule.accessories
                    .filter(acc => acc.type === 'hinge')
                    .map((acc) => {
                      const accessoryData = accessories.find(a => a.id === acc.accessoryItemId);
                      return (
                        <div key={acc.id} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                          <span>{accessoryData?.name || 'Unknown'} ({acc.quantity}x)</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => handleRemoveAccessory(acc.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
              
              {/* Slides */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Slides</h3>
                <Select onValueChange={(value) => handleAddAccessory('slide', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add slide" />
                  </SelectTrigger>
                  <SelectContent>
                    {accessories
                      .filter(a => a.type === 'slide')
                      .map((accessory) => (
                        <SelectItem key={accessory.id} value={accessory.id}>
                          {accessory.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
                
                {/* List current slides */}
                <div className="space-y-1 mt-2">
                  {editedModule.accessories
                    .filter(acc => acc.type === 'slide')
                    .map((acc) => {
                      const accessoryData = accessories.find(a => a.id === acc.accessoryItemId);
                      return (
                        <div key={acc.id} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                          <span>{accessoryData?.name || 'Unknown'} ({acc.quantity}x)</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => handleRemoveAccessory(acc.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
              
              {/* Handles */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Handles</h3>
                <Select onValueChange={(value) => handleAddAccessory('handle', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add handle" />
                  </SelectTrigger>
                  <SelectContent>
                    {accessories
                      .filter(a => a.type === 'handle')
                      .map((accessory) => (
                        <SelectItem key={accessory.id} value={accessory.id}>
                          {accessory.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
                
                {/* List current handles */}
                <div className="space-y-1 mt-2">
                  {editedModule.accessories
                    .filter(acc => acc.type === 'handle')
                    .map((acc) => {
                      const accessoryData = accessories.find(a => a.id === acc.accessoryItemId);
                      return (
                        <div key={acc.id} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                          <span>{accessoryData?.name || 'Unknown'} ({acc.quantity}x)</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => handleRemoveAccessory(acc.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
              
              {/* Other accessory types can be added here */}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      <div className="p-4 border-t">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium">Price:</span>
          <span className="font-medium">€{editedModule.price.toFixed(2)}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => onDelete(module.id)}>
            <Trash className="h-4 w-4 mr-2" /> Delete
          </Button>
          <Button className="flex-1" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" /> Save
          </Button>
        </div>
      </div>
    </div>
  );
};
