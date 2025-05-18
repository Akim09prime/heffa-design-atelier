
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { FurnitureModule } from '@/types';
import { ModuleDimensionsPanel } from './ModuleDimensionsPanel';
import { ModulePositionPanel } from './ModulePositionPanel';
import { ModuleRotationPanel } from './ModuleRotationPanel';
import { ModuleMaterialsPanel } from './ModuleMaterialsPanel';
import { ModuleAccessoriesPanel } from './ModuleAccessoriesPanel';
import { ModuleTypeSelector } from './ModuleTypeSelector';
import { ModuleHeader, PropertiesFooter, useModuleProperties } from './module-properties';
import { toast } from '@/hooks/use-toast';

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
  // Use the custom hook to handle module properties
  const {
    materials,
    accessories,
    editedModule,
    setEditedModule,
    blockedOptions,
    priceBreakdown,
    showPriceBreakdown,
    setShowPriceBreakdown,
    handleTypeChange,
    handleSave
  } = useModuleProperties(module, onUpdate);

  const handleSaveWithFeedback = () => {
    handleSave();
    toast({
      title: "Module Saved",
      description: "Module properties have been updated",
      variant: "default"
    });
  };

  const handleDeleteWithConfirmation = () => {
    if (typeof onDelete === 'function') {
      onDelete(module.id);
      toast({
        title: "Module Deleted",
        description: "Module has been removed from the scene",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-80 border-l bg-white flex flex-col h-full">
      {/* Module header with title and close button */}
      <ModuleHeader name={editedModule.name} onClose={onClose} />
      
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
      
      {/* Footer with price breakdown and action buttons */}
      <PropertiesFooter
        priceBreakdown={priceBreakdown}
        totalPrice={editedModule.price}
        showPriceBreakdown={showPriceBreakdown}
        setShowPriceBreakdown={setShowPriceBreakdown}
        onSave={handleSaveWithFeedback}
        onDelete={handleDeleteWithConfirmation}
      />
    </div>
  );
};
