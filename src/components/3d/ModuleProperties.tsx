
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { X, Save, Trash } from 'lucide-react';
import { MaterialService } from '@/services/materialService';
import { AccessoryService } from '@/services/accessoryService';
import { useToast } from '@/hooks/use-toast';
import { FurnitureModule, ModuleType, Material, AccessoryItem } from '@/types';
import { ComboLogicService } from '@/services/comboLogicService';
import { ModuleDimensionsPanel } from './ModuleDimensionsPanel';
import { ModulePositionPanel } from './ModulePositionPanel';
import { ModuleRotationPanel } from './ModuleRotationPanel';
import { ModuleMaterialsPanel } from './ModuleMaterialsPanel';
import { ModuleAccessoriesPanel } from './ModuleAccessoriesPanel';
import { ModuleTypeSelector } from './ModuleTypeSelector';

// Define the ModulePropertiesProps interface
interface ModulePropertiesProps {
  module: FurnitureModule;
  onUpdate: (module: FurnitureModule) => void;
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

  // Module type change handler
  const handleTypeChange = (type: ModuleType) => {
    const updatedModule = { ...editedModule, type };
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
              <ModuleTypeSelector 
                type={editedModule.type} 
                onTypeChange={handleTypeChange}
                blockedOptions={blockedOptions} 
              />
              
              <ModuleDimensionsPanel
                module={editedModule}
                onUpdate={(updatedModule) => setEditedModule(updatedModule)}
              />
              
              <ModulePositionPanel
                module={editedModule}
                onUpdate={(updatedModule) => setEditedModule(updatedModule)}
              />
              
              <ModuleRotationPanel
                module={editedModule}
                onUpdate={(updatedModule) => setEditedModule(updatedModule)}
              />
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="materials" className="flex-1 p-0 m-0">
          <ScrollArea className="h-full p-4">
            <ModuleMaterialsPanel
              module={editedModule}
              materials={materials}
              onUpdate={(updatedModule) => setEditedModule(updatedModule)}
            />
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="accessories" className="flex-1 p-0 m-0">
          <ScrollArea className="h-full p-4">
            <ModuleAccessoriesPanel
              module={editedModule}
              accessories={accessories}
              onUpdate={(updatedModule) => setEditedModule(updatedModule)}
            />
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
