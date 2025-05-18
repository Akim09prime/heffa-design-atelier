
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus, Loader } from 'lucide-react';
import { FurnitureModule, AccessoryItem, AccessoryType } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { useUi } from '@/contexts/UiContext';

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
  const { isLoading, setLoading, showSuccessToast, showErrorToast } = useUi();
  const [selectedType, setSelectedType] = useState<AccessoryType>('hinge');
  const [selectedAccessory, setSelectedAccessory] = useState<string>('');
  
  useEffect(() => {
    // Reset selected accessory when type changes
    setSelectedAccessory('');
    
    // Set default selection if available
    const compatibleAccessories = getCompatibleAccessories();
    if (compatibleAccessories.length > 0) {
      setSelectedAccessory(compatibleAccessories[0].id);
    }
  }, [selectedType]);

  // Add accessory handler
  const handleAddAccessory = async () => {
    if (!selectedAccessory) {
      showErrorToast('No accessory selected', 'Please select an accessory to add');
      return;
    }
    
    try {
      setLoading('add-accessory', true);
      
      const updatedModule = { ...module };
      const accessoryToAdd = accessories.find(a => a.id === selectedAccessory);
      
      if (accessoryToAdd) {
        updatedModule.accessories.push({
          id: uuidv4(),
          type: accessoryToAdd.type,
          accessoryItemId: selectedAccessory,
          quantity: 1
        });
        
        onUpdate(updatedModule);
        showSuccessToast(`Added ${accessoryToAdd.name}`, 'Accessory added successfully');
      }
    } catch (error) {
      console.error('Error adding accessory:', error);
      showErrorToast('Failed to add accessory', (error as Error).message);
    } finally {
      setLoading('add-accessory', false);
    }
  };

  // Remove accessory handler
  const handleRemoveAccessory = async (accessoryId: string) => {
    try {
      setLoading(`remove-accessory-${accessoryId}`, true);
      
      const updatedModule = { ...module };
      const accessoryToRemove = updatedModule.accessories.find(acc => acc.id === accessoryId);
      const accessoryItem = accessoryToRemove
        ? accessories.find(a => a.id === accessoryToRemove.accessoryItemId)
        : null;
      
      updatedModule.accessories = updatedModule.accessories.filter(acc => acc.id !== accessoryId);
      onUpdate(updatedModule);
      
      if (accessoryItem) {
        showSuccessToast('Accessory removed', `Removed ${accessoryItem.name}`);
      } else {
        showSuccessToast('Accessory removed', 'Accessory has been removed');
      }
    } catch (error) {
      console.error('Error removing accessory:', error);
      showErrorToast('Failed to remove accessory', (error as Error).message);
    } finally {
      setLoading(`remove-accessory-${accessoryId}`, false);
    }
  };

  // Update accessory quantity
  const handleQuantityChange = (accessoryId: string, quantity: number) => {
    if (quantity < 1) return;
    
    try {
      const updatedModule = { ...module };
      const accessoryIndex = updatedModule.accessories.findIndex(acc => acc.id === accessoryId);
      
      if (accessoryIndex !== -1) {
        updatedModule.accessories[accessoryIndex].quantity = quantity;
        onUpdate(updatedModule);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      showErrorToast('Failed to update quantity', (error as Error).message);
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

  const compatibleAccessoriesForType = getCompatibleAccessories();
  const compatibleTypes = getCompatibleTypes();

  return (
    <div className="space-y-4">
      {accessories.length === 0 ? (
        <div className="text-center py-4 text-sm text-muted-foreground">
          No accessories available for this module
        </div>
      ) : (
        <>
          <div>
            <Label className="text-sm font-medium">Add Accessory</Label>
            <div className="flex flex-col space-y-2 mt-1">
              <Select 
                value={selectedType} 
                onValueChange={(value) => setSelectedType(value as AccessoryType)}
                disabled={compatibleTypes.length === 0}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select accessory type" />
                </SelectTrigger>
                <SelectContent>
                  {compatibleTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Select 
                  value={selectedAccessory} 
                  onValueChange={setSelectedAccessory}
                  disabled={compatibleAccessoriesForType.length === 0}
                  className="flex-1"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select accessory" />
                  </SelectTrigger>
                  <SelectContent>
                    {compatibleAccessoriesForType.map(accessory => (
                      <SelectItem key={accessory.id} value={accessory.id}>
                        {accessory.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={handleAddAccessory} 
                  disabled={!selectedAccessory || isLoading('add-accessory')}
                >
                  {isLoading('add-accessory') ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
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
                            disabled={acc.quantity <= 1}
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
                          disabled={isLoading(`remove-accessory-${acc.id}`)}
                        >
                          {isLoading(`remove-accessory-${acc.id}`) ? (
                            <Loader className="h-3 w-3 animate-spin" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
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
