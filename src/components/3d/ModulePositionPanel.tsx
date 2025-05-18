
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FurnitureModule } from '@/types';

interface ModulePositionPanelProps {
  module: FurnitureModule;
  onUpdate: (module: FurnitureModule) => void;
}

export const ModulePositionPanel: React.FC<ModulePositionPanelProps> = ({
  module,
  onUpdate
}) => {
  const handlePositionChange = (axis: 0 | 1 | 2, value: number) => {
    const updatedModule = { ...module };
    const newPosition = [...updatedModule.position];
    newPosition[axis] = value;
    updatedModule.position = newPosition as [number, number, number];
    onUpdate(updatedModule);
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Position</h3>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label htmlFor="position-x" className="text-xs">X</Label>
          <Input
            id="position-x"
            type="number"
            step="0.1"
            value={module.position[0]}
            onChange={(e) => handlePositionChange(0, Number(e.target.value))}
            className="h-8"
          />
        </div>
        <div>
          <Label htmlFor="position-y" className="text-xs">Y</Label>
          <Input
            id="position-y"
            type="number"
            step="0.1"
            value={module.position[1]}
            onChange={(e) => handlePositionChange(1, Number(e.target.value))}
            className="h-8"
          />
        </div>
        <div>
          <Label htmlFor="position-z" className="text-xs">Z</Label>
          <Input
            id="position-z"
            type="number"
            step="0.1"
            value={module.position[2]}
            onChange={(e) => handlePositionChange(2, Number(e.target.value))}
            className="h-8"
          />
        </div>
      </div>
    </div>
  );
};
