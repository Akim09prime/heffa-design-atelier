import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Save, Trash, Move, RotateCw } from 'lucide-react';
import { MaterialService } from '@/services/materialService';
import { AccessoryService } from '@/services/accessoryService';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { FurnitureModule, ModuleType, Material, AccessoryItem } from '@/types';

interface ModulePropertiesProps {
  module: FurnitureModule;
  onUpdate: (module: FurnitureModule) => void;
  onDelete: (moduleId: string) => void;
  onClose: () => void;
}

// Helper to format measurements
const formatMeasurement = (value: number) => {
  return `${value}mm`;
};

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
  const [bodyMaterialId, setBodyMaterialId] = useState<string>('');
  const [frontMaterialId, setFrontMaterialId] = useState<string>('');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
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

  // Materials tab
  const MaterialsTab = () => (
    <div className="space-y-4">
      {/* Body Material */}
      <div>
        <Label className="text-sm font-medium">Body Material</Label>
        <Select
          value={bodyMaterialId}
          onValueChange={(value) => handleMaterialChange('body', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select material" />
          </SelectTrigger>
          <SelectContent>
            {materials
              .filter(m => m.type === 'PAL' || m.type === 'MDF')
              .map(material => (
                <SelectItem key={material.id} value={material.id}>
                  {material.name} - {material.type}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Front Material */}
      <div>
        <Label className="text-sm font-medium">Front Material</Label>
        <Select
          value={frontMaterialId}
          onValueChange={(value) => handleMaterialChange('door', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select front material" />
          </SelectTrigger>
          <SelectContent>
            {materials.map(material => (
              <SelectItem key={material.id} value={material.id}>
                {material.name} - {material.type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Material preview would go here */}
      {selectedMaterial && (
        <div className="mt-4">
          <div className="text-xs text-gray-500 mb-1">Selected Material Preview</div>
          <div className="h-24 bg-gray-100 relative rounded overflow-hidden">
            {selectedMaterial.textureUrl ? (
              <img 
                src={selectedMaterial.textureUrl} 
                alt={selectedMaterial.name}
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Preview
              </div>
            )}
          </div>
          <div className="mt-2 text-xs">
            <div><span className="font-medium">Type:</span> {selectedMaterial.type}</div>
            <div><span className="font-medium">Thickness:</span> {selectedMaterial.thickness}mm</div>
            <div><span className="font-medium">Price:</span> {selectedMaterial.pricePerSqm}/m²</div>
          </div>
        </div>
      )}
    </div>
  );

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
              {/* Module type */}
              <div>
                <Label className="text-sm font-medium">Type</Label>
                <Select
                  value={editedModule.type}
                  onValueChange={(value: ModuleType) => {
                    const updatedModule = { ...editedModule };
                    updatedModule.type = value;
                    setEditedModule(updatedModule);
                  }}
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
                    <SelectItem value="island">Island</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Dimensions */}
              <div>
                <h3 className="text-sm font-medium mb-2">Dimensions</h3>
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
                    <div className="text-xs text-gray-500 mt-1">{formatMeasurement(editedModule.width)}</div>
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
                    <div className="text-xs text-gray-500 mt-1">{formatMeasurement(editedModule.height)}</div>
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
                    <div className="text-xs text-gray-500 mt-1">{formatMeasurement(editedModule.depth)}</div>
                  </div>
                </div>
              </div>
              
              {/* Position */}
              <div>
                <h3 className="text-sm font-medium mb-2">Position</h3>
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
              
              {/* Rotation */}
              <div>
                <h3 className="text-sm font-medium mb-2">Rotation</h3>
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
            <MaterialsTab />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="accessories" className="flex-1 p-0 m-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Add Accessory</Label>
                <div className="flex space-x-2 mt-1">
                  <Select onValueChange={(value) => handleAddAccessory('hinge', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select accessory" />
                    </SelectTrigger>
                    <SelectContent>
                      {accessories
                        .filter(acc => acc.type === 'hinge')
                        .map(accessory => (
                          <SelectItem key={accessory.id} value={accessory.id}>
                            {accessory.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* List of accessories */}
              <div>
                <h3 className="text-sm font-medium mb-2">Applied Accessories</h3>
                {editedModule.accessories.length > 0 ? (
                  <ul className="space-y-2">
                    {editedModule.accessories.map(acc => {
                      const accessoryItem = accessories.find(a => a.id === acc.accessoryItemId);
                      return (
                        <li key={acc.id} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                          <span>
                            {accessoryItem?.name || 'Unknown'} ({acc.quantity})
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveAccessory(acc.id)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-500">No accessories added</div>
                )}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      
      {/* Footer with action buttons */}
      <div className="border-t p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Total Price:</span>
          <span className="text-sm font-medium">${editedModule.price.toFixed(2)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={handleSave} className="flex-1">
            <Save className="h-4 w-4 mr-1" />
            Save Changes
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => onDelete(module.id)}
            size="icon"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
