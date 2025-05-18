
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { FurnitureModule, AccessoryItem } from '@/types';

interface AccessoriesTabProps {
  module: FurnitureModule;
  accessories: AccessoryItem[];
  onAddAccessory: (accessoryType: string, accessoryItemId: string) => void;
  onRemoveAccessory: (accessoryId: string) => void;
}

export const AccessoriesTab: React.FC<AccessoriesTabProps> = ({
  module,
  accessories,
  onAddAccessory,
  onRemoveAccessory
}) => {
  return (
    <ScrollArea className="h-full p-4">
      <div className="space-y-4">
        {/* Hinges */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Hinges</h3>
          <Select onValueChange={(value) => onAddAccessory('hinge', value)}>
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
            {module.accessories
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
                      onClick={() => onRemoveAccessory(acc.id)}
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
          <Select onValueChange={(value) => onAddAccessory('slide', value)}>
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
            {module.accessories
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
                      onClick={() => onRemoveAccessory(acc.id)}
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
          <Select onValueChange={(value) => onAddAccessory('handle', value)}>
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
            {module.accessories
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
                      onClick={() => onRemoveAccessory(acc.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
