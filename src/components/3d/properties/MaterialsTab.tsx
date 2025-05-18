
import React from 'react';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FurnitureModule, Material } from '@/types';

interface MaterialsTabProps {
  module: FurnitureModule;
  materials: Material[];
  onMaterialChange: (partType: string, materialId: string) => void;
}

export const MaterialsTab: React.FC<MaterialsTabProps> = ({
  module,
  materials,
  onMaterialChange
}) => {
  return (
    <ScrollArea className="h-full p-4">
      <div className="space-y-4">
        {/* Body Material */}
        <div>
          <Label htmlFor="body-material" className="block mb-2">Body Material</Label>
          <Select 
            value={module.materials.find(m => m.part === 'body')?.materialId || ''}
            onValueChange={(value) => onMaterialChange('body', value)}
          >
            <SelectTrigger id="body-material">
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent>
              {materials
                .filter(m => m.type === 'PAL' || m.type === 'MDF')
                .map((material) => (
                  <SelectItem key={material.id} value={material.id}>
                    {material.name} ({material.thickness}mm)
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
        
        {/* Door/Front Material */}
        <div>
          <Label htmlFor="door-material" className="block mb-2">Door/Front Material</Label>
          <Select 
            value={module.materials.find(m => m.part === 'door' || m.part === 'drawer_front')?.materialId || ''}
            onValueChange={(value) => onMaterialChange('door', value)}
          >
            <SelectTrigger id="door-material">
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent>
              {materials
                .filter(m => m.type === 'PAL' || m.type === 'MDF' || m.type === 'MDF-AGT' || m.type === 'GLASS')
                .map((material) => (
                  <SelectItem key={material.id} value={material.id}>
                    {material.name} ({material.thickness}mm)
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
        
        {/* Back Panel Material */}
        <div>
          <Label htmlFor="back-material" className="block mb-2">Back Panel</Label>
          <Select 
            value={module.materials.find(m => m.part === 'back_panel')?.materialId || ''}
            onValueChange={(value) => onMaterialChange('back_panel', value)}
          >
            <SelectTrigger id="back-material">
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent>
              {materials
                .filter(m => m.type === 'PFL' || m.type === 'PAL')
                .map((material) => (
                  <SelectItem key={material.id} value={material.id}>
                    {material.name} ({material.thickness}mm)
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
      </div>
    </ScrollArea>
  );
};
