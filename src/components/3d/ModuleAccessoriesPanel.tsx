
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { FurnitureModule, AccessoryItem } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface ModuleAccessoriesPanelProps {
  module: FurnitureModule;
  accessories: AccessoryItem[];
  onUpdate: (module: FurnitureModule) => void;
}

export const ModuleAccessoriesPanel: React.FC<ModuleAccessoriesPanelProps> = ({
  module,
  accessories,
  onUpdate
}) => {
  // Add accessory handler
  const handleAddAccessory = (accessoryType: string, accessoryItemId: string) => {
    const updatedModule = { ...module };
    
    const selectedAccessory = accessories.find(a => a.id === accessoryItemId);
    
    if (selectedAccessory) {
      updatedModule.accessories.push({
        id: uuidv4(),
        type: selectedAccessory.type,
        accessoryItemId,
        quantity: 1
      });
      
      onUpdate(updatedModule);
    }
  };

  // Remove accessory handler
  const handleRemoveAccessory = (accessoryId: string) => {
    const updatedModule = { ...module };
    updatedModule.accessories = updatedModule.accessories.filter(acc => acc.id !== accessoryId);
    onUpdate(updatedModule);
  };

  // Get compatible accessories for the current module type
  const getCompatibleAccessories = (type: string) => {
    return accessories.filter(a => 
      a.type === type && 
      a.compatibility.includes(module.type)
    );
  };

  return (
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
        {module.accessories.length > 0 ? (
          <ul className="space-y-2">
            {module.accessories.map(acc => {
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
  );
};
