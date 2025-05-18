
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FurnitureModule } from '@/types';

interface ModuleRotationPanelProps {
  module: FurnitureModule;
  onUpdate: (module: FurnitureModule) => void;
}

export const ModuleRotationPanel: React.FC<ModuleRotationPanelProps> = ({
  module,
  onUpdate
}) => {
  const handleRotationChange = (axis: 0 | 1 | 2, value: number) => {
    const updatedModule = { ...module };
    const newRotation = [...updatedModule.rotation];
    newRotation[axis] = value;
    updatedModule.rotation = newRotation as [number, number, number];
    onUpdate(updatedModule);
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Rotation</h3>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label htmlFor="rotation-x" className="text-xs">X</Label>
          <Input
            id="rotation-x"
            type="number"
            value={module.rotation[0]}
            onChange={(e) => handleRotationChange(0, Number(e.target.value))}
            className="h-8"
          />
        </div>
        <div>
          <Label htmlFor="rotation-y" className="text-xs">Y</Label>
          <Input
            id="rotation-y"
            type="number"
            value={module.rotation[1]}
            onChange={(e) => handleRotationChange(1, Number(e.target.value))}
            className="h-8"
          />
        </div>
        <div>
          <Label htmlFor="rotation-z" className="text-xs">Z</Label>
          <Input
            id="rotation-z"
            type="number"
            value={module.rotation[2]}
            onChange={(e) => handleRotationChange(2, Number(e.target.value))}
            className="h-8"
          />
        </div>
      </div>
    </div>
  );
};
