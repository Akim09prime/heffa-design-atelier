
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Move, RotateCw } from 'lucide-react';
import { FurnitureModule } from '@/types';

interface PropertiesTabProps {
  module: FurnitureModule;
  onDimensionChange: (dimension: 'width' | 'height' | 'depth', value: number) => void;
  onPositionChange: (axis: 0 | 1 | 2, value: number) => void;
  onRotationChange: (axis: 0 | 1 | 2, value: number) => void;
  onTypeChange: (value: string) => void;
  onNameChange: (value: string) => void;
}

export const PropertiesTab: React.FC<PropertiesTabProps> = ({
  module,
  onDimensionChange,
  onPositionChange,
  onRotationChange,
  onTypeChange,
  onNameChange
}) => {
  return (
    <ScrollArea className="h-full p-4">
      <div className="space-y-4">
        {/* Basic Info */}
        <div className="space-y-2">
          <Label htmlFor="module-name">Name</Label>
          <Input 
            id="module-name" 
            value={module.name} 
            onChange={(e) => onNameChange(e.target.value)} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="module-type">Type</Label>
          <Select 
            value={module.type} 
            onValueChange={onTypeChange}
          >
            <SelectTrigger id="module-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="base_cabinet">Base Cabinet</SelectItem>
              <SelectItem value="wall_cabinet">Wall Cabinet</SelectItem>
              <SelectItem value="tall_cabinet">Tall Cabinet</SelectItem>
              <SelectItem value="drawer_unit">Drawer Unit</SelectItem>
              <SelectItem value="corner_cabinet">Corner Cabinet</SelectItem>
              <SelectItem value="shelf_unit">Shelf Unit</SelectItem>
              <SelectItem value="island">Island</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dimensions */}
        <div>
          <h3 className="text-sm font-medium mb-2">Dimensions (mm)</h3>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="module-width">Width</Label>
              <Input 
                id="module-width" 
                type="number" 
                value={module.width} 
                onChange={(e) => onDimensionChange('width', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="module-height">Height</Label>
              <Input 
                id="module-height" 
                type="number" 
                value={module.height} 
                onChange={(e) => onDimensionChange('height', parseInt(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="module-depth">Depth</Label>
              <Input 
                id="module-depth" 
                type="number" 
                value={module.depth} 
                onChange={(e) => onDimensionChange('depth', parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Position */}
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <Move className="h-4 w-4 mr-1" /> Position
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="position-x">X</Label>
              <Input 
                id="position-x" 
                type="number" 
                value={module.position[0]} 
                onChange={(e) => onPositionChange(0, parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="position-y">Y</Label>
              <Input 
                id="position-y" 
                type="number" 
                value={module.position[1]} 
                onChange={(e) => onPositionChange(1, parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="position-z">Z</Label>
              <Input 
                id="position-z" 
                type="number" 
                value={module.position[2]} 
                onChange={(e) => onPositionChange(2, parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>

        {/* Rotation */}
        <div>
          <h3 className="text-sm font-medium mb-2 flex items-center">
            <RotateCw className="h-4 w-4 mr-1" /> Rotation
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="rotation-x">X</Label>
              <Input 
                id="rotation-x" 
                type="number" 
                value={module.rotation[0]} 
                onChange={(e) => onRotationChange(0, parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="rotation-y">Y</Label>
              <Input 
                id="rotation-y" 
                type="number" 
                value={module.rotation[1]} 
                onChange={(e) => onRotationChange(1, parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="rotation-z">Z</Label>
              <Input 
                id="rotation-z" 
                type="number" 
                value={module.rotation[2]} 
                onChange={(e) => onRotationChange(2, parseFloat(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
