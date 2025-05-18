
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FurnitureModule } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { MaterialService } from '@/services/materialService';
import { AccessoryService } from '@/services/accessoryService';

import { SidebarHeader } from './properties/SidebarHeader';
import { SidebarFooter } from './properties/SidebarFooter';
import { PropertiesTab } from './properties/PropertiesTab';
import { MaterialsTab } from './properties/MaterialsTab';
import { AccessoriesTab } from './properties/AccessoriesTab';
import { calculatePrice } from './properties/PricingUtils';

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
  const [materials, setMaterials] = useState([]);
  const [accessories, setAccessories] = useState([]);
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

  const handleNameChange = (value: string) => {
    setEditedModule({ ...editedModule, name: value });
  };

  const handleTypeChange = (value: string) => {
    setEditedModule({ ...editedModule, type: value as any });
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
    const updatedModule = calculatePrice(editedModule, materials, accessories);
    onUpdate(updatedModule);
  };

  const handleDelete = () => {
    onDelete(module.id);
  };

  return (
    <div className="w-80 border-l bg-white flex flex-col h-full">
      <SidebarHeader title={editedModule.name} onClose={onClose} />
      
      <Tabs defaultValue="properties" className="flex-1 flex flex-col">
        <div className="px-4 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="accessories">Accessories</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="properties" className="flex-1 p-0 m-0">
          <PropertiesTab 
            module={editedModule}
            onDimensionChange={handleDimensionChange}
            onPositionChange={handlePositionChange}
            onRotationChange={handleRotationChange}
            onTypeChange={handleTypeChange}
            onNameChange={handleNameChange}
          />
        </TabsContent>
        
        <TabsContent value="materials" className="flex-1 p-0 m-0">
          <MaterialsTab 
            module={editedModule}
            materials={materials}
            onMaterialChange={handleMaterialChange}
          />
        </TabsContent>
        
        <TabsContent value="accessories" className="flex-1 p-0 m-0">
          <AccessoriesTab 
            module={editedModule}
            accessories={accessories}
            onAddAccessory={handleAddAccessory}
            onRemoveAccessory={handleRemoveAccessory}
          />
        </TabsContent>
      </Tabs>
      
      <SidebarFooter
        price={editedModule.price}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
};
