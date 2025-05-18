
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import { FurnitureModule, AccessoryItem, AccessoryType } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { AccessoryService } from '@/services/accessoryService';

interface ModuleAccessoriesPanelProps {
  module: FurnitureModule;
  accessories: AccessoryItem[];  // Added this prop
  onUpdate: (module: FurnitureModule) => void;
}

export const ModuleAccessoriesPanel: React.FC<ModuleAccessoriesPanelProps> = ({
  module,
  accessories,
  onUpdate
}) => {
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<AccessoryType>('hinge');
  
  useEffect(() => {
    // Set loading to false since accessories are now passed as props
    setLoading(false);
  }, [accessories]);

  // Add accessory handler
  const handleAddAccessory = (accessoryItemId: string) => {
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

  // Update accessory quantity
  const handleQuantityChange = (accessoryId: string, quantity: number) => {
    const updatedModule = { ...module };
    const accessoryIndex = updatedModule.accessories.findIndex(acc => acc.id === accessoryId);
    
    if (accessoryIndex !== -1) {
      updatedModule.accessories[accessoryIndex].quantity = Math.max(1, quantity);
      onUpdate(updatedModule);
    }
  };

  // Get compatible accessories for the current module type and selected accessory type
  const getCompatibleAccessories = () => {
    return accessories.filter(a => 
      a.type === selectedType && 
      a.compatibility.includes(module.type)
    );
  };

  // Get compatible accessory types for this module
  const getCompatibleTypes = () => {
    const types = new Set<AccessoryType>();
    
    accessories.forEach(acc => {
      if (acc.compatibility.includes(module.type)) {
        types.add(acc.type);
      }
    });
    
    return Array.from(types);
  };

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="text-center py-4 text-sm text-muted-foreground">Loading accessories...</div>
      ) : (
        <>
          <div>
            <Label className="text-sm font-medium">Add Accessory</Label>
            <div className="flex flex-col space-y-2 mt-1">
              <Select value={selectedType} onValueChange={(value) => setSelectedType(value as AccessoryType)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select accessory type" />
                </SelectTrigger>
                <SelectContent>
                  {getCompatibleTypes().map(type => (
                    <SelectItem key={type} value={type}>
                      {type.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select onValueChange={(value) => handleAddAccessory(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select accessory" />
                </SelectTrigger>
                <SelectContent>
                  {getCompatibleAccessories().map(accessory => (
                    <SelectItem key={accessory.id} value={accessory.id}>
                      {accessory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* List of applied accessories */}
          <div>
            <h3 className="text-sm font-medium mb-2">Applied Accessories</h3>
            {module.accessories.length > 0 ? (
              <ul className="space-y-2">
                {module.accessories.map(acc => {
                  const accessoryItem = accessories.find(a => a.id === acc.accessoryItemId);
                  return (
                    <li key={acc.id} className="flex justify-between items-center text-sm bg-gray-50 p-2 rounded">
                      <span className="truncate flex-1">
                        {accessoryItem?.name || 'Unknown'}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={() => handleQuantityChange(acc.id, acc.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-6 text-center">{acc.quantity}</span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={() => handleQuantityChange(acc.id, acc.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveAccessory(acc.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded text-center">
                No accessories added to this module
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ModuleAccessoriesPanel;
