
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FurnitureModule } from '@/types';

// Helper to format measurements
const formatMeasurement = (value: number) => {
  return `${value}mm`;
};

interface ModuleDimensionsPanelProps {
  module: FurnitureModule;
  onUpdate: (module: FurnitureModule) => void;
}

export const ModuleDimensionsPanel: React.FC<ModuleDimensionsPanelProps> = ({
  module,
  onUpdate
}) => {
  const handleDimensionChange = (dimension: 'width' | 'height' | 'depth', value: number) => {
    const updatedModule = { ...module };
    updatedModule[dimension] = value;
    onUpdate(updatedModule);
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Dimensions</h3>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label htmlFor="width" className="text-xs">Width</Label>
          <Input
            id="width"
            type="number"
            value={module.width}
            onChange={(e) => handleDimensionChange('width', Number(e.target.value))}
            className="h-8"
          />
          <div className="text-xs text-gray-500 mt-1">{formatMeasurement(module.width)}</div>
        </div>
        <div>
          <Label htmlFor="height" className="text-xs">Height</Label>
          <Input
            id="height"
            type="number"
            value={module.height}
            onChange={(e) => handleDimensionChange('height', Number(e.target.value))}
            className="h-8"
          />
          <div className="text-xs text-gray-500 mt-1">{formatMeasurement(module.height)}</div>
        </div>
        <div>
          <Label htmlFor="depth" className="text-xs">Depth</Label>
          <Input
            id="depth"
            type="number"
            value={module.depth}
            onChange={(e) => handleDimensionChange('depth', Number(e.target.value))}
            className="h-8"
          />
          <div className="text-xs text-gray-500 mt-1">{formatMeasurement(module.depth)}</div>
        </div>
      </div>
    </div>
  );
};
