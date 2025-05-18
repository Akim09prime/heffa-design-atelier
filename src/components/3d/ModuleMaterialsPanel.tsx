
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Material, FurnitureModule, MaterialType } from '@/types';
import { v4 as uuidv4 } from 'uuid';

<lov-add-dependency>uuid@11.1.0</lov-add-dependency>

interface ModuleMaterialsPanelProps {
  module: FurnitureModule;
  materials: Material[];
  onUpdate: (module: FurnitureModule) => void;
}

export const ModuleMaterialsPanel: React.FC<ModuleMaterialsPanelProps> = ({
  module,
  materials,
  onUpdate
}) => {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [bodyMaterialId, setBodyMaterialId] = useState<string>('');
  const [frontMaterialId, setFrontMaterialId] = useState<string>('');

  // Material change handler
  const handleMaterialChange = (partType: 'body' | 'door' | 'drawer_front' | 'back_panel' | 'shelf', materialId: string) => {
    const updatedModule = { ...module };
    
    // Update state based on part type
    if (partType === 'body') {
      setBodyMaterialId(materialId);
    } else if (partType === 'door') {
      setFrontMaterialId(materialId);
    }
    
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
    
    onUpdate(updatedModule);
  };

  // Handle material selection for preview
  const handleSelectMaterialForPreview = (materialId: string) => {
    const material = materials.find(m => m.id === materialId);
    if (material) {
      setSelectedMaterial(material);
    }
  };

  return (
    <div className="space-y-4">
      {/* Body Material */}
      <div>
        <Label className="text-sm font-medium">Body Material</Label>
        <Select
          value={bodyMaterialId}
          onValueChange={(value) => {
            handleMaterialChange('body', value);
            handleSelectMaterialForPreview(value);
          }}
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
          onValueChange={(value) => {
            handleMaterialChange('door', value);
            handleSelectMaterialForPreview(value);
          }}
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
      
      {/* Material preview */}
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
};
