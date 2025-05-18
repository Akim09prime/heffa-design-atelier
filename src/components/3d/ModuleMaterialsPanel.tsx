
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Material, FurnitureModule, MaterialType } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { useUi } from '@/contexts/UiContext';
import { Loader } from 'lucide-react';

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
  const { showSuccessToast, showErrorToast, isLoading, setLoading } = useUi();
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [loadingMaterial, setLoadingMaterial] = useState<Record<string, boolean>>({});
  
  // Find current materials in the module
  const bodyMaterial = module.materials.find(m => m.part === 'body');
  const frontMaterial = module.materials.find(m => m.part === 'door' || m.part === 'drawer_front');
  
  const [bodyMaterialId, setBodyMaterialId] = useState<string>(bodyMaterial?.materialId || '');
  const [frontMaterialId, setFrontMaterialId] = useState<string>(frontMaterial?.materialId || '');

  // Update state when module changes
  useEffect(() => {
    const bodyMat = module.materials.find(m => m.part === 'body');
    const frontMat = module.materials.find(m => m.part === 'door' || m.part === 'drawer_front');
    
    setBodyMaterialId(bodyMat?.materialId || '');
    setFrontMaterialId(frontMat?.materialId || '');
  }, [module]);

  // Material change handler
  const handleMaterialChange = async (partType: 'body' | 'door' | 'drawer_front' | 'back_panel' | 'shelf', materialId: string) => {
    if (!materialId) return;
    
    try {
      setLoadingMaterial(prev => ({ ...prev, [partType]: true }));
      
      // Update state based on part type
      if (partType === 'body') {
        setBodyMaterialId(materialId);
      } else if (partType === 'door' || partType === 'drawer_front') {
        setFrontMaterialId(materialId);
      }
      
      const updatedModule = { ...module };
      
      // Find the material in the module or create a new one
      const materialIndex = updatedModule.materials.findIndex(m => m.part === partType);
      
      if (materialIndex >= 0) {
        // Update existing material
        updatedModule.materials[materialIndex].materialId = materialId;
      } else {
        // Add new material
        const selectedMat = materials.find(m => m.id === materialId);
        if (selectedMat) {
          updatedModule.materials.push({
            id: uuidv4(),
            type: selectedMat.type,
            materialId,
            part: partType,
            quantity: calculatePartQuantity(updatedModule, partType) // Calculate based on dimensions
          });
        }
      }
      
      onUpdate(updatedModule);
      
      const material = materials.find(m => m.id === materialId);
      showSuccessToast(
        'Material Updated',
        `${material?.name || 'Material'} applied to ${partType.replace('_', ' ')}`
      );
    } catch (error) {
      console.error(`Error updating ${partType} material:`, error);
      showErrorToast('Material Update Failed', (error as Error).message);
    } finally {
      setLoadingMaterial(prev => ({ ...prev, [partType]: false }));
    }
  };

  // Calculate material quantity based on part type and module dimensions
  const calculatePartQuantity = (module: FurnitureModule, partType: string): number => {
    const width = module.width / 1000; // Convert to meters
    const height = module.height / 1000;
    const depth = module.depth / 1000;
    
    switch(partType) {
      case 'body':
        // Side panels (2) + top + bottom
        return (height * depth * 2) + (width * depth * 2);
      case 'door':
      case 'drawer_front':
        // Front area
        return width * height;
      case 'back_panel':
        return width * height;
      case 'shelf':
        return width * depth;
      default:
        return 1;
    }
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
        <Label className="text-sm font-medium flex items-center">
          Body Material
          {loadingMaterial.body && <Loader size={14} className="animate-spin ml-2" />}
        </Label>
        <Select
          value={bodyMaterialId}
          onValueChange={(value) => {
            handleMaterialChange('body', value);
            handleSelectMaterialForPreview(value);
          }}
          disabled={loadingMaterial.body}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select material" />
          </SelectTrigger>
          <SelectContent>
            {materials
              .filter(m => m.type === 'PAL' || m.type === 'MDF')
              .map(material => (
                <SelectItem key={material.id} value={material.id} className="flex items-center gap-2">
                  {material.textureUrl && (
                    <div 
                      className="h-4 w-4 rounded-full" 
                      style={{ 
                        backgroundImage: `url(${material.textureUrl})`, 
                        backgroundSize: 'cover' 
                      }} 
                    />
                  )}
                  {material.name} - {material.type}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {/* Front Material */}
      <div>
        <Label className="text-sm font-medium flex items-center">
          Front Material
          {loadingMaterial.door && <Loader size={14} className="animate-spin ml-2" />}
        </Label>
        <Select
          value={frontMaterialId}
          onValueChange={(value) => {
            handleMaterialChange('door', value);
            handleSelectMaterialForPreview(value);
          }}
          disabled={loadingMaterial.door}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select front material" />
          </SelectTrigger>
          <SelectContent>
            {materials.map(material => (
              <SelectItem key={material.id} value={material.id} className="flex items-center gap-2">
                {material.textureUrl && (
                  <div 
                    className="h-4 w-4 rounded-full" 
                    style={{ 
                      backgroundImage: `url(${material.textureUrl})`, 
                      backgroundSize: 'cover' 
                    }} 
                  />
                )}
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
          <div className="h-32 bg-gray-100 relative rounded overflow-hidden shadow-inner">
            {selectedMaterial.textureUrl ? (
              <div className="w-full h-full">
                <img 
                  src={selectedMaterial.textureUrl} 
                  alt={selectedMaterial.name}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-xs">
                  {selectedMaterial.name}
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Preview
              </div>
            )}
          </div>
          <div className="mt-2 text-xs grid grid-cols-2 gap-2">
            <div><span className="font-medium">Type:</span> {selectedMaterial.type}</div>
            <div><span className="font-medium">Thickness:</span> {selectedMaterial.thickness}mm</div>
            <div><span className="font-medium">Price:</span> ${selectedMaterial.pricePerSqm}/m²</div>
            <div><span className="font-medium">Manufacturer:</span> {selectedMaterial.manufacturer || 'N/A'}</div>
          </div>
        </div>
      )}

      {/* Quick material info cards */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {bodyMaterialId && (
          <div className="p-2 border rounded bg-gray-50">
            <div className="text-xs font-medium">Body Material</div>
            <div className="text-xs mt-1">
              {materials.find(m => m.id === bodyMaterialId)?.name || 'Not selected'}
            </div>
          </div>
        )}
        {frontMaterialId && (
          <div className="p-2 border rounded bg-gray-50">
            <div className="text-xs font-medium">Front Material</div>
            <div className="text-xs mt-1">
              {materials.find(m => m.id === frontMaterialId)?.name || 'Not selected'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
