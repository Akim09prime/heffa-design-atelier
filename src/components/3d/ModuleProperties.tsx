import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { X, Save, Trash, Move, RotateCw } from 'lucide-react';
import { FurnitureModule, Material, AccessoryItem, MaterialType } from '@/types';
import { MaterialService } from '@/services/materialService';
import { AccessoryService } from '@/services/accessoryService';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { ComboLogicService } from '@/services/comboLogicService';

interface ModulePropertiesProps {
  module: FurnitureModule;
  onUpdate: (updatedModule: FurnitureModule) => void;
  onDelete: (moduleId: string) => void;
  onClose: () => void;
}

export const ModuleProperties: React.FC<ModulePropertiesProps> = ({ 
  module, 
  onUpdate, 
  onDelete, 
  onClose 
}) => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [accessories, setAccessories] = useState<AccessoryItem[]>([]);
  const [editedModule, setEditedModule] = useState<FurnitureModule>({...module});
  const [warnings, setWarnings] = useState<string[]>([]);
  const [blockedOptions, setBlockedOptions] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch materials and accessories
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
          variant: 'destructive'
        });
      }
    };
    
    fetchData();
  }, [toast]);

  // Update the module when the props change
  useEffect(() => {
    setEditedModule({...module});
  }, [module]);

  // Apply combo logic rules
  useEffect(() => {
    const applyRules = async () => {
      try {
        // Convert materials array to a Map for ComboLogicService
        const materialsMap = new Map<string, Material>();
        materials.forEach(material => {
          materialsMap.set(material.id, material);
        });
        
        const { updatedModule, messages, blockedOptions } = await ComboLogicService.applyRules(
          editedModule,
          materialsMap
        );
        
        setEditedModule(updatedModule);
        setWarnings(messages);
        setBlockedOptions(blockedOptions);
        
        // Display warnings as toasts
        messages.forEach(message => {
          toast({
            title: 'Rule Applied',
            description: message
          });
        });
      } catch (error) {
        console.error('Error applying combo rules:', error);
      }
    };
    
    if (materials.length > 0) {
      applyRules();
    }
  }, [materials, editedModule.type, editedModule.materials, toast]);

  // Dimension change handler
  const handleDimensionChange = (dimension: 'width' | 'height' | 'depth', value: number) => {
    const updatedModule = { ...editedModule };
    updatedModule[dimension] = value;
    setEditedModule(updatedModule);
  };

  // Position change handler
  const handlePositionChange = (axis: 0 | 1 | 2, value: number) => {
    const updatedModule = { ...editedModule };
    const newPosition = [...updatedModule.position];
    newPosition[axis] = value;
    updatedModule.position = newPosition as [number, number, number];
    setEditedModule(updatedModule);
  };

  // Rotation change handler
  const handleRotationChange = (axis: 0 | 1 | 2, value: number) => {
    const updatedModule = { ...editedModule };
    const newRotation = [...updatedModule.rotation];
    newRotation[axis] = value;
    updatedModule.rotation = newRotation as [number, number, number];
    setEditedModule(updatedModule);
  };

  // Material change handler
  const handleMaterialChange = (partType: 'body' | 'door' | 'drawer_front' | 'back_panel' | 'shelf', materialId: string) => {
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
          part: partType,
          quantity: 1 // Default quantity, would be calculated based on dimensions in a real app
        });
      }
    }
    
    setEditedModule(updatedModule);
  };

  // Add accessory handler
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

  // Remove accessory handler
  const handleRemoveAccessory = (accessoryId: string) => {
    const updatedModule = { ...editedModule };
    updatedModule.accessories = updatedModule.accessories.filter(acc => acc.id !== accessoryId);
    setEditedModule(updatedModule);
  };

  // Save changes handler
  const handleSave = () => {
    // Calculate price based on materials, accessories, etc.
    const updatedModule = calculatePrice(editedModule);
    onUpdate(updatedModule);
    
    toast({
      title: 'Module Updated',
      description: 'Your changes have been saved successfully.'
    });
  };

  // Helper function to calculate module price based on materials and accessories
  const calculatePrice = (moduleToPrice: FurnitureModule): FurnitureModule => {
    const calculatedModule = { ...moduleToPrice };
    
    // Calculate materials cost
    const materialsCost = calculatedModule.materials.reduce((total, mat) => {
      const materialData = materials.find(m => m.id === mat.materialId);
      
      if (materialData) {
        // A simple calculation based on dimensions, would be more complex in real app
        const area = calculatedModule.width * calculatedModule.height / 1000000; // Convert to m²
        return total + materialData.pricePerSqm * mat.quantity * area;
      }
      
      return total;
    }, 0);
    
    // Calculate accessories cost
    const accessoriesCost = calculatedModule.accessories.reduce((total, acc) => {
      const accessoryData = accessories.find(a => a.id === acc.accessoryItemId);
      
      if (accessoryData) {
        return total + accessoryData.price * acc.quantity;
      }
      
      return total;
    }, 0);
    
    // Add processing costs (would have more complex logic in a real app)
    const processingCost = calculatedModule.processingOptions.length * 50;
    
    // Set the calculated price
    calculatedModule.price = materialsCost + accessoriesCost + processingCost;
    
    return calculatedModule;
  };

  // Filter functions for materials and accessories
  const getMaterialsByType = (type: MaterialType) => {
    return materials.filter(m => m.type === type);
  };

  const getCompatibleAccessories = (type: string) => {
    return accessories.filter(a => 
      a.type === type && 
      a.compatibility.includes(editedModule.type)
    );
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
              <div>
                <Label htmlFor="module-name">Name</Label>
                <Input 
                  id="module-name" 
                  value={editedModule.name}
                  onChange={(e) => setEditedModule({...editedModule, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="module-type">Type</Label>
                <Select 
                  value={editedModule.type} 
                  onValueChange={(value) => setEditedModule({...editedModule, type: value as ModuleType})}
                >
                  <SelectTrigger>
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
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Move className="h-4 w-4" />
                  Dimensions (mm)
                </h3>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="width" className="text-xs">Width</Label>
                    <Input 
                      id="width" 
                      type="number" 
                      value={editedModule.width}
                      onChange={(e) => handleDimensionChange('width', Number(e.target.value))}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-xs">Height</Label>
                    <Input 
                      id="height" 
                      type="number" 
                      value={editedModule.height}
                      onChange={(e) => handleDimensionChange('height', Number(e.target.value))}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="depth" className="text-xs">Depth</Label>
                    <Input 
                      id="depth" 
                      type="number" 
                      value={editedModule.depth}
                      onChange={(e) => handleDimensionChange('depth', Number(e.target.value))}
                      className="h-8"
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <Move className="h-4 w-4" />
                  Position (m)
                </h3>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="position-x" className="text-xs">X</Label>
                    <Input 
                      id="position-x" 
                      type="number" 
                      step="0.1"
                      value={editedModule.position[0]}
                      onChange={(e) => handlePositionChange(0, Number(e.target.value))}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="position-y" className="text-xs">Y</Label>
                    <Input 
                      id="position-y" 
                      type="number" 
                      step="0.1"
                      value={editedModule.position[1]}
                      onChange={(e) => handlePositionChange(1, Number(e.target.value))}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="position-z" className="text-xs">Z</Label>
                    <Input 
                      id="position-z" 
                      type="number" 
                      step="0.1"
                      value={editedModule.position[2]}
                      onChange={(e) => handlePositionChange(2, Number(e.target.value))}
                      className="h-8"
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium flex items-center gap-2">
                  <RotateCw className="h-4 w-4" />
                  Rotation (degrees)
                </h3>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label htmlFor="rotation-x" className="text-xs">X</Label>
                    <Input 
                      id="rotation-x" 
                      type="number" 
                      value={editedModule.rotation[0]}
                      onChange={(e) => handleRotationChange(0, Number(e.target.value))}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rotation-y" className="text-xs">Y</Label>
                    <Input 
                      id="rotation-y" 
                      type="number" 
                      value={editedModule.rotation[1]}
                      onChange={(e) => handleRotationChange(1, Number(e.target.value))}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rotation-z" className="text-xs">Z</Label>
                    <Input 
                      id="rotation-z" 
                      type="number" 
                      value={editedModule.rotation[2]}
                      onChange={(e) => handleRotationChange(2, Number(e.target.value))}
                      className="h-8"
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
                <Label htmlFor="body-material" className="text-sm font-medium">Body Material (Carcass)</Label>
                <Select 
                  value={editedModule.materials.find(m => m.part === 'body')?.materialId || ''}
                  onValueChange={(value) => handleMaterialChange('body', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {getMaterialsByType('PAL').map((material) => (
                      <SelectItem key={material.id} value={material.id}>
                        {material.name} ({material.thickness}mm)
                      </SelectItem>
                    ))}
                    {getMaterialsByType('MDF').map((material) => (
                      <SelectItem key={material.id} value={material.id}>
                        {material.name} ({material.thickness}mm)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Front Material (Door or Drawer Front) */}
              <div>
                <Label htmlFor="front-material" className="text-sm font-medium">Front Material</Label>
                <Select 
                  value={editedModule.materials.find(m => m.part === 'door' || m.part === 'drawer_front')?.materialId || ''}
                  onValueChange={(value) => handleMaterialChange(
                    editedModule.type === 'drawer_unit' ? 'drawer_front' : 'door', 
                    value
                  )}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {getMaterialsByType('PAL').map((material) => (
                      <SelectItem key={material.id} value={material.id}>
                        {material.name} ({material.thickness}mm)
                      </SelectItem>
                    ))}
                    {getMaterialsByType('MDF').map((material) => (
                      <SelectItem key={material.id} value={material.id}>
                        {material.name} ({material.thickness}mm)
                      </SelectItem>
                    ))}
                    {getMaterialsByType('MDF-AGT').map((material) => (
                      <SelectItem key={material.id} value={material.id}>
                        {material.name} ({material.thickness}mm)
                      </SelectItem>
                    ))}
                    {getMaterialsByType('GLASS').map((material) => (
                      <SelectItem key={material.id} value={material.id}>
                        {material.name} ({material.thickness}mm)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Back Panel Material */}
              <div>
                <Label htmlFor="back-material" className="text-sm font-medium">Back Panel</Label>
                <Select 
                  value={editedModule.materials.find(m => m.part === 'back_panel')?.materialId || ''}
                  onValueChange={(value) => handleMaterialChange('back_panel', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    {getMaterialsByType('PFL').map((material) => (
                      <SelectItem key={material.id} value={material.id}>
                        {material.name} ({material.thickness}mm)
                      </SelectItem>
                    ))}
                    {getMaterialsByType('PAL').map((material) => (
                      <SelectItem key={material.id} value={material.id}>
                        {material.name} ({material.thickness}mm)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Material Preview */}
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Material Preview</h3>
                <div className="grid grid-cols-2 gap-2">
                  {editedModule.materials.map(material => {
                    const materialData = materials.find(m => m.id === material.materialId);
                    return materialData ? (
                      <div key={material.id} className="border rounded p-2">
                        {materialData.textureUrl ? (
                          <div className="h-20 bg-contain bg-center bg-no-repeat" 
                               style={{ backgroundImage: `url(${materialData.textureUrl})` }} />
                        ) : (
                          <div className="h-20 bg-gray-100 flex items-center justify-center">
                            No texture
                          </div>
                        )}
                        <div className="text-xs mt-1 font-medium">{materialData.name}</div>
                        <div className="text-xs text-gray-500">{material.part}</div>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
              
              {/* Processing Options */}
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Processing Options</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="edge-banding" 
                      className="mr-2"
                      checked={editedModule.processingOptions.some(p => p.type === 'edge_banding')}
                      onChange={(e) => {
                        const updatedModule = { ...editedModule };
                        if (e.target.checked) {
                          if (!updatedModule.processingOptions.some(p => p.type === 'edge_banding')) {
                            updatedModule.processingOptions.push({
                              id: uuidv4(),
                              type: 'edge_banding',
                              materialId: updatedModule.materials.find(m => m.part === 'body')?.materialId || '',
                              area: 0 // Would calculate based on dimensions
                            });
                          }
                        } else {
                          updatedModule.processingOptions = updatedModule.processingOptions.filter(
                            p => p.type !== 'edge_banding'
                          );
                        }
                        setEditedModule(updatedModule);
                      }}
                      disabled={
                        !editedModule.materials.some(m => 
                          materials.find(mat => mat.id === m.materialId)?.cantable
                        )
                      }
                    />
                    <Label htmlFor="edge-banding" className="text-sm">
                      Edge Banding
                    </Label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="painting" 
                      className="mr-2"
                      checked={editedModule.processingOptions.some(p => p.type === 'painting')}
                      onChange={(e) => {
                        const updatedModule = { ...editedModule };
                        if (e.target.checked) {
                          if (!updatedModule.processingOptions.some(p => p.type === 'painting')) {
                            updatedModule.processingOptions.push({
                              id: uuidv4(),
                              type: 'painting',
                              materialId: updatedModule.materials.find(m => m.part === 'door' || m.part === 'drawer_front')?.materialId || '',
                              area: 0 // Would calculate based on dimensions
                            });
                          }
                        } else {
                          updatedModule.processingOptions = updatedModule.processingOptions.filter(
                            p => p.type !== 'painting'
                          );
                        }
                        setEditedModule(updatedModule);
                      }}
                      disabled={
                        !editedModule.materials.some(m => 
                          materials.find(mat => mat.id === m.materialId)?.paintable
                        ) || 
                        blockedOptions.includes('paint')
                      }
                    />
                    <Label htmlFor="painting" className="text-sm">
                      Painting
                      {blockedOptions.includes('paint') && (
                        <span className="text-destructive ml-1 text-xs">(Not available for this material)</span>
                      )}
                    </Label>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="cnc-rifled" 
                      className="mr-2"
                      checked={editedModule.processingOptions.some(p => p.type === 'cnc_rifled')}
                      onChange={(e) => {
                        const updatedModule = { ...editedModule };
                        if (e.target.checked) {
                          if (!updatedModule.processingOptions.some(p => p.type === 'cnc_rifled')) {
                            updatedModule.processingOptions.push({
                              id: uuidv4(),
                              type: 'cnc_rifled',
                              materialId: updatedModule.materials.find(m => m.part === 'door' || m.part === 'drawer_front')?.materialId || '',
                              area: 0 // Would calculate based on dimensions
                            });
                            // If we add CNC rifling, we should suggest painting
                            if (!updatedModule.processingOptions.some(p => p.type === 'painting')) {
                              const frontMaterial = updatedModule.materials.find(m => m.part === 'door' || m.part === 'drawer_front');
                              const materialData = materials.find(m => m.id === frontMaterial?.materialId);
                              
                              if (materialData?.paintable && !blockedOptions.includes('paint')) {
                                toast({
                                  title: 'Suggestion',
                                  description: 'CNC rifled fronts typically need painting. Would you like to add painting?'
                                });
                              }
                            }
                          }
                        } else {
                          updatedModule.processingOptions = updatedModule.processingOptions.filter(
                            p => p.type !== 'cnc_rifled'
                          );
                        }
                        setEditedModule(updatedModule);
                      }}
                      disabled={
                        !editedModule.materials.some(m => 
                          materials.find(mat => mat.id === m.materialId)?.type === 'MDF'
                        )
                      }
                    />
                    <Label htmlFor="cnc-rifled" className="text-sm">
                      CNC Rifled
                      {!editedModule.materials.some(m => 
                        materials.find(mat => mat.id === m.materialId)?.type === 'MDF'
                      ) && (
                        <span className="text-destructive ml-1 text-xs">(Requires MDF)</span>
                      )}
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="accessories" className="flex-1 p-0 m-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              {/* Hinges */}
              <div>
                <Label htmlFor="hinges" className="text-sm font-medium">Hinges</Label>
                <Select
                  onValueChange={(value) => handleAddAccessory('hinge', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Add hinge" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCompatibleAccessories('hinge').map((accessory) => (
                      <SelectItem key={accessory.id} value={accessory.id}>
                        {accessory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* List of selected hinges */}
                <div className="mt-2 space-y-1">
                  {editedModule.accessories
                    .filter(acc => acc.type === 'hinge')
                    .map((acc) => {
                      const accessory = accessories.find(a => a.id === acc.accessoryItemId);
                      return accessory ? (
                        <div key={acc.id} className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
                          <span>{accessory.name}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => handleRemoveAccessory(acc.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : null;
                    })
                  }
                </div>
              </div>
              
              {/* Slides */}
              <div>
                <Label htmlFor="slides" className="text-sm font-medium">Drawer Slides</Label>
                <Select
                  onValueChange={(value) => handleAddAccessory('slide', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Add drawer slide" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCompatibleAccessories('slide').map((accessory) => (
                      <SelectItem key={accessory.id} value={accessory.id}>
                        {accessory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* List of selected slides */}
                <div className="mt-2 space-y-1">
                  {editedModule.accessories
                    .filter(acc => acc.type === 'slide')
                    .map((acc) => {
                      const accessory = accessories.find(a => a.id === acc.accessoryItemId);
                      return accessory ? (
                        <div key={acc.id} className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
                          <span>{accessory.name}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => handleRemoveAccessory(acc.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : null;
                    })
                  }
                </div>
              </div>
              
              {/* Handles */}
              <div>
                <Label htmlFor="handles" className="text-sm font-medium">Handles</Label>
                <Select
                  onValueChange={(value) => handleAddAccessory('handle', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Add handle" />
                  </SelectTrigger>
                  <SelectContent>
                    {getCompatibleAccessories('handle').map((accessory) => (
                      <SelectItem key={accessory.id} value={accessory.id}>
                        {accessory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {/* List of selected handles */}
                <div className="mt-2 space-y-1">
                  {editedModule.accessories
                    .filter(acc => acc.type === 'handle')
                    .map((acc) => {
                      const accessory = accessories.find(a => a.id === acc.accessoryItemId);
                      return accessory ? (
                        <div key={acc.id} className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
                          <span>{accessory.name}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => handleRemoveAccessory(acc.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : null;
                    })
                  }
                </div>
              </div>
              
              {/* Other Accessories */}
              <div>
                <Label htmlFor="other-accessories" className="text-sm font-medium">Other Accessories</Label>
                <Select
                  onValueChange={(value) => handleAddAccessory('other', value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Add accessory" />
                  </SelectTrigger>
                  <SelectContent>
                    {accessories
                      .filter(a => a.type !== 'hinge' && a.type !== 'slide' && a.type !== 'handle' && 
                             a.compatibility.includes(editedModule.type))
                      .map((accessory) => (
                        <SelectItem key={accessory.id} value={accessory.id}>
                          {accessory.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
                
                {/* List of other accessories */}
                <div className="mt-2 space-y-1">
                  {editedModule.accessories
                    .filter(acc => acc.type !== 'hinge' && acc.type !== 'slide' && acc.type !== 'handle')
                    .map((acc) => {
                      const accessory = accessories.find(a => a.id === acc.accessoryItemId);
                      return accessory ? (
                        <div key={acc.id} className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
                          <span>{accessory.name}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => handleRemoveAccessory(acc.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : null;
                    })
                  }
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      <div className="p-4 border-t flex justify-between items-center">
        <div>
          <div className="text-sm font-medium">Price: ${editedModule.price.toFixed(2)}</div>
          <div className="text-xs text-gray-500">
            {editedModule.materials.length} materials, {editedModule.accessories.length} accessories
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => onDelete(editedModule.id)}
            className="flex items-center gap-1"
          >
            <Trash className="h-3.5 w-3.5" />
            Delete
          </Button>
          <Button 
            size="sm"
            onClick={handleSave}
            className="flex items-center gap-1"
          >
            <Save className="h-3.5 w-3.5" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
